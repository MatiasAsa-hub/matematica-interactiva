// Arma las direcciones internas teniendo en cuenta la "base" del sitio
// (en GitHub Pages la página vive en /matematica-interactiva/).
const BASE = import.meta.env.BASE_URL.replace(/\/?$/, '/');

export function url(ruta = '') {
  return BASE + String(ruta).replace(/^\//, '');
}
