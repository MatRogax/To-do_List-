import { signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import type { FilterType, Task } from "../types/types";

interface FirebaseError {
  code: string;
  message: string;
}

export const handleLogout = async (
  navigate: (path: string) => void,
  startLoading?: () => void,
  stopLoading?: () => void
): Promise<void> => {
  try {
    if (startLoading) startLoading();
    await signOut(auth);
    navigate("/");
  } catch (error) {
    console.error("Error logging out:", error);
  } finally {
    if (stopLoading) stopLoading();
  }
};

export const handleDeleteList = async (
  listId: string,
  activeFilter: FilterType,
  setActiveFilter: (filter: FilterType) => void,
  currentUserId?: string
) => {
  try {
    if (activeFilter === listId) {
      setActiveFilter("inbox");
    }

    if (!currentUserId) return;

    const batch = writeBatch(db);
    const tasksToDeleteQuery = query(
      collection(db, "tasks"),
      where("listId", "==", listId),
      where("userId", "==", currentUserId)
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

export const handleDeleteTask = async (taskId: string) => {
  const taskDocRef = doc(db, "tasks", taskId);
  try {
    await deleteDoc(taskDocRef);
  } catch (error) {
    console.error("Erro ao apagar tarefa: ", error);
  }
};

export const handleToggleTaskStatus = async (
  taskId: string,
  completed: boolean
) => {
  try {
    await updateDoc(doc(db, "tasks", taskId), {
      completed: !completed,
    });
  } catch (error) {
    console.error("Erro ao atualizar status da tarefa:", error);
  }
};

export const handleAddTask = async (
  title: string,
  activeFilter: FilterType,
  currentUserId: string,
  completed: boolean = false
) => {
  if (!title.trim() || !currentUserId) {
    return false;
  }

  try {
    const newTaskData = {
      title: title.trim(),
      completed: completed,
      createdAt: Timestamp.now(),
      userId: currentUserId,
      dueDate: activeFilter === "today" ? Timestamp.fromDate(new Date()) : null,
      listId: ["inbox", "today", "completed", "calendar", "important"].includes(
        activeFilter
      )
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

export const handleAddList = async (name: string, currentUserId: string) => {
  if (!name.trim() || !currentUserId) {
    console.error("Nome vazio ou usuário não logado");
    return false;
  }

  try {
    console.log("Criando nova lista:", name);
    const newListData = {
      name: name.trim(),
      createdAt: Timestamp.now(),
      userId: currentUserId,
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

export const getFilteredTasks = (
  tasks: Task[],
  activeFilter: FilterType,
  searchQuery: string,
  customLists: { id: string }[]
) => {
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
      const isCustomList = customLists.some((list) => list.id === activeFilter);
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

export const getActiveFilterLabel = (
  activeFilter: FilterType,
  customLists: { id: string; name: string }[],
  tasks: Task[]
) => {
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
      const list = customLists.find((list) => list.id === activeFilter);
      if (list) {
        return list.name;
      }
      const task = tasks.find((task) => task.id === activeFilter);
      if (task) {
        return task.title;
      }
      return "Lista";
    }
  }
};
