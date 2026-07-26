"use client";

import { useEffect, useMemo, useState } from "react";
import type { SiteLocale as Locale } from "./i18n";

type FulfillmentRecord = {
  id: number;
  reference: string;
  occurredAt: string;
  destination: "United States" | "Canada" | "Brazil" | string;
  service: "catalogue" | "private_label" | "bulk" | "custom" | string;
  orderProfile: string;
  status: "completed" | "dispatched" | "in_production" | string;
  isSample: boolean;
};

type ApiResponse = {
  records: FulfillmentRecord[];
  count: number;
  limit: number;
  windowStart: string;
  generatedAt: string;
  includesIllustrativeData: boolean;
};

const localeCodes: Record<Locale, string> = {
  en: "en-US",
  pt: "pt-BR",
  es: "es",
  fr: "fr",
  zh: "zh-CN",
};

const content = {
  en: {
    tag: "Recent fulfillment ledger",
    title: "Recent fulfillment activity.",
    text: "A privacy-conscious view of recent B2B order and fulfillment activity across our priority markets.",
    count: "records",
    window: "month window",
    markets: "priority markets",
    illustrativeTitle: "Illustrative dataset",
    illustrativeText:
      "These records demonstrate the live database format and are not presented as verified customer transactions. They can be replaced with authorized, anonymized records.",
    filters: ["All markets", "United States", "Canada", "Brazil"],
    refresh: "Refresh records",
    updated: "Updated",
    loading: "Loading recent records…",
    error: "Recent records are temporarily unavailable.",
    empty: "No published records are available for this period.",
    headers: ["Date", "Reference", "Destination", "Service", "Order profile", "Status"],
    sample: "Illustrative",
    services: {
      catalogue: "Catalogue supply",
      private_label: "Private label",
      bulk: "Bulk supply",
      custom: "Custom project",
    },
    statuses: {
      completed: "Completed",
      dispatched: "Dispatched",
      in_production: "In production",
    },
    profiles: {
      "Pilot order": "Pilot order",
      "10–50 kits": "10–50 kits",
      "50–100 kits": "50–100 kits",
      "Bulk specification": "Bulk specification",
      "Packaging project": "Packaging project",
    },
  },
  pt: {
    tag: "Registro recente de atendimento",
    title: "Atividade recente de pedidos.",
    text: "Uma visão anonimizada das atividades recentes de pedidos B2B e atendimento em nossos mercados prioritários.",
    count: "registros",
    window: "meses de histórico",
    markets: "mercados prioritários",
    illustrativeTitle: "Dados ilustrativos",
    illustrativeText:
      "Estes registros demonstram o formato do banco de dados e não são apresentados como transações verificadas. Podem ser substituídos por registros autorizados e anonimizados.",
    filters: ["Todos", "Estados Unidos", "Canadá", "Brasil"],
    refresh: "Atualizar registros",
    updated: "Atualizado",
    loading: "Carregando registros recentes…",
    error: "Os registros recentes estão temporariamente indisponíveis.",
    empty: "Não há registros publicados para este período.",
    headers: ["Data", "Referência", "Destino", "Serviço", "Perfil do pedido", "Status"],
    sample: "Ilustrativo",
    services: {
      catalogue: "Fornecimento de catálogo",
      private_label: "Marca própria",
      bulk: "Fornecimento a granel",
      custom: "Projeto personalizado",
    },
    statuses: {
      completed: "Concluído",
      dispatched: "Despachado",
      in_production: "Em produção",
    },
    profiles: {
      "Pilot order": "Pedido piloto",
      "10–50 kits": "10–50 kits",
      "50–100 kits": "50–100 kits",
      "Bulk specification": "Especificação a granel",
      "Packaging project": "Projeto de embalagem",
    },
  },
  es: {
    tag: "Registro reciente de cumplimiento",
    title: "Actividad reciente de pedidos.",
    text: "Una vista anonimizada de la actividad reciente de pedidos B2B y cumplimiento en nuestros mercados prioritarios.",
    count: "registros",
    window: "meses de historial",
    markets: "mercados prioritarios",
    illustrativeTitle: "Datos ilustrativos",
    illustrativeText:
      "Estos registros muestran el formato de la base de datos y no se presentan como transacciones verificadas. Pueden reemplazarse por registros autorizados y anonimizados.",
    filters: ["Todos", "Estados Unidos", "Canadá", "Brasil"],
    refresh: "Actualizar registros",
    updated: "Actualizado",
    loading: "Cargando registros recientes…",
    error: "Los registros recientes no están disponibles temporalmente.",
    empty: "No hay registros publicados para este período.",
    headers: ["Fecha", "Referencia", "Destino", "Servicio", "Perfil del pedido", "Estado"],
    sample: "Ilustrativo",
    services: {
      catalogue: "Suministro de catálogo",
      private_label: "Marca privada",
      bulk: "Suministro a granel",
      custom: "Proyecto personalizado",
    },
    statuses: {
      completed: "Completado",
      dispatched: "Despachado",
      in_production: "En producción",
    },
    profiles: {
      "Pilot order": "Pedido piloto",
      "10–50 kits": "10–50 kits",
      "50–100 kits": "50–100 kits",
      "Bulk specification": "Especificación a granel",
      "Packaging project": "Proyecto de empaque",
    },
  },
  fr: {
    tag: "Registre récent des réalisations",
    title: "Activité récente des commandes.",
    text: "Une vue anonymisée de l’activité récente des commandes B2B et des réalisations sur nos marchés prioritaires.",
    count: "enregistrements",
    window: "mois d’historique",
    markets: "marchés prioritaires",
    illustrativeTitle: "Données illustratives",
    illustrativeText:
      "Ces enregistrements présentent le format de la base de données et ne sont pas des transactions clients vérifiées. Ils peuvent être remplacés par des données autorisées et anonymisées.",
    filters: ["Tous", "États-Unis", "Canada", "Brésil"],
    refresh: "Actualiser",
    updated: "Actualisé",
    loading: "Chargement des enregistrements récents…",
    error: "Les enregistrements récents sont temporairement indisponibles.",
    empty: "Aucun enregistrement publié pour cette période.",
    headers: ["Date", "Référence", "Destination", "Service", "Profil de commande", "Statut"],
    sample: "Illustratif",
    services: {
      catalogue: "Approvisionnement catalogue",
      private_label: "Marque blanche",
      bulk: "Approvisionnement en vrac",
      custom: "Projet personnalisé",
    },
    statuses: {
      completed: "Terminé",
      dispatched: "Expédié",
      in_production: "En production",
    },
    profiles: {
      "Pilot order": "Commande pilote",
      "10–50 kits": "10–50 kits",
      "50–100 kits": "50–100 kits",
      "Bulk specification": "Spécification vrac",
      "Packaging project": "Projet d’emballage",
    },
  },
  zh: {
    tag: "近期履约记录",
    title: "近期成交与履约记录。",
    text: "以脱敏方式展示重点市场近三个月的 B2B 订单与履约活动，避免公开客户身份和敏感商业信息。",
    count: "条记录",
    window: "个月时间范围",
    markets: "个重点市场",
    illustrativeTitle: "当前为演示数据",
    illustrativeText:
      "这些记录仅用于展示实时数据库结构，并不作为真实客户成交证明。后续可替换为经过授权的真实脱敏记录。",
    filters: ["全部市场", "美国", "加拿大", "巴西"],
    refresh: "刷新记录",
    updated: "更新时间",
    loading: "正在读取近期记录…",
    error: "近期记录暂时无法加载。",
    empty: "该时间范围内暂无公开记录。",
    headers: ["日期", "记录编号", "目的地", "服务类型", "订单规模", "状态"],
    sample: "演示",
    services: {
      catalogue: "目录产品供应",
      private_label: "贴牌服务",
      bulk: "大货供应",
      custom: "定制项目",
    },
    statuses: {
      completed: "已完成",
      dispatched: "已发运",
      in_production: "生产中",
    },
    profiles: {
      "Pilot order": "小批量试单",
      "10–50 kits": "10–50 盒",
      "50–100 kits": "50–100 盒",
      "Bulk specification": "大货规格",
      "Packaging project": "包装项目",
    },
  },
} as const;

