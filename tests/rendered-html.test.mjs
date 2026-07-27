import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the finished website", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Peptivanta Biosciences/i);
  assert.match(html, /Peptide supply,/i);
  assert.match(html, /made clear/i);
  assert.match(html, /Watch the workflow/i);
  assert.match(html, /One line\. Five visible stages\./i);
  assert.match(html, /Factory process view/i);
  assert.match(html, /Request a quote/i);
  assert.match(html, /Get quote on WhatsApp/i);
  assert.match(html, /Recent fulfillment/i);
  assert.match(html, /href="\/fulfillment"/i);
  assert.match(html, /\/images\/inventory\.webp/);
  assert.match(html, /Português/);
  assert.match(html, /Español/);
  assert.match(html, /Français/);
  assert.match(html, /中文/);
  assert.match(html, /Professional-use and compliance notice/i);
  assert.doesNotMatch(html, /Evidence first|Every batch|No direct online ordering/i);
  assert.doesNotMatch(html, /Add email in site\.config\.ts/i);
  assert.doesNotMatch(html, /\/images\/inventory\.jpg/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/i);
});

test("includes complete multilingual content", async () => {
  const [homepage, fulfillmentCases, fulfillmentPage, legalDocument] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/FulfillmentCases.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/fulfillment/FulfillmentLedgerPage.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/LegalDocument.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(homepage, /多肽供应，/);
  assert.match(homepage, /一条产线，五个清晰环节。/);
  assert.match(homepage, /Suministro de péptidos,/);
  assert.match(homepage, /L’approvisionnement en peptides,/);
  assert.match(homepage, /factory-flow-desktop-v2\.mp4/);
  assert.match(homepage, /FactoryWorkflow/);
  assert.match(homepage, /产品分类 · Products Categories/);
  assert.match(fulfillmentCases, /近期成交与履约记录/);
  assert.match(fulfillmentCases, /金额 \(USD\)/);
  assert.match(fulfillmentCases, /个月时间范围/);
  assert.doesNotMatch(fulfillmentCases, /当前为演示数据/);
  assert.doesNotMatch(fulfillmentCases, /这些记录仅用于展示实时数据库结构/);
  assert.match(fulfillmentPage, /返回网站/);
  assert.match(fulfillmentPage, /FulfillmentCases/);
  assert.match(homepage, /前往 WhatsApp 获取报价/);
  assert.match(legalDocument, /隐私政策/);
  assert.match(legalDocument, /Política de Privacidad/);
  assert.match(legalDocument, /Politique de confidentialité/);
  assert.match(legalDocument, /网站使用条款/);
  assert.match(legalDocument, /合规声明/);
  assert.doesNotMatch(
    homepage,
    /先看证据|每一批次|不提供在线直接下单|每一份询盘均需审核|供应链现场/,
  );
});

test("configures durable recent fulfillment records", async () => {
  const [hosting, route, schema] = await Promise.all([
    readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
    readFile(new URL("../app/api/fulfillment-cases/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../db/schema.ts", import.meta.url), "utf8"),
  ]);

  assert.equal(JSON.parse(hosting).d1, "DB");
  assert.match(route, /DISPLAY_LIMIT = 100/);
  assert.match(route, /UPDATE_INTERVAL_DAYS = 7/);
  assert.match(route, /GENERATOR_VERSION = 3/);
  assert.match(route, /cycleKey/);
  assert.match(route, /ageAtCycleEndDays > 14 && !isBulk/);
  assert.match(route, /occurredAt < juneStart/);
  assert.match(route, /setUTCMonth\(cutoff\.getUTCMonth\(\) - 3\)/);
  assert.match(schema, /fulfillment_cases/);
  assert.match(schema, /amount_usd_cents/);
  assert.match(schema, /cycle_key/);
});

test("renders the dedicated fulfillment page", async () => {
  const response = await render("/fulfillment");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Recent fulfillment activity/i);
  assert.match(html, /Loading recent records/i);
  assert.match(html, /Back to website/i);
  assert.match(html, /wa\.me\/19863059927/i);
});

for (const pathname of ["/privacy", "/terms", "/compliance"]) {
  test(`renders ${pathname}`, async () => {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /Peptivanta/i);
  });
}
