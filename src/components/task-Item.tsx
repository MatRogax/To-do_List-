import React from "react";

interface TaskItemProps {
  initial: string;
  text: string;
}

const TaskItem: React.FC<TaskItemProps> = ({ initial, text }) => (
  <li>
    <a
      href="#"
      className="flex items-center p-2 text-gray-400 rounded-md hover:bg-gray-700 hover:text-white transition-colors"
    >
      <span className="flex items-center justify-center w-6 h-6 mr-3 text-xs font-bold text-gray-300 bg-gray-600 rounded-md">
        {initial}
      </span>
      <span>{text}</span>
    </a>
  </li>
);

export default TaskItem;