const marketValues = ["all", "United States", "Canada", "Brazil"] as const;

function publicReference(reference: string) {
  return reference.replace(/-[A-Z0-9]+-(\d{3})$/, "-$1");
}

export default function FulfillmentCases({ locale }: { locale: Locale }) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [market, setMarket] = useState<(typeof marketValues)[number]>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const t = content[locale];

  async function loadRecords() {
    setLoading(true);
    setError(false);

    try {
      const response = await fetch("/api/fulfillment-cases", { cache: "no-store" });
      if (!response.ok) throw new Error("Unable to load records");
      setData((await response.json()) as ApiResponse);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const loadFrame = window.requestAnimationFrame(() => {
      void loadRecords();
    });

    return () => window.cancelAnimationFrame(loadFrame);
  }, []);

  const visibleRecords = useMemo(() => {
    const records = data?.records ?? [];
    return market === "all"
      ? records
      : records.filter((record) => record.destination === market);
  }, [data, market]);

  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(localeCodes[locale], { month: "short", day: "2-digit", year: "numeric" }),
    [locale],
  );

  return (
    <section className="case-ledger section-shell" aria-labelledby="case-ledger-title">
      <div className="case-ledger-heading">
        <div>
          <p className="section-tag">{t.tag}</p>
          <h2 id="case-ledger-title">{t.title}</h2>
          <p>{t.text}</p>
        </div>
        <dl className="case-ledger-stats">
          <div><dt>{data?.count ?? "—"}</dt><dd>{t.count}</dd></div>
          <div><dt>3</dt><dd>{t.window}</dd></div>
          <div><dt>3</dt><dd>{t.markets}</dd></div>
        </dl>
      </div>

      {data?.includesIllustrativeData && (
        <aside className="case-data-notice">
          <span aria-hidden="true">i</span>
          <div><strong>{t.illustrativeTitle}</strong><p>{t.illustrativeText}</p></div>
        </aside>
      )}

      <div className="case-ledger-toolbar">
        <div className="case-market-filters" role="group" aria-label={t.headers[2]}>
          {marketValues.map((value, index) => (
            <button
              type="button"
              className={market === value ? "active" : undefined}
              aria-pressed={market === value}
              onClick={() => setMarket(value)}
              key={value}
            >
              {t.filters[index]}
            </button>
          ))}
        </div>
        <button className="case-refresh" type="button" onClick={() => void loadRecords()} disabled={loading}>
          <span aria-hidden="true">↻</span>{t.refresh}
        </button>
      </div>

      <div className="case-table-shell">
        {loading ? (
          <p className="case-state">{t.loading}</p>
        ) : error ? (
          <p className="case-state case-state-error">{t.error}</p>
        ) : visibleRecords.length === 0 ? (
          <p className="case-state">{t.empty}</p>
        ) : (
          <table className="case-table">
            <thead>
              <tr>{t.headers.map((header) => <th scope="col" key={header}>{header}</th>)}</tr>
            </thead>
            <tbody>
              {visibleRecords.map((record) => (
                <tr key={record.id}>
                  <td data-label={t.headers[0]}>{dateFormatter.format(new Date(`${record.occurredAt}T00:00:00Z`))}</td>
                  <td data-label={t.headers[1]}>
                    <code>{publicReference(record.reference)}</code>
                    {record.isSample && <small>{t.sample}</small>}
                  </td>
                  <td data-label={t.headers[2]}>{t.filters[marketValues.indexOf(record.destination as (typeof marketValues)[number])]}</td>
                  <td data-label={t.headers[3]}>{t.services[record.service as keyof typeof t.services] ?? record.service}</td>
                  <td data-label={t.headers[4]}>{t.profiles[record.orderProfile as keyof typeof t.profiles] ?? record.orderProfile}</td>
                  <td data-label={t.headers[5]}>
                    <span className={`case-status case-status-${record.status}`}>
                      {t.statuses[record.status as keyof typeof t.statuses] ?? record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {data && (
        <p className="case-ledger-updated">
          {t.updated}: {new Intl.DateTimeFormat(localeCodes[locale], {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(new Date(data.generatedAt))}
        </p>
      )}
    </section>
  );
}
