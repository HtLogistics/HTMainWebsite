/* Text-only service catalogue shared by client and server (the server uses it for sitemap and
   per-page metadata). Photographs are attached on the client in client/src/data/services.ts. */
export interface ServiceCatalogEntry {
  slug: string;
  number: string;
  title: string;
  summary: string;
  intro: string[];
  highlights: string[];
  /* Curated cross-links shown as "Works well with" on the detail page. Slugs only — the page
     resolves them against this list, so a typo renders nothing rather than a broken link. */
  related?: string[];
  /* Everything below is drawn from the HT Logistics company profile (2025). Optional so a service
     without profile material renders fewer sections rather than invented ones. */
  pillars?: { title: string; copy: string }[];
  handles?: { heading: string; items: string[] }[];
  faqs?: [string, string][];
}

export const coreCatalog: ServiceCatalogEntry[] = [
  {
    slug: "warehouse-storage",
    number: "01",
    title: "Warehouse & Distribution",
    summary: "Secure and organized storage solutions to keep your inventory safe, accessible, and efficiently managed.",
    intro: [
      "Our warehousing facilities across Penang and Kulim give you secure, well-organised storage backed by clear inventory systems, so your goods stay protected and easy to locate at every stage of the supply chain.",
      "From receiving and put-away to order fulfilment and outbound distribution, our teams keep stock moving accurately, reducing shrinkage and keeping your operations running on schedule.",
    ],
    highlights: [
      "Multiple branch locations across Penang and Kulim",
      "Organised inventory management and stock control",
      "Receiving, put-away, picking and dispatch handled in-house",
      "Scalable storage space for seasonal and long-term needs",
    ],
    related: ["kitting", "packaging-labelling", "warehouse-management-system-wms"],
    // Profile p.10 "Warehousing Solutions" — the five capability pillars.
    pillars: [
      { title: "Inventory Management", copy: "Stock levels, locations and movements tracked through our Warehouse Management System across every branch." },
      { title: "Flexible Storage Solutions", copy: "Bonded and non-bonded, temperature-controlled, cold and ambient storage across our three main facilities." },
      { title: "Efficient Distribution Support", copy: "Order processing, packaging and outbound transport coordinated from the same site as your stock." },
      { title: "Secure Storage Facilities", copy: "TAPA-certified operations with QEHSS standards applied consistently across the network." },
      { title: "Professional Handling & Support", copy: "Experienced warehouse personnel handling goods from receiving through to dispatch." },
    ],
    // Profile p.8 "Our Services" — supply chain solution and customer service capabilities.
    handles: [
      { heading: "Storage", items: ["FTZ, bonded and non-bonded", "Temperature-controlled and ambient facilities", "Cold storage at Science Park"] },
      { heading: "Handling", items: ["Pick and pack operations (piece, carton, pallet)", "Value-added services: labelling and quality", "Inspection, bundling and ink-jet printing"] },
      { heading: "Compliance", items: ["Import and export clearance and customs documentation", "Duty exemptions, HS Code registration and import permits", "Licensed Manufacturing Warehouse (LMW) application support"] },
      { heading: "Standards", items: ["ISO 9001, ISO 14001 and ISO 45001", "TAPA certified", "GDPMD"] },
    ],
    faqs: [
      ["Where are your warehouses?", "Our headquarters is at Science Park, Bukit Minyak in Pulau Pinang (17,400 m², 4,000 pallet positions), with further facilities at Prai Industrial Park in Seberang Prai (8,500 m², 6,000 pallets) and Kulim Industrial Park in Kedah (4,000 m², 4,000 pallets) — five branches across Penang and Kulim in total."],
      ["Do you offer bonded storage?", "Yes. All three main facilities provide bonded and non-bonded storage, including Free Trade Zone storage. We also support Licensed Manufacturing Warehouse (LMW) applications."],
      ["Can you store temperature-sensitive goods?", "Yes. Temperature-controlled storage is available at all three facilities, with cold storage at Science Park and ambient storage at Prai Industrial Park."],
      ["How is my stock tracked?", "Through our Warehouse Management System, which gives inventory visibility and control across every branch and reduces manual errors in stock counts and locations."],
      ["What standards do you operate to?", "Our QEHSS standards cover ISO 9001, ISO 14001 and ISO 45001, alongside TAPA certification for supply chain security and GDPMD for medical device handling."],
    ],
  },
  {
    slug: "kitting",
    number: "02",
    title: "Kitting",
    summary: "Streamlined kitting services to group, assemble, and prepare product sets for faster fulfillment and distribution.",
    intro: [
      "Our kitting services bring together the individual components of your product sets — bundling, assembling and preparing them ahead of time so orders move out the door faster and with fewer errors.",
      "Whether you need recurring kitting for retail bundles or one-off assembly for a promotional campaign, our teams follow clear specifications to keep every kit consistent.",
    ],
    highlights: [
      "Custom bundling and assembly to your specifications",
      "Faster order fulfilment with pre-kitted product sets",
      "Quality checks at every assembly stage",
      "Flexible for recurring or one-off kitting runs",
    ],
    related: ["packaging-labelling", "warehouse-storage", "pick-pack-operations"],
    faqs: [
      ["Where does kitting take place?", "In our own warehouses across Penang and Kulim, alongside your stored stock — so components move straight from storage into assembly without an extra transport leg."],
      ["Can you handle one-off kitting runs?", "Yes. We handle both recurring kitting for regular product sets and one-off assembly for promotions or launches, following your specifications either way."],
      ["Do you check kits before they ship?", "Yes. Quality checks are carried out at every assembly stage, and kitting sits within the same QEHSS standards as the rest of our operations."],
      ["Can kitting be combined with packaging and labelling?", "Yes. Kitting, packaging, labelling, inspection, bundling and ink-jet printing are all handled in-house as value-added services, so a kit can leave us retail-ready."],
    ],
  },
  {
    slug: "packaging-labelling",
    number: "03",
    title: "Packaging & Labelling",
    summary: "Packaging and accurate labelling to ensure compliance, protection, and a professional presentation of your products.",
    intro: [
      "Proper packaging protects your products in transit, while accurate labelling keeps you compliant and your brand looking professional from the warehouse to the customer's door.",
      "Our packaging and labelling teams follow your specifications closely, whether that's retail-ready presentation, protective export packaging, or regulatory labelling requirements.",
    ],
    highlights: [
      "Retail-ready and protective packaging options",
      "Accurate, compliant product labelling",
      "Custom branding and presentation on request",
      "Quality control checks before dispatch",
    ],
    related: ["kitting", "warehouse-storage", "value-added-services"],
    faqs: [
      ["What packaging options do you offer?", "Retail-ready and protective export packaging, plus bundling and ink-jet printing, carried out in our warehouses as part of our value-added services."],
      ["Can you apply regulatory labelling?", "Yes. We handle accurate product labelling to your specification, including compliance labelling, with quality checks before dispatch."],
      ["Do you handle medical or pharmaceutical products?", "We hold GDPMD certification for medical device handling and operate temperature-controlled and cold storage, so these goods can be stored and packed under the right conditions."],
      ["Can you use our own branded packaging?", "Yes. We follow your specifications for custom branding and presentation, and hold your packaging materials in our facilities."],
    ],
  },
  {
    slug: "transportation",
    number: "04",
    title: "Transportation",
    summary: "Timely transportation services for local and regional deliveries, ensuring goods reach their destination safely.",
    intro: [
      "Our transportation fleet handles local and regional deliveries across Malaysia, keeping your goods moving safely and on schedule.",
      "With experienced drivers and well-maintained vehicles, we plan routes carefully to minimise delays and keep your supply chain reliable.",
    ],
    highlights: [
      "Local and regional coverage across Malaysia",
      "Experienced drivers and a well-maintained fleet",
      "Careful route planning to minimise delays",
      "Reliable scheduling for time-sensitive deliveries",
    ],
    related: ["nationwide-ftl-ltl-transport", "cross-border-trucking", "last-mile-delivery"],
    faqs: [
      ["Where do you deliver?", "Nationwide across Malaysia on both full truckload (FTL) and less-than-truckload (LTL) terms, plus cross-border trucking to regional markets and last-mile delivery to end customers."],
      ["How large is your fleet?", "We operate 20 land vehicles, supported by our transport solutioning team who match the right vehicle and route to each shipment."],
      ["Can we track our shipments?", "Yes. Our Transport Management System provides real-time tracking and route management, giving visibility of where a shipment is and when it will arrive."],
      ["Do you handle customs for cross-border loads?", "Yes. Our customer service team handles import and export clearance and customs documentation, and assists with duty exemptions, HS Code registration and import permits."],
    ],
  },
  {
    slug: "manpower-supply",
    number: "05",
    title: "Manpower Supply",
    summary: "Experienced logistics personnel to support operations from warehousing to delivery, enhancing productivity.",
    intro: [
      "Our manpower supply service places experienced logistics personnel into your operations — from warehousing to delivery — so you can scale up quickly without compromising on quality.",
      "Every team member is briefed on safety and operational standards before deployment, helping your business maintain productivity during peak periods or long-term growth.",
    ],
    highlights: [
      "Experienced personnel for warehousing, kitting and delivery roles",
      "Flexible staffing for peak season or long-term needs",
      "Safety and operational briefing before deployment",
      "Support that scales with your business",
    ],
    related: ["warehouse-storage", "kitting", "transportation"],
    faqs: [
      ["What roles can you supply?", "Experienced logistics personnel for warehousing, kitting, packaging and delivery roles, drawn from our team of over 200 active workers."],
      ["Can you cover peak periods?", "Yes. Staffing can scale up for seasonal peaks or be placed on a long-term basis, depending on what your operation needs."],
      ["Are your staff trained before deployment?", "Every team member is briefed on safety and operational standards before deployment, in line with our ISO 45001 occupational health and safety standard."],
      ["Can personnel work at our site?", "Yes. Manpower can support your operations directly or work within our own facilities, depending on where the work sits."],
    ],
  },
];

