import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, PieChart, TrendingUp, User } from "lucide-react";

const Header = () => {
  const navItems = [
    { name: "Portfolio", path: "/portfolio", icon: LayoutDashboard },
    { name: "Mutual Funds", path: "/mutual-funds", icon: PieChart },
    { name: "Swing Trading", path: "/swing-trading", icon: TrendingUp },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-brand-dark/80 backdrop-blur-md border-b border-brand-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-accent rounded-lg flex items-center justify-center shadow-lg shadow-brand-accent/20">
            <TrendingUp className="text-white" size={20} />
          </div>
          <span className="text-xl font-black text-white tracking-tighter uppercase">
            Asset<span className="text-brand-accent">Flow</span>
          </span>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300
                ${
                  isActive
                    ? "bg-brand-accent/10 text-brand-accent"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }
              `}
            >
              <item.icon size={18} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Profile/User Section */}
        <button className="w-10 h-10 rounded-full bg-slate-800 border border-brand-border flex items-center justify-center text-slate-400 hover:border-brand-accent transition-colors">
          <User size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
