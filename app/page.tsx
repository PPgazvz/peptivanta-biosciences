"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { createWhatsAppUrl, siteConfig } from "../site.config";

type Locale = "en" | "pt" | "zh";
type Category = "all" | "catalogue" | "cosmetic" | "custom";
type IntroState = "hidden" | "visible" | "closing";

const INTRO_SESSION_KEY = "peptivanta-factory-intro-seen";
const LOCALE_STORAGE_KEY = "peptivanta-locale";

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
    introReplay: "Watch the workflow",
    introSkip: "Skip intro",
    introKicker: "Peptivanta · Operations",
    introLead: "Precision",
    introFinish: "in motion.",
    introStatement: "A controlled path from handling and verification to export-ready dispatch.",
    introStages: ["Prepare", "Verify", "Pack", "Dispatch"],
    introAria: "Peptivanta facility workflow introduction",
    introMeta: "AUTHENTIC WORKFLOW FOOTAGE · MUTED · 08 SEC",
    heroNote: "No online checkout · Every inquiry is reviewed",
    imageLabel: "Controlled packaging environment",
    imageSub: "Authentic operational facility image",
    heroImageAlt: "Controlled packaging facility",
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
    productGroupLabel: "Product categories",
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
    facilityMetrics: ["Availability review", "Analytical data where available"],
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
    vialsAlt: "Unlabelled vials prepared for packaging",
    customLabelSystem: "CUSTOM LABEL SYSTEM",
    companyTag: "The brand",
    companyTitle: "Peptivanta Biosciences is designed around professional supply clarity.",
    companyText:
      "Peptivanta Biosciences is our product and service brand for professional customer communication, request qualification, documentation coordination, and export follow-through.",
    companyDetails: ["Operating region", "Brand focus", "Response target", "Registered address"],
    operatingRegion: "Hong Kong SAR · Sales & Export Coordination",
    brandFocusValue: "Professional peptide supply inquiries",
    responseTime: "Within one business day",
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
    footerLinks: ["Privacy", "Terms", "Compliance"],
    contactLabels: ["WhatsApp", "Email"],
    contactMissing: ["Add number in site.config.ts", "Add email in site.config.ts"],
    whatsappCta: "Inquire",
    whatsappAria: "WhatsApp inquiry",
    servicePrinciplesLabel: "Service principles",
    menuLabel: "Toggle navigation",
    navLabel: "Primary navigation",
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
    introReplay: "Ver o fluxo",
    introSkip: "Pular abertura",
    introKicker: "Peptivanta · Operações",
    introLead: "Precisão",
    introFinish: "em movimento.",
    introStatement: "Um percurso controlado do manuseio e verificação à expedição para exportação.",
    introStages: ["Preparar", "Verificar", "Embalar", "Expedir"],
    introAria: "Introdução ao fluxo operacional da Peptivanta",
    introMeta: "IMAGENS REAIS DO FLUXO · SEM ÁUDIO · 08 SEG",
    heroNote: "Sem checkout online · Toda consulta é revisada",
    imageLabel: "Ambiente controlado de embalagem",
    imageSub: "Imagem autêntica do ambiente operacional",
    heroImageAlt: "Ambiente controlado de embalagem",
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
    productGroupLabel: "Categorias de produtos",
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
    facilityMetrics: ["Revisão de disponibilidade", "Dados analíticos quando disponíveis"],
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
    vialsAlt: "Frascos sem rótulo preparados para embalagem",
    customLabelSystem: "SISTEMA DE RÓTULO PERSONALIZADO",
    companyTag: "A marca",
    companyTitle: "Peptivanta Biosciences foi criada para dar clareza ao fornecimento profissional.",
    companyText:
      "Peptivanta Biosciences é nossa marca de produtos e serviços para comunicação profissional, qualificação, coordenação documental e acompanhamento de exportação.",
    companyDetails: ["Região operacional", "Foco da marca", "Meta de resposta", "Endereço registrado"],
    operatingRegion: "Hong Kong SAR · Coordenação de vendas e exportação",
    brandFocusValue: "Consultas profissionais sobre fornecimento de peptídeos",
    responseTime: "Em até um dia útil",
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
    footerLinks: ["Privacidade", "Termos", "Conformidade"],
    contactLabels: ["WhatsApp", "E-mail"],
    contactMissing: ["Adicione o número em site.config.ts", "Adicione o e-mail em site.config.ts"],
    whatsappCta: "Consultar",
    whatsappAria: "Consulta pelo WhatsApp",
    servicePrinciplesLabel: "Princípios do serviço",
    menuLabel: "Alternar navegação",
    navLabel: "Navegação principal",
  },
  zh: {
    nav: ["产品目录", "质量体系", "贴牌服务", "品牌介绍"],
    navIds: ["products", "quality", "private-label", "company"],
    eyebrow: "面向专业客户的 B2B 多肽供应",
    heroTitleA: "先看证据。",
    heroTitleB: "每一批次。",
    heroText:
      "提供文件化的多肽产品目录、灵活的贴牌支持，以及面向合格专业客户的出口协调服务。",
    primaryCta: "发起询盘",
    secondaryCta: "浏览产品目录",
    introReplay: "观看工厂流程",
    introSkip: "跳过开场",
    introKicker: "Peptivanta · 运营流程",
    introLead: "精准把控",
    introFinish: "贯穿全程。",
    introStatement: "从操作、核验到出口发运，以清晰流程衔接每一个环节。",
    introStages: ["准备", "核验", "包装", "发运"],
    introAria: "Peptivanta 工厂流程开场",
    introMeta: "真实流程影像 · 静音播放 · 08 秒",
    heroNote: "不提供在线直接下单 · 每一份询盘均需审核",
    imageLabel: "规范化包装环境",
    imageSub: "真实运营场景照片",
    heroImageAlt: "规范化包装作业环境",
    proof: [
      ["批次关联", "文件与信息"],
      ["仅限 B2B", "客户资质审核"],
      ["全球市场", "出口协调服务"],
    ],
    introTag: "更清晰的供应体验",
    introTitle: "以文件为依据，而不是空泛承诺。",
    introText:
      "为经销商、科研机构、配方团队和合格商业采购方提供聚焦、清晰的对接流程。",
    pillars: [
      ["01", "明确产品规格", "报价前确认产品、规格、数量和所需文件。"],
      ["02", "质量信息透明", "根据询盘核对可提供的 COA、分析数据和批次信息。"],
      ["03", "专人跟进支持", "从资质确认到发运交接，由专人持续跟进。"],
    ],
    categoryTag: "产品分类 · Products Categories",
    categoryTitle: "更快找到合适的产品入口。",
    categoryText:
      "可按供应形式和专业应用浏览。所有分类均进入资质审核型询盘流程，不面向消费者直接结账。",
    categoryItems: [
      ["01", "目录多肽", "覆盖多种目录多肽与既定规格。", "Retatrutide · Tirzepatide · BPC-157", "catalogue"],
      ["02", "化妆品肽原料", "面向合格配方与采购团队的多肽原料。", "GHK-Cu · Acetyl Hexapeptide-8", "cosmetic"],
      ["03", "复配多肽", "针对多组分产品需求进行规格化沟通。", "规格审核 · 批次规划", "catalogue"],
      ["04", "大货供应", "综合评估数量、规格、文件和目的地要求。", "商业数量 · 出口审核", "custom"],
      ["05", "贴牌服务", "支持标签设计、瓶型呈现和包装协调。", "OEM · 包装 · 品牌支持", "custom"],
      ["06", "定制询盘", "针对目录之外的要求提供引导式对接。", "序列 · 规格 · 文件", "custom"],
    ],
    productsTag: "精选产品目录",
    productsTitle: "从这里开始筛选。",
    productsText:
      "以下为完整目录中的代表性产品。具体供应情况及目的地合规性需要逐项确认。",
    search: "搜索产品名称",
    categories: ["全部", "目录多肽", "化妆品肽原料", "定制与大货"],
    ask: "通过 WhatsApp 询价",
    docs: "批次文件审核",
    noProducts: "未找到匹配的产品。",
    productGroupLabel: "产品分类筛选",
    qualityTag: "质量管理框架",
    qualityTitle: "从流程开始建立可追溯性。",
    qualityText:
      "我们的流程重点关注规格一致性、文件可用性、包装控制和清晰交接。",
    steps: [
      ["01", "需求审核", "确认产品名称、规格、数量、目的地及专业用途。"],
      ["02", "文件匹配", "将可提供的批次信息和分析文件与询盘要求进行匹配。"],
      ["03", "包装控制", "发运前确认包装配置及相应操作要求。"],
      ["04", "出口协调", "根据目的地要求与订单情况评估运输方案。"],
    ],
    facilityKicker: "真实现场影像",
    facilityTitle: "专业、规范的运营环境。",
    facilityText:
      "网站采用真实供应链现场照片，避免使用与实际无关的库存实验室图片。设施身份和认证信息仅在具备可核验文件时披露。",
    inventoryCaption: "规范化库存管理与订单分配",
    facilityMetrics: ["根据批次确认可用性", "在可提供时匹配分析数据"],
    privateTag: "贴牌服务支持",
    privateTitle: "让你的品牌拥有更严谨的交付流程。",
    privateText:
      "面向合格经销商和品牌团队，我们支持标签设计协调、包装规格确认及按批次规划。",
    privateBullets: [
      "标签尺寸与设计稿审核",
      "小批量试单沟通",
      "批次与包装协调",
      "保密的 B2B 商务沟通",
    ],
    privateCta: "沟通贴牌项目",
    vialsAlt: "准备进行包装的无标签西林瓶",
    customLabelSystem: "定制标签系统",
    companyTag: "品牌介绍",
    companyTitle: "Peptivanta Biosciences 专注于提升专业供应沟通的清晰度。",
    companyText:
      "Peptivanta Biosciences 是我们的产品与服务品牌，用于专业客户沟通、询盘资质确认、文件协调和出口跟进。",
    companyDetails: ["运营区域", "品牌业务方向", "回复时效", "注册地址"],
    operatingRegion: "中国香港特别行政区 · 销售与出口协调",
    brandFocusValue: "专业多肽供应询盘",
    responseTime: "一个工作日内",
    inquiryTag: "专业询盘",
    inquiryTitle: "告诉我们你的采购需求。",
    inquiryText:
      "请提供产品、规格、数量和目的地。我们将确认可依法供应的内容及可提供的文件。",
    form: {
      name: "姓名",
      company: "公司 / 机构",
      country: "目的国家或地区",
      contact: "邮箱或 WhatsApp",
      product: "产品或服务",
      quantity: "预计数量",
      use: "预期专业用途",
      placeholderUse: "科研、分析、配方开发、经销等",
      consent: "我确认这是专业用途询盘，并同意网站合规声明。",
      submit: "前往 WhatsApp 继续沟通",
      missing: "网站尚未配置 WhatsApp 号码，请先在 site.config.ts 中添加。",
    },
    complianceTitle: "专业用途与合规声明",
    complianceText:
      "网站展示的产品仅面向合格的科研、分析、配方开发或其他合法专业用途，不作为药品展示，也不面向人用或兽用。网站不提供医疗功效宣称、剂量建议或消费者使用指导。供应需经过客户资质审核、目的地法规评估，并遵守适用法律。",
    footerNote: "为合格专业客户提供文件化的多肽供应服务。",
    footerLinks: ["隐私政策", "网站条款", "合规声明"],
    contactLabels: ["WhatsApp", "企业邮箱"],
    contactMissing: ["请在 site.config.ts 中添加号码", "请在 site.config.ts 中添加邮箱"],
    whatsappCta: "立即询盘",
    whatsappAria: "通过 WhatsApp 发起询盘",
    servicePrinciplesLabel: "服务原则",
    menuLabel: "展开或收起导航",
    navLabel: "主导航",
  },
} as const;

