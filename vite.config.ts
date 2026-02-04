//vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/YOUR_REPO_NAME/", // ใส่ชื่อ repo ของคุณ
});
