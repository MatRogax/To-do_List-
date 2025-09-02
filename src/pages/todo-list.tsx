import React from "react";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Calendar,
  FileText,
  AreaChart,
  LogOut,
} from "lucide-react";
import TaskMasterLogo from "../components/logo";
import TaskItem from "../components/task-Item";
import NavItem from "../components/nav-item";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";

const TodoListPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <div className="flex h-screen bg-[#111827] text-gray-200 font-sans">
      <aside className="w-64 flex-shrink-0 bg-[#1F2937] p-4 flex flex-col justify-between">
        <div>
          <div className="mb-8">
            <div className="flex items-center text-white mb-8 ml-2">
              <TaskMasterLogo width={50} height={50} />
              <span className="ml-3 text-2xl font-bold">TaskMaster</span>
            </div>
            <nav>
              <ul className="space-y-2">
                <NavItem icon={LayoutDashboard} text="Dashboard" active />
                <NavItem icon={Users} text="Team" />
                <NavItem icon={FolderKanban} text="Projects" />
                <NavItem icon={Calendar} text="Calendar" />
                <NavItem icon={FileText} text="Documents" />
                <NavItem icon={AreaChart} text="Reports" />
              </ul>
            </nav>
          </div>
          <div>
            <h3 className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Histórico de Tarefas
            </h3>
            <ul className="space-y-2">
              <TaskItem initial="A" text="tarefa 1" />
              <TaskItem initial="B" text="tarefa 2" />
              <TaskItem initial="C" text="tarefa 3" />
            </ul>
          </div>
        </div>
        <div className="pb-15">
          <ul className="space-y-2">
            <NavItem icon={LogOut} text="Sair" onClick={handleLogout} />
          </ul>
        </div>
      </aside>
      <main className="flex-1 p-6 lg:p-8"></main>
    </div>
  );
};

export default TodoListPage;
