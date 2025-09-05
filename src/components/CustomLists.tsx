import { Trash } from "lucide-react";
import React from "react";
import { handleDeleteList } from "../handlers/task-handlers";
import type { FilterType, List } from "../types/types";

interface CustomListsProps {
  isListsExpanded: boolean;
  setIsListsExpanded: (expanded: boolean) => void;
  customLists: List[];
  activeFilter: FilterType;
  setActiveFilter: (filter: FilterType) => void;
  currentUserId?: string;
}

const CustomLists: React.FC<CustomListsProps> = ({
  isListsExpanded,
  setIsListsExpanded,
  customLists,
  activeFilter,
  setActiveFilter,
  currentUserId,
}) => {
  return (
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
  );
};

export default CustomLists;
