import Link from "next/link";
import { siteConfig } from "../../site.config";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy information for Peptivanta Biosciences website inquiries.",
};

export default function PrivacyPage() {
  return (
    <main className="legal-page">
      <Link className="legal-back" href="/">← Back to Peptivanta</Link>
      <p className="section-tag">Legal information</p>
      <h1>Privacy Policy</h1>
      <p className="legal-date">Last updated: July 23, 2026</p>

      <section>
        <h2>Information we receive</h2>
        <p>
          When you submit or continue an inquiry, we may receive your name,
          organization, destination country, contact details, requested product,
          estimated quantity, intended professional use, and the content of your
          message.
        </p>
      </section>
      <section>
        <h2>How information is used</h2>
        <p>
          Information is used to assess customer qualification, destination
          eligibility, documentation availability, quotation needs, and export
          coordination. We do not use inquiry information to provide medical
          advice or consumer-use recommendations.
        </p>
      </section>
      <section>
        <h2>WhatsApp and external services</h2>
        <p>
          If you choose to continue through WhatsApp or email, your information
          is also subject to the privacy terms of that service. Do not send
          confidential personal health information through the website.
        </p>
      </section>
      <section>
        <h2>Retention and requests</h2>
        <p>
          Business inquiry records may be retained for compliance, service, and
          commercial recordkeeping purposes. Contact us through the published
          business channel to request access, correction, or deletion where
          applicable.
        </p>
      </section>
      <footer>{siteConfig.fullBrandName} · {siteConfig.operatingRegion}</footer>
    </main>
  );
}
