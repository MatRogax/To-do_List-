import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  LogOut,
  CheckCircle,
  Plus,
  Trash,
} from "lucide-react";
import TaskMasterLogo from "../components/logo";
import NavItem from "../components/nav-item";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../config/firebase";
import Button from "../components/ui/button";
import Search from "../components/ui/search";
import { useAuth } from "../hooks/use-auth";
import Footer from "../components/footer";
import {
  collection,
  Timestamp,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  writeBatch,
  getDocs,
} from "firebase/firestore";
import NewListModal from "../components/modalDialog";
import TaskModal from "../components/task-modal";

interface FirebaseError {
  code: string;
  message: string;
}

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

interface List {
  id: string;
  name: string;
  userId: string;
  createdAt: Timestamp;
}

type FilterType =
  | "inbox"
  | "today"
  | "completed"
  | "calendar"
  | "important"
  | string;

const TodoListPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [customLists, setCustomLists] = useState<List[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>("inbox");

  const [isNewListModalOpen, setIsNewListModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isListsExpanded, setIsListsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (!currentUser) return;

    const tasksQuery = query(
      collection(db, "tasks"),
      where("userId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(tasksQuery, (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Task[];
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    const listsQuery = query(
      collection(db, "lists"),
      where("userId", "==", currentUser.uid)
    );

    const unsubscribe = onSnapshot(listsQuery, (snapshot) => {
      const listsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as List[];
      setCustomLists(listsData);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  const handleDeleteList = async (listId: string) => {
    try {
      if (activeFilter === listId) {
        setActiveFilter("inbox");
      }

      const batch = writeBatch(db);
      const tasksToDeleteQuery = query(
        collection(db, "tasks"),
        where("listId", "==", listId),
        where("userId", "==", currentUser?.uid)
      );
      const tasksSnapshot = await getDocs(tasksToDeleteQuery);

      tasksSnapshot.forEach((taskDoc) => {
        batch.delete(taskDoc.ref);
      });

      const listRef = doc(db, "lists", listId);
      batch.delete(listRef);

      await batch.commit();
    } catch (error) {
      console.error("Erro ao apagar a lista e as suas tarefas:", error);
      alert("Não foi possível apagar a lista.");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const taskDocRef = doc(db, "tasks", taskId);
    try {
      await deleteDoc(taskDocRef);
    } catch (error) {
      console.error("Erro ao apagar tarefa: ", error);
    }
  };

  const handleOpenNewTaskModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleOpenEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleToggleTaskStatus = async (taskId: string, completed: boolean) => {
    try {
      await updateDoc(doc(db, "tasks", taskId), {
        completed: !completed,
      });
    } catch (error) {
      console.error("Erro ao atualizar status da tarefa:", error);
    }
  };

  const handleAddTask = async (title: string, completed: boolean = false) => {
    if (!title.trim() || !currentUser) {
      console.error("Título vazio ou usuário não logado");
      return false;
    }

    try {
      console.log("Criando nova tarefa com filtro:", activeFilter);
      const newTaskData = {
        title: title.trim(),
        completed: completed,
        createdAt: Timestamp.now(),
        userId: currentUser.uid,
        dueDate:
          activeFilter === "today" ? Timestamp.fromDate(new Date()) : null,
        listId: [
          "inbox",
          "today",
          "completed",
          "calendar",
          "important",
        ].includes(activeFilter)
          ? null
          : activeFilter,
        important: activeFilter === "important",
      };

      console.log("Dados da nova tarefa:", newTaskData);
      const docRef = await addDoc(collection(db, "tasks"), newTaskData);
      console.log("Tarefa criada com sucesso, ID:", docRef.id);
      return true;
    } catch (error: unknown) {
      console.error("Erro ao criar tarefa:", error);
      if (error && typeof error === "object" && "code" in error) {
        const firebaseError = error as FirebaseError;
        switch (firebaseError.code) {
          case "permission-denied":
            alert("Erro: Permissão negada. Verifique as regras do Firestore.");
            break;
          case "unauthenticated":
            alert("Erro: Usuário não autenticado. Faça login novamente.");
            break;
          case "invalid-argument":
            alert("Erro: Argumentos inválidos. Verifique os dados da tarefa.");
            break;
          case "failed-precondition":
            alert(
              "Erro: Condição prévia falhou. Verifique a configuração do Firebase."
            );
            break;
          default:
            alert(
              `Erro do Firebase (${firebaseError.code}): ${firebaseError.message}`
            );
        }
      } else {
        alert("Erro ao criar tarefa. Tente novamente.");
      }
      return false;
    }
  };

  const handleAddList = async (name: string) => {
    if (!name.trim() || !currentUser) {
      console.error("Nome vazio ou usuário não logado");
      return false;
    }

    try {
      console.log("Criando nova lista:", name);
      const newListData = {
        name: name.trim(),
        createdAt: Timestamp.now(),
        userId: currentUser.uid,
      };

      console.log("Dados da nova lista:", newListData);
      const docRef = await addDoc(collection(db, "lists"), newListData);
      console.log("Lista criada com sucesso, ID:", docRef.id);
      return true;
    } catch (error: unknown) {
      console.error("Erro ao criar lista:", error);
      alert("Erro ao criar lista. Tente novamente.");
      return false;
    }
  };

  const getFilteredTasks = () => {
    let filtered = tasks;

    if (searchQuery.trim()) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    switch (activeFilter) {
      case "today": {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return filtered.filter((task) => {
          const taskCreatedDate = task.createdAt.toDate();
          taskCreatedDate.setHours(0, 0, 0, 0);
          const isCreatedToday = taskCreatedDate.getTime() === today.getTime();
          const hasDueDateToday =
            task.dueDate &&
            task.dueDate.toDate().setHours(0, 0, 0, 0) === today.getTime();

          return isCreatedToday || hasDueDateToday;
        });
      }
      case "completed":
        return filtered.filter((task) => task.completed);
      case "important":
        return filtered.filter((task) => task.important);
      case "inbox":
        return filtered.filter((task) => !task.listId && !task.completed);
      default: {
        const isCustomList = customLists.some(
          (list) => list.id === activeFilter
        );
        if (isCustomList) {
          return filtered.filter((task) => task.listId === activeFilter);
        }
        const selectedTask = tasks.find((task) => task.id === activeFilter);
        if (selectedTask) {
          return filtered.filter((task) => task.id === activeFilter);
        }
        return filtered.filter((task) => task.listId === activeFilter);
      }
    }
  };

  const getActiveFilterLabel = () => {
    switch (activeFilter) {
      case "inbox":
        return "Inbox";
      case "today":
        return "Hoje";
      case "completed":
        return "Completado";
      case "calendar":
        return "Calendário";
      case "important":
        return "Importante";
      default: {
        const list = customLists.find((l) => l.id === activeFilter);
        if (list) {
          return list.name;
        }
        const task = tasks.find((t) => t.id === activeFilter);
        if (task) {
          return task.title;
        }
        return "Lista";
      }
    }
  };

  const filteredTasks = getFilteredTasks().sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return b.createdAt.toMillis() - a.createdAt.toMillis();
  });

  return (
    <>
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
                            handleDeleteList(list.id);
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
            <Button onClick={() => setIsNewListModalOpen(true)}>
              Adicionar Lista
            </Button>
            <ul className="pt-5 space-y-2">
              <NavItem icon={LogOut} text="Sair" onClick={handleLogout} />
            </ul>
          </div>
        </aside>
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex-1 max-w-2xl">
                <Search
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="Search tasks and lists..."
                />
              </div>
              <button
                onClick={handleOpenNewTaskModal}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors ml-4"
              >
                <Plus className="w-5 h-5" />
                New Task
              </button>
            </div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                {getActiveFilterLabel()}
              </h1>
              <p className="text-gray-400">
                {filteredTasks.length}{" "}
                {filteredTasks.length === 1 ? "tarefa" : "tarefas"}
              </p>
            </div>
            <div className="space-y-0">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <p>Nenhuma tarefa encontrada.</p>
                  <p className="text-sm mt-2">
                    Adicione uma nova tarefa para começar!
                  </p>
                </div>
              ) : (
                filteredTasks.map((task, index) => (
                  <div key={task.id} className="relative">
                    <div
                      className="flex items-center py-4 px-0 cursor-pointer hover:bg-[#1F2937] transition-colors"
                      onClick={() => handleOpenEditTaskModal(task)}
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
                          task.completed
                            ? "line-through text-gray-500"
                            : "text-white"
                        }`}
                      >
                        {task.title}
                      </span>
                      {task.important && (
                        <span className="ml-2 text-red-500">⭐</span>
                      )}
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
                    {index < filteredTasks.length - 1 && (
                      <div className="h-px bg-gray-600 ml-8"></div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      <NewListModal
        isOpen={isNewListModalOpen}
        onClose={() => setIsNewListModalOpen(false)}
        onAddList={handleAddList}
      />
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={handleCloseTaskModal}
        task={editingTask}
        onAddTask={handleAddTask}
      />
      <Footer />
    </>
  );
};

export default TodoListPage;
