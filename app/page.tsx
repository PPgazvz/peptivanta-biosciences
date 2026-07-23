"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { createWhatsAppUrl, siteConfig } from "../site.config";

type Locale = "en" | "pt";
type Category = "all" | "catalogue" | "cosmetic" | "custom";

const copy = {
  en: {
    nav: ["Products", "Quality", "Private label", "Company"],
    navIds: ["products", "quality", "private-label", "company"],
    eyebrow: "Qualified B2B peptide supply",
    heroTitleA: "Evidence first.",
    heroTitleB: "Every batch.",
    heroText:
      "Documented catalogue peptides, flexible private-label support, and responsive export coordination for qualified professional customers.",
    primaryCta: "Start an inquiry",
    secondaryCta: "Explore catalogue",
    heroNote: "No online checkout · Every inquiry is reviewed",
    imageLabel: "Controlled packaging environment",
    imageSub: "Authentic operational facility image",
    proof: [
      ["Batch-linked", "documentation"],
      ["B2B only", "customer review"],
      ["Global", "export coordination"],
    ],
    introTag: "A clearer supply experience",
    introTitle: "Built around documents, not promises.",
    introText:
      "A focused workflow for distributors, research organizations, formulation teams, and qualified commercial buyers.",
    pillars: [
      ["01", "Defined specifications", "Product, format, quantity, and documentation are confirmed before quotation."],
      ["02", "Quality visibility", "Available COA, analytical data, and batch information are reviewed with each inquiry."],
      ["03", "Human support", "A dedicated contact follows the request from qualification through dispatch."],
    ],
    categoryTag: "Products Categories",
    categoryTitle: "A clearer way into the catalogue.",
    categoryText:
      "Browse by supply format and professional application. Every category routes to a qualification-led inquiry, never direct consumer checkout.",
    categoryItems: [
      ["01", "Catalogue Peptides", "Defined configurations across a broad peptide catalogue.", "Retatrutide · Tirzepatide · BPC-157", "catalogue"],
      ["02", "Cosmetic Ingredients", "Peptide ingredients for qualified formulation and sourcing teams.", "GHK-Cu · Acetyl Hexapeptide-8", "cosmetic"],
      ["03", "Peptide Blends", "Configuration-led discussion for multi-component product requirements.", "Specification review · Batch planning", "catalogue"],
      ["04", "Bulk Supply", "Quantity, format, documentation, and destination reviewed together.", "Commercial quantities · Export review", "custom"],
      ["05", "Private Label", "Label artwork, vial presentation, and packaging coordination.", "OEM · Packaging · Brand support", "custom"],
      ["06", "Custom Inquiry", "A guided path for requirements not covered by the visible catalogue.", "Sequence · Format · Documentation", "custom"],
    ],
    productsTag: "Selected catalogue",
    productsTitle: "Find a starting point.",
    productsText:
      "Representative items from a broader catalogue. Availability and destination eligibility are confirmed individually.",
    search: "Search product name",
    categories: ["All", "Catalogue peptides", "Cosmetic ingredients", "Custom & bulk"],
    ask: "Ask on WhatsApp",
    docs: "Documentation review",
    noProducts: "No matching products.",
    qualityTag: "Quality framework",
    qualityTitle: "Traceable by design.",
    qualityText:
      "Our process prioritizes specification alignment, document availability, careful packaging, and clear handover.",
    steps: [
      ["01", "Requirement review", "We confirm product identity, configuration, quantity, destination, and professional use."],
      ["02", "Document alignment", "Available batch information and analytical documents are matched to the request."],
      ["03", "Packaging control", "Packaging configuration and handling requirements are confirmed before dispatch."],
      ["04", "Export coordination", "Shipping options are reviewed against destination requirements and order profile."],
    ],
    facilityKicker: "Real facility imagery",
    facilityTitle: "A professional operating environment.",
    facilityText:
      "We use authentic supply-network photography and avoid stock-lab claims. Facility identity and certifications are disclosed only when documentary verification is available.",
    inventoryCaption: "Organized inventory and order allocation",
    privateTag: "Private-label support",
    privateTitle: "Your brand, with a more disciplined workflow.",
    privateText:
      "For qualified distributors and brand teams, we support label artwork coordination, packaging configuration, and batch-based production planning.",
    privateBullets: [
      "Label size and artwork review",
      "Low-volume pilot discussion",
      "Batch and packaging coordination",
      "Confidential B2B communication",
    ],
    privateCta: "Discuss a private-label project",
    companyTag: "The brand",
    companyTitle: "Peptivanta Biosciences is designed around professional supply clarity.",
    companyText:
      "Peptivanta Biosciences is our product and service brand for professional customer communication, request qualification, documentation coordination, and export follow-through.",
    inquiryTag: "Qualified inquiry",
    inquiryTitle: "Tell us what you need.",
    inquiryText:
      "Share the product, configuration, quantity, and destination. We will confirm what can be supplied lawfully and what documentation is available.",
    form: {
      name: "Your name",
      company: "Company / organization",
      country: "Destination country",
      contact: "Email or WhatsApp",
      product: "Product or service",
      quantity: "Estimated quantity",
      use: "Professional intended use",
      placeholderUse: "Research, analytical, formulation, distribution…",
      consent: "I confirm this is a professional inquiry and accept the compliance notice.",
      submit: "Continue on WhatsApp",
      missing:
        "The site owner has not added a WhatsApp number yet. Please update site.config.ts before launch.",
    },
    complianceTitle: "Professional-use and compliance notice",
    complianceText:
      "Products displayed are offered only for qualified research, analytical, formulation-development, or other lawful professional applications. They are not presented as medicines and are not for human or veterinary use. No medical claims, dosing advice, or consumer-use instructions are provided. Supply is subject to customer qualification, destination-country review, and applicable law.",
    footerNote: "Documented peptide supply for qualified professional customers.",
    languageLabel: "Português",
  },
  pt: {
    nav: ["Produtos", "Qualidade", "Marca própria", "Empresa"],
    navIds: ["products", "quality", "private-label", "company"],
    eyebrow: "Fornecimento B2B qualificado de peptídeos",
    heroTitleA: "Evidência primeiro.",
    heroTitleB: "Em cada lote.",
    heroText:
      "Peptídeos de catálogo documentados, suporte flexível de marca própria e coordenação ágil de exportação para clientes profissionais qualificados.",
    primaryCta: "Iniciar consulta",
    secondaryCta: "Ver catálogo",
    heroNote: "Sem checkout online · Toda consulta é revisada",
    imageLabel: "Ambiente controlado de embalagem",
    imageSub: "Imagem autêntica do ambiente operacional",
    proof: [
      ["Documentação", "vinculada ao lote"],
      ["Somente B2B", "análise do cliente"],
      ["Global", "coordenação de exportação"],
    ],
    introTag: "Uma experiência de fornecimento mais clara",
    introTitle: "Baseado em documentos, não em promessas.",
    introText:
      "Um fluxo objetivo para distribuidores, organizações de pesquisa, equipes de formulação e compradores comerciais qualificados.",
    pillars: [
      ["01", "Especificações definidas", "Produto, formato, quantidade e documentação são confirmados antes da cotação."],
      ["02", "Visibilidade de qualidade", "COA, dados analíticos e informações de lote disponíveis são revisados em cada consulta."],
      ["03", "Suporte humano", "Um contato dedicado acompanha a solicitação até a expedição."],
    ],
    categoryTag: "Products Categories",
    categoryTitle: "Uma entrada mais clara para o catálogo.",
    categoryText:
      "Navegue por formato de fornecimento e aplicação profissional. Cada categoria leva a uma consulta qualificada, nunca a um checkout de consumidor.",
    categoryItems: [
      ["01", "Peptídeos de catálogo", "Configurações definidas em um amplo catálogo de peptídeos.", "Retatrutide · Tirzepatide · BPC-157", "catalogue"],
      ["02", "Ingredientes cosméticos", "Ingredientes peptídicos para equipes qualificadas de formulação e compras.", "GHK-Cu · Acetyl Hexapeptide-8", "cosmetic"],
      ["03", "Misturas de peptídeos", "Discussão orientada por especificações para requisitos multicomponentes.", "Especificação · Planejamento de lote", "catalogue"],
      ["04", "Fornecimento a granel", "Quantidade, formato, documentos e destino revisados em conjunto.", "Volume comercial · Revisão de exportação", "custom"],
      ["05", "Marca própria", "Coordenação de arte, apresentação dos frascos e embalagem.", "OEM · Embalagem · Suporte de marca", "custom"],
      ["06", "Consulta personalizada", "Um caminho guiado para requisitos fora do catálogo visível.", "Sequência · Formato · Documentação", "custom"],
    ],
    productsTag: "Catálogo selecionado",
    productsTitle: "Encontre um ponto de partida.",
    productsText:
      "Itens representativos de um catálogo maior. Disponibilidade e elegibilidade por destino são confirmadas individualmente.",
    search: "Buscar nome do produto",
    categories: ["Todos", "Peptídeos de catálogo", "Ingredientes cosméticos", "Personalizado e granel"],
    ask: "Consultar no WhatsApp",
    docs: "Revisão de documentação",
    noProducts: "Nenhum produto encontrado.",
    qualityTag: "Estrutura de qualidade",
    qualityTitle: "Rastreável por princípio.",
    qualityText:
      "Nosso processo prioriza especificações, disponibilidade documental, embalagem cuidadosa e transferência clara.",
    steps: [
      ["01", "Análise do requisito", "Confirmamos identidade, configuração, quantidade, destino e uso profissional."],
      ["02", "Alinhamento documental", "Informações de lote e documentos analíticos disponíveis são associados à solicitação."],
      ["03", "Controle de embalagem", "Configuração e manuseio são confirmados antes da expedição."],
      ["04", "Coordenação de exportação", "As opções de envio são revisadas conforme destino e perfil do pedido."],
    ],
    facilityKicker: "Imagens reais",
    facilityTitle: "Um ambiente operacional profissional.",
    facilityText:
      "Utilizamos fotografias autênticas da rede de fornecimento. Identidade da instalação e certificações só são divulgadas com documentação verificável.",
    inventoryCaption: "Estoque organizado e alocação de pedidos",
    privateTag: "Suporte de marca própria",
    privateTitle: "Sua marca, com um processo mais disciplinado.",
    privateText:
      "Para distribuidores e equipes de marca qualificados, apoiamos a arte do rótulo, a configuração da embalagem e o planejamento por lote.",
    privateBullets: [
      "Revisão de tamanho e arte do rótulo",
      "Discussão de piloto de baixo volume",
      "Coordenação de lote e embalagem",
      "Comunicação B2B confidencial",
    ],
    privateCta: "Discutir um projeto de marca própria",
    companyTag: "A marca",
    companyTitle: "Peptivanta Biosciences foi criada para dar clareza ao fornecimento profissional.",
    companyText:
      "Peptivanta Biosciences é nossa marca de produtos e serviços para comunicação profissional, qualificação, coordenação documental e acompanhamento de exportação.",
    inquiryTag: "Consulta qualificada",
    inquiryTitle: "Conte-nos o que você precisa.",
    inquiryText:
      "Informe produto, configuração, quantidade e destino. Confirmaremos o fornecimento permitido e a documentação disponível.",
    form: {
      name: "Seu nome",
      company: "Empresa / organização",
      country: "País de destino",
      contact: "E-mail ou WhatsApp",
      product: "Produto ou serviço",
      quantity: "Quantidade estimada",
      use: "Uso profissional pretendido",
      placeholderUse: "Pesquisa, análise, formulação, distribuição…",
      consent: "Confirmo que esta é uma consulta profissional e aceito o aviso de conformidade.",
      submit: "Continuar no WhatsApp",
      missing:
        "O número de WhatsApp ainda não foi configurado. Atualize site.config.ts antes do lançamento.",
    },
    complianceTitle: "Aviso de uso profissional e conformidade",
    complianceText:
      "Os produtos são oferecidos somente para pesquisa qualificada, análise, desenvolvimento de formulações ou outras aplicações profissionais lícitas. Não são apresentados como medicamentos e não se destinam ao uso humano ou veterinário. Não fornecemos alegações médicas, doses ou instruções de uso ao consumidor. O fornecimento depende da qualificação do cliente, análise do país de destino e legislação aplicável.",
    footerNote: "Fornecimento documentado para clientes profissionais qualificados.",
    languageLabel: "English",
  },
} as const;

