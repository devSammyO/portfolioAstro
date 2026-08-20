// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel'; // Importa el adaptador de Vercel

// https://astro.build/config
export default defineConfig({
  site: "https://portfolio-astro-eight-omega.vercel.app", // Actualiza esto si conectas un dominio propio
  output: "static", // Exportar archivos estáticos
  trailingSlash: "always", // Asegura que las rutas terminan en "/"
  adapter: vercel({}), // Usa el adaptador de Vercel para evitar 404
});