const products = [
  {
    names: { en: "Retatrutide", pt: "Retatrutide", zh: "Retatrutide" },
    code: "RT",
    category: "catalogue",
    formats: { en: "5–100 mg · 10 vials", pt: "5–100 mg · 10 frascos", zh: "5–100 mg · 10 瓶" },
  },
  {
    names: { en: "Tirzepatide", pt: "Tirzepatide", zh: "Tirzepatide" },
    code: "TR",
    category: "catalogue",
    formats: { en: "5–60 mg · 10 vials", pt: "5–60 mg · 10 frascos", zh: "5–60 mg · 10 瓶" },
  },
  {
    names: { en: "Semaglutide", pt: "Semaglutide", zh: "Semaglutide" },
    code: "SM",
    category: "catalogue",
    formats: { en: "Multiple configurations", pt: "Várias configurações", zh: "多种规格" },
  },
  {
    names: { en: "BPC-157", pt: "BPC-157", zh: "BPC-157" },
    code: "BC",
    category: "catalogue",
    formats: { en: "2–10 mg · 10 vials", pt: "2–10 mg · 10 frascos", zh: "2–10 mg · 10 瓶" },
  },
  {
    names: { en: "TB-500", pt: "TB-500", zh: "TB-500" },
    code: "TB",
    category: "catalogue",
    formats: { en: "2–10 mg · 10 vials", pt: "2–10 mg · 10 frascos", zh: "2–10 mg · 10 瓶" },
  },
  {
    names: { en: "CJC-1295", pt: "CJC-1295", zh: "CJC-1295" },
    code: "CJ",
    category: "catalogue",
    formats: { en: "Multiple configurations", pt: "Várias configurações", zh: "多种规格" },
  },
  {
    names: { en: "Ipamorelin", pt: "Ipamorelin", zh: "Ipamorelin" },
    code: "IP",
    category: "catalogue",
    formats: { en: "5–10 mg · 10 vials", pt: "5–10 mg · 10 frascos", zh: "5–10 mg · 10 瓶" },
  },
  {
    names: { en: "MOTS-C", pt: "MOTS-C", zh: "MOTS-C" },
    code: "MC",
    category: "catalogue",
    formats: { en: "10–40 mg · 10 vials", pt: "10–40 mg · 10 frascos", zh: "10–40 mg · 10 瓶" },
  },
  {
    names: { en: "GHK-Cu", pt: "GHK-Cu", zh: "GHK-Cu" },
    code: "CU",
    category: "cosmetic",
    formats: { en: "50–100 mg · Raw material", pt: "50–100 mg · Matéria-prima", zh: "50–100 mg · 原料" },
  },
  {
    names: { en: "Acetyl Hexapeptide-8", pt: "Acetyl Hexapeptide-8", zh: "Acetyl Hexapeptide-8" },
    code: "AH8",
    category: "cosmetic",
    formats: { en: "Bulk inquiry", pt: "Consulta a granel", zh: "大货询盘" },
  },
  {
    names: { en: "Custom configuration", pt: "Configuração personalizada", zh: "自定义规格" },
    code: "OEM",
    category: "custom",
    formats: { en: "Private label · Packaging", pt: "Marca própria · Embalagem", zh: "贴牌 · 包装" },
  },
  {
    names: { en: "Bulk peptide inquiry", pt: "Consulta de peptídeos a granel", zh: "多肽大货询盘" },
    code: "BLK",
    category: "custom",
    formats: { en: "Specification-led review", pt: "Revisão orientada por especificação", zh: "按规格审核" },
  },
] satisfies Array<{
  names: Record<Locale, string>;
  code: string;
  category: Exclude<Category, "all">;
  formats: Record<Locale, string>;
}>;

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
  const [introState, setIntroState] = useState<IntroState>("hidden");
  const t = copy[locale];

  useEffect(() => {
    try {
      const savedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
      if (savedLocale === "en" || savedLocale === "pt" || savedLocale === "zh") {
        setLocale(savedLocale);
        document.documentElement.lang =
          savedLocale === "zh" ? "zh-CN" : savedLocale === "pt" ? "pt-BR" : "en";
      }
    } catch {
      // The language switcher still works when browser storage is unavailable.
    }
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    let hasSeenIntro = false;

    try {
      hasSeenIntro = window.sessionStorage.getItem(INTRO_SESSION_KEY) === "1";
    } catch {
      hasSeenIntro = false;
    }

    if (reducedMotion || connection?.saveData || hasSeenIntro) return;

    const revealTimer = window.setTimeout(() => {
      setIntroState("visible");
      try {
        window.sessionStorage.setItem(INTRO_SESSION_KEY, "1");
      } catch {
        // The intro can still run when browser storage is unavailable.
      }
    }, 180);

    return () => window.clearTimeout(revealTimer);
  }, []);

  useEffect(() => {
    if (introState === "hidden") return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const fallbackTimer =
      introState === "visible" ? window.setTimeout(() => closeIntro(), 9000) : undefined;

    return () => {
      document.body.style.overflow = originalOverflow;
      if (fallbackTimer) window.clearTimeout(fallbackTimer);
    };
  }, [introState]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return products.filter(
      (product) =>
        (category === "all" || product.category === category) &&
        (!normalized ||
          product.names[locale].toLowerCase().includes(normalized) ||
          product.code.toLowerCase().includes(normalized)),
    );
  }, [category, locale, query]);

  function productMessage(name: string, formats: string) {
    if (locale === "zh") {
      return `您好，我代表一家专业机构，希望了解 ${name}（${formats}）。请提供可选规格、起订量、相关文件以及目的地供应条件。`;
    }
    if (locale === "pt") {
      return `Olá, represento uma organização profissional e tenho interesse em ${name} (${formats}). Por favor, envie configurações disponíveis, MOQ, documentação e elegibilidade para o destino.`;
    }
    return `Hello, I represent a professional organization and am interested in ${name} (${formats}). Please share available configurations, MOQ, documentation, and destination eligibility.`;
  }

  function changeLocale(nextLocale: Locale) {
    setLocale(nextLocale);
    setFormStatus("");
    document.documentElement.lang =
      nextLocale === "zh" ? "zh-CN" : nextLocale === "pt" ? "pt-BR" : "en";
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
    } catch {
      // Keep the selected language for the current page when storage is unavailable.
    }
  }

  function closeIntro() {
    setIntroState((current) => (current === "hidden" ? current : "closing"));
    window.setTimeout(() => setIntroState("hidden"), 700);
  }

  function openIntro() {
    setIntroState("visible");
  }

  function handleInquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (!siteConfig.whatsappNumber) {
      setFormStatus(t.form.missing);
      return;
    }
    const message =
      locale === "zh"
        ? [
            "网站专业询盘",
            `姓名：${data.get("name")}`,
            `公司：${data.get("company")}`,
            `目的地：${data.get("country")}`,
            `联系方式：${data.get("contact")}`,
            `产品：${data.get("product")}`,
            `数量：${data.get("quantity")}`,
            `专业用途：${data.get("intendedUse")}`,
          ].join("\n")
        : locale === "pt"
          ? [
              "Consulta qualificada pelo site",
              `Nome: ${data.get("name")}`,
              `Empresa: ${data.get("company")}`,
              `Destino: ${data.get("country")}`,
              `Contato: ${data.get("contact")}`,
              `Produto: ${data.get("product")}`,
              `Quantidade: ${data.get("quantity")}`,
              `Uso profissional: ${data.get("intendedUse")}`,
            ].join("\n")
          : [
              "Qualified website inquiry",
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
    <main id="top" className={locale === "zh" ? "lang-zh" : undefined}>
      {introState !== "hidden" && (
        <section
          className={`site-intro site-intro-${introState}`}
          aria-label={t.introAria}
        >
          <video
            className="site-intro-video"
            autoPlay
            muted
            playsInline
            preload="metadata"
            poster="/media/factory-flow-poster.webp"
            onEnded={closeIntro}
            aria-hidden="true"
          >
            <source
              src="/media/factory-flow-mobile.mp4"
              type="video/mp4"
              media="(max-width: 720px)"
            />
            <source src="/media/factory-flow-desktop.mp4" type="video/mp4" />
          </video>
          <div className="site-intro-shade" aria-hidden="true" />
          <div className="site-intro-grid" aria-hidden="true" />
          <div className="site-intro-frame" aria-hidden="true" />

          <div className="site-intro-brand">
            <img src="/logo-mark.svg" alt="" width={46} height={46} />
            <span><strong>PEPTIVANTA</strong><small>BIOSCIENCES</small></span>
          </div>

          <button className="site-intro-skip" type="button" onClick={closeIntro}>
            {t.introSkip}<span aria-hidden="true">↗</span>
          </button>

          <div className="site-intro-copy">
            <p>{t.introKicker}</p>
            <h2><span>{t.introLead}</span><em>{t.introFinish}</em></h2>
            <div className="site-intro-statement">
              <span aria-hidden="true">01—04</span>
              <p>{t.introStatement}</p>
            </div>
          </div>

          <div className="site-intro-timeline">
            <div className="site-intro-progress" aria-hidden="true" />
            <ol>
              {t.introStages.map((stage, index) => (
                <li key={stage}><span>0{index + 1}</span>{stage}</li>
              ))}
            </ol>
          </div>

          <p className="site-intro-meta">{t.introMeta}</p>
        </section>
      )}

      <div className="noise" aria-hidden="true" />
      <header className="site-header">
        <Brand />
        <button
          className="menu-button"
          type="button"
          aria-label={t.menuLabel}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
        <nav className={menuOpen ? "nav nav-open" : "nav"} aria-label={t.navLabel}>
          {t.nav.map((item, index) => (
            <a key={item} href={`#${t.navIds[index]}`} onClick={() => setMenuOpen(false)}>
              {item}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <div className="language-switcher" role="group" aria-label="Language / Idioma / 语言">
            {([
              ["en", "EN"],
              ["pt", "PT"],
              ["zh", "中文"],
            ] as const).map(([code, label]) => (
              <button
                className={locale === code ? "active" : ""}
                type="button"
                key={code}
                aria-pressed={locale === code}
                onClick={() => changeLocale(code)}
              >
                {label}
              </button>
            ))}
          </div>
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
          <button className="workflow-replay" type="button" onClick={openIntro}>
            <span className="workflow-replay-icon" aria-hidden="true">▶</span>
            {t.introReplay}
            <small>08 SEC</small>
          </button>
          <p className="micro-note">{t.heroNote}</p>
        </div>
        <div className="hero-visual">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="hero-image-frame">
            <img
              src="/images/facility.jpg"
              alt={t.heroImageAlt}
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

      <section className="proof-strip section-shell" aria-label={t.servicePrinciplesLabel}>
        {t.proof.map(([value, label]) => (
          <div key={value}><strong>{value}</strong><span>{label}</span></div>
        ))}
        <p>{t.operatingRegion}</p>
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
          <div className="filter-tabs" role="group" aria-label={t.productGroupLabel}>
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
          {filtered.map((product, index) => {
            const productName = product.names[locale];
            const productFormat = product.formats[locale];
            return (
              <article className="product-card" key={product.code}>
                <div className="product-top">
                  <span>{product.code}</span>
                  <small>{String(index + 1).padStart(2, "0")}</small>
                </div>
                <h3>{productName}</h3>
                <p>{productFormat}</p>
                <div className="product-meta"><i />{t.docs}</div>
                <a
                  href={createWhatsAppUrl(productMessage(productName, productFormat))}
                  target={siteConfig.whatsappNumber ? "_blank" : undefined}
                  rel="noreferrer"
                >
                  {t.ask}<span>↗</span>
                </a>
              </article>
            );
          })}
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
            <div><strong>COA</strong><span>{t.facilityMetrics[0]}</span></div>
            <div><strong>HPLC / MS</strong><span>{t.facilityMetrics[1]}</span></div>
          </div>
        </div>
        <figure className="facility-photo">
          <img src="/images/inventory.jpg" alt={t.inventoryCaption} />
          <figcaption>{t.inventoryCaption}</figcaption>
        </figure>
      </section>

      <section className="private-label section-shell" id="private-label">
        <div className="private-image">
          <img src="/images/vials.png" alt={t.vialsAlt} />
          <div className="label-sample">
            <img src="/logo-mark.svg" alt="" width={30} height={30} />
            <div><strong>PEPTIVANTA</strong><small>{t.customLabelSystem}</small></div>
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
            <div><dt>{t.companyDetails[0]}</dt><dd>{t.operatingRegion}</dd></div>
            <div><dt>{t.companyDetails[1]}</dt><dd>{t.brandFocusValue}</dd></div>
            <div><dt>{t.companyDetails[2]}</dt><dd>{t.responseTime}</dd></div>
            {siteConfig.registeredAddress && (
              <div><dt>{t.companyDetails[3]}</dt><dd>{siteConfig.registeredAddress}</dd></div>
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
              <span>{t.contactLabels[0]}</span><strong>{siteConfig.whatsappNumber || t.contactMissing[0]}</strong>
              <span>{t.contactLabels[1]}</span><strong>{siteConfig.salesEmail || t.contactMissing[1]}</strong>
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
          <Link href="/privacy">{t.footerLinks[0]}</Link>
          <Link href="/terms">{t.footerLinks[1]}</Link>
          <Link href="/compliance">{t.footerLinks[2]}</Link>
        </div>
        <p>© {new Date().getFullYear()} {siteConfig.fullBrandName}</p>
      </footer>

      <a
        className="whatsapp-float"
        href={createWhatsAppUrl(
          locale === "zh"
            ? "您好，我有一项专业多肽供应询盘。"
            : locale === "pt"
              ? "Olá, tenho uma consulta profissional sobre fornecimento de peptídeos."
              : "Hello, I have a professional peptide supply inquiry.",
        )}
        target={siteConfig.whatsappNumber ? "_blank" : undefined}
        rel="noreferrer"
        aria-label={t.whatsappAria}
      >
        <span>WA</span><small>{t.whatsappCta}</small>
      </a>
    </main>
  );
}
