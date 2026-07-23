/**
 * Central editable business settings.
 *
 * WhatsApp: digits only, including the country code.
 * Example: 85261234567
 *
 * Do not publish a full registered address until the supporting company
 * documents have been verified.
 */
export const siteConfig = {
  brandName: "Peptivanta",
  fullBrandName: "Peptivanta Biosciences",
  tagline: "Precision in every batch",
  whatsappNumber: "1-9863059927",
  salesEmail: "",
  operatingRegion: "Hong Kong SAR · Sales & Export Coordination",
  registeredAddress: "",
  responseTime: "Within one business day",
} as const;

export function createWhatsAppUrl(message: string) {
  const number = siteConfig.whatsappNumber.replace(/\D/g, "");
  return number
    ? `https://wa.me/${number}?text=${encodeURIComponent(message)}`
    : "#inquiry";
}
