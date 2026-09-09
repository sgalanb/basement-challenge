import { defineConfig } from "oxlint";

export default defineConfig({
  // Default plugins plus react, nextjs and jsx-a11y
  plugins: ["eslint", "typescript", "unicorn", "oxc", "react", "nextjs", "jsx-a11y", "vitest"],
});
