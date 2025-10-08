import React from "react";
import Link from "next/link";
import classNames from "classnames";

type NavigationItem = {
  name: string;
  href: string;
  icon: React.ReactNode;
};

type NavigationProps = {
  navigation: NavigationItem[];
  isActive: (href: string) => boolean;
};

const Navigation: React.FC<NavigationProps> = ({ navigation, isActive }) => {
  return (
    <div className="hidden lg:flex lg:flex-shrink-0 min-h-screen">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
          <nav className="flex-1 flex flex-col">
            <div className="px-4 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    "group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200 text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                    {
                      "bg-blue-100 text-blue-700 border-r-2 border-blue-600":
                        isActive(item.href)
                    }
                  )}
                >
                  <div
                    className={`mr-3 ${
                      isActive(item.href)
                        ? "text-blue-600"
                        : "text-gray-400 group-hover:text-gray-500"
                    }`}
                  >
                    {item.icon}
                  </div>
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
