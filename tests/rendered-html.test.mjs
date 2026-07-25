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
  assert.match(html, /Evidence first/i);
  assert.match(html, /Qualified B2B peptide supply/i);
  assert.match(html, /Watch the workflow/i);
  assert.match(html, /中文/);
  assert.match(html, /Professional-use and compliance notice/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/i);
});

test("includes complete Chinese locale content", async () => {
  const [homepage, legalDocument] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/LegalDocument.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(homepage, /先看证据。/);
  assert.match(homepage, /产品分类 · Products Categories/);
  assert.match(homepage, /前往 WhatsApp 继续沟通/);
  assert.match(legalDocument, /隐私政策/);
  assert.match(legalDocument, /网站使用条款/);
  assert.match(legalDocument, /合规声明/);
});

for (const pathname of ["/privacy", "/terms", "/compliance"]) {
  test(`renders ${pathname}`, async () => {
    const response = await render(pathname);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /Peptivanta/i);
  });
}