const products = [
  { name: "Retatrutide", code: "RT", category: "catalogue", formats: "5–100 mg · 10 vials" },
  { name: "Tirzepatide", code: "TR", category: "catalogue", formats: "5–60 mg · 10 vials" },
  { name: "Semaglutide", code: "SM", category: "catalogue", formats: "Multiple configurations" },
  { name: "BPC-157", code: "BC", category: "catalogue", formats: "2–10 mg · 10 vials" },
  { name: "TB-500", code: "TB", category: "catalogue", formats: "2–10 mg · 10 vials" },
  { name: "CJC-1295", code: "CJ", category: "catalogue", formats: "Multiple configurations" },
  { name: "Ipamorelin", code: "IP", category: "catalogue", formats: "5–10 mg · 10 vials" },
  { name: "MOTS-C", code: "MC", category: "catalogue", formats: "10–40 mg · 10 vials" },
  { name: "GHK-Cu", code: "CU", category: "cosmetic", formats: "50–100 mg · Raw material" },
  { name: "Acetyl Hexapeptide-8", code: "AH8", category: "cosmetic", formats: "Bulk inquiry" },
  { name: "Custom configuration", code: "OEM", category: "custom", formats: "Private label · Packaging" },
  { name: "Bulk peptide inquiry", code: "BLK", category: "custom", formats: "Specification-led review" },
] satisfies Array<{ name: string; code: string; category: Exclude<Category, "all">; formats: string }>;

