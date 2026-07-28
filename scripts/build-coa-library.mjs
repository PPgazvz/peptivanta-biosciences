import { copyFile, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const currentReportsRoot =
  "C:\\Users\\33171\\Desktop\\time\\新机需要的软件+素材\\素材\\coa检测报告的使用说明\\产品对应coa检测报告";
const latestReportsRoot =
  "C:\\Users\\33171\\Desktop\\time\\肽常用文件\\COA\\COA\\4.4";
const publicRoot = path.resolve(projectRoot, "public", "coa", "reports");
const generatedManifest = path.resolve(
  projectRoot,
  "app",
  "coa",
  "coa-documents.generated.ts",
);

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const allowedExtensions = new Set([...imageExtensions, ".pdf"]);

const photoReports = new Map([
  ["photo_2026-03-23_04-37-06 (2).jpg", ["Tirzepatide", "30 mg"]],
  ["photo_2026-03-23_04-37-06 (3).jpg", ["Semaglutide", "10 mg"]],
  ["photo_2026-03-23_04-37-06 (4).jpg", ["5-Amino-1MQ", "10 mg"]],
  ["photo_2026-03-23_04-37-06 (5).jpg", ["Retatrutide", "30 mg"]],
  ["photo_2026-03-23_04-37-06 (6).jpg", ["BPC-157", "10 mg"]],
  ["photo_2026-03-23_04-37-06 (7).jpg", ["GHK-Cu", "100 mg"]],
  ["photo_2026-03-23_04-37-06.jpg", ["BPC-157", "20 mg"]],
]);

const productOrder = [
  "5-Amino-1MQ",
  "AHK-Cu",
  "AOD-9604",
  "BPC-157",
  "BPC-157 + TB-500",
  "Cagrilintide",
  "CJC-1295 + Ipamorelin",
  "DSIP",
  "Epithalon",
  "GHK-Cu",
  "GLP-2T",
  "GLP-3RT Blend",
  "Glow Blend",
  "HCG",
  "HGH / Somatropin",
  "IGF-LR3",
  "Ipamorelin",
  "KLOW",
  "KPV",
  "L-Glutathione",
  "Melanotan-2",
  "MOTS-C",
  "NAD+",
  "PT-141",
  "Retatrutide",
  "Selank",
  "Semaglutide",
  "Semax",
  "Sermorelin",
  "SNAP-8",
  "SS-31",
  "TB-500",
  "Tesamorelin",
  "Thymosin Alpha-1",
  "Thymosin Beta-4",
  "Tirzepatide",
];

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/\+/g, " plus ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function identifyProduct(filename) {
  const photo = photoReports.get(filename);
  if (photo) return { product: photo[0], strength: photo[1] };

  const name = path.parse(filename).name;
  const key = name.toLowerCase().replace(/[–—]/g, "-");
  let product = null;

  if (key.includes("5-amino")) product = "5-Amino-1MQ";
  else if (key.includes("ahk")) product = "AHK-Cu";
  else if (key.includes("aod")) product = "AOD-9604";
  else if (
    key.includes("bpc") &&
    (key.includes("tb-500") || key.includes("tb500") || key.includes("thymosin beta 4"))
  ) product = "BPC-157 + TB-500";
  else if (key.includes("bpc")) product = "BPC-157";
  else if (key.includes("cagrilintide")) product = "Cagrilintide";
  else if (key.includes("cjc")) product = "CJC-1295 + Ipamorelin";
  else if (key.includes("dsip")) product = "DSIP";
  else if (key.includes("epithalon")) product = "Epithalon";
  else if (key.includes("glp-3rt")) product = "GLP-3RT Blend";
  else if (key.includes("glp-2t")) product = "GLP-2T";
  else if (key.includes("glow")) product = "Glow Blend";
  else if (key.includes("ghk")) product = "GHK-Cu";
  else if (key.includes("hcg")) product = "HCG";
  else if (key.includes("hgh") || key.includes("somatropin")) product = "HGH / Somatropin";
  else if (key.includes("igf")) product = "IGF-LR3";
  else if (key.includes("ipamorelin")) product = "Ipamorelin";
  else if (key.includes("klow")) product = "KLOW";
  else if (key.includes("kpv")) product = "KPV";
  else if (key.includes("glutathione")) product = "L-Glutathione";
  else if (key.includes("melanotan")) product = "Melanotan-2";
  else if (key.includes("mots")) product = "MOTS-C";
  else if (key.includes("nad")) product = "NAD+";
  else if (key.includes("pt-141") || key.includes("pt141")) product = "PT-141";
  else if (key.includes("retatrutide") || key.includes("glp-r")) product = "Retatrutide";
  else if (key.includes("selank") || key.includes("selenk")) product = "Selank";
  else if (key.includes("semaglutide") || key.includes("glp-s") || key.includes("glp-1s")) {
    product = "Semaglutide";
  } else if (key.includes("semax")) product = "Semax";
  else if (key.includes("sermorelin")) product = "Sermorelin";
  else if (key.includes("snap")) product = "SNAP-8";
  else if (key.includes("ss-31") || key.includes("s-31-s")) product = "SS-31";
  else if (key.includes("tb-500") || key.includes("tb500")) product = "TB-500";
  else if (key.includes("tesamorelin")) product = "Tesamorelin";
  else if (key.includes("thymosin alpha")) product = "Thymosin Alpha-1";
  else if (key.includes("thymosin beta")) product = "Thymosin Beta-4";
  else if (key.includes("tirzepatide") || key.includes("glp-t")) product = "Tirzepatide";

  if (!product) return null;

  const measurements = [
    ...name.matchAll(/(\d[\d,]*(?:\.\d+)?)\s*(mg|iu)/gi),
  ].map((match) => `${match[1].replace(",", ",")} ${match[2].toUpperCase()}`);

  let strength = [...new Set(measurements)].join(" + ");
  if (/raw/i.test(name)) strength = "Raw material";
  if (!strength && /blend/i.test(name)) strength = "Blend report";
  if (!strength && product === "HGH / Somatropin") strength = "Identity / purity report";
  if (!strength) strength = "Analytical report";

  return { product, strength };
}

