/* Ground-truth replication: global routing for the HT Logistics Solutions WordPress-to-hardcoded conversion. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AboutPage, ContactPage, HomePage, NotFoundPage, PrivacyPage, ServicesPage, TermsPage } from "./pages/SitePages";
import { BlogArticlePage, BlogListPage } from "./pages/BlogPages";
import { AdminPage } from "./pages/AdminPages";
import { ServiceDetailPage } from "./pages/ServiceDetailPage";
import { allServices } from "./data/services";

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Switch>
    <Route path="/" component={HomePage} />
    <Route path="/about-us/" component={AboutPage} />
    <Route path="/services/" component={ServicesPage} />
    <Route path="/latest-news/" component={BlogListPage} />
    <Route path="/contact-us/" component={ContactPage} />
    {allServices.map(s => <Route key={s.slug} path={`/${s.slug}/`}>{() => <ServiceDetailPage slug={s.slug} />}</Route>)}
    <Route path="/admin/" component={AdminPage} />
    <Route path="/privacy-policy/" component={PrivacyPage} />
    <Route path="/terms-conditions/" component={TermsPage} />
    <Route path="/:slug/" component={BlogArticlePage} />
    <Route component={NotFoundPage} />
  </Switch></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
