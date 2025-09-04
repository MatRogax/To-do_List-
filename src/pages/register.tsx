import Button from "../components/ui/button.js";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import InputField from "../components/ui/input.js";

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

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/todo-list");
    } catch (err: unknown) {
      if (err === "auth/email-already-in-use") {
        setError("Email já está em uso.");
      } else if (err === "auth/weak-password") {
        setError("A senha deve ter pelo menos 6 caracteres.");
      } else {
        setError("Ocorreu um erro ao criar a conta.");
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 bg-gray-900">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center">
        <header className="pl-10 flex items-center justify-start">
          <TaskMasterLogo />
          <h1 className="mt-8 text-3xl font-bold text-white">TaskMaster</h1>
        </header>
        <h2 className="mt-8 text-1.5xl font-bold tracking-tight text-white">
          Crie Sua Conta
        </h2>
        <p className="mt-2.5 font-bold text-sm text-gray-600">
          Transforme a sua produtividade e organize suas tarefas
        </p>
      </div>
      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <InputField
            id="email"
            icon={Mail}
            label="Email"
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
          <InputField
            id="password"
            icon={Lock}
            label="Senha"
            type="password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
          <InputField
            id="confirm-password"
            label="Confirmar Senha"
            type="password"
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setConfirmPassword(e.target.value)
            }
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div className="mt-7">
            <Button type="submit">Registrar</Button>
          </div>
        </form>
        <div className="mt-5 font-bold text-sm flex justify-center items-center text-gray-600">
          <p>Já possui uma conta?</p>
          <Link
            to="/"
            className="pl-1 text-[#1466b7] hover:text-blue-400 transition-all duration-300 ease-in-out hover:scale-105"
          >
            Faça login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
