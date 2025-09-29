// components/Sidebar.tsx
"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { navigation } from "@/lib/sidebaritem";
import Navigation from "./Navigation";
import MobileNavigation from "./MobileNavigation";

export default function Sidebar() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Sidebar for desktop */}
      <Navigation isActive={isActive} navigation={navigation} />

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <MobileNavigation
          isActive={isActive}
          navigation={navigation}
          setSidebarOpen={setSidebarOpen}
        />
      )}
    </>
  );
}
