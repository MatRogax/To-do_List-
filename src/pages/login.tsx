// src/pages/LoginPage.tsx

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import InputField from "../components/ui/input.js";
import Button from "../components/ui/button.js";

// Tipagem do componente do Logo
const TaskMasterLogo: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="100"
    height="100"
    viewBox="0 0 48 48"
  >
    <path
      fill="#185abd"
      d="M24.48,29.316l-9.505,9.505L1.588,25.434c-0.784-0.784-0.784-2.054,0-2.838l6.667-6.667 c0.784-0.784,2.054-0.784,2.838,0L24.48,29.316z"
    ></path>
    <linearGradient
      id="5qKAcydctVb3hkGT27jhwa_HpPqCqynotVp_gr1"
      x1="14.572"
      x2="43.188"
      y1="38.199"
      y2="9.583"
      gradientUnits="userSpaceOnUse"
    >
      <stop offset="0" stop-color="#4191fd"></stop>
      <stop offset="1" stop-color="#55acfd"></stop>
    </linearGradient>
    <path
      fill="url(#5qKAcydctVb3hkGT27jhwa_HpPqCqynotVp_gr1)"
      d="M17.797,41.642l-6.667-6.667c-0.784-0.784-0.784-2.054,0-2.838L36.907,6.358  c0.784-0.784,2.054-0.784,2.838,0l6.667,6.667c0.784,0.784,0.784,2.054,0,2.838L20.634,41.642  C19.851,42.425,18.58,42.425,17.797,41.642z"
    ></path>
  </svg>
);

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/todo-list");
    } catch (err: unknown) {
      if (err == "auth/user-not-found" || err == "auth/wrong-password") {
        setError("Email ou senha inválidos.");
      } else {
        setError("Ocorreu um erro ao fazer login.");
      }
      console.error("Erro no login:", err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
        <header className="pl-10 flex items-center justify-start">
          <TaskMasterLogo />
          <h1 className="mt-8 text-3xl font-bold text-white">TaskMaster</h1>
        </header>
        <h2 className="mt-6 text-2xl font-bold tracking-tight text-white">
          Bem Vindo de Volta
        </h2>

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
          <div className="flex items-center justify-end">
            <Link
              to="/forgot-password"
              className="text-sm font-semibold text-[#1466b7] hover:text-blue-400 transition-all duration-300 ease-in-out hover:scale-105"
            >
              Esqueceu a senha?
            </Link>
          </div>
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
