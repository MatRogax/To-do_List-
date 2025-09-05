import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../hooks/use-auth";
import Footer from "../components/footer";
import NewListModal from "../components/modalDialog";
import TaskModal from "../components/task-modal";
import Sidebar from "../components/Sidebar";
import TaskList from "../components/TaskList";
import type { FilterType, List, Task } from "../types/types";
import { getFilteredTasks, handleAddList, handleAddTask } from "../handlers/task-handlers";

const TodoListPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [customLists, setCustomLists] = useState<List[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>("inbox");

  const [isNewListModalOpen, setIsNewListModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
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

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const filteredTasks = getFilteredTasks(tasks, activeFilter, searchQuery, customLists);

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

  return (
    <>
      <div className="flex h-screen bg-[#111827] text-white overflow-hidden">
        <Sidebar
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          customLists={customLists}
          isMobileMenuOpen={isMobileMenuOpen}
          toggleMobileMenu={toggleMobileMenu}
          onNewListClick={() => setIsNewListModalOpen(true)}
          currentUserId={currentUser?.uid}
          navigate={navigate}
        />
        
        <TaskList
          tasks={filteredTasks}
          activeFilter={activeFilter}
          customLists={customLists}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onNewTaskClick={handleOpenNewTaskModal}
          onEditTaskClick={handleOpenEditTaskModal}
        />
      </div>

      <NewListModal
        isOpen={isNewListModalOpen}
        onClose={() => setIsNewListModalOpen(false)}
        onAddList={(name) => handleAddList(name, currentUser?.uid || "")}
      />
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={handleCloseTaskModal}
        task={editingTask}
        onAddTask={(title) => handleAddTask(title, activeFilter, currentUser?.uid || "")}
      />
      <Footer />
    </>
  );
};

export default TodoListPage;
