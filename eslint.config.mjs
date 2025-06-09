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
      "@typescript-eslint/no-unused-vars" : "off", // Disable unused vars in TypeScript
      "@typescript-eslint/no-wrapper-object-types": "off", // Allow wrapper object types like 'String', 'Number', etc.
      "@typescript-eslint/prefer-const": "off", // Allow wrapper object types like 'String', 'Number', etc.
    },
  },
];

export default eslintConfig;
