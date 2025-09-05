import { createContext, useContext, useState, type ReactNode } from "react";
import Loading from "../components/ui/loading";

interface LoadingContextType {
  isLoading: boolean;
  startLoading: (message?: string) => void;
  stopLoading: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("Carregando...");

  const startLoading = (message?: string) => {
    if (message) {
      setLoadingMessage(message);
    }
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
    setLoadingMessage("Carregando...");
  };

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading }}>
      {isLoading && <Loading fullScreen size="large" text={loadingMessage} />}
      {children}
    </LoadingContext.Provider>
  );
};
