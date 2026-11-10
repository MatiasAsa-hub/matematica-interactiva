// Configuración de Astro.
// "site" y "base" tienen que coincidir con la dirección de GitHub Pages:
// https://matiasasa-hub.github.io/matematica-interactiva/
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://matiasasa-hub.github.io',
  base: '/matematica-interactiva',
  trailingSlash: 'always',
  // Los archivos .md de "contenido/" se leen y se arman desde src/lib/contenido.js,
  // así que Astro no tiene que procesarlos solo.
});
