import Link from "next/link";
import { siteConfig } from "../../site.config";

export const metadata = {
  title: "Website Terms",
  description: "Website terms for Peptivanta Biosciences.",
};

export default function TermsPage() {
  return (
    <main className="legal-page">
      <Link className="legal-back" href="/">← Back to Peptivanta</Link>
      <p className="section-tag">Legal information</p>
      <h1>Website Terms</h1>
      <p className="legal-date">Last updated: July 23, 2026</p>

      <section>
        <h2>Professional audience</h2>
        <p>
          This website is intended for organizations and qualified professional
          customers. It is not a consumer pharmacy, clinic, telehealth service,
          or source of medical advice.
        </p>
      </section>
      <section>
        <h2>No online sale</h2>
        <p>
          Catalogue content is informational and does not constitute an offer
          for unrestricted sale. A website inquiry creates no order or supply
          commitment. Customer, intended-use, destination, documentation, and
          legal reviews may be required before a quotation.
        </p>
      </section>
      <section>
        <h2>Product information</h2>
        <p>
          Configurations and document availability can vary by batch. Final
          specifications, packaging, lead time, documentation, and commercial
          terms must be confirmed in writing for each qualified inquiry.
        </p>
      </section>
      <section>
        <h2>Acceptable use</h2>
        <p>
          You may not use this website to seek products for unlawful,
          unauthorized, human, or veterinary administration. We may refuse or
          discontinue any request that does not meet professional or legal
          requirements.
        </p>
      </section>
      <footer>{siteConfig.fullBrandName} · {siteConfig.operatingRegion}</footer>
    </main>
  );
}
