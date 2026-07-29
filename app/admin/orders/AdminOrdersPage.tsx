"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  PRODUCT_CATALOG,
  PRODUCT_CATEGORY_LABELS,
} from "../../../lib/product-catalog.ts";
import {
  calculateOrderPricing,
  orderProfileForQuantity,
} from "../../../lib/order-pricing.ts";
import { siteConfig } from "../../../site.config";

type Market = "United States" | "Canada" | "Brazil" | "Mexico";
type Service = "catalogue" | "private_label" | "bulk" | "custom";
type Status =
  | "confirmed"
  | "documentation_review"
  | "in_production"
  | "quality_control"
  | "packaging"
  | "dispatched"
  | "delivered";

type ManualOrder = {
  id: number;
  reference: string;
  occurredAt: string;
  destination: Market;
  service: Service;
  orderProfile: string;
  sku: string;
  productName: string;
  specification: string;
  quantityUnits: number;
  retailUnitPriceUsdCents: number;
  discountBps: number;
  serviceFeeUsdCents: number;
  shippingFeeUsdCents: number;
  deductionUsdCents: number;
  amountUsdCents: number;
  status: Status;
  isPublished: boolean | number;
  createdAt: string;
  updatedAt: string;
};

type OrderResponse = {
  orders?: ManualOrder[];
  error?: string;
};

const SESSION_KEY = "peptivanta_fulfillment_admin_key";
const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const markets: { value: Market; label: string }[] = [
  { value: "United States", label: "美国" },
  { value: "Canada", label: "加拿大" },
  { value: "Brazil", label: "巴西" },
  { value: "Mexico", label: "墨西哥" },
];

const services: { value: Service; label: string }[] = [
  { value: "catalogue", label: "目录产品供应" },
  { value: "private_label", label: "贴牌服务" },
  { value: "custom", label: "定制项目" },
  { value: "bulk", label: "大货供应" },
];

const statuses: { value: Status; label: string }[] = [
  { value: "confirmed", label: "订单已确认" },
  { value: "documentation_review", label: "文件审核中" },
  { value: "in_production", label: "生产中" },
  { value: "quality_control", label: "质量检测" },
  { value: "packaging", label: "包装中" },
  { value: "dispatched", label: "已发运" },
  { value: "delivered", label: "已送达" },
];

const firstCatalogItem = PRODUCT_CATALOG[0];
const productNames = Array.from(
  new Set(PRODUCT_CATALOG.map((item) => item.productName)),
).sort((left, right) => left.localeCompare(right, "en"));

const emptyDraft = () => ({
  reference: "",
  occurredAt: new Date().toISOString().slice(0, 10),
  destination: "United States" as Market,
  service: "catalogue" as Service,
  sku: firstCatalogItem.sku,
  productName: firstCatalogItem.productName,
  quantityUnits: "1",
  serviceFeeUsd: "0",
  shippingFeeUsd: "0",
  deductionUsd: "0",
  status: "confirmed" as Status,
  isPublished: true,
});

function usdToCents(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed * 100)) : 0;
}

