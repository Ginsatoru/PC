import React from "react";
import { Link } from "react-router-dom";

const QuickActions = () => {
  const actions = [
    {
      label: "Browse Products",
      href: "/products",
      bgColor: "bg-blue-600 hover:bg-blue-700",
      description: "Explore all available PC parts",
    },
    {
      label: "View Cart",
      href: "/cart",
      bgColor: "bg-green-600 hover:bg-green-700",
      description: "Check items in your cart",
    },
    {
      label: "Shop CPUs",
      href: "/category/CPU",
      bgColor: "bg-purple-600 hover:bg-purple-700",
      description: "Browse processors",
    },
    {
      label: "Shop GPUs",
      href: "/category/GPU",
      bgColor: "bg-red-600 hover:bg-red-700",
      description: "Browse graphics cards",
    },
    {
      label: "Shop RAM",
      href: "/category/RAM",
      bgColor: "bg-indigo-600 hover:bg-indigo-700",
      description: "Browse memory modules",
    },
    {
      label: "Shop Storage",
      href: "/category/SSD",
      bgColor: "bg-orange-600 hover:bg-orange-700",
      description: "Browse SSDs and storage",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.href}
            className={`${action.bgColor} text-white p-3 rounded-lg text-center transition duration-200 shadow-sm hover:shadow-md group`}
            title={action.description}
          >
            <div className="text-sm font-medium group-hover:scale-105 transition-transform duration-200">
              {action.label}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
