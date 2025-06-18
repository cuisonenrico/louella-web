import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "no-unused-vars": "off", // Disable unused imports/vars
      "@typescript-eslint/no-explicit-any": "off", // Allow 'any' type
      "@typescript-eslint/ban-types": "off", // Allow using types like '{}', 'Function', etc.
      "@typescript-eslint/explicit-module-boundary-types": "off", // Don't require explicit return types
      "@typescript-eslint/no-unused-vars": "off", // Disable unused vars in TypeScript
      "@typescript-eslint/no-wrapper-object-types": "off", // Allow wrapper object types like 'String', 'Number', etc.
      "prefer-const": "off",
      "react-hooks/exhaustive-deps": "off", // Disable exhaustive deps rule for React hooks
      "react/no-unescaped-entities": "off", // Allow unescaped entities in JSX
      "no-empty-object-type": "off", // Disable no-empty-object-type rule
      "@typescript-eslint/no-empty-object-type": "off", // Allow empty object types
    },
  },
];


export default eslintConfig;
