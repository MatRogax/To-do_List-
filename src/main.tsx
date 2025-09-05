import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import TodoListPage from "./pages/todo-list";
import { AuthProvider } from "./context/auth-context";
import { LoadingProvider } from "./context/loading-context";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/todo-list",
    element: <TodoListPage />,
  },
]);

// Adiciona classe de animação global para transições de página
import.meta.hot?.accept();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <LoadingProvider>
        <div className="animate-fadeIn">
          <RouterProvider router={router} />
        </div>
      </LoadingProvider>
    </AuthProvider>
  </React.StrictMode>
);
