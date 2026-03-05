#!/usr/bin/env node
import { Command } from "commander";
import inquirer from "inquirer";
import { execa } from "execa";
import chalk from "chalk";
import fs from "fs";
import {
  createAppFile,
  createMainFile,
  generateRootFile,
  addPluginToViteConfig,
  createIndexCssFromTemplate,
} from "./lib/utils.js";
import { tsconfig, eslintConfig } from "./lib/configs.js";
const program = new Command();

program
  .name("fast-react-project")
  .description(
    "CLI to create React + Vite + TS projects with optional packages and structure"
  )
  .argument("<project-name>", "Project name")
  .action(async (projectName) => {
    console.log(chalk.green(`🚀 Starting project creation: ${projectName}...`));

    // Ask for optional packages
    const answersPackages = await inquirer.prompt([
      {
        type: "checkbox",
        name: "packages",
        message: "Which optional packages do you want to install?",
        choices: [
          { name: "TanStack Query", value: "query" },
          { name: "TanStack Form", value: "form" },
          { name: "TanStack Router", value: "router" },
          { name: "TanStack Table", value: "table" },
          { name: "Zod", value: "zod" },
          { name: "Axios", value: "axios" },
        ],
      },
      {
        type: "confirm",
        name: "zustand",
        message: "Do you want to use Zustand as the state manager?",
        default: false,
      },
      {
        type: "confirm",
        name: "tailwind",
        message: "Do you want to configure Tailwind CSS?",
        default: false,
      },
      {
        type: "confirm",
        name: "tests",
        message: "Do you want to configure Jest + React Testing Library?",
        default: false,
      },
      {
        type: "confirm",
        name: "createStructure",
        message:
          "Do you want to create the recommended folder structure for the project?",
        default: false,
      },
    ]);

    // Create Vite + React + TS project
    await execa(
      "npx",
      ["-y", "create-vite@latest", projectName, "--template", "react-ts"],
      { stdio: "inherit" }
    );

    process.chdir(projectName);
    await execa("npm", ["install"], { stdio: "inherit" });

    // Remove default Vite files
    ["src/App.css", "src/index.css", "src/logo.svg", "src/App.tsx"].forEach(
      (file) => {
        if (fs.existsSync(file)) fs.unlinkSync(file);
      }
    );

    // Create folder structure
    if (answersPackages.createStructure) {
      const folders = [
        "src/app",
        "src/pages",
        "src/components",
        "src/hooks",
        "src/utils",
        "src/assets",
      ];
      folders.forEach((folder) => fs.mkdirSync(folder, { recursive: true }));
    }

    // Install optional packages
    const deps = [];

    const devDeps = [
      "@babel/core",
      "@babel/preset-env",
      "@babel/preset-react",
      "prettier",
    ];

    if (answersPackages.packages.includes("query")) {
      deps.push("@tanstack/react-query");
    }
    if (answersPackages.packages.includes("form")) {
      deps.push("@tanstack/react-form");
    }
    if (answersPackages.packages.includes("router")) {
      deps.push("@tanstack/react-router", "@tanstack/react-router-devtools");
      devDeps.push("@tanstack/router-plugin");
    }
    if (answersPackages.packages.includes("table")) {
      deps.push("@tanstack/react-table");
    }
    if (answersPackages.packages.includes("zod")) {
      deps.push("zod");
    }
    if (answersPackages.packages.includes("axios")) {
      deps.push("axios");
    }
    if (answersPackages.zustand) {
      deps.push("zustand");
    }

    // Tailwind
    if (answersPackages.tailwind) {
      devDeps.push("tailwindcss", "@tailwindcss/vite");
    }

    // Testing
    if (answersPackages.tests) {
      devDeps.push(
        "jest",
        "@testing-library/react",
        "@testing-library/jest-dom",
        "@testing-library/user-event",
        "ts-jest",
        "@types/jest"
      );
    }

    // Install dependencies
    if (deps.length > 0) {
      console.log(chalk.blue(`📦 Installing dependencies: ${deps.join(", ")}`));
      await execa("npm", ["install", ...deps.map((d) => `${d}@latest`)], {
        stdio: "inherit",
      });
    }

    // Instalar devDependencies com @latest
    if (devDeps.length > 0) {
      console.log(
        chalk.blue(`🔧 Installing dev dependencies: ${devDeps.join(", ")}`)
      );
      await execa(
        "npm",
        ["install", "-D", ...devDeps.map((d) => `${d}@latest`)],
        { stdio: "inherit" }
      );
    }

    // Tailwind setup
    if (answersPackages.tailwind) {
      console.log(chalk.cyan("⚡ Configuring Tailwind CSS..."));
      addPluginToViteConfig(
        'tailwindcss from "@tailwindcss/vite";',
        "tailwindcss()"
      );
    }

    // Automatically add TanStack Router plugin
    if (answersPackages.packages.includes("router")) {
      addPluginToViteConfig(
        '{ tanstackRouter } from "@tanstack/router-plugin/vite";',
        `tanstackRouter({
            target: "react",
            autoCodeSplitting: true,
        })`
      );
      generateRootFile();
      console.log(chalk.green("✅ TanStack Router added to Vite config."));
    }

    // Jest setup
    if (answersPackages.tests) {
      console.log(chalk.cyan("🧪 Configuring Jest + Testing Library..."));
      const jestConfig = {
        preset: "ts-jest",
        testEnvironment: "jsdom",
        setupFilesAfterEnv: ["@testing-library/jest-dom"],
      };
      fs.writeFileSync(
        "jest.config.js",
        `export default ${JSON.stringify(jestConfig, null, 2)}`
      );
    }

    fs.writeFileSync("tsconfig.json", JSON.stringify(tsconfig, null, 2));
    fs.writeFileSync(".eslintrc.json", JSON.stringify(eslintConfig, null, 2));

    createAppFile({ tailwind: answersPackages.tailwind });
    createMainFile({
      tailwind: answersPackages.tailwind,
      router: answersPackages.packages.includes("router"),
    });
    createIndexCssFromTemplate(answersPackages.tailwind);

    console.log(chalk.green(`🎉 Project ${projectName} created successfully!`));
    if (answersPackages.tailwind)
      console.log(chalk.blue("✅ Tailwind configured successfully."));
    if (answersPackages.tests)
      console.log(chalk.blue("✅ Jest + Testing Library configured."));
    console.log(
      chalk.blue(
        "✅ ESLint and TypeScript configured for safer typing (avoiding any and @ts-ignore)."
      )
    );
    console.log(chalk.yellow(`👉 cd ${projectName} && npm run dev`));
  });

program.parse();