export const specialisedCatalog: ServiceCatalogEntry[] = [
  {
    slug: "supply-chain-solutions",
    number: "06",
    title: "Supply Chain Solutions",
    summary: "End-to-end coordination across warehousing, transport and fulfilment, built around your operational needs.",
    intro: [
      "We coordinate every stage of your supply chain — warehousing, transport and fulfilment — as one connected operation, rather than a set of disjointed services.",
      "This end-to-end approach gives you a single point of accountability, clearer visibility, and a logistics partner who understands how each part of your operation affects the next.",
    ],
    highlights: [
      "Single point of accountability across your supply chain",
      "Coordinated warehousing, transport and fulfilment",
      "Built around your specific operational needs",
      "Clearer visibility from inbound to delivery",
    ],
    related: ["warehouse-storage", "transportation", "warehouse-management-system-wms"],
    handles: [
      { heading: "Storage", items: ["FTZ, bonded and non-bonded", "Temperature-controlled and ambient facilities", "Cold storage at Science Park"] },
      { heading: "Operations", items: ["Pick and pack by piece, carton or pallet", "Labelling, quality checks and inspection", "Bundling and ink-jet printing"] },
      { heading: "Systems", items: ["Warehouse Management System across every branch", "Transport Management System with real-time tracking"] },
      { heading: "Standards", items: ["ISO 9001, ISO 14001 and ISO 45001", "TAPA certified", "GDPMD"] },
    ],
    faqs: [
      ["What does end-to-end actually cover?", "Storage, handling, transport and the systems that track them, coordinated as one operation from inbound receipt to final delivery rather than as separate contracts."],
      ["Who is our point of contact?", "A named Key Account Manager, supported by operational contacts and customer service. The ways of working are written into an SOP agreed alongside the contract."],
      ["How is the arrangement reviewed?", "Monthly operational meetings on recent performance, quarterly business reviews of scope and improvements, and a top-management meeting at least once a year."],
      ["Which industries do you work with?", "Manufacturing, automotive, retail, medical, electronics, FMCG, e-commerce and industrial customers across Penang, Kedah and nationwide."],
    ],
  },
  {
    slug: "nationwide-ftl-ltl-transport",
    number: "07",
    title: "Nationwide FTL & LTL Transport",
    summary: "Full truckload and less-than-truckload transport solutions covering destinations across Malaysia.",
    intro: [
      "Whether you're moving a full truckload or a smaller less-than-truckload shipment, our nationwide transport network covers destinations across Malaysia.",
      "We match the right vehicle and route to your shipment size, helping you control costs without compromising on delivery reliability.",
    ],
    highlights: [
      "Full truckload (FTL) and less-than-truckload (LTL) options",
      "Nationwide coverage across Malaysia",
      "Vehicle and route matched to shipment size",
      "Reliable scheduling for planned and urgent shipments",
    ],
    related: ["cross-border-trucking", "last-mile-delivery", "transportation"],
    handles: [
      { heading: "How we plan it", items: ["Your requirements reviewed by our transport solutioning team", "Best-suited partner and vehicle matched to the load", "Cost efficiency and system integration assessed up front"] },
      { heading: "What's put in place", items: ["Agreed transport partner and pricing", "Warehouse integration where stock is held with us", "TMS tracking with KPIs reviewed at monthly operational meetings", "Billing set up against the agreed scope"] },
      { heading: "Coverage", items: ["Full truckload (FTL) for dedicated loads", "Less-than-truckload (LTL) for smaller consignments", "Destinations across Malaysia"] },
    ],
    faqs: [
      ["What's the difference between FTL and LTL?", "Full truckload gives you a dedicated vehicle for your consignment. Less-than-truckload shares the vehicle with other freight, which lowers the cost for smaller shipments. We match the option to your volume and timing."],
      ["Where do you cover?", "Nationwide across Malaysia, with cross-border trucking to regional markets and last-mile delivery available as separate services."],
      ["Can we track the load?", "Yes. Our Transport Management System provides real-time tracking and route management, so you can see where a shipment is and when it will arrive."],
      ["How large is the fleet?", "We operate 20 land vehicles, and our transport solutioning team matches the vehicle and partner to each load."],
    ],
  },
  {
    slug: "cross-border-trucking",
    number: "08",
    title: "Cross-Border Trucking",
    summary: "Dependable cross-border trucking connecting Malaysia with regional markets.",
    intro: [
      "Our cross-border trucking service connects Malaysia with regional markets, handling the logistics of moving goods across borders reliably and on schedule.",
      "We work closely with our customs support team to keep cross-border shipments compliant and moving smoothly, reducing delays at checkpoints.",
    ],
    highlights: [
      "Cross-border coverage connecting regional markets",
      "Coordinated with customs and documentation support",
      "Reliable scheduling for cross-border shipments",
      "Experienced drivers familiar with cross-border routes",
    ],
    related: ["import-export-customs-support", "nationwide-ftl-ltl-transport", "transportation"],
    handles: [
      { heading: "Customs and documentation", items: ["Import and export clearance", "Customs documentation prepared and lodged", "Duty exemptions, HS Code registration and import permits"] },
      { heading: "How we plan it", items: ["Your requirements reviewed by our transport solutioning team", "Best-suited partner and vehicle matched to the load", "Cost efficiency and system integration assessed up front"] },
      { heading: "Visibility", items: ["Real-time tracking through our Transport Management System", "KPIs reviewed at monthly operational meetings"] },
    ],
    faqs: [
      ["Do you handle the customs side?", "Yes. Our customer service team handles import and export clearance and customs documentation, and assists with duty exemptions, HS Code registration and import permits."],
      ["Where do you go?", "Cross-border trucking connects Malaysia with regional markets. Tell us the origin and destination and our solutioning team will confirm the route and partner."],
      ["Can we track the shipment across the border?", "Yes. Tracking runs through our Transport Management System for the whole journey."],
      ["Can goods be held in bonded storage before or after the crossing?", "Yes. All three of our main facilities offer bonded and non-bonded storage, including Free Trade Zone storage."],
    ],
  },
  {
    slug: "last-mile-delivery",
    number: "09",
    title: "Last-Mile Delivery",
    summary: "Efficient final-leg delivery that keeps your goods moving right to the customer's door.",
    intro: [
      "The last mile is often the most complex part of the delivery journey — we manage it efficiently, getting your goods from our warehouses right to your customer's door.",
      "Our last-mile operations are built for reliability, helping you maintain customer satisfaction with on-time, trackable deliveries.",
    ],
    highlights: [
      "Reliable final-leg delivery to end customers",
      "Real-time tracking for delivery transparency",
      "Efficient route planning for urban and regional drops",
      "Built to support customer satisfaction and repeat business",
    ],
    related: ["nationwide-ftl-ltl-transport", "transportation", "transport-management-system-tms"],
    handles: [
      { heading: "Planning", items: ["Route management through our Transport Management System", "Delivery is the final step of our eight-stage logistics workflow", "Volumes and windows agreed in your SOP"] },
      { heading: "Visibility", items: ["Real-time tracking for every delivery", "KPIs reviewed at monthly operational meetings"] },
      { heading: "From our facilities", items: ["Dispatched from stock held at Science Park, Prai or Kulim", "Order processing and packaging completed on the same site"] },
    ],
    faqs: [
      ["Can customers track their delivery?", "Yes. Our Transport Management System provides real-time tracking and route management for the final leg."],
      ["Where do you deliver?", "Urban and regional drops across Malaysia, from stock held in our Penang and Kedah facilities."],
      ["Does last-mile connect with your warehousing?", "Yes. Order processing, packaging and dispatch happen at the same site as your stock, so there is no hand-off between providers."],
      ["How are delivery volumes handled?", "Volumes and delivery windows are agreed in the SOP and reviewed monthly, with capacity scaled from our fleet of 20 vehicles and our transport partners."],
    ],
  },
  {
    slug: "import-export-customs-support",
    number: "10",
    title: "Import / Export & Customs Support",
    summary: "Guidance and support through import, export and customs processes to keep shipments compliant and on schedule.",
    intro: [
      "Import, export and customs processes can slow down even the best-planned shipment. Our team provides guidance and hands-on support to keep your documentation accurate and your shipments compliant.",
      "By managing the paperwork and regulatory requirements alongside your shipment, we help reduce delays at customs and keep your supply chain predictable.",
    ],
    highlights: [
      "Guidance through import and export documentation",
      "Customs compliance support to reduce delays",
      "Coordination with transport and cross-border teams",
      "Experience across a range of shipment types",
    ],
    related: ["cross-border-trucking", "warehouse-storage", "supply-chain-solutions"],
    handles: [
      { heading: "Clearance", items: ["Import and export clearance", "Customs documentation prepared and lodged"] },
      { heading: "Permits and exemptions", items: ["Duty exemption applications", "HS Code registration", "Import permits"] },
      { heading: "Licensing", items: ["Licensed Manufacturing Warehouse (LMW) application support", "Free Trade Zone and bonded storage at all three facilities"] },
      { heading: "Standards", items: ["ISO 9001, ISO 14001 and ISO 45001", "TAPA certified", "GDPMD"] },
    ],
    faqs: [
      ["What do you handle for us?", "Import and export clearance, customs documentation, duty exemption applications, HS Code registration and import permits."],
      ["Can you help with an LMW application?", "Yes. We support Licensed Manufacturing Warehouse applications, and hold bonded and Free Trade Zone storage across our facilities."],
      ["Does this connect with your transport?", "Yes. Customs support is coordinated with our cross-border trucking and nationwide transport teams so shipments are not held up at checkpoints."],
      ["Who handles it?", "Our customer service team, working with your Key Account Manager under the SOP agreed for your account."],
    ],
  },
  {
    slug: "pick-pack-operations",
    number: "11",
    title: "Pick & Pack Operations",
    summary: "Accurate order picking and packing operations designed for speed and fulfilment accuracy.",
    intro: [
      "Our pick and pack operations are designed for speed and accuracy, helping you fulfil orders quickly without sacrificing quality control.",
      "From single-item orders to complex multi-SKU fulfilment, our warehouse teams follow clear processes to keep error rates low and turnaround times short.",
    ],
    highlights: [
      "Accurate picking across single and multi-SKU orders",
      "Fast turnaround to support fulfilment deadlines",
      "Quality checks built into the packing process",
      "Scalable for order volume spikes",
    ],
    related: ["warehouse-storage", "kitting", "packaging-labelling"],
    handles: [
      { heading: "Order types", items: ["Piece picking", "Carton picking", "Pallet picking"] },
      { heading: "Quality", items: ["Inspection and quality checks", "Labelling to your specification", "Packing checks before dispatch"] },
      { heading: "Systems", items: ["Picking driven by our Warehouse Management System", "Stock locations and movements recorded per branch"] },
      { heading: "Standards", items: ["ISO 9001, ISO 14001 and ISO 45001", "TAPA certified", "GDPMD"] },
    ],
    faqs: [
      ["Do you pick by piece, carton or pallet?", "All three. Pick and pack runs at piece, carton and pallet level depending on the order profile."],
      ["How do you keep picking accurate?", "Picking is driven by our Warehouse Management System, with inspection and quality checks built into the packing process."],
      ["Can you handle volume spikes?", "Yes. Staffing scales from our team of over 200 active workers for seasonal peaks or campaign launches."],
      ["Where does it happen?", "In our own facilities at Science Park, Prai and Kulim, alongside your stored stock."],
    ],
  },
  {
    slug: "value-added-services",
    number: "12",
    title: "Value-Added Services",
    summary: "Additional handling, assembly and processing tailored to your product and customer requirements.",
    intro: [
      "Beyond standard warehousing and transport, we offer additional handling, assembly and processing services tailored to your specific product and customer requirements.",
      "These value-added services are designed to fit around your existing operations, adding capability without adding complexity.",
    ],
    highlights: [
      "Custom handling and processing on request",
      "Tailored to your product and customer requirements",
      "Integrates with existing warehousing and fulfilment",
      "Flexible scope for one-off or recurring needs",
    ],
    related: ["kitting", "packaging-labelling", "pick-pack-operations"],
    handles: [
      { heading: "Handling", items: ["Labelling", "Quality checks and inspection", "Bundling"] },
      { heading: "Processing", items: ["Ink-jet printing", "Kitting and assembly", "Retail-ready and protective packaging"] },
      { heading: "Standards", items: ["ISO 9001, ISO 14001 and ISO 45001", "TAPA certified", "GDPMD"] },
    ],
    faqs: [
      ["What counts as a value-added service?", "Anything beyond storage and transport: labelling, quality checks, inspection, bundling, ink-jet printing, kitting and packaging, carried out in our warehouses."],
      ["Can you print directly onto cartons?", "Yes. Ink-jet printing is one of the value-added services we run in-house."],
      ["Is it available as a one-off?", "Yes. Value-added work can be recurring or one-off, for example for a promotion or product launch."],
      ["Where is the work done?", "In our own facilities across Penang and Kulim, so goods move straight from storage to processing without an extra transport leg."],
    ],
  },
  {
    slug: "warehouse-management-system-wms",
    number: "13",
    title: "Warehouse Management System (WMS)",
    summary: "Technology-driven inventory visibility and control across every warehouse branch.",
    intro: [
      "Our Warehouse Management System gives you technology-driven visibility into inventory across every branch, so stock levels, locations and movements are always accurate and accessible.",
      "This system-level control reduces manual errors and helps our teams — and yours — make faster, better-informed decisions about your inventory.",
    ],
    highlights: [
      "Real-time inventory visibility across branches",
      "Reduced manual errors through system-level control",
      "Supports accurate stock forecasting and planning",
      "Integrated with our warehousing operations",
    ],
    related: ["warehouse-storage", "transport-management-system-tms", "pick-pack-operations"],
    handles: [
      { heading: "Visibility", items: ["Stock levels, locations and movements", "Across every branch: Science Park, Prai and Kulim"] },
      { heading: "Control", items: ["Receiving, put-away, picking and dispatch recorded", "Fewer manual errors in counts and locations"] },
      { heading: "Review", items: ["Inventory data supports forecasting and planning", "Performance reviewed at monthly operational meetings"] },
    ],
    faqs: [
      ["Does it cover all your warehouses?", "Yes. The WMS runs across every branch, so stock held at Science Park, Prai or Kulim is visible in one place."],
      ["How does it reduce errors?", "Receiving, put-away, picking and dispatch are recorded in the system rather than on paper, which removes most manual counting and location mistakes."],
      ["Will we see the data?", "Yes. Inventory visibility is part of the service, and performance is reviewed with you at monthly operational meetings."],
      ["Does it link to transport?", "Yes. It works alongside our Transport Management System, which handles tracking once goods leave the warehouse."],
    ],
  },
  {
    slug: "transport-management-system-tms",
    number: "14",
    title: "Transport Management System (TMS)",
    summary: "Real-time tracking and route management for greater delivery transparency and efficiency.",
    intro: [
      "Our Transport Management System provides real-time tracking and route management, giving you greater visibility into where your shipments are and when they'll arrive.",
      "This system-driven approach improves delivery efficiency and supports the transparency our customers have come to expect, including the real-time tracking capability we introduced across our fleet.",
    ],
    highlights: [
      "Real-time shipment tracking",
      "Route management for greater delivery efficiency",
      "Improved delivery transparency for customers",
      "Supports both local and nationwide transport operations",
    ],
    related: ["transportation", "nationwide-ftl-ltl-transport", "last-mile-delivery"],
    handles: [
      { heading: "Tracking", items: ["Real-time shipment tracking", "Route management"] },
      { heading: "Performance", items: ["KPIs reviewed at monthly operational meetings", "Billing aligned to the agreed scope"] },
      { heading: "Coverage", items: ["Local and nationwide transport", "Cross-border trucking", "Last-mile delivery"] },
    ],
    faqs: [
      ["What can we see?", "Where a shipment is and when it is expected to arrive, in real time, across local, nationwide and cross-border movements."],
      ["Is tracking available on every service?", "Yes. The TMS covers our transportation, nationwide FTL and LTL, cross-border trucking and last-mile delivery."],
      ["How is performance reviewed?", "TMS data feeds the KPIs we review with you at monthly operational meetings and quarterly business reviews."],
      ["Does it connect to your warehousing?", "Yes. It works alongside our Warehouse Management System, so visibility carries through from stock to delivery."],
    ],
  },
];

export const serviceCatalog: ServiceCatalogEntry[] = [...coreCatalog, ...specialisedCatalog];
