import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useResponsiveScale } from "@/hooks/use-scale";
import {
  Home,
  Brain,
  MessageSquare,
  Users,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
  Package,
  ShoppingCart,
  LogOut,
  Edit,
  Star,
  Cpu,
  Syringe,
  Ambulance,
  Watch,
  Activity,
  Heart,
  Building2,
  Droplets,
  User,
  FileText,
  Stethoscope,
  Menu,
  X,
  Search,
  Bell
} from "lucide-react";

interface FloatingSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  userType?: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href: string;
  badge?: number;
}

export const FloatingSidebar = ({
  isCollapsed,
  setIsCollapsed,
  userType,
}: FloatingSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const scale = useResponsiveScale(1024, 0.65); // Minimum 65% scale
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close sidebar on path change in mobile
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const menuItems: MenuItem[] = [
    { id: "home", label: "Dashboard", icon: Home, href: "/dashboard" },
    {
      id: "chatbot",
      label: "AI Chat",
      icon: Brain,
      href: "/dashboard/chatbot",
    },
    {
      id: "mindspace",
      label: "MindSpace",
      icon: Heart,
      href: "/dashboard/mindspace",
    },
    {
      id: "exercise",
      label: "Exercise",
      icon: Cpu,
      href: "/dashboard/exercise-guidance",
    },
    {
      id: "disease-detection",
      label: "Disease Detection",
      icon: Star,
      href: "/dashboard/disease-detection",
    },
    {
      id: "government-yojana",
      label: "Government Yojana",
      icon: Building2,
      href: "/dashboard/government-yojana",
    },
    {
      id: "vaccination",
      label: "Vaccination",
      icon: Syringe,
      href: "/dashboard/vaccination-tracker",
    },
    {
      id: "ambulance",
      label: "Ambulance Services",
      icon: Ambulance,
      href: "/dashboard/ambulance-services",
    },
    {
      id: "miband",
      label: "Mi Band 4",
      icon: Watch,
      href: "/dashboard/miband",
    },
    {
      id: "fitbit",
      label: "Fitbit Dashboard",
      icon: Activity,
      href: "/dashboard/fitbit",
    },
    {
      id: "clinical-profile",
      label: "Clinical Profile",
      icon: FileText,
      href: "/dashboard/clinical-profile",
    },
    {
      id: "teleconsultation",
      label: "Teleconsultation",
      icon: Stethoscope,
      href: "/dashboard/doctor-categories",
    },
  ];

  const isActive = (href: string) => {
    // Exact match for root dashboard path
    if (href === "/dashboard") {
      return location.pathname === "/dashboard";
    }
    // For other paths, use exact match or sub-paths
    return (
      location.pathname === href || location.pathname.startsWith(href + "/")
    );
  };

  // Update active index when location changes
  useEffect(() => {
    const currentIndex = menuItems.findIndex((item) => isActive(item.href));
    setActiveIndex(currentIndex !== -1 ? currentIndex : -1);
  }, [location.pathname]);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-3 left-3 right-3 z-[60] h-14 bg-white/90 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMobileOpen((prev) => !prev)}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors shadow-sm"
          >
            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-gray-400">
            <Search size={16} />
            <span className="text-sm font-medium">Search</span>
          </div>
        </div>

        <div className="flex items-center gap-4 pr-1">
          <button className="relative text-gray-600 hover:text-gray-900 transition-colors mt-1">
            <Bell size={20} />
            <div className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white" />
          </button>
          <Avatar className="w-8 h-8 border border-gray-200">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AK</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Mobile Translate Wrapper */}
      <div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 md:translate-x-0 ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Sidebar - Always visible on desktop, scales on mobile */}
        <motion.div
          layout
          className={`absolute md:fixed left-0 top-0 bottom-0 md:left-4 md:top-4 md:bottom-4 ${isCollapsed ? "w-16" : "w-64"
            } max-h-screen`}
          animate={{ width: isCollapsed && !isMobileOpen ? 64 : 256 }}
          transition={{ duration: 0.45, ease: [0.2, 0.9, 0.2, 1] }}
          style={{
            transform: scale < 1 ? `scale(${scale})` : 'none',
            transformOrigin: 'top left',
          }}
        >
          {/* Smooth Off-White Glass Sidebar */}
          <div className="h-full sidebar-glass flex flex-col">
            {/* Logo Section */}
            <motion.div
              className="p-4 border-b border-white/30 transition-colors duration-300 flex-shrink-0"
              initial={false}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-8 h-8 bg-gradient-to-r from-[#3B82F6] to-[#14B8A6] rounded-lg flex items-center justify-center font-bold text-sm shadow-lg text-white"
                  whileHover={{ scale: 1.05 }}
                >
                  D
                </motion.div>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      className="text-lg font-bold dashboard-title transition-colors duration-300 text-gray-800"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      Dashboard
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Toggle Button */}
            <motion.button
              className="absolute -right-3 top-6 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 text-gray-600 hover:text-gray-800 z-20"
              style={{
                background: "rgba(255, 255, 255, 0.85)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                border: "1.5px solid rgba(255, 255, 255, 0.7)",
                boxShadow: "0 4px 12px rgba(17,24,39,0.06)",
              }}
              onClick={() => setIsCollapsed(!isCollapsed)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
            </motion.button>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col">
              {/* Navigation Menu */}
              <div className={`flex-1 p-3 space-y-1 relative flex flex-col ${isCollapsed ? 'justify-center items-center' : 'justify-start items-stretch'}`}>
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    className={`w-full flex items-center gap-3 transition-all duration-200 group relative z-10 ${isCollapsed ? "p-2 justify-center" : "p-3"
                      } rounded-2xl ${isActive(item.href)
                        ? "text-white bg-[#2563EB] shadow-lg"
                        : "hover:bg-white/40 text-gray-700 hover:text-gray-900"
                      }`}
                    onClick={() => navigate(item.href)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`hidden md:flex items-center justify-center rounded-full overflow-hidden flex-shrink-0 ${isCollapsed ? 'w-9 h-9' : 'w-10 h-10'} transition-all duration-200 ${isActive(item.href) ? 'bg-[#2563EB] border-transparent' : 'bg-[#eeeff4] border border-white/20 group-hover:border-white/30'}`}>
                      <item.icon
                        size={isCollapsed ? 18 : 18}
                        className={`transition-all duration-200 ${isActive(item.href) ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'}`}
                      />
                    </div>
                    <AnimatePresence>
                      {(!isCollapsed || isMobileOpen) && (
                        <motion.span
                          className="text-sm font-medium flex-1 text-left dashboard-text transition-colors duration-200 text-gray-800"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {item.badge && (!isCollapsed || isMobileOpen) && (
                      <Badge className="bg-red-500 text-white text-xs min-w-[18px] h-5 flex items-center justify-center">
                        {item.badge}
                      </Badge>
                    )}
                    {/* Active indicator dot for collapsed state */}
                    {isActive(item.href) && isCollapsed && !isMobileOpen && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full shadow-sm animate-pulse"></div>
                    )}
                    {/* Badge dot for collapsed state */}
                    {item.badge && isCollapsed && !isMobileOpen && !isActive(item.href) && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-[8px] text-white font-bold">
                          {item.badge > 9 ? "9+" : item.badge}
                        </span>
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Video Section */}
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.div
                    className="p-3 border-t border-gray-200/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex flex-col relative mt-5 h-auto pb-7">
                      <div className="flex flex-col relative mt-5 min-h-5 min-w-5 w-full">
                        <div className="relative">
                          <video
                            autoPlay
                            muted
                            controls={false}
                            playsInline
                            loop
                            className="w-full h-full object-cover object-center rounded-sm relative flex flex-col mt-5 min-h-5 min-w-5"
                          >
                            <source
                              type="video/mp4"
                              src="https://cdn.builder.io/o/assets%2Fa35bd991f0e541aa931714571cb88c16%2F671424c800a94207be9aa0b5e0a92325?alt=media&token=7a7dbbe0-724a-46f1-8b5e-83a5a7b0456d&apiKey=a35bd991f0e541aa931714571cb88c16"
                            />
                          </video>
                          <div className="w-full pt-[70.04048582995948%] pointer-events-none text-[0px]" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};
