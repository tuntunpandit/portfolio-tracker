import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/layout/Header";
import DashboardPage from "./features/dashboard/DashboardPage";
import PortfolioPage from "./features/portfolio/PortFolioPage";
import MutualFundPage from "./features/mutualfunds/MutualFundPage";
import SwingTradingPage from "./features/swingtrading/SwingTradingPage";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-brand-dark text-slate-200">
        <Header />

        <main className="container mx-auto pt-24 pb-12">
          <Routes>
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/mutual-funds" element={<MutualFundPage />} />
            <Route path="/swing-trading" element={<SwingTradingPage />} />

            {/* 404 Catch-all */}
            <Route
              path="*"
              element={<div className="text-center py-20">Page Not Found</div>}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
