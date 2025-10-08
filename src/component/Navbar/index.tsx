// Navbar.jsx
import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md w-full z-10 hidden lg:flex">
      <div className="flex h-16 items-center">
        <div className="hidden md:flex space-x-6">
          {/* Add nav links here */}
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="ml-3 text-xl font-bold text-gray-900">Dashboard</h1>
          </div>
        </div>
        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button className="text-gray-700 focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
