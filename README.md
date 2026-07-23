# Peptivanta Biosciences Website

A bilingual English / Brazilian Portuguese B2B inquiry website for documented
peptide supply, private-label projects, and export coordination.

## Edit WhatsApp, email, and company information

Open `site.config.ts` and update:

```ts
whatsappNumber: "85261234567",
salesEmail: "sales@yourdomain.com",
operatingRegion: "Hong Kong SAR · Sales & Export Coordination",
registeredAddress: "Your verified registered address",
```

The WhatsApp number must use digits only and include the country code. Product
buttons and the inquiry form will automatically generate pre-filled messages.

Do not publish a registered address, authorization, certification, or facility
identity that cannot be supported by current documents.

## Main files

- `site.config.ts` — editable business details
- `app/page.tsx` — homepage content, translations, and product catalogue
- `app/globals.css` — brand styling and responsive layout
- `public/images` — approved website photographs
- `app/privacy`, `app/terms`, `app/compliance` — legal and compliance pages

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Compliance posture

The website is structured as a qualified professional inquiry catalogue. It
does not provide direct online checkout, medical claims, dosage information,
reconstitution instructions, injection guidance, or consumer-use advice.
