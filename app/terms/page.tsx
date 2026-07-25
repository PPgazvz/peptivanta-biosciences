import LegalDocument from "../LegalDocument";

export const metadata = {
  title: "Website Terms",
  description: "Website terms for Peptivanta Biosciences.",
};

export default function TermsPage() {
  return <LegalDocument kind="terms" />;
}
