/**
 * Canonical product catalogue used by both the order admin and the illustrative
 * fulfillment generator.
 *
 * Source: PEPTIVANTA_2026_All_Languages_USD.xlsx
 * Pricing basis: USD per box (10 vials); shipping is not included.
 *
 * Keep this file aligned with the official quote workbook. A variant is
 * validated by SKU + product name + specification because the workbook itself
 * currently reuses NP810 for two Snap variants.
 */
export type ProductCategory =
  | "weight_management"
  | "performance_recovery"
  | "beauty_longevity"
  | "wellness_research";

export type ProductCatalogItem = {
  sku: string;
  productName: string;
  specification: string;
  retailUsdCents: number;
  category: ProductCategory;
};

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  weight_management: "体重管理类",
  performance_recovery: "健身与修复类",
  beauty_longevity: "美容与抗衰类",
  wellness_research: "综合健康与研究类",
};

export const PRODUCT_CATALOG: readonly ProductCatalogItem[] = [
  { sku: "5AM", productName: "5-AMINO-1MQ", specification: "5mg*10vials", retailUsdCents: 3100, category: "beauty_longevity" },
  { sku: "10AM", productName: "5-AMINO-1MQ", specification: "10mg*10vials", retailUsdCents: 3700, category: "beauty_longevity" },
  { sku: "50AM", productName: "5-AMINO-1MQ", specification: "50mg*10vials", retailUsdCents: 11000, category: "beauty_longevity" },
  { sku: "AU50", productName: "AHK-CU", specification: "50mg*10vials", retailUsdCents: 6000, category: "beauty_longevity" },
  { sku: "AU100", productName: "AHK-CU", specification: "100mg*10vials", retailUsdCents: 9000, category: "beauty_longevity" },
  { sku: "5AD", productName: "AOD9604", specification: "5mg*10vials", retailUsdCents: 10300, category: "performance_recovery" },
  { sku: "10AD", productName: "AOD9604", specification: "10mg*10vials", retailUsdCents: 18000, category: "performance_recovery" },
  { sku: "B12", productName: "B12", specification: "10mg*10vials", retailUsdCents: 4800, category: "wellness_research" },
  { sku: "BA03", productName: "bac.water", specification: "3ml*10vials", retailUsdCents: 1900, category: "wellness_research" },
  { sku: "BA10", productName: "bac.water", specification: "10ml*10vials", retailUsdCents: 2300, category: "wellness_research" },
  { sku: "BB20", productName: "BPC 10mg + TB10mg", specification: "20mg*10vials", retailUsdCents: 20000, category: "performance_recovery" },
  { sku: "BC5", productName: "BPC 157", specification: "5mg*10vials", retailUsdCents: 4600, category: "performance_recovery" },
  { sku: "BC10", productName: "BPC 157", specification: "10mg*10vials", retailUsdCents: 6000, category: "performance_recovery" },
  { sku: "BB10", productName: "BPC 5mg + TB5mg", specification: "10mg*10vials", retailUsdCents: 10900, category: "performance_recovery" },
  { sku: "CGL5", productName: "Cagrilintide", specification: "5mg*10vials", retailUsdCents: 14300, category: "weight_management" },
  { sku: "CGL10", productName: "Cagrilintide", specification: "10mg*10vials", retailUsdCents: 24000, category: "weight_management" },
  { sku: "CP10", productName: "CJC 1295 (without DAC) 5mg + IPA 5mg", specification: "10mg*10vials", retailUsdCents: 10100, category: "performance_recovery" },
  { sku: "CND5", productName: "CJC 1295(without DAC)", specification: "5mg*10vials", retailUsdCents: 8100, category: "performance_recovery" },
  { sku: "CND10", productName: "CJC 1295(without DAC)", specification: "10mg*10vials", retailUsdCents: 13600, category: "performance_recovery" },
  { sku: "CD5", productName: "CJC1295 with DAC", specification: "5mg*10vials", retailUsdCents: 19400, category: "performance_recovery" },
  { sku: "CD10", productName: "CJC1295 with DAC", specification: "10mg*10vials", retailUsdCents: 24800, category: "performance_recovery" },
  { sku: "DX10", productName: "Dihexa", specification: "10mg*10vials", retailUsdCents: 7600, category: "wellness_research" },
  { sku: "DS5", productName: "DSIP", specification: "5mg*10vials", retailUsdCents: 5400, category: "wellness_research" },
  { sku: "DS10", productName: "DSIP", specification: "10mg*10vials", retailUsdCents: 9000, category: "wellness_research" },
  { sku: "ET10", productName: "Epithalon", specification: "10mg*10vials", retailUsdCents: 5400, category: "beauty_longevity" },
  { sku: "ET50", productName: "Epithalon", specification: "50mg*10vials", retailUsdCents: 15900, category: "beauty_longevity" },
  { sku: "F42", productName: "FOX04", specification: "2mg*10vials", retailUsdCents: 11700, category: "beauty_longevity" },
  { sku: "F410", productName: "FOX04", specification: "10mg*10vials", retailUsdCents: 61400, category: "beauty_longevity" },
  { sku: "FOX04-DRI", productName: "FOXO4-DRI", specification: "10mg*10vials", retailUsdCents: 50000, category: "beauty_longevity" },
  { sku: "CU50", productName: "GHK-Cu", specification: "50mg*10vials", retailUsdCents: 3400, category: "beauty_longevity" },
  { sku: "CU100", productName: "GHK-Cu", specification: "100mg*10vials", retailUsdCents: 3700, category: "beauty_longevity" },
  { sku: "GLOW", productName: "GLOW", specification: "70mg*10vials", retailUsdCents: 21400, category: "beauty_longevity" },
  { sku: "GTT600", productName: "Glutathione", specification: "600mg*10vials", retailUsdCents: 3100, category: "beauty_longevity" },
  { sku: "GTT1500", productName: "Glutathione", specification: "1500mg*10vials", retailUsdCents: 11700, category: "beauty_longevity" },
  { sku: "IG01", productName: "IGF-1 LR3", specification: "100mcg*10vials", retailUsdCents: 4700, category: "performance_recovery" },
  { sku: "IG1", productName: "IGF-1 LR3", specification: "1mg*10vials", retailUsdCents: 22900, category: "performance_recovery" },
  { sku: "IP5", productName: "Ipamorelin", specification: "5mg*10vials", retailUsdCents: 4700, category: "performance_recovery" },
  { sku: "IP10", productName: "Ipamorelin", specification: "10mg*10vials", retailUsdCents: 6600, category: "performance_recovery" },
  { sku: "KLOW", productName: "KLOW", specification: "80mg*10vials", retailUsdCents: 28000, category: "beauty_longevity" },
  { sku: "KP5", productName: "KPV", specification: "5mg*10vials", retailUsdCents: 4700, category: "wellness_research" },
  { sku: "KP10", productName: "KPV", specification: "10mg*10vials", retailUsdCents: 6000, category: "wellness_research" },
  { sku: "LC1200", productName: "L-carnitine", specification: "1200mg*10vials", retailUsdCents: 6900, category: "beauty_longevity" },
  { sku: "Lemon Bottle", productName: "Lemon Bottle", specification: "10ml*10vials", retailUsdCents: 6700, category: "beauty_longevity" },
  { sku: "Lipo-c", productName: "Lipo-c", specification: "10ml*10vials", retailUsdCents: 6700, category: "wellness_research" },
  { sku: "MT2", productName: "Melanotan ll", specification: "10mg*10vials", retailUsdCents: 8200, category: "wellness_research" },
  { sku: "MIC", productName: "MIC (Lipo-C with B12)", specification: "10mg*10vials", retailUsdCents: 12000, category: "wellness_research" },
  { sku: "MS10", productName: "MOTS-c", specification: "10mg*10vials", retailUsdCents: 8600, category: "performance_recovery" },
  { sku: "MS15", productName: "MOTS-c", specification: "15mg*10vials", retailUsdCents: 12900, category: "performance_recovery" },
  { sku: "MS20", productName: "MOTS-c", specification: "20mg*10vials", retailUsdCents: 14900, category: "performance_recovery" },
  { sku: "MS40", productName: "MOTS-c", specification: "40mg*10vials", retailUsdCents: 27700, category: "performance_recovery" },
  { sku: "NJ100", productName: "Nad+", specification: "100mg*10vials", retailUsdCents: 4300, category: "beauty_longevity" },
  { sku: "NJ500", productName: "Nad+", specification: "500mg*10vials", retailUsdCents: 5100, category: "beauty_longevity" },
  { sku: "NJ1000", productName: "Nad+", specification: "1000mg*10vials", retailUsdCents: 7000, category: "beauty_longevity" },
  { sku: "P41", productName: "PT141", specification: "10mg*10vials", retailUsdCents: 7700, category: "wellness_research" },
  { sku: "RT5", productName: "Retatrutide", specification: "5mg*10vials", retailUsdCents: 7400, category: "weight_management" },
  { sku: "RT10", productName: "Retatrutide", specification: "10mg*10vials", retailUsdCents: 11700, category: "weight_management" },
  { sku: "RT15", productName: "Retatrutide", specification: "15mg*10vials", retailUsdCents: 15700, category: "weight_management" },
  { sku: "RT20", productName: "Retatrutide", specification: "20mg*10vials", retailUsdCents: 17100, category: "weight_management" },
  { sku: "RT30", productName: "Retatrutide", specification: "30mg*10vials", retailUsdCents: 21300, category: "weight_management" },
  { sku: "RT40", productName: "Retatrutide", specification: "40mg*10vials", retailUsdCents: 26000, category: "weight_management" },
  { sku: "RT50", productName: "Retatrutide", specification: "50mg*10vials", retailUsdCents: 34000, category: "weight_management" },
  { sku: "RT60", productName: "Retatrutide", specification: "60mg*10vials", retailUsdCents: 47100, category: "weight_management" },
  { sku: "SK5", productName: "Selank", specification: "5mg*10vials", retailUsdCents: 4700, category: "wellness_research" },
  { sku: "SK10", productName: "Selank", specification: "10mg*10vials", retailUsdCents: 6600, category: "wellness_research" },
  { sku: "SM10", productName: "Semaglutide", specification: "10mg*10vials", retailUsdCents: 5700, category: "weight_management" },
  { sku: "SM15", productName: "Semaglutide", specification: "15mg*10vials", retailUsdCents: 6900, category: "weight_management" },
  { sku: "SM20", productName: "Semaglutide", specification: "20mg*10vials", retailUsdCents: 8600, category: "weight_management" },
  { sku: "SM30", productName: "Semaglutide", specification: "30mg*10vials", retailUsdCents: 13700, category: "weight_management" },
  { sku: "XA5", productName: "Semax", specification: "5mg*10vials", retailUsdCents: 4700, category: "wellness_research" },
  { sku: "XA10", productName: "Semax", specification: "10mg*10vials", retailUsdCents: 6600, category: "wellness_research" },
  { sku: "SM05", productName: "Sermorelin Acetate", specification: "5mg*10vials", retailUsdCents: 8900, category: "wellness_research" },
  { sku: "SM010", productName: "Sermorelin Acetate", specification: "10mg*10vials", retailUsdCents: 14600, category: "wellness_research" },
  { sku: "NP810", productName: "Snap-8", specification: "100mg*10vials", retailUsdCents: 4600, category: "beauty_longevity" },
  { sku: "NP810", productName: "Snap8", specification: "10mg*10vials", retailUsdCents: 4600, category: "beauty_longevity" },
  { sku: "2S10", productName: "SS ·31", specification: "10mg*10vials", retailUsdCents: 9600, category: "wellness_research" },
  { sku: "2550", productName: "SS ·31", specification: "50mg*10vials", retailUsdCents: 34900, category: "wellness_research" },
  { sku: "BT5", productName: "TB500", specification: "5mg*10vials", retailUsdCents: 10000, category: "performance_recovery" },
  { sku: "BT10", productName: "TB500", specification: "10mg*10vials", retailUsdCents: 17100, category: "performance_recovery" },
  { sku: "TSM5", productName: "Tesamorelin", specification: "5mg*10vials", retailUsdCents: 11700, category: "performance_recovery" },
  { sku: "TSM10", productName: "Tesamorelin", specification: "10mg*10vials", retailUsdCents: 21400, category: "performance_recovery" },
  { sku: "TSM20", productName: "Tesamorelin", specification: "20mg*10vials", retailUsdCents: 37100, category: "performance_recovery" },
  { sku: "TY10", productName: "Thymalin/Thymulin", specification: "10mg*10vials", retailUsdCents: 7700, category: "wellness_research" },
  { sku: "TA5", productName: "Thymosin alpha 1", specification: "5mg*10vials", retailUsdCents: 11400, category: "wellness_research" },
  { sku: "TA10", productName: "Thymosin alpha 1", specification: "10mg*10vials", retailUsdCents: 18600, category: "wellness_research" },
  { sku: "TR5", productName: "Tirzepatide", specification: "5mg*10vials", retailUsdCents: 5100, category: "weight_management" },
  { sku: "TR10", productName: "Tirzepatide", specification: "10mg*10vials", retailUsdCents: 7100, category: "weight_management" },
  { sku: "TR15", productName: "Tirzepatide", specification: "15mg*10vials", retailUsdCents: 8300, category: "weight_management" },
  { sku: "TR20", productName: "Tirzepatide", specification: "20mg*10vials", retailUsdCents: 10900, category: "weight_management" },
  { sku: "TR30", productName: "Tirzepatide", specification: "30mg*10vials", retailUsdCents: 14300, category: "weight_management" },
  { sku: "TR40", productName: "Tirzepatide", specification: "40mg*10vials", retailUsdCents: 18300, category: "weight_management" },
  { sku: "TR50", productName: "Tirzepatide", specification: "50mg*10vials", retailUsdCents: 21700, category: "weight_management" },
  { sku: "TR60", productName: "Tirzepatide", specification: "60mg*10vials", retailUsdCents: 25100, category: "weight_management" },
  { sku: "TR80", productName: "Tirzepatide", specification: "80mg*10vials", retailUsdCents: 37100, category: "weight_management" },
  { sku: "TR100", productName: "Tirzepatide", specification: "100mg*10vials", retailUsdCents: 39000, category: "weight_management" },
  { sku: "VP5", productName: "VIP", specification: "5mg*10vials", retailUsdCents: 8900, category: "wellness_research" },
  { sku: "VP10", productName: "VIP", specification: "10mg*10vials", retailUsdCents: 14900, category: "wellness_research" },
] as const satisfies readonly ProductCatalogItem[];

export function findCatalogVariant(
  sku: string,
  productName: string,
  specification: string,
) {
  return (
    PRODUCT_CATALOG.find(
      (item) =>
        item.sku === sku &&
        item.productName === productName &&
        item.specification === specification,
    ) ?? null
  );
}
