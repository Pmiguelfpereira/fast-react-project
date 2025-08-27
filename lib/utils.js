import fs from "fs";
import chalk from "chalk";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadTemplate(file) {
  const filePath = path.join(__dirname, "../", file); // adjust if templates are in ../templates
  return fs.readFileSync(filePath, "utf-8");
}

// Create or overwrite src/App.tsx based on Tailwind choice
export function createAppFile({ tailwind }) {
  const file = tailwind
    ? "templates/app-tailwind.tsx.tpl"
    : "templates/app-basic.tsx.tpl";

  const content = loadTemplate(file);
  fs.writeFileSync("src/App.tsx", content);
  console.log(chalk.green(`✅ src/App.tsx created/overwritten successfully.`));
}

// Create or overwrite src/main.tsx based on router choice
export function createMainFile({ tailwind, router }) {
  const file = router
    ? "templates/main-router.tsx.tpl"
    : "templates/main-basic.tsx.tpl";

  let content = loadTemplate(file);

  // Se Tailwind estiver ativo, adiciona import do index.css no topo
  if (tailwind && !content.includes('import "./index.css";')) {
    content = `import "./index.css";\n` + content;
  }

  fs.writeFileSync("src/main.tsx", content);
  console.log(chalk.green(`✅ src/main.tsx created/overwritten successfully.`));
}

export function generateRootFile() {
  const routesPath = "src/routes";

  if (!fs.existsSync(routesPath)) {
    fs.mkdirSync(routesPath, { recursive: true });
    console.log(chalk.green(`✅ Created folder ${routesPath}`));
  }

  const templateFile = "templates/root-router.tsx.tpl";

  const content = loadTemplate(templateFile);

  fs.writeFileSync(`${routesPath}/__root.tsx`, content);
  console.log(
    chalk.green(`✅ ${routesPath}/__root.tsx created/overwritten successfully.`)
  );
}

// Add plugin to vite.config.ts
export const addPluginToViteConfig = (pluginImport, pluginCall) => {
  const viteConfigPath = "vite.config.ts";

  if (!fs.existsSync(viteConfigPath)) {
    console.error(chalk.red("❌ vite.config.ts not found"));
    return;
  }

  let viteConfig = fs.readFileSync(viteConfigPath, "utf-8");

  // 1️⃣ Add import if it doesn't exist
  if (!viteConfig.includes(pluginImport)) {
    viteConfig = `import ${pluginImport}\n` + viteConfig;
  }

  // 2️⃣ Regex to capture plugins array (multiline safe)
  const regex = /plugins:\s*\[((?:.|\n)*?)\]/m;
  const pluginName = pluginCall.split("(")[0].trim();

  viteConfig = viteConfig.replace(regex, (match, pluginsInside) => {
    if (!pluginsInside.includes(pluginName)) {
      const separator = pluginsInside.trim() ? ",\n  " : "\n  ";
      return `plugins: [${pluginsInside.trim()}${separator}${pluginCall}\n]`;
    }
    return match; // already exists
  });

  fs.writeFileSync(viteConfigPath, viteConfig, "utf-8");
  console.log(chalk.green(`✅ Plugin added: ${pluginCall}`));
};

export function createIndexCssFromTemplate(tailwind) {
  const templateFile = tailwind
    ? "templates/index-tailwind.css.tpl"
    : "templates/index-basic.css.tpl";

  const content = loadTemplate(templateFile);

  // Ensure src folder exists
  if (!fs.existsSync("src")) fs.mkdirSync("src");

  fs.writeFileSync("src/index.css", content, "utf-8");
  console.log(
    chalk.green("✅ src/index.css created from template successfully")
  );
}

export function removeFavicon() {
  const indexPath = path.join(process.cwd(), "index.html");

  if (!fs.existsSync(indexPath)) {
    console.error(chalk.red("❌ index.html not found!"));
    return;
  }

  let html = fs.readFileSync(indexPath, "utf-8");

  // Remove any <link rel="icon" ... /> line
  html = html.replace(/<link rel="icon" href=".*" ?\/?>/gi, "");

  fs.writeFileSync(indexPath, html, "utf-8");
  console.log(chalk.green("✅ Favicon removed from index.html"));
}
