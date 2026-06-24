import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import nextPluginPackage from "@next/eslint-plugin-next";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

const { flatConfig: nextFlatConfig } = nextPluginPackage;

const eslintConfig = [
  ...compat.extends("next/typescript"),
  nextFlatConfig.coreWebVitals,
  {
    ignores: [".next/**", "node_modules/**", ".npm-cache/**", "out/**", "next-env.d.ts"]
  }
];

export default eslintConfig;
