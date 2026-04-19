import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CompareProvider } from "./context/CompareContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import HomePage from "./pages/HomePage";
import SearchPage from "./pages/SearchPage";
import ComparePage from "./pages/ComparePage";
import AboutPage from "./pages/AboutPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import NotFoundPage from "./pages/NotFoundPage";
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <CompareProvider>
        <ScrollToTop />
        <Navbar />
        <main>
          <Routes>
            <Route path="/"        element={<HomePage />} />
            <Route path="/search"  element={<SearchPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/about"   element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms"   element={<TermsPage />} />
            <Route path="*"       element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </CompareProvider>
    </BrowserRouter>
  );
}
