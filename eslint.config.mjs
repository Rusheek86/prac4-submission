import { eslint } from "@eslint/js";

export default [
  eslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        __dirname: "readonly", 
      },
      sourceType: "commonjs", 
    },
  },
];