# TaskMaster 🚀

TaskMaster é um aplicativo de gerenciamento de tarefas (To-Do list) moderno e funcional, construído com React, TypeScript e Firebase. Ele permite que os usuários gerenciem suas atividades diárias de forma eficiente, com uma interface limpa, reativa e totalmente responsiva.

Este projeto foi desenvolvido com foco em uma arquitetura de software limpa e escalável, utilizando hooks customizados para uma clara separação de responsabilidades entre a interface do usuário (UI) e a lógica de negócios.

Link do projeto: https://todo-list-471b4.web.app/

---


## 📋 Tabela de Conteúdos

* [Funcionalidades Principais](#-funcionalidades-principais)
* [Tecnologias Utilizadas](#-tecnologias-utilizadas)
* [Arquitetura do Projeto](#-arquitetura-do-projeto)
* [Como Executar o Projeto Localmente](#-como-executar-o-projeto-localmente)
* [Estrutura de Pastas](#-estrutura-de-pastas)
* [Licença](#-licença)

---

## ✨ Funcionalidades Principais

* **🔐 Autenticação de Usuários:** Sistema completo de login e logout utilizando **Firebase Auth**.
* **📝 CRUD de Tarefas e Listas:** Crie, edite e delete tarefas e listas personalizadas de forma intuitiva.
* **⚡ Atualizações em Tempo Real:** A interface é sincronizada instantaneamente com o banco de dados **Firestore**.
* **📂 Filtros Inteligentes:** Organize e visualize tarefas por "Inbox", "Hoje", "Importante" e "Concluídas".
* **🔍 Busca Rápida:** Encontre qualquer tarefa de forma instantânea.
* **📱 Design Responsivo (Mobile-First):** Experiência de uso perfeita em qualquer dispositivo, do celular ao desktop.
* **🎨 Interface Moderna:** Design com tema escuro (dark mode), construído com **Tailwind CSS**.

---

## 🛠️ Tecnologias Utilizadas

* **Frontend:**
    * **[React](https://react.dev/)**
    * **[TypeScript](https://www.typescriptlang.org/)**
    * **[Vite](https://vitejs.dev/)**
    * **[Tailwind CSS](https://tailwindcss.com/)**
* **Backend & Banco de Dados:**
    * **[Firebase](https://firebase.google.com/)** (Authentication e Firestore)
* **UI & Roteamento:**
    * **[Lucide React](https://lucide.dev/)** (Ícones)
    * **[React Router DOM](https://reactrouter.com/)**

---

## 🏗️ Arquitetura do Projeto

A arquitetura do TaskMaster foi desenhada para ser limpa, componentizada e de fácil manutenção:

* **Separação de Responsabilidades (SoC):** A lógica de interação com o backend é totalmente isolada da camada de apresentação através de hooks customizados.
* **Hooks Customizados:**
    * `useAuth`: Gerencia o estado de autenticação do usuário.
* **Componentização:** A UI é dividida em pequenos componentes de apresentação, reutilizáveis e focados em uma única responsabilidade, localizados em `src/components`.

---

## 🚀 Como Executar o Projeto Localmente

Siga os passos abaixo para configurar e executar o TaskMaster em sua máquina.

### Pré-requisitos

* **Node.js** (versão 18 ou superior)
* **Yarn** ou **npm**
* Uma conta no **[Firebase](https://firebase.google.com/)** para configurar o backend.

### Passos

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/taskmaster.git](https://github.com/seu-usuario/taskmaster.git)
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Configure as variáveis de ambiente:**
    Para conectar a aplicação ao seu backend, crie um arquivo chamado `.env.local` na raiz do projeto. Copie e cole o conteúdo abaixo, substituindo os valores pelas credenciais do **seu projeto Firebase**.

    ```.env.local
    VITE_FIREBASE_API_KEY="SUA_API_KEY"
    VITE_FIREBASE_AUTH_DOMAIN="SEU_AUTH_DOMAIN"
    VITE_FIREBASE_PROJECT_ID="SEU_PROJECT_ID"
    VITE_FIREBASE_STORAGE_BUCKET="SEU_STORAGE_BUCKET"
    
