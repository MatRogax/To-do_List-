import { signInWithEmailAndPassword } from "firebase/auth";
import { Lock, Mail } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TaskMasterLogo from "../components/logo.js";
import Button from "../components/ui/button.js";
import InputField from "../components/ui/input.js";
import { auth } from "../config/firebase";
import { useLoading } from "../context/loading-context";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoading();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    startLoading("Fazendo login...");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/todo-list");
      stopLoading();
    } catch (err: unknown) {
      if (err == "auth/user-not-found" || err == "auth/wrong-password") {
        setError("Email ou senha inválidos.");
      } else {
        setError("Ocorreu um erro ao fazer login.");
      }
      console.error("Erro no login:", err);
      stopLoading();
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
        <header className="pl-10 flex items-center justify-start">
          <TaskMasterLogo />
          <h1 className="mt-8 text-3xl font-bold text-white">TaskMaster</h1>
        </header>
        <div className="mt-2 font-bold text-sm flex justify-center items-center text-gray-600">
          <p className="text-gray-600">Novo por aqui?</p>
          <Link
            to="/register"
            className="pl-1 text-[#1466b7] hover:text-blue-400 transition-all duration-300 ease-in-out hover:scale-105"
          >
            Crie sua conta
          </Link>
        </div>
      </div>
      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <InputField
            id="email"
            label="Email"
            type="email"
            icon={Mail}
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
          <InputField
            id="password"
            label="senha"
            type="password"
            icon={Lock}
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
          {error && (
            <p className="text-red-500 text-sm text-center -mt-2">{error}</p>
          )}

          <Button type="submit">Login</Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
