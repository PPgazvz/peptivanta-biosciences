"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createWhatsAppUrl, siteConfig } from "../../site.config";
import {
  htmlLang,
  isSiteLocale,
  LANGUAGE_OPTIONS,
  LOCALE_STORAGE_KEY,
  type SiteLocale,
} from "../i18n";

type CoverageStatus = "direct" | "blend" | "gap";

type CoaProduct = {
  product: string;
  coverage: string;
  status: CoverageStatus;
};

const coaProducts: CoaProduct[] = [
  { product: "Retatrutide", coverage: "5 / 10 / 15 / 20 / 30 mg", status: "direct" },
  { product: "Tirzepatide", coverage: "10 / 15 / 30 / 60 mg", status: "direct" },
  { product: "Semaglutide", coverage: "5 / 10 / 30 mg", status: "direct" },
  { product: "BPC-157", coverage: "5 / 10 / 20 mg", status: "direct" },
  { product: "TB-500", coverage: "10 mg · BPC-157 blend", status: "direct" },
  { product: "CJC-1295", coverage: "CJC / Ipamorelin blend only", status: "blend" },
  { product: "Ipamorelin", coverage: "10 mg · CJC blend", status: "direct" },
  { product: "MOTS-C", coverage: "10 / 40 mg", status: "direct" },
  { product: "GHK-Cu", coverage: "50 / 100 mg · raw material", status: "direct" },
  { product: "Acetyl Hexapeptide-8", coverage: "No direct match in current index", status: "gap" },
];

const additionalFamilies = [
  "5-Amino-1MQ",
  "AHK-Cu",
  "AOD-9604",
  "Cagrilintide",
  "DSIP",
  "Epithalon",
  "Glow blend",
  "Glutathione",
  "HCG",
  "HGH / Somatropin",
  "IGF-LR3",
  "KLOW",
  "KPV",
  "Melanotan-2",
  "NAD+",
  "PT-141",
  "Selank",
  "Semax",
  "Sermorelin",
  "SS-31",
  "Tesamorelin",
  "Thymosin Alpha-1",
  "Thymosin Beta-4",
];

