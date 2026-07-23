import Link from "next/link";
import { siteConfig } from "../../site.config";

export const metadata = {
  title: "Compliance Notice",
  description: "Professional-use and destination review policy.",
};

export default function CompliancePage() {
  return (
    <main className="legal-page">
      <Link className="legal-back" href="/">← Back to Peptivanta</Link>
      <p className="section-tag">Responsible supply</p>
      <h1>Compliance Notice</h1>
      <p className="legal-date">Qualified professional inquiries only</p>

      <section>
        <h2>Intended professional applications</h2>
        <p>
          Products displayed may be considered only for qualified research,
          analytical, formulation-development, manufacturing, or other lawful
          professional applications. They are not presented as medicines and
          are not intended for human or veterinary use.
        </p>
      </section>
      <section>
        <h2>No medical or consumer-use content</h2>
        <p>
          We do not provide medical claims, treatment recommendations, dosing,
          reconstitution instructions, injection guidance, before-and-after
          testimonials, or advice for personal use.
        </p>
      </section>
      <section>
        <h2>Customer and destination review</h2>
        <p>
          Product eligibility can differ by jurisdiction. We may request
          organization details, intended-use information, import credentials,
          end-user declarations, or other documents. A request may be declined
          when the destination or intended use cannot be supported lawfully.
        </p>
      </section>
      <section>
        <h2>Documentation</h2>
        <p>
          References to COA or analytical information mean that availability
          will be checked for the relevant product and batch. No certification,
          approval, accreditation, or regulatory status should be inferred
          unless it is expressly supported by current documentary evidence.
        </p>
      </section>
      <footer>{siteConfig.fullBrandName} · {siteConfig.operatingRegion}</footer>
    </main>
  );
}
