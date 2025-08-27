// Configure TsConfig
export const tsconfig = {
  compilerOptions: {
    target: "ESNext",
    lib: ["DOM", "DOM.Iterable", "ESNext"],
    strict: true,
    noImplicitAny: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    strictNullChecks: true,
    module: "ESNext",
    moduleResolution: "Node",
    resolveJsonModule: true,
    isolatedModules: true,
    noEmit: true,
    esModuleInterop: true,
    allowSyntheticDefaultImports: true,
    jsx: "react-jsx",
  },
  include: ["src"],
};

// Configure ESLint
export const eslintConfig = {
  env: { browser: true, es2021: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/ban-ts-comment": [
      "error",
      {
        "ts-ignore": "error",
        "ts-nocheck": "warn",
        "ts-expect-error": "off",
      },
    ],
    "no-unused-vars": "error",
    "react/prop-types": "off",
  },
  settings: { react: { version: "detect" } },
};

export const tailwindConfig = `
        /** @type {import('tailwindcss').Config} */
        export default {
          content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
          theme: { extend: {} },
          plugins: [],
      };`;

export const indexCss = `
              @tailwind base;
              @tailwind components;
              @tailwind utilities;
            `;
