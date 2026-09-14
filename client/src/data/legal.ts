import { SITE } from "@shared/seo";

/* Privacy Policy and Terms & Conditions, drafted against Malaysia's Personal Data Protection Act
   2010 (PDPA). DRAFT — reconstructed 14 Sep 2026 after the original file was lost (never
   committed, caught by an over-broad .gitignore pattern). Content follows the PDPA's seven
   principles (General, Notice & Choice, Disclosure, Security, Retention, Data Integrity, Access)
   using only verified company facts from shared/seo.ts. Sentences on retention period and
   partner-sharing are generic placeholders and MUST be reviewed and confirmed by HT Logistics
   before this page is treated as final — see PROJECT-MEMORY.md §5. */

export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface LegalDocument {
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}

export const privacyPolicy: LegalDocument = {
  title: "Privacy Policy",
  updated: "14 September 2026",
  intro: `${SITE.legalName} (Company No. ${SITE.registration}) ("HT Logistics", "we", "us") respects your privacy. This policy explains what personal data we collect, why, and how it is protected, in line with Malaysia's Personal Data Protection Act 2010 (PDPA).`,
  sections: [
    {
      heading: "What we collect",
      paragraphs: [
        "We collect personal data you provide directly to us, for example through our enquiry form, by phone, email or WhatsApp, or when you engage us for logistics services.",
      ],
      bullets: [
        "Contact details: name, company name, email address, phone number",
        "Enquiry details: the message and service you asked about",
        "Business details relevant to a quotation or contract, such as shipment volumes or storage requirements",
      ],
    },
    {
      heading: "Why we collect it",
      paragraphs: [
        "We use personal data only for purposes connected to our business relationship with you.",
      ],
      bullets: [
        "To respond to enquiries submitted through this website",
        "To prepare quotations and manage service agreements",
        "To operate warehousing, transport and related logistics services you have engaged us for",
        "To meet legal, customs and regulatory obligations that apply to our operations",
      ],
    },
    {
      heading: "Disclosure of your data",
      paragraphs: [
        "We do not sell personal data. We may share it with third parties only where necessary to deliver the service you requested, or where required by law.",
      ],
      bullets: [
        "Transport and delivery partners, where fulfilling a shipment requires it",
        "Customs and regulatory authorities, where required for import/export clearance",
        "Professional advisers (for example auditors), where required for our legal or accounting obligations",
      ],
    },
    {
      heading: "Data security",
      paragraphs: [
        "We take reasonable technical and organisational measures to protect personal data against loss, misuse and unauthorised access, in line with the PDPA's Security Principle. Access to enquiry and customer records is restricted to authorised personnel.",
      ],
    },
    {
      heading: "Retention",
      paragraphs: [
        "We keep personal data only for as long as necessary for the purposes it was collected for, including to meet contractual, accounting, customs or other legal record-keeping requirements, after which it is securely deleted or anonymised.",
      ],
    },
    {
      heading: "Your rights",
      paragraphs: [
        "Under the PDPA, you may request access to the personal data we hold about you, ask us to correct it, or withdraw consent to its processing (subject to any legal or contractual obligations that require us to keep it).",
        `To make a request, contact us at ${SITE.email} or ${SITE.phone}.`,
      ],
    },
    {
      heading: "Changes to this policy",
      paragraphs: [
        "We may update this policy from time to time to reflect changes in our practices or in the law. The date at the top of this page shows when it was last revised.",
      ],
    },
    {
      heading: "Contact us",
      paragraphs: [
        `${SITE.legalName}, ${SITE.address.street}, ${SITE.address.postalCode} ${SITE.address.locality}, ${SITE.address.region}, Malaysia.`,
        `Phone: ${SITE.phone} · Email: ${SITE.email}`,
      ],
    },
  ],
};

export const termsConditions: LegalDocument = {
  title: "Terms & Conditions",
  updated: "14 September 2026",
  intro: `These terms govern your use of this website and your engagement of services from ${SITE.legalName} (Company No. ${SITE.registration}). By using this website or engaging our services, you agree to these terms.`,
  sections: [
    {
      heading: "About us",
      paragraphs: [
        `${SITE.legalName} is a logistics company registered in Malaysia, providing warehousing, transportation, kitting, packaging and related supply chain services from facilities in Pulau Pinang and Kedah.`,
      ],
    },
    {
      heading: "Use of this website",
      paragraphs: [
        "This website is provided to give information about our services and to let you contact us for a quotation. Content on this site is for general information and does not constitute a binding offer; specific pricing and terms are confirmed separately once a service agreement is in place.",
      ],
    },
    {
      heading: "Enquiries and quotations",
      paragraphs: [
        "Submitting an enquiry through this website does not create a contract between you and HT Logistics. A binding agreement is formed only once both parties agree to and sign a service agreement or purchase order covering the scope, pricing and terms of service.",
      ],
    },
    {
      heading: "Service agreements",
      paragraphs: [
        "Where we agree to provide logistics services, the specific terms — including scope, pricing, liability, insurance and standard operating procedures — are set out in a separate written agreement between HT Logistics and the customer. Those agreed terms take priority over this general website page in the event of any conflict.",
      ],
    },
    {
      heading: "Intellectual property",
      paragraphs: [
        `The content of this website, including text, images and logos, belongs to ${SITE.legalName} or its licensors and may not be reproduced without permission.`,
      ],
    },
    {
      heading: "Limitation of liability",
      paragraphs: [
        "While we take care to keep information on this website accurate and up to date, we make no warranty that it is complete or error-free. To the extent permitted by law, HT Logistics is not liable for losses arising from reliance on general website content; liability in respect of services we actually provide is governed by the relevant signed service agreement.",
      ],
    },
    {
      heading: "Governing law",
      paragraphs: [
        "These terms are governed by the laws of Malaysia, and any dispute arising from them is subject to the exclusive jurisdiction of the Malaysian courts.",
      ],
    },
    {
      heading: "Contact us",
      paragraphs: [
        `${SITE.legalName}, ${SITE.address.street}, ${SITE.address.postalCode} ${SITE.address.locality}, ${SITE.address.region}, Malaysia.`,
        `Phone: ${SITE.phone} · Email: ${SITE.email}`,
      ],
    },
  ],
};
