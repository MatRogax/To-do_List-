import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Timestamp, doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../hooks/use-auth";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Timestamp;
  userId: string;
  dueDate?: Timestamp | null;
  listId?: string | null;
  important?: boolean;
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  onAddTask?: (title: string, completed?: boolean) => Promise<boolean>;
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  task,
  onAddTask,
}) => {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<"completed" | "pending">("pending");
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = !!task;

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setStatus(task.completed ? "completed" : "pending");
    } else {
      setTitle("");
      setStatus("pending");
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      console.error("Título vazio");
      return;
    }
    if (!currentUser) {
      console.error("Usuário não logado");
      alert("Você precisa estar logado para adicionar ou editar tarefas.");
      return;
    }
    setIsLoading(true);
    try {
      const trimmedTitle = title.trim();
      if (isEditMode && task) {
        await updateDoc(doc(db, "tasks", task.id), {
          title: trimmedTitle,
          completed: status === "completed",
        });
        console.log("Tarefa atualizada com sucesso");
      } else {
        if (!onAddTask) {
          console.error("Função onAddTask não foi fornecida");
          alert("Erro: Função de adicionar tarefa não disponível.");
          return;
        }
        const success = await onAddTask(trimmedTitle, false);
        if (!success) {
          console.error("Erro ao adicionar tarefa");
          alert("Não foi possível adicionar a tarefa.");
          return;
        }
      }
      setTitle("");
      onClose();
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
      alert("Erro ao salvar tarefa. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1F2937] rounded-lg shadow-xl w-full max-w-md mx-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-600">
          <h2 className="text-xl font-bold text-white">
            {isEditMode ? "Editar Tarefa" : "Nova Tarefa"}
          </h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Título da Tarefa
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título da tarefa..."
              className="w-full px-4 py-3 bg-[#2D3748] border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              disabled={isLoading}
              required
            />
          </div>
          {isEditMode && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStatus("completed")}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    status === "completed"
                      ? "bg-gray-300 text-gray-800"
                      : "bg-[#2D3748] border border-gray-600 text-gray-300 hover:bg-gray-600"
                  }`}
                  disabled={isLoading}
                >
                  Concluída
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("pending")}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                    status === "pending"
                      ? "bg-gray-300 text-gray-800"
                      : "bg-[#2D3748] border border-gray-600 text-gray-300 hover:bg-gray-600"
                  }`}
                  disabled={isLoading}
                >
                  Pendente
                </button>
              </div>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 bg-[#2D3748] border border-gray-600 text-gray-300 rounded-lg font-medium hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!title.trim() || isLoading}
              className="px-4 py-2 bg-[#2D3748] border border-gray-600 text-gray-300 rounded-lg font-medium hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
