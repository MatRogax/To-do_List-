// src/components/NavItem.tsx

import React from "react";

interface NavItemProps {
  text: string;
  active?: boolean;
  icon?: React.ElementType;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({
  text,
  active = false,
  icon: Icon,
  onClick,
}) => (
  <li>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        if (onClick) {
          onClick();
        }
      }}
      className={`flex items-center p-2 rounded-md transition-colors cursor-pointer ${
        active
          ? "bg-gray-700 text-white"
          : "text-gray-400 hover:bg-gray-700 hover:text-white"
      }`}
    >
      {Icon && <Icon className="w-5 h-5 mr-3" />}
      <span>{text}</span>
    </a>
  </li>
);

export default NavItem;
