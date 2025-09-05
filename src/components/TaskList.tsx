import React from "react";
import { Plus } from "lucide-react";
import Search from "./ui/search";
import TaskItem from "./TaskItem";
import { getActiveFilterLabel } from "../handlers/task-handlers";
import type { FilterType, Task } from "../types/types";

interface TaskListProps {
  tasks: Task[];
  activeFilter: FilterType;
  customLists: { id: string; name: string }[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onNewTaskClick: () => void;
  onEditTaskClick: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  activeFilter,
  customLists,
  searchQuery,
  setSearchQuery,
  onNewTaskClick,
  onEditTaskClick,
}) => {
  const activeFilterLabel = getActiveFilterLabel(activeFilter, customLists, tasks);

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto md:ml-0 ml-0 transition-all duration-300 ease-in-out">
      <div className="max-w-4xl mx-auto pt-12 md:pt-0">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div className="flex-1 w-full max-w-2xl">
            <Search
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search tasks and lists..."
            />
          </div>
          <button
            onClick={onNewTaskClick}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors w-full md:w-auto md:ml-4"
          >
            <Plus className="w-5 h-5" />
            New Task
          </button>
        </div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {activeFilterLabel}
          </h1>
          <p className="text-gray-400">
            {tasks.length}{" "}
            {tasks.length === 1 ? "tarefa" : "tarefas"}
          </p>
        </div>
        <div className="space-y-0">
          {tasks.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p>Nenhuma tarefa encontrada.</p>
              <p className="text-sm mt-2">
                Adicione uma nova tarefa para começar!
              </p>
            </div>
          ) : (
            tasks.map((task, index) => (
              <React.Fragment key={task.id}>
                <TaskItem 
                  task={task} 
                  index={index} 
                  onEditClick={onEditTaskClick} 
                />
                {index < tasks.length - 1 && (
                  <div className="h-px bg-gray-600 ml-8"></div>
                )}
              </React.Fragment>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default TaskList;