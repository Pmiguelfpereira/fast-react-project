---

## fast-react-project CLI

The `fast-react-project` CLI is a tool for quickly setting up new **React + Vite + TypeScript projects**. Since this is a **private repository** and not on npm, you need to install it directly from the cloned repository.

### Features

- Creates a **React + Vite + TypeScript** project in one command.
- **Optional package installation** for popular libraries, including:
  - TanStack Query, Form, Router, and Table
  - Zod
  - Axios
- **Configures popular tools** like:
  - Zustand for state management
  - Tailwind CSS
  - Jest + React Testing Library
- **Optional recommended folder structure** to help you stay organized.
- **Pre-configured ESLint and Prettier** for consistent code formatting.

---

## Installation

1.  **Clone the repository:**

    ```bash
    git clone <your-repo-url>
    cd fast-react-project
    ```

2.  **Install the CLI globally:**

    ```bash
    npm install -g
    ```

    This command makes `fast-react-project` available from anywhere on your system.

---

## Usage

Run the following command, replacing `<project-name>` with the name of your new project:

```bash
fast-react-project <project-name>
```

The CLI will then guide you through a series of prompts to:

- Select which packages to install.
- Choose whether to configure Zustand, Tailwind CSS, or Jest.
- Decide if you want to use the recommended folder structure.

After you make your selections, the CLI will:

- Create a new Vite + React + TypeScript project.
- Install all selected dependencies.
- Set up the chosen configuration for tools like Tailwind CSS and Jest.
- Create the recommended folder structure, if selected.
- Configure ESLint and TypeScript.

---

## After Project Creation

To start working on your new project, navigate into the project folder and start the development server:

```bash
cd <project-name>
npm run dev
```