const pageCopy = {
  en: {
    back: "Back to website",
    language: "Language",
    eyebrow: "Analytical document index",
    titleA: "Find the right COA.",
    titleB: "Then match the batch.",
    intro:
      "This index shows current document coverage by product family. The applicable report is confirmed against the requested specification, source, and batch before it is shared.",
    metrics: ["catalogue families mapped", "direct document matches", "standalone match to confirm"],
    search: "Search product or specification",
    searchLabel: "Search the COA index",
    tableProduct: "Product",
    tableCoverage: "Current document coverage",
    tableStatus: "Index status",
    tableAction: "Request",
    statuses: {
      direct: "Direct match found",
      blend: "Blend document only",
      gap: "Match to confirm",
    },
    request: "Request matched COA",
    empty: "No matching product found.",
    additionalTag: "Additional document families",
    additionalTitle: "A broader analytical archive is available by request.",
    additionalText:
      "These families appear in the reviewed archive but are outside the selected public catalogue. Availability and suitability still require individual review.",
    methodTag: "Document matching",
    methodTitle: "One report should never stand in for every lot.",
    steps: [
      ["01", "Confirm identity", "Match the exact product name, blend composition, and requested strength."],
      ["02", "Confirm source and batch", "Review the report date, laboratory, lot or batch reference, and sample identity."],
      ["03", "Share the applicable file", "Provide the document that corresponds to the available supply, not a generic substitute."],
    ],
    notice:
      "COAs and analytical reports are batch- and sample-specific. Inclusion in this index does not establish regulatory approval, destination eligibility, or suitability for human or veterinary use.",
    ctaTitle: "Need a product-specific document check?",
    ctaText:
      "Send the product, specification, destination, and intended professional use. We will confirm which current document can be matched.",
    cta: "Check on WhatsApp",
  },
  pt: {
    back: "Voltar ao site",
    language: "Idioma",
    eyebrow: "Índice de documentos analíticos",
    titleA: "Encontre o COA correto.",
    titleB: "Depois, confirme o lote.",
    intro:
      "Este índice mostra a cobertura documental atual por família. O relatório aplicável é confirmado com a especificação, a origem e o lote antes do envio.",
    metrics: ["famílias do catálogo mapeadas", "correspondências diretas", "correspondência isolada a confirmar"],
    search: "Buscar produto ou especificação",
    searchLabel: "Buscar no índice COA",
    tableProduct: "Produto",
    tableCoverage: "Cobertura documental atual",
    tableStatus: "Status do índice",
    tableAction: "Solicitar",
    statuses: {
      direct: "Correspondência direta",
      blend: "Somente documento de blend",
      gap: "Correspondência a confirmar",
    },
    request: "Solicitar COA correspondente",
    empty: "Nenhum produto correspondente.",
    additionalTag: "Outras famílias documentais",
    additionalTitle: "Um arquivo analítico mais amplo está disponível sob consulta.",
    additionalText:
      "Estas famílias aparecem no arquivo revisado, mas estão fora do catálogo público selecionado. A disponibilidade exige revisão individual.",
    methodTag: "Correspondência documental",
    methodTitle: "Um relatório não deve representar todos os lotes.",
    steps: [
      ["01", "Confirmar identidade", "Conferir produto, composição do blend e concentração solicitada."],
      ["02", "Confirmar origem e lote", "Revisar data, laboratório, lote e identificação da amostra."],
      ["03", "Enviar o arquivo aplicável", "Fornecer o documento ligado ao fornecimento disponível, sem substituição genérica."],
    ],
    notice:
      "COAs e relatórios analíticos são específicos de lote e amostra. A inclusão neste índice não estabelece aprovação regulatória, elegibilidade de destino ou adequação para uso humano ou veterinário.",
    ctaTitle: "Precisa verificar um documento específico?",
    ctaText:
      "Envie produto, especificação, destino e uso profissional pretendido. Confirmaremos o documento atual correspondente.",
    cta: "Verificar no WhatsApp",
  },
  es: {
    back: "Volver al sitio",
    language: "Idioma",
    eyebrow: "Índice de documentos analíticos",
    titleA: "Encuentre el COA correcto.",
    titleB: "Después, confirme el lote.",
    intro:
      "Este índice muestra la cobertura documental actual por familia. El informe aplicable se confirma con la especificación, el origen y el lote antes de compartirlo.",
    metrics: ["familias del catálogo revisadas", "coincidencias directas", "coincidencia individual por confirmar"],
    search: "Buscar producto o especificación",
    searchLabel: "Buscar en el índice COA",
    tableProduct: "Producto",
    tableCoverage: "Cobertura documental actual",
    tableStatus: "Estado del índice",
    tableAction: "Solicitar",
    statuses: {
      direct: "Coincidencia directa",
      blend: "Solo documento de mezcla",
      gap: "Coincidencia por confirmar",
    },
    request: "Solicitar COA correspondiente",
    empty: "No se encontró un producto.",
    additionalTag: "Otras familias documentales",
    additionalTitle: "Hay un archivo analítico más amplio disponible bajo consulta.",
    additionalText:
      "Estas familias aparecen en el archivo revisado, pero están fuera del catálogo público seleccionado. La disponibilidad requiere revisión individual.",
    methodTag: "Correspondencia documental",
    methodTitle: "Un informe no debe representar todos los lotes.",
    steps: [
      ["01", "Confirmar identidad", "Verificar producto, composición de la mezcla y concentración solicitada."],
      ["02", "Confirmar origen y lote", "Revisar fecha, laboratorio, lote e identidad de la muestra."],
      ["03", "Compartir el archivo aplicable", "Entregar el documento ligado al suministro disponible, no un sustituto genérico."],
    ],
    notice:
      "Los COA e informes analíticos son específicos de lote y muestra. Su inclusión no implica aprobación regulatoria, elegibilidad de destino ni idoneidad para uso humano o veterinario.",
    ctaTitle: "¿Necesita comprobar un documento específico?",
    ctaText:
      "Envíe producto, especificación, destino y uso profesional previsto. Confirmaremos el documento actual correspondiente.",
    cta: "Comprobar por WhatsApp",
  },
  fr: {
    back: "Retour au site",
    language: "Langue",
    eyebrow: "Index des documents analytiques",
    titleA: "Trouvez le bon COA.",
    titleB: "Puis vérifiez le lot.",
    intro:
      "Cet index présente la couverture documentaire actuelle par famille. Le rapport applicable est vérifié selon la spécification, la source et le lot avant transmission.",
    metrics: ["familles du catalogue indexées", "correspondances directes", "correspondance autonome à confirmer"],
    search: "Rechercher un produit ou une spécification",
    searchLabel: "Rechercher dans l’index COA",
    tableProduct: "Produit",
    tableCoverage: "Couverture documentaire actuelle",
    tableStatus: "Statut de l’index",
    tableAction: "Demander",
    statuses: {
      direct: "Correspondance directe",
      blend: "Document de mélange uniquement",
      gap: "Correspondance à confirmer",
    },
    request: "Demander le COA correspondant",
    empty: "Aucun produit correspondant.",
    additionalTag: "Autres familles documentaires",
    additionalTitle: "Une archive analytique plus large est disponible sur demande.",
    additionalText:
      "Ces familles figurent dans l’archive examinée, mais hors du catalogue public sélectionné. La disponibilité nécessite un examen individuel.",
    methodTag: "Correspondance documentaire",
    methodTitle: "Un rapport ne doit jamais représenter tous les lots.",
    steps: [
      ["01", "Confirmer l’identité", "Vérifier le produit, la composition du mélange et le dosage demandé."],
      ["02", "Confirmer la source et le lot", "Examiner la date, le laboratoire, le lot et l’identité de l’échantillon."],
      ["03", "Transmettre le fichier applicable", "Fournir le document lié à l’offre disponible, sans substitut générique."],
    ],
    notice:
      "Les COA et rapports analytiques sont propres à un lot et à un échantillon. Leur présence dans cet index n’établit ni approbation réglementaire, ni admissibilité à destination, ni aptitude à un usage humain ou vétérinaire.",
    ctaTitle: "Besoin de vérifier un document produit ?",
    ctaText:
      "Envoyez le produit, la spécification, la destination et l’usage professionnel prévu. Nous confirmerons le document actuel correspondant.",
    cta: "Vérifier sur WhatsApp",
  },
  zh: {
    back: "返回网站",
    language: "语言",
    eyebrow: "分析文件索引",
    titleA: "先找到对应 COA，",
    titleB: "再核对实际批次。",
    intro:
      "本页按产品系列展示当前文件覆盖情况。实际提供前仍需根据产品规格、文件来源和具体批次进行匹配，避免用一份通用报告代表所有批次。",
    metrics: ["个网站目录产品已核对", "个产品有直接匹配文件", "个独立产品待补充确认"],
    search: "搜索产品或规格",
    searchLabel: "搜索 COA 文件索引",
    tableProduct: "产品",
    tableCoverage: "当前文件覆盖",
    tableStatus: "索引状态",
    tableAction: "索取文件",
    statuses: {
      direct: "已找到直接匹配",
      blend: "目前仅有复配文件",
      gap: "待补充匹配",
    },
    request: "索取对应 COA",
    empty: "没有找到匹配产品。",
    additionalTag: "其他文件系列",
    additionalTitle: "另有更多分析文件可按需核对。",
    additionalText:
      "以下产品在已检查的文件库中出现，但不属于当前网站精选目录。是否可供应、文件是否适用仍需逐项确认。",
    methodTag: "文件匹配原则",
    methodTitle: "一份报告不能代表所有批次。",
    steps: [
      ["01", "核对产品身份", "确认准确产品名称、复配组成及所需规格。"],
      ["02", "核对来源与批次", "检查报告日期、检测机构、批号以及样品身份。"],
      ["03", "提供适用文件", "只提供与当前可供应产品相匹配的文件，不用通用报告替代。"],
    ],
    notice:
      "COA 与分析报告仅对应特定批次或样品。本索引不代表监管批准、目的地准入，也不表示产品适用于人用或兽用。",
    ctaTitle: "需要核对某个产品的文件？",
    ctaText:
      "请发送产品、规格、目的国家或地区以及预期专业用途，我们会确认当前可以匹配的文件。",
    cta: "通过 WhatsApp 核对",
  },
} as const;

