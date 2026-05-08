import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/layout/Header";
import PortfolioPage from "./features/portfolio/PortFolioPage";
import MutualFundPage from "./features/mutualfunds/MutualFundPage";
// Placeholder component for future module
const SwingTrading = () => (
  <div className="text-white p-10">Swing Trading Module Coming Soon...</div>
);

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-brand-dark text-slate-200">
        <Header />

        <main className="container mx-auto pt-24 pb-12">
          <Routes>
            {/* Redirect root to portfolio */}
            <Route path="/" element={<Navigate to="/portfolio" replace />} />

            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/mutual-funds" element={<MutualFundPage />} />
            <Route path="/swing-trading" element={<SwingTrading />} />

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
