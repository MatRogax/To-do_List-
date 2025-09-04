import React from "react";

interface TaskItemProps {
  initial: string;
  text: string;
  active?: boolean;
  onClick?: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ initial, text, active = false, onClick }) => (
  <li>
    <button
      onClick={onClick}
      className={`flex items-center w-full p-2 text-gray-400 rounded-md hover:bg-gray-700 hover:text-white transition-colors ${
        active ? 'bg-gray-700 text-white' : ''
      }`}
    >
      <span className="flex items-center justify-center w-6 h-6 mr-3 text-xs font-bold text-gray-300 bg-gray-600 rounded-md">
        {initial}
      </span>
      <span>{text}</span>
    </button>
  </li>
);

export default TaskItem;
