import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ProjectGallery from "./pages/ProjectGallery";
import DesignCanvas from "./pages/DesignCanvas";
import TerrainAnalysis from "./pages/TerrainAnalysis";
import ExportDesign from "./pages/ExportDesign";
import AdminInventory from "./pages/AdminInventory";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/projects" component={ProjectGallery} />
      <Route path="/design/:id" component={DesignCanvas} />
      <Route path="/analysis/:id" component={TerrainAnalysis} />
      <Route path="/export/:id" component={ExportDesign} />
      <Route path="/admin/inventory" component={AdminInventory} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