function requestMessage(locale: SiteLocale, product: string, coverage: string) {
  if (locale === "zh") {
    return `您好，我想核对 ${product}（当前索引：${coverage}）的 COA。请确认可供应规格、批次以及对应文件。`;
  }
  if (locale === "pt") {
    return `Olá, gostaria de verificar o COA de ${product} (${coverage}). Confirme a especificação disponível, o lote e o documento correspondente.`;
  }
  if (locale === "es") {
    return `Hola, quisiera verificar el COA de ${product} (${coverage}). Confirme la especificación disponible, el lote y el documento correspondiente.`;
  }
  if (locale === "fr") {
    return `Bonjour, je souhaite vérifier le COA de ${product} (${coverage}). Merci de confirmer la spécification disponible, le lot et le document correspondant.`;
  }
  return `Hello, I would like to verify the COA for ${product} (${coverage}). Please confirm the available specification, batch, and matching document.`;
}

export default function CoaLibraryPage() {
  const [locale, setLocale] = useState<SiteLocale>("en");
  const [query, setQuery] = useState("");
  const t = pageCopy[locale];

  useEffect(() => {
    const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isSiteLocale(storedLocale)) setLocale(storedLocale);
  }, []);

  useEffect(() => {
    document.documentElement.lang = htmlLang(locale);
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }, [locale]);

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return coaProducts;
    return coaProducts.filter(
      (item) =>
        item.product.toLowerCase().includes(normalized) ||
        item.coverage.toLowerCase().includes(normalized),
    );
  }, [query]);

  return (
    <main className={`coa-page lang-${locale}`}>
      <header className="fulfillment-page-header">
        <Link className="brand" href="/" aria-label="Peptivanta home">
          <img src="/logo-mark.svg" alt="" width={44} height={44} />
          <span>
            <strong>{siteConfig.brandName}</strong>
            <small>Biosciences</small>
          </span>
        </Link>

        <div className="fulfillment-page-actions">
          <Link className="fulfillment-back" href="/">
            <span aria-hidden="true">←</span>{t.back}
          </Link>
          <label className="language-select">
            <span>{t.language}</span>
            <select
              value={locale}
              onChange={(event) => setLocale(event.target.value as SiteLocale)}
              aria-label={t.language}
            >
              {LANGUAGE_OPTIONS.map((option) => (
                <option value={option.code} key={option.code}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <section className="coa-hero section-shell">
        <div className="coa-hero-copy">
          <p className="section-tag">{t.eyebrow}</p>
          <h1>{t.titleA}<em>{t.titleB}</em></h1>
          <p>{t.intro}</p>
        </div>
        <dl className="coa-metrics">
          <div><dt>10</dt><dd>{t.metrics[0]}</dd></div>
          <div><dt>8</dt><dd>{t.metrics[1]}</dd></div>
          <div><dt>1</dt><dd>{t.metrics[2]}</dd></div>
        </dl>
      </section>

      <section className="coa-index section-shell" aria-labelledby="coa-index-title">
        <div className="coa-index-heading">
          <div>
            <p className="section-tag">COA / HPLC / MS</p>
            <h2 id="coa-index-title">{t.tableCoverage}</h2>
          </div>
          <label className="coa-search">
            <span aria-hidden="true">⌕</span>
            <span className="sr-only">{t.searchLabel}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.search}
              aria-label={t.searchLabel}
            />
          </label>
        </div>

        <div className="coa-table-shell">
          <table className="coa-table">
            <thead>
              <tr>
                <th scope="col">{t.tableProduct}</th>
                <th scope="col">{t.tableCoverage}</th>
                <th scope="col">{t.tableStatus}</th>
                <th scope="col"><span className="sr-only">{t.tableAction}</span></th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((item) => (
                <tr key={item.product}>
                  <td data-label={t.tableProduct}><strong>{item.product}</strong></td>
                  <td data-label={t.tableCoverage}>{item.coverage}</td>
                  <td data-label={t.tableStatus}>
                    <span className={`coa-status coa-status-${item.status}`}>
                      {t.statuses[item.status]}
                    </span>
                  </td>
                  <td data-label={t.tableAction}>
                    <a
                      href={createWhatsAppUrl(requestMessage(locale, item.product, item.coverage))}
                      target={siteConfig.whatsappNumber ? "_blank" : undefined}
                      rel="noreferrer"
                    >
                      {t.request}<span aria-hidden="true">↗</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filteredProducts.length && <p className="coa-empty">{t.empty}</p>}
        </div>
      </section>

      <section className="coa-additional section-shell">
        <div>
          <p className="section-tag">{t.additionalTag}</p>
          <h2>{t.additionalTitle}</h2>
          <p>{t.additionalText}</p>
        </div>
        <ul>
          {additionalFamilies.map((family) => <li key={family}>{family}</li>)}
        </ul>
      </section>

      <section className="coa-method">
        <div className="section-shell">
          <div className="coa-method-heading">
            <p className="section-tag">{t.methodTag}</p>
            <h2>{t.methodTitle}</h2>
          </div>
          <div className="coa-method-grid">
            {t.steps.map(([number, title, text]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <p className="coa-notice">{t.notice}</p>
        </div>
      </section>

      <section className="coa-cta section-shell">
        <div>
          <p className="section-tag">DOCUMENT REQUEST</p>
          <h2>{t.ctaTitle}</h2>
          <p>{t.ctaText}</p>
        </div>
        <a
          className="button"
          href={createWhatsAppUrl(t.ctaText)}
          target={siteConfig.whatsappNumber ? "_blank" : undefined}
          rel="noreferrer"
        >
          {t.cta}<span aria-hidden="true">↗</span>
        </a>
      </section>
    </main>
  );
}
