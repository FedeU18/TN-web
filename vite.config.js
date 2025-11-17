import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxificar las peticiones a la API y al WSDL SOAP hacia el backend durante el desarrollo
      "/api": {
        target: import.meta.env.VITE_BACKEND_URL,
        changeOrigin: true,
        secure: false,
      },
      "/wsdl": {
        target: import.meta.env.VITE_BACKEND_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
