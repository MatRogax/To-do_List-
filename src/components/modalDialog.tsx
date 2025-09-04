import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import Button from "./ui/button";
import InputField from "./ui/input";

interface NewListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddList?: (name: string) => Promise<boolean>;
}

const NewListModal: React.FC<NewListModalProps> = ({
  isOpen,
  onClose,
  onAddList,
}) => {
  const [listName, setListName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateList = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (listName.trim() === "") {
      setError("O nome da lista não pode estar vazio.");
      return;
    }

    if (!onAddList) {
      setError("Função de adicionar lista não disponível.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const success = await onAddList(listName.trim());
      if (success) {
        setListName("");
        onClose();
      } else {
        setError("Não foi possível criar a lista.");
      }
    } catch (err) {
      console.error("Erro ao criar a lista:", err);
      setError("Não foi possível criar a lista.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-black/60 data-[state=open]:animate-overlayShow fixed inset-0 z-40" />
        <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-[#1F2937] border border-gray-600 p-6 shadow-lg focus:outline-none z-50">
          <Dialog.Title className="text-white m-0 text-xl font-bold">
            Nova Lista
          </Dialog.Title>
          <Dialog.Description className="text-gray-400 mt-2 mb-5 text-sm leading-normal">
            Introduza um nome para a sua nova lista de tarefas.
          </Dialog.Description>

          <form onSubmit={handleCreateList}>
            <fieldset className="mb-5">
              <InputField
                id="listName"
                label="Nome da Lista"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                placeholder="ex: Compras de Supermercado"
              />
            </fieldset>

            {error && (
              <p className="text-red-500 text-xs text-center mb-4">{error}</p>
            )}

            <div className="flex justify-end gap-4">
              <Dialog.Close asChild>
                <Button disabled={isLoading}>Cancelar</Button>
              </Dialog.Close>
              <Button type="submit" disabled={isLoading || !listName.trim()}>
                {isLoading ? "Criando..." : "Criar Lista"}
              </Button>
            </div>
          </form>

          <Dialog.Close asChild>
            <button
              className="text-gray-400 hover:text-white absolute top-4 right-4 inline-flex h-6 w-6 appearance-none items-center justify-center rounded-full focus:outline-none transition-colors"
              aria-label="Close"
            >
              <X />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default NewListModal;
