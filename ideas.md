# Reference Recreation Specification

## Ground-truth reference

The source of truth is https://htlogisticssolutions.com/. This is a visual replication task, so the reference site overrides any alternative design direction. Preserve the visible content, hierarchy, brand colors, imagery, navigation labels, calls to action, footer details, responsive behavior, carousel behavior, floating WhatsApp control, and linked destinations as closely as possible while replacing WordPress with a hardcoded React frontend.

## Observed homepage structure

- Fixed or overlaid white header on the hero with HT Logistics Solutions logo at left.
- Primary navigation: Home, About, Services, Latest News, plus a red Contact Us button.
- Full-bleed image carousel hero with logistics imagery, large white left-aligned headline, supporting copy, small red circular down-arrow control, and left/right slide controls.
- Hero slides include the visible messages: "A Total Logistics Solutions Company", "Kitting", and "Packaging & Labelling". One slide includes the line "Keep your inventory safe, accessible, and efficiently managed with our secure storage solutions." Another includes a news card for "Latest News: Launches Real-Time Tracking System for Enhanced Delivery Transparency".
- About section with warehouse imagery, paragraph describing HT Logistics Solutions' 2023 Penang founding and expansion, About Us button, and "Certified by" logos.
- Services section titled "Discover Our Services" with subtitle "Comprehensive Solutions for Every Step of Your Supply Chain".
- Metrics/statistics row showing Client Satisfaction, Active Workers, Land Vehicles, Warehouse Branches, and Warehouse Capacity (sqm), visually counting from zero on the source view.
- Values/features section with Client-Focused Solutions, Entrepreneurial Spirit, and Integrity & Continuity copy.
- Latest News section with title "Latest News", subtitle "Stay Updated on Our Growth, Innovations & Milestones", and View More button.
- Large red Contact Us CTA band and a multi-column footer with Useful Links, Services, Contact, address, phone numbers, Privacy Policy, Terms & Conditions, copyright, and VeecoTech credit.
- Floating WhatsApp chat control is visible at the bottom-right.

## Asset references observed

- Logo: https://htlogisticssolutions.com/wp-content/uploads/2025/11/ht-logistics.png
- News image: https://htlogisticssolutions.com/wp-content/uploads/2025/11/delivery.jpg
- Certification images: https://htlogisticssolutions.com/wp-content/uploads/2026/01/Untitled-4-removebg-preview.png and https://htlogisticssolutions.com/wp-content/uploads/2026/01/isocertification-removebg-preview.png
- Exact remaining hero/about/service image URLs and CSS geometry should be extracted from the source page HTML before implementation.

## Replication philosophy

Use a faithful WordPress-to-hardcoded conversion: keep the source site's red-and-charcoal identity, white navigation surface, rounded red CTA styling, bold geometric sans-serif headings, large edge-to-edge imagery, generous vertical spacing, and strong section transitions. Do not introduce new visual patterns, extra content, substitute brand language, or a different aesthetic. Interactions should remain lightweight and familiar: carousel controls, anchor navigation, hover feedback, mobile menu, and smooth scrolling.

## Style decisions

- Ground truth takes priority over invention.
- Use source imagery when available; generated assets are reserved only for fallback/technical gaps and must not alter the reference composition.
- Keep text over darkened imagery white and body text on light surfaces charcoal.
- Maintain a red accent close to the source brand, approximately #ee1c25, paired with deep charcoal #252525 and warm white.
- Avoid gradients, purple, generic glassmorphism, excessive rounded cards, or added content that is not present in the reference.
