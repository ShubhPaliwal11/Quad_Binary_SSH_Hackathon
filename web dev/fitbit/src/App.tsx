/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";

export default function App() {
  return (
    <div className="flex min-h-screen bg-bg-light font-sans text-dark-primary">
      <Sidebar />
      <main className="flex-1 flex flex-col px-8 pb-8 overflow-y-auto">
        <Header />
        <Dashboard />
      </main>
    </div>
  );
}
