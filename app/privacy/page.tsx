import LegalDocument from "../LegalDocument";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy information for Peptivanta Biosciences website inquiries.",
};

export default function PrivacyPage() {
  return <LegalDocument kind="privacy" />;
}
