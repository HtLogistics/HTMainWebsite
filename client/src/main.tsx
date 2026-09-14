import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

/* Umami analytics is optional: only injected when both env vars are present at build time, so an
   unconfigured build never ships a broken script tag. */
const analyticsEndpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT as string | undefined;
const analyticsId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID as string | undefined;
if (analyticsEndpoint && analyticsId) {
  const script = document.createElement("script");
  script.defer = true;
  script.src = `${analyticsEndpoint.replace(/\/$/, "")}/umami`;
  script.dataset.websiteId = analyticsId;
  document.head.appendChild(script);
}

createRoot(document.getElementById("root")!).render(<App />);