function Brand() {
  return (
    <Link className="brand" href="#top" aria-label="Peptivanta home">
      <img src="/logo-mark.svg" alt="" width={44} height={44} />
      <span>
        <strong>{siteConfig.brandName}</strong>
        <small>Biosciences</small>
      </span>
    </Link>
  );
}

export default function Home() {
  const [locale, setLocale] = useState<Locale>("en");
  const [category, setCategory] = useState<Category>("all");
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState("");
  const t = copy[locale];

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return products.filter(
      (product) =>
        (category === "all" || product.category === category) &&
        (!normalized ||
          product.name.toLowerCase().includes(normalized) ||
          product.code.toLowerCase().includes(normalized)),
    );
  }, [category, query]);

  function productMessage(name: string, formats: string) {
    return locale === "en"
      ? `Hello, I represent a professional organization and am interested in ${name} (${formats}). Please share available configurations, MOQ, documentation, and destination eligibility.`
      : `Olá, represento uma organização profissional e tenho interesse em ${name} (${formats}). Por favor, envie configurações disponíveis, MOQ, documentação e elegibilidade para o destino.`;
  }

  function handleInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!siteConfig.whatsappNumber) {
      setFormStatus(t.form.missing);
      return;
    }
    const message = [
      locale === "en" ? "Qualified website inquiry" : "Consulta qualificada pelo site",
      `Name: ${data.get("name")}`,
      `Company: ${data.get("company")}`,
      `Destination: ${data.get("country")}`,
      `Contact: ${data.get("contact")}`,
      `Product: ${data.get("product")}`,
      `Quantity: ${data.get("quantity")}`,
      `Professional use: ${data.get("intendedUse")}`,
    ].join("\n");
    window.open(createWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  }

  return (
    <main id="top">
      <div className="noise" aria-hidden="true" />
      <header className="site-header">
        <Brand />
        <button
          className="menu-button"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
        <nav className={menuOpen ? "nav nav-open" : "nav"} aria-label="Primary navigation">
          {t.nav.map((item, index) => (
            <a key={item} href={`#${t.navIds[index]}`} onClick={() => setMenuOpen(false)}>
              {item}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <button
            className="language"
            type="button"
            onClick={() => setLocale(locale === "en" ? "pt" : "en")}
          >
            {t.languageLabel}
          </button>
          <a className="button button-small" href="#inquiry">
            {t.primaryCta}
          </a>
        </div>
      </header>

      <section className="hero section-shell">
        <div className="hero-copy">
          <p className="eyebrow"><span />{t.eyebrow}</p>
          <h1>
            {t.heroTitleA}
            <em>{t.heroTitleB}</em>
          </h1>
          <p className="hero-text">{t.heroText}</p>
          <div className="hero-actions">
            <a className="button" href="#inquiry">{t.primaryCta}<span>↗</span></a>
            <a className="text-link" href="#products">{t.secondaryCta}<span>↓</span></a>
          </div>
          <p className="micro-note">{t.heroNote}</p>
        </div>
        <div className="hero-visual">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="hero-image-frame">
            <img
              src="/images/facility.jpg"
              alt="Controlled packaging facility"
            />
            <div className="image-scan" aria-hidden="true" />
          </div>
          <div className="image-caption">
            <span className="pulse" />
            <div><strong>{t.imageLabel}</strong><small>{t.imageSub}</small></div>
          </div>
          <div className="molecule-card">
            <span>QC</span>
            <strong>Identity</strong>
            <small>Purity · Mass · Batch</small>
          </div>
        </div>
      </section>

      <section className="proof-strip section-shell" aria-label="Service principles">
        {t.proof.map(([value, label]) => (
          <div key={value}><strong>{value}</strong><span>{label}</span></div>
        ))}
        <p>{siteConfig.operatingRegion}</p>
      </section>

      <section className="intro section-shell">
        <div className="section-heading">
          <p className="section-tag">{t.introTag}</p>
          <h2>{t.introTitle}</h2>
          <p>{t.introText}</p>
        </div>
        <div className="pillar-grid">
          {t.pillars.map(([number, title, text]) => (
            <article className="pillar-card" key={number}>
              <span>{number}</span><h3>{title}</h3><p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="category-showcase section-shell" id="categories">
        <div className="section-heading split-heading">
          <div>
            <p className="section-tag">{t.categoryTag}</p>
            <h2>{t.categoryTitle}</h2>
          </div>
          <p>{t.categoryText}</p>
        </div>
        <div className="category-grid">
          {t.categoryItems.map(([number, title, description, examples, target], index) => (
            <button
              className={`category-card category-card-${index + 1}`}
              type="button"
              key={number}
              onClick={() => {
                setCategory(target as Category);
                document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span className="category-number">{number}</span>
              <span className="category-symbol" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <strong>{title}</strong>
              <small>{description}</small>
              <em>{examples}</em>
              <b aria-hidden="true">↗</b>
            </button>
          ))}
        </div>
      </section>

      <section className="products section-shell" id="products">
        <div className="section-heading split-heading">
          <div><p className="section-tag">{t.productsTag}</p><h2>{t.productsTitle}</h2></div>
          <p>{t.productsText}</p>
        </div>
        <div className="catalogue-tools">
          <label className="search-box">
            <span aria-hidden="true">⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t.search}
              aria-label={t.search}
            />
          </label>
          <div className="filter-tabs" role="group" aria-label="Product categories">
            {(["all", "catalogue", "cosmetic", "custom"] as Category[]).map((item, index) => (
              <button
                key={item}
                type="button"
                className={category === item ? "active" : ""}
                onClick={() => setCategory(item)}
              >
                {t.categories[index]}
              </button>
            ))}
          </div>
        </div>
        <div className="product-grid">
          {filtered.map((product, index) => (
            <article className="product-card" key={product.code}>
              <div className="product-top">
                <span>{product.code}</span>
                <small>{String(index + 1).padStart(2, "0")}</small>
              </div>
              <h3>{product.name}</h3>
              <p>{product.formats}</p>
              <div className="product-meta"><i />{t.docs}</div>
              <a
                href={createWhatsAppUrl(productMessage(product.name, product.formats))}
                target={siteConfig.whatsappNumber ? "_blank" : undefined}
                rel="noreferrer"
              >
                {t.ask}<span>↗</span>
              </a>
            </article>
          ))}
        </div>
        {!filtered.length && <p className="empty-state">{t.noProducts}</p>}
        <div className="catalogue-disclaimer">
          {t.complianceText}
        </div>
      </section>

      <section className="quality" id="quality">
        <div className="section-shell quality-shell">
          <div className="quality-copy">
            <p className="section-tag">{t.qualityTag}</p>
            <h2>{t.qualityTitle}</h2>
            <p>{t.qualityText}</p>
          </div>
          <div className="quality-steps">
            {t.steps.map(([number, title, text]) => (
              <article key={number}>
                <span>{number}</span>
                <div><h3>{title}</h3><p>{text}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="facility section-shell">
        <div className="facility-copy">
          <p className="section-tag">{t.facilityKicker}</p>
          <h2>{t.facilityTitle}</h2>
          <p>{t.facilityText}</p>
          <div className="facility-metrics">
            <div><strong>COA</strong><span>Availability review</span></div>
            <div><strong>HPLC / MS</strong><span>Analytical data where available</span></div>
          </div>
        </div>
        <figure className="facility-photo">
          <img src="/images/inventory.jpg" alt={t.inventoryCaption} />
          <figcaption>{t.inventoryCaption}</figcaption>
        </figure>
      </section>

      <section className="private-label section-shell" id="private-label">
        <div className="private-image">
          <img src="/images/vials.png" alt="Unlabelled vials prepared for packaging" />
          <div className="label-sample">
            <img src="/logo-mark.svg" alt="" width={30} height={30} />
            <div><strong>PEPTIVANTA</strong><small>CUSTOM LABEL SYSTEM</small></div>
          </div>
        </div>
        <div className="private-copy">
          <p className="section-tag">{t.privateTag}</p>
          <h2>{t.privateTitle}</h2>
          <p>{t.privateText}</p>
          <ul>{t.privateBullets.map((item) => <li key={item}><span>✓</span>{item}</li>)}</ul>
          <a className="button button-dark" href="#inquiry">{t.privateCta}<span>↗</span></a>
        </div>
      </section>

      <section className="company section-shell" id="company">
        <div className="company-heading">
          <p className="section-tag">{t.companyTag}</p>
          <h2>{t.companyTitle}</h2>
        </div>
        <div className="company-content">
          <p>{t.companyText}</p>
          <dl>
            <div><dt>Operating region</dt><dd>{siteConfig.operatingRegion}</dd></div>
            <div><dt>Brand focus</dt><dd>Professional peptide supply inquiries</dd></div>
            <div><dt>Response target</dt><dd>{siteConfig.responseTime}</dd></div>
            {siteConfig.registeredAddress && (
              <div><dt>Registered address</dt><dd>{siteConfig.registeredAddress}</dd></div>
            )}
          </dl>
        </div>
      </section>

      <section className="inquiry" id="inquiry">
        <div className="section-shell inquiry-shell">
          <div className="inquiry-copy">
            <p className="section-tag">{t.inquiryTag}</p>
            <h2>{t.inquiryTitle}</h2>
            <p>{t.inquiryText}</p>
            <div className="contact-lines">
              <span>WhatsApp</span><strong>{siteConfig.whatsappNumber || "Add number in site.config.ts"}</strong>
              <span>Email</span><strong>{siteConfig.salesEmail || "Add email in site.config.ts"}</strong>
            </div>
          </div>
          <form className="inquiry-form" onSubmit={handleInquiry}>
            <div className="form-row">
              <label>{t.form.name}<input name="name" required /></label>
              <label>{t.form.company}<input name="company" required /></label>
            </div>
            <div className="form-row">
              <label>{t.form.country}<input name="country" required /></label>
              <label>{t.form.contact}<input name="contact" required /></label>
            </div>
            <div className="form-row">
              <label>{t.form.product}<input name="product" required /></label>
              <label>{t.form.quantity}<input name="quantity" required /></label>
            </div>
            <label>{t.form.use}<textarea name="intendedUse" placeholder={t.form.placeholderUse} required /></label>
            <label className="consent">
              <input type="checkbox" required /><span>{t.form.consent}</span>
            </label>
            <button className="button form-submit" type="submit">{t.form.submit}<span>↗</span></button>
            {formStatus && <p className="form-status" role="status">{formStatus}</p>}
          </form>
        </div>
      </section>

      <section className="compliance section-shell">
        <span>!</span>
        <div><h2>{t.complianceTitle}</h2><p>{t.complianceText}</p></div>
      </section>

      <footer className="footer section-shell">
        <div><Brand /><p>{t.footerNote}</p></div>
        <div className="footer-links">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/compliance">Compliance</Link>
        </div>
        <p>© {new Date().getFullYear()} {siteConfig.fullBrandName}</p>
      </footer>

      <a
        className="whatsapp-float"
        href={createWhatsAppUrl(locale === "en" ? "Hello, I have a professional peptide supply inquiry." : "Olá, tenho uma consulta profissional sobre fornecimento de peptídeos.")}
        target={siteConfig.whatsappNumber ? "_blank" : undefined}
        rel="noreferrer"
        aria-label="WhatsApp inquiry"
      >
        <span>WA</span><small>{locale === "en" ? "Inquire" : "Consultar"}</small>
      </a>
    </main>
  );
}
