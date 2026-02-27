/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { FloatingSidebar } from "../../components/FloatingSidebar";
import { FloatingTopBar } from "../../components/FloatingTopBar";
import { useSidebar } from "../../contexts/SidebarContext";
import { motion } from "framer-motion";

export default function FitbitDashboard() {
  const { isCollapsed, setIsCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-bg-light font-sans text-dark-primary overflow-hidden flex">
      <FloatingSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <FloatingTopBar isCollapsed={isCollapsed} />

      <motion.div
        className={`flex-1 transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-72"} pt-28 px-8 pb-8 overflow-y-auto w-full`}
        animate={{ marginLeft: isCollapsed ? 80 : 272 }}
      >
        <Header />
        <Dashboard />
      </motion.div>
    </div>
  );
}