export default function AdminOrdersPage() {
  const [adminKey, setAdminKey] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [orders, setOrders] = useState<ManualOrder[]>([]);
  const [draft, setDraft] = useState(emptyDraft);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = window.sessionStorage.getItem(SESSION_KEY);
    // Hydrate the tab-scoped credential only after the client is available.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setAdminKey(stored);
  }, []);

  const publishedCount = useMemo(
    () => orders.filter((order) => Boolean(order.isPublished)).length,
    [orders],
  );
  const draftVariants = useMemo(
    () =>
      PRODUCT_CATALOG.filter(
        (item) => item.productName === draft.productName,
      ),
    [draft.productName],
  );
  const selectedDraftProduct = useMemo(
    () =>
      draftVariants.find((item) => item.sku === draft.sku) ??
      draftVariants[0] ??
      firstCatalogItem,
    [draft.sku, draftVariants],
  );
  const draftPricing = useMemo(
    () =>
      calculateOrderPricing({
        retailUnitPriceUsdCents: selectedDraftProduct.retailUsdCents,
        quantityUnits: Number(draft.quantityUnits) || 1,
        service: draft.service,
        serviceFeeUsdCents: usdToCents(draft.serviceFeeUsd),
        shippingFeeUsdCents: usdToCents(draft.shippingFeeUsd),
        deductionUsdCents: usdToCents(draft.deductionUsd),
      }),
    [
      draft.deductionUsd,
      draft.quantityUnits,
      draft.service,
      draft.serviceFeeUsd,
      draft.shippingFeeUsd,
      selectedDraftProduct,
    ],
  );

  async function adminRequest(
    method: "GET" | "POST" | "PATCH",
    body?: unknown,
    key = adminKey,
  ) {
    const response = await fetch("/api/admin/orders", {
      method,
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${key}`,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const result = (await response.json()) as OrderResponse;
    if (!response.ok) {
      if (response.status === 401) {
        setAuthenticated(false);
        window.sessionStorage.removeItem(SESSION_KEY);
      }
      throw new Error(result.error ?? "操作失败，请重试。");
    }
    setOrders(
      (result.orders ?? []).map((order) => ({
        ...order,
        isPublished: Boolean(order.isPublished),
      })),
    );
  }

  async function signIn(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await adminRequest("GET", undefined, adminKey);
      window.sessionStorage.setItem(SESSION_KEY, adminKey);
      setAuthenticated(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "验证失败。");
    } finally {
      setBusy(false);
    }
  }

  async function createOrder(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await adminRequest("POST", {
        ...draft,
        sku: selectedDraftProduct.sku,
        productName: selectedDraftProduct.productName,
        specification: selectedDraftProduct.specification,
        quantityUnits: Number(draft.quantityUnits),
        serviceFeeUsdCents: usdToCents(draft.serviceFeeUsd),
        shippingFeeUsdCents: usdToCents(draft.shippingFeeUsd),
        deductionUsdCents: usdToCents(draft.deductionUsd),
      });
      setDraft(emptyDraft());
      setMessage("真实订单已保存，并已按照公开状态加入近期履约页面。");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "订单保存失败。");
    } finally {
      setBusy(false);
    }
  }

  function updateLocalOrder(id: number, changes: Partial<ManualOrder>) {
    setOrders((current) =>
      current.map((order) =>
        order.id === id ? { ...order, ...changes } : order,
      ),
    );
  }

  async function saveOrder(order: ManualOrder, nextStatus?: Status) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await adminRequest("PATCH", {
        ...order,
        status: nextStatus ?? order.status,
        isPublished: Boolean(order.isPublished),
      });
      setMessage(`${order.reference} 已实时更新。`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "订单更新失败。");
    } finally {
      setBusy(false);
    }
  }

  function advanceOrder(order: ManualOrder) {
    const currentIndex = statuses.findIndex(
      (option) => option.value === order.status,
    );
    const next = statuses[Math.min(currentIndex + 1, statuses.length - 1)];
    if (next.value === order.status) {
      setMessage(`${order.reference} 已经是最终状态。`);
      return;
    }
    updateLocalOrder(order.id, { status: next.value });
    void saveOrder(order, next.value);
  }

  function signOut() {
    window.sessionStorage.removeItem(SESSION_KEY);
    setAdminKey("");
    setAuthenticated(false);
    setOrders([]);
  }

  if (!authenticated) {
    return (
      <main className="admin-login-page">
        <section className="admin-login-card">
          <div className="admin-brand">
            <img src="/logo-mark.svg" alt="" width={48} height={48} />
            <span>
              <strong>{siteConfig.brandName}</strong>
              <small>Fulfillment Admin</small>
            </span>
          </div>
          <p className="section-tag">PRIVATE CONSOLE</p>
          <h1>真实订单后台</h1>
          <p>
            使用管理密钥进入。真实订单和模拟订单分别存储，模拟器不会覆盖这里的记录。
          </p>
          <form onSubmit={signIn}>
            <label>
              <span>管理密钥</span>
              <input
                type="password"
                value={adminKey}
                onChange={(event) => setAdminKey(event.target.value)}
                autoComplete="current-password"
                required
              />
            </label>
            {error && <p className="admin-error">{error}</p>}
            <button type="submit" disabled={busy || !adminKey.trim()}>
              {busy ? "正在验证…" : "进入订单后台"}
            </button>
          </form>
          <Link href="/fulfillment">返回近期履约页面</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-orders-page">
      <header className="admin-orders-header">
        <div className="admin-brand">
          <img src="/logo-mark.svg" alt="" width={44} height={44} />
          <span>
            <strong>{siteConfig.brandName}</strong>
            <small>Fulfillment Admin</small>
          </span>
        </div>
        <nav>
          <Link href="/fulfillment" target="_blank">查看公开页面</Link>
          <button type="button" onClick={signOut}>退出后台</button>
        </nav>
      </header>

      <section className="admin-orders-shell">
        <div className="admin-orders-intro">
          <div>
            <p className="section-tag">REAL ORDER WORKFLOW</p>
            <h1>真实订单管理</h1>
            <p>
              新增订单后可按与模拟订单相同的履约阶段手动推进。取消公开只会隐藏记录，不会删除数据。
            </p>
          </div>
          <dl>
            <div><dt>{orders.length}</dt><dd>真实订单</dd></div>
            <div><dt>{publishedCount}</dt><dd>公开展示</dd></div>
          </dl>
        </div>

        {(message || error) && (
          <div className={error ? "admin-alert is-error" : "admin-alert"}>
            {error || message}
          </div>
        )}

        <section className="admin-create-panel">
          <div>
            <p className="section-tag">ADD ORDER</p>
            <h2>登记一个真实订单</h2>
          </div>
          <form onSubmit={createOrder}>
            <label>
              <span>订单日期</span>
              <input
                type="date"
                value={draft.occurredAt}
                onChange={(event) =>
                  setDraft({ ...draft, occurredAt: event.target.value })
                }
                required
              />
            </label>
            <label>
              <span>目的国家</span>
              <select
                value={draft.destination}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    destination: event.target.value as Market,
                  })
                }
              >
                {markets.map((market) => (
                  <option value={market.value} key={market.value}>
                    {market.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>服务类型</span>
              <select
                value={draft.service}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    service: event.target.value as Service,
                  })
                }
              >
                {services.map((service) => (
                  <option value={service.value} key={service.value}>
                    {service.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>订单编号（可留空）</span>
              <input
                value={draft.reference}
                onChange={(event) =>
                  setDraft({ ...draft, reference: event.target.value })
                }
                placeholder="系统自动生成"
              />
            </label>
            <label>
              <span>产品名称</span>
              <select
                value={draft.productName}
                onChange={(event) => {
                  const productName = event.target.value;
                  const firstVariant = PRODUCT_CATALOG.find(
                    (item) => item.productName === productName,
                  );
                  if (firstVariant) {
                    setDraft({
                      ...draft,
                      productName,
                      sku: firstVariant.sku,
                    });
                  }
                }}
              >
                {productNames.map((productName) => {
                  const item = PRODUCT_CATALOG.find(
                    (entry) => entry.productName === productName,
                  );
                  return (
                    <option value={productName} key={productName}>
                      {productName}
                      {item
                        ? ` · ${PRODUCT_CATEGORY_LABELS[item.category]}`
                        : ""}
                    </option>
                  );
                })}
              </select>
            </label>
            <label>
              <span>报价单规格与零售价</span>
              <select
                value={selectedDraftProduct.sku}
                onChange={(event) =>
                  setDraft({ ...draft, sku: event.target.value })
                }
              >
                {draftVariants.map((item) => (
                  <option value={item.sku} key={`${item.sku}-${item.specification}`}>
                    {item.specification} · {item.sku} ·{" "}
                    {usdFormatter.format(item.retailUsdCents / 100)}/盒
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span>数量（盒，每盒10瓶）</span>
              <input
                type="number"
                min="1"
                max="100000"
                step="1"
                value={draft.quantityUnits}
                onChange={(event) =>
                  setDraft({ ...draft, quantityUnits: event.target.value })
                }
                required
              />
            </label>
            <label>
              <span>贴牌/包装/检测费（USD）</span>
              <input
                type="number"
                min="0"
                max="10000000"
                step="0.01"
                value={draft.serviceFeeUsd}
                onChange={(event) =>
                  setDraft({ ...draft, serviceFeeUsd: event.target.value })
                }
              />
            </label>
            <label>
              <span>运费（USD，报价单不含运费）</span>
              <input
                type="number"
                min="0"
                max="10000000"
                step="0.01"
                value={draft.shippingFeeUsd}
                onChange={(event) =>
                  setDraft({ ...draft, shippingFeeUsd: event.target.value })
                }
              />
            </label>
            <label>
              <span>额外减免（USD，可选）</span>
              <input
                type="number"
                min="0"
                max="10000000"
                step="0.01"
                value={draft.deductionUsd}
                onChange={(event) =>
                  setDraft({ ...draft, deductionUsd: event.target.value })
                }
              />
            </label>
            <label>
              <span>当前状态</span>
              <select
                value={draft.status}
                onChange={(event) =>
                  setDraft({ ...draft, status: event.target.value as Status })
                }
              >
                {statuses.map((status) => (
                  <option value={status.value} key={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="admin-pricing-preview">
              <div>
                <span>零售价小计</span>
                <strong>
                  {usdFormatter.format(
                    draftPricing.retailSubtotalUsdCents / 100,
                  )}
                </strong>
              </div>
              <div>
                <span>数量阶梯折扣</span>
                <strong>{(draftPricing.discountBps / 100).toFixed(0)}%</strong>
              </div>
              <div>
                <span>订单规模</span>
                <strong>
                  {orderProfileForQuantity(Number(draft.quantityUnits) || 1)}
                </strong>
              </div>
              <div className="is-total">
                <span>自动计算总额</span>
                <strong>
                  {usdFormatter.format(draftPricing.amountUsdCents / 100)}
                </strong>
              </div>
              <small>
                零售价小计 − 阶梯折扣 + 服务费 + 运费 − 额外减免
              </small>
            </div>
            <label className="admin-checkbox">
              <input
                type="checkbox"
                checked={draft.isPublished}
                onChange={(event) =>
                  setDraft({ ...draft, isPublished: event.target.checked })
                }
              />
              <span>立即在近期履约页面公开</span>
            </label>
            <button className="admin-primary" type="submit" disabled={busy}>
              {busy ? "正在保存…" : "保存真实订单"}
            </button>
          </form>
        </section>

        <section className="admin-order-list">
          <div className="admin-list-heading">
            <div>
              <p className="section-tag">MANUAL RECORDS</p>
              <h2>已登记真实订单</h2>
            </div>
            <button type="button" onClick={() => void adminRequest("GET")} disabled={busy}>
              刷新列表
            </button>
          </div>

          {orders.length === 0 ? (
            <p className="admin-empty">暂时没有真实订单。</p>
          ) : (
            <div className="admin-order-cards">
              {orders.map((order) => (
                <article key={order.id}>
                  <header>
                    <div>
                      <code>{order.reference}</code>
                      <h3>{order.productName}</h3>
                      <p>
                        {order.specification || "未填写规格"} · SKU {order.sku}
                      </p>
                    </div>
                    <strong>{usdFormatter.format(order.amountUsdCents / 100)}</strong>
                  </header>
                  <dl>
                    <div><dt>订单日期</dt><dd>{order.occurredAt}</dd></div>
                    <div>
                      <dt>目的地</dt>
                      <dd>{markets.find((item) => item.value === order.destination)?.label}</dd>
                    </div>
                    <div>
                      <dt>数量与规模</dt>
                      <dd>{order.quantityUnits.toLocaleString()} 盒 · {order.orderProfile}</dd>
                    </div>
                    <div>
                      <dt>报价单零售价</dt>
                      <dd>{usdFormatter.format(order.retailUnitPriceUsdCents / 100)}/盒</dd>
                    </div>
                    <div>
                      <dt>数量折扣</dt>
                      <dd>{(order.discountBps / 100).toFixed(0)}%</dd>
                    </div>
                    <div>
                      <dt>费用/运费/减免</dt>
                      <dd>
                        {usdFormatter.format(order.serviceFeeUsdCents / 100)} /{" "}
                        {usdFormatter.format(order.shippingFeeUsdCents / 100)} /{" "}
                        {usdFormatter.format(order.deductionUsdCents / 100)}
                      </dd>
                    </div>
                    <div>
                      <dt>公开状态</dt>
                      <dd>{order.isPublished ? "公开展示" : "后台保留"}</dd>
                    </div>
                  </dl>
                  <div className="admin-order-controls">
                    <label>
                      <span>履约阶段</span>
                      <select
                        value={order.status}
                        onChange={(event) =>
                          updateLocalOrder(order.id, {
                            status: event.target.value as Status,
                          })
                        }
                      >
                        {statuses.map((status) => (
                          <option value={status.value} key={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="admin-checkbox">
                      <input
                        type="checkbox"
                        checked={Boolean(order.isPublished)}
                        onChange={(event) =>
                          updateLocalOrder(order.id, {
                            isPublished: event.target.checked,
                          })
                        }
                      />
                      <span>公开展示</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => void saveOrder(order)}
                      disabled={busy}
                    >
                      保存修改
                    </button>
                    <button
                      className="admin-advance"
                      type="button"
                      onClick={() => advanceOrder(order)}
                      disabled={busy || order.status === "delivered"}
                    >
                      推进下一阶段
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
