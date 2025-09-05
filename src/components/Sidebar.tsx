import {
  Calendar,
  CheckCircle,
  FileText,
  LayoutDashboard,
  LogOut,
  Trash,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { handleDeleteList, handleLogout } from "../handlers/task-handlers";
import type { FilterType, List } from "../types/types";
import TaskMasterLogo from "./logo";
import NavItem from "./nav-item";
import Button from "./ui/button";

interface SidebarProps {
  activeFilter: FilterType;
  setActiveFilter: (filter: FilterType) => void;
  customLists: List[];
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  onNewListClick: () => void;
  currentUserId?: string;
  navigate: (path: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeFilter,
  setActiveFilter,
  customLists,
  isMobileMenuOpen,
  toggleMobileMenu,
  onNewListClick,
  currentUserId,
  navigate,
}) => {
  const [isListsExpanded, setIsListsExpanded] = useState(true);

  return (
    <>
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-700 p-2 rounded-md text-white"
      >
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
            strokeWidth={2}
            d={
              isMobileMenuOpen
                ? "M6 18L18 6M6 6l12 12"
                : "M4 6h16M4 12h16M4 18h16"
            }
          />
        </svg>
      </button>
      <aside
        className={`${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-64 flex-shrink-0 bg-[#1F2937] p-4 flex flex-col justify-between fixed md:static h-full z-40 transition-transform duration-300 ease-in-out`}
      >
        <div>
          <div className="mb-8">
            <div className="flex items-center text-white mb-8 ml-2">
              <TaskMasterLogo width={50} height={50} />
              <span className="ml-3 text-2xl font-bold">TaskMaster</span>
            </div>
            <nav>
              <ul className="space-y-2">
                <NavItem
                  icon={LayoutDashboard}
                  text="Inbox"
                  active={activeFilter === "inbox"}
                  onClick={() => setActiveFilter("inbox")}
                />
                <NavItem
                  icon={Users}
                  text="Hoje"
                  active={activeFilter === "today"}
                  onClick={() => setActiveFilter("today")}
                />
                <NavItem
                  icon={CheckCircle}
                  text="Completado"
                  active={activeFilter === "completed"}
                  onClick={() => setActiveFilter("completed")}
                />
                <NavItem
                  icon={Calendar}
                  text="Calendário"
                  active={activeFilter === "calendar"}
                  onClick={() => setActiveFilter("calendar")}
                />
                <NavItem
                  icon={FileText}
                  text="Importante"
                  active={activeFilter === "important"}
                  onClick={() => setActiveFilter("important")}
                />
              </ul>
            </nav>
          </div>
          <div>
            <button
              onClick={() => setIsListsExpanded(!isListsExpanded)}
              className="flex items-center px-2 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 hover:text-gray-400 transition-colors w-full text-left"
            >
              <span className="mr-2 transition-transform duration-200">
                {isListsExpanded ? "▼" : "▶"}
              </span>
              Listas
            </button>
            {isListsExpanded && (
              <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pr-2">
                <ul className="space-y-2">
                  {customLists.map((list) => (
                    <li
                      key={list.id}
                      onClick={() => setActiveFilter(list.id)}
                      className={`group flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                        activeFilter === list.id
                          ? "bg-gray-700 text-white"
                          : "text-gray-400 hover:bg-gray-700 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center flex-1 overflow-hidden mr-2">
                        <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 mr-3 text-xs font-bold text-gray-300 bg-gray-600 rounded-md">
                          {list.name.charAt(0).toUpperCase()}
                        </span>
                        <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">
                          {list.name}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteList(
                            list.id,
                            activeFilter,
                            setActiveFilter,
                            currentUserId || ""
                          );
                        }}
                        className="flex-shrink-0 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash className="cursor-pointer " size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="pb-5">
          <Button onClick={onNewListClick}>Adicionar Lista</Button>
          <ul className="pt-5 space-y-2">
            <NavItem
              icon={LogOut}
              text="Sair"
              onClick={() => {
                handleLogout(navigate);
              }}
            />
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