async function walk(root) {
  const output = [];
  const entries = await readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    const absolute = path.join(root, entry.name);
    if (entry.isDirectory()) output.push(...await walk(absolute));
    else output.push(absolute);
  }
  return output;
}

function shouldExclude(absolutePath) {
  const filename = path.basename(absolutePath);
  const normalized = absolutePath.toLowerCase();
  return (
    !allowedExtensions.has(path.extname(filename).toLowerCase()) ||
    normalized.includes("客户自检") ||
    normalized.includes("736992-21-5") ||
    filename === "photo_2026-03-23_04-37-07.jpg"
  );
}

const sourceFiles = [
  ...await walk(currentReportsRoot),
  ...await walk(latestReportsRoot),
].filter((absolutePath) => !shouldExclude(absolutePath));

const identified = [];
const unidentified = [];
for (const absolutePath of sourceFiles) {
  const identity = identifyProduct(path.basename(absolutePath));
  if (!identity) {
    unidentified.push(absolutePath);
    continue;
  }
  identified.push({
    sourcePath: absolutePath,
    originalName: path.basename(absolutePath),
    ...identity,
  });
}

identified.sort((a, b) => {
  const productDelta = productOrder.indexOf(a.product) - productOrder.indexOf(b.product);
  return productDelta || a.strength.localeCompare(b.strength) || a.originalName.localeCompare(b.originalName);
});

if (
  publicRoot === path.parse(publicRoot).root ||
  !publicRoot.startsWith(path.resolve(projectRoot, "public") + path.sep) ||
  path.basename(publicRoot) !== "reports"
) {
  throw new Error(`Refusing to replace unexpected asset directory: ${publicRoot}`);
}

await rm(publicRoot, { recursive: true, force: true });
await mkdir(publicRoot, { recursive: true });

const counters = new Map();
const documents = [];
for (const report of identified) {
  const count = (counters.get(report.product) ?? 0) + 1;
  counters.set(report.product, count);

  const productSlug = slugify(report.product);
  const extension = path.extname(report.originalName).toLowerCase();
  const outputName = `report-${String(count).padStart(2, "0")}${extension}`;
  const outputDirectory = path.join(publicRoot, productSlug);
  const outputPath = path.join(outputDirectory, outputName);
  await mkdir(outputDirectory, { recursive: true });
  await copyFile(report.sourcePath, outputPath);

  const href = `/coa/reports/${productSlug}/${outputName}`;
  const id = `${productSlug}-${String(count).padStart(2, "0")}`;
  documents.push({
    id,
    product: report.product,
    strength: report.strength,
    format: extension === ".pdf" ? "pdf" : "image",
    href,
    previewHref: extension === ".pdf" ? href.replace(/\.pdf$/i, "-preview.png") : href,
  });
}

const productOptions = productOrder
  .filter((product) => counters.has(product))
  .map((product) => ({ product, count: counters.get(product) }));

const banner = `// This file is generated by scripts/build-coa-library.mjs.\n// Update the source report folders or mapping script, then regenerate it.\n\n`;
const manifestSource = `${banner}export type CoaDocument = {\n  id: string;\n  product: string;\n  strength: string;\n  format: "image" | "pdf";\n  href: string;\n  previewHref: string;\n};\n\nexport const coaDocuments: CoaDocument[] = ${JSON.stringify(documents, null, 2)};\n\nexport const coaProductOptions = ${JSON.stringify(productOptions, null, 2)};\n`;
await writeFile(generatedManifest, manifestSource, "utf8");

console.log(`Published ${documents.length} reports across ${productOptions.length} product groups.`);
if (unidentified.length) {
  console.log("Skipped files without a confirmed product name:");
  for (const filename of unidentified) console.log(`- ${filename}`);
}
