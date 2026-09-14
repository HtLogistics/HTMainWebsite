import type { ServiceCatalogEntry } from "@shared/services-catalog";
import { coreCatalog, specialisedCatalog } from "@shared/services-catalog";

/* Photographs attached to the text-only catalogue in shared/services-catalog.ts. Reconstructed
   14 Sep 2026 after the original file was lost (never committed, caught by an over-broad
   .gitignore pattern) — filenames below are matched back against the real assets still present
   in client/src/assets/, one <slug>-card.jpg per core service and one service-hero-<slug>.jpg
   per service (all 14). */

import warehouseStorageCard from "@/assets/warehouse-distribution-card.jpg";
import kittingCard from "@/assets/kitting-card.jpg";
import packagingLabellingCard from "@/assets/packaging-labelling-card.jpg";
import transportationCard from "@/assets/transportation-card.jpg";
import manpowerSupplyCard from "@/assets/manpower-supply-card.jpg";

import heroWarehouseStorage from "@/assets/service-hero-warehouse-storage.jpg";
import heroKitting from "@/assets/service-hero-kitting.jpg";
import heroPackagingLabelling from "@/assets/service-hero-packaging-labelling.jpg";
import heroTransportation from "@/assets/service-hero-transportation.jpg";
import heroManpowerSupply from "@/assets/service-hero-manpower-supply.jpg";
import heroSupplyChainSolutions from "@/assets/service-hero-supply-chain-solutions.jpg";
import heroNationwideFtlLtl from "@/assets/service-hero-nationwide-ftl-ltl-transport.jpg";
import heroCrossBorderTrucking from "@/assets/service-hero-cross-border-trucking.jpg";
import heroLastMileDelivery from "@/assets/service-hero-last-mile-delivery.jpg";
import heroImportExportCustoms from "@/assets/service-hero-import-export-customs-support.jpg";
import heroPickPackOperations from "@/assets/service-hero-pick-pack-operations.jpg";
import heroValueAddedServices from "@/assets/service-hero-value-added-services.jpg";
import heroWms from "@/assets/service-hero-warehouse-management-system-wms.jpg";
import heroTms from "@/assets/service-hero-transport-management-system-tms.jpg";

export interface ServiceEntry extends ServiceCatalogEntry {
  /* Card/feature-row thumbnail — only the five core services have one. */
  image?: string;
  /* Full-bleed detail-page hero — every service has one. */
  heroImage?: string;
}

const photosBySlug: Record<string, { image?: string; heroImage: string }> = {
  "warehouse-storage": { image: warehouseStorageCard, heroImage: heroWarehouseStorage },
  kitting: { image: kittingCard, heroImage: heroKitting },
  "packaging-labelling": { image: packagingLabellingCard, heroImage: heroPackagingLabelling },
  transportation: { image: transportationCard, heroImage: heroTransportation },
  "manpower-supply": { image: manpowerSupplyCard, heroImage: heroManpowerSupply },
  "supply-chain-solutions": { heroImage: heroSupplyChainSolutions },
  "nationwide-ftl-ltl-transport": { heroImage: heroNationwideFtlLtl },
  "cross-border-trucking": { heroImage: heroCrossBorderTrucking },
  "last-mile-delivery": { heroImage: heroLastMileDelivery },
  "import-export-customs-support": { heroImage: heroImportExportCustoms },
  "pick-pack-operations": { heroImage: heroPickPackOperations },
  "value-added-services": { heroImage: heroValueAddedServices },
  "warehouse-management-system-wms": { heroImage: heroWms },
  "transport-management-system-tms": { heroImage: heroTms },
};

function attachPhotos(entries: ServiceCatalogEntry[]): ServiceEntry[] {
  return entries.map((entry) => ({ ...entry, ...photosBySlug[entry.slug] }));
}

export const coreServices: ServiceEntry[] = attachPhotos(coreCatalog);
export const specialisedServices: ServiceEntry[] = attachPhotos(specialisedCatalog);
export const allServices: ServiceEntry[] = [...coreServices, ...specialisedServices];

export function getServiceBySlug(slug: string): ServiceEntry | undefined {
  return allServices.find((s) => s.slug === slug);
}
