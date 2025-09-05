import { createUserWithEmailAndPassword } from "firebase/auth";
import { Lock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TaskMasterLogo from "../components/logo.js";
import Button from "../components/ui/button.js";
import InputField from "../components/ui/input.js";
import { auth } from "../config/firebase";
import { useLoading } from "../context/loading-context";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);

  const navigate = useNavigate();
  const { startLoading, stopLoading } = useLoading();

  const validatePasswords = () => {
    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        setPasswordsMatch(false);
        setError("As senhas não coincidem.");
      } else {
        setPasswordsMatch(true);
        setError("");
      }
    }
  };

  useEffect(() => {
    validatePasswords();
  }, [password, confirmPassword]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    validatePasswords();

    if (!passwordsMatch || password !== confirmPassword) {
      return;
    }

    startLoading("Criando sua conta...");
    
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/todo-list");
      stopLoading();
    } catch (err: unknown) {
      if (err === "auth/email-already-in-use") {
        setError("Email já está em uso.");
      } else if (err === "auth/weak-password") {
        setError("A senha deve ter pelo menos 6 caracteres.");
      } else {
        setError("Ocorreu um erro ao criar a conta.");
      }
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
            }}
          />
          <InputField
            id="confirm-password"
            icon={Lock}
            label="Confirmar Senha"
            type="password"
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setConfirmPassword(e.target.value);
            }}
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
