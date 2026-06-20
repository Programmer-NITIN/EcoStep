import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { DashboardPage } from "./pages/DashboardPage";
import { TrackerPage } from "./pages/TrackerPage";
import { CommunityPage } from "./pages/CommunityPage";
import { ResourcesPage } from "./pages/ResourcesPage";

export default function App() {
  return (
    <div className="app-layout">
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/tracker" element={<TrackerPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
