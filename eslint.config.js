// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import tailwindcssPlugin from "eslint-plugin-tailwindcss"; // Import the plugin

export default tseslint.config(
  { ignores: ["dist", "playwright-report", "test-results"] }, // Added build/test artifacts
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      // Use plugin object directly for recommended rules
      // See: https://github.com/francoismassart/eslint-plugin-tailwindcss?tab=readme-ov-file#recommended-configuration
      // tailwindcssPlugin.configs.recommended, // <-- Use this if available and desired
      "plugin:tailwindcss/recommended", // Keep this if the above isn't available/suitable
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020, // Keep or update if needed (e.g., 'latest')
      globals: {
        ...globals.browser,
        ...globals.node, // Add node globals if needed for config files etc.
      },
      parserOptions: {
        // Ensure parser options are set if needed
        project: ["./tsconfig.app.json", "./tsconfig.node.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      // Assign the imported plugin object
      tailwindcss: tailwindcssPlugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "tailwindcss/no-custom-classname": "warn",
      // Remove this rule - let prettier-plugin-tailwindcss handle it
      // "tailwindcss/classnames-order": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ], // Example: Relax unused vars slightly
      // Add other rules as needed
    },
    // Add settings if required by plugins (like tailwindcss)
    settings: {
      tailwindcss: {
        // Optional: Set the path to your tailwind config file
        // configFile: 'tailwind.config.ts',
      },
    },
  },
);
