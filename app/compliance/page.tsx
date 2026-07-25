import LegalDocument from "../LegalDocument";

export const metadata = {
  title: "Compliance Notice",
  description: "Professional-use and destination review policy.",
};

export default function CompliancePage() {
  return <LegalDocument kind="compliance" />;
}
