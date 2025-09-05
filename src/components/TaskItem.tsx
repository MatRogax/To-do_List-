import { Trash } from "lucide-react";
import React from "react";
import {
  handleDeleteTask,
  handleToggleTaskStatus,
} from "../handlers/task-handlers";
import type { Task } from "../types/types";

interface TaskItemProps {
  task: Task;
  index: number;
  onEditClick: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, index, onEditClick }) => {
  return (
    <div className="relative animate-fadeIn">
      <div
        className="flex items-center py-4 px-0 cursor-pointer hover:bg-[#1F2937] transition-all duration-300 hover:shadow-md rounded-md transform hover:translate-x-1"
        onClick={() => onEditClick(task)}
      >
        <input
          type="checkbox"
          checked={task.completed}
          onChange={(e) => {
            e.stopPropagation();
            handleToggleTaskStatus(task.id, task.completed);
          }}
          className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
        />
        <span className="ml-3 text-gray-500 text-sm font-medium min-w-[2rem]">
          {index + 1}.
        </span>
        <span
          className={`flex-1 ${
            task.completed ? "line-through text-gray-500" : "text-white"
          }`}
        >
          {task.title}
        </span>
        {task.important && <span className="ml-2 text-red-500">⭐</span>}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteTask(task.id);
          }}
          className="ml-3 mr-2.5 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Trash className="cursor-pointer" size={18} />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
