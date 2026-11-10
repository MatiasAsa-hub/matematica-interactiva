# Estado del proyecto

_Última actualización: 10/11/2026 — sesión 1 (Etapa 0)_

**Página publicada:** https://matiasasa-hub.github.io/matematica-interactiva/
**Repositorio:** https://github.com/MatiasAsa-hub/matematica-interactiva

## Hecho

### Etapa 0 — Base y prototipo (esperando la devolución de Mati)
- Proyecto con **Astro** (sitio estático). El contenido está en `contenido/`, en Markdown, separado del código.
- Publicación automática en **GitHub Pages** con GitHub Actions (`.github/workflows/publicar.yml`): se publica sola con cada cambio que se sube a `main`.
- **Diseño base:** fondo gris azulado tipo pizarra, tipografía Nunito, barra de navegación abajo en el celular y arriba en la compu.
  - Páginas: Inicio, Temas (alumnos), Tutores (con "Cómo usar esta página en una clase"), Laboratorio (por ahora vacío), Notación.
- **Códigos de color fijos** (en `src/styles/global.css`): función = azul, derivada = naranja, integral = violeta, C⁺ = verde (zona lisa), C⁻ = rojo (zona rayada y barra punteada), C⁰/raíces = amarillo, vértice/máx/mín = lila, ordenada al origen = rosa, crece = turquesa, decrece = terracota.
- **Módulo de graficado 2D** (`src/lib/grafico/`): plano con ejes, grilla y números; zoom y desplazamiento con dos dedos (con un dedo se mueve la página), Ctrl+rueda y botones + / − / vista inicial en la compu; curvas, zonas pintadas, puntos, rectas, etiquetas y puntos arrastrables.
  - **Animación de puntos** compartida (`animacionPuntos.js`): primero aparecen los puntos de izquierda a derecha, después la curva, y la tabla x | f(x) opcional se llena a la par.
  - Deslizadores con botones − y + para ajustar fino con el dedo, y casillas que se prenden y se apagan.
- **Interactivo de la cuadrática** completo: forma canónica con *a*, *h* y *k*, la expresión en vivo (se resalta el número que estás moviendo), y casillas para mostrar vértice, eje de simetría, raíces (con la resolvente, y un aviso si no hay raíces reales), ordenada al origen, C⁺/C⁻/C⁰, crece/decrece y máximo o mínimo. Con *a* = 0 avisa que queda una recta.
- **Tema de ejemplo:** "Función cuadrática" con intuición, explicación, ejemplo resuelto con pasos desplegables, 4 ejercicios autocorregibles (numéricos, de varias respuestas y de opción múltiple, con pista y resolución) y notas para tutores en una página aparte.
- `COMO-EDITAR.md`: guía para cambiar textos desde la web de GitHub.

## Falta (próximas etapas)
- Etapa 1: Básico (operaciones, primero con números y después con *x*).
- Etapa 2: Ecuaciones e inecuaciones.
- Etapa 3: Qué es una función y la función lineal (el interactivo de la lineal).
- Etapas 4 a 8: según la hoja de ruta de `CLAUDE.md`.
- Transversal: **guía imprimible** por tema (ejercicios con las respuestas al final). Todavía no está hecha.

## Decisiones pendientes (para Mati)
- **Estética** (fondo, colores, tipografía), ahora que hay prototipo.
- **Nombre de la página.** Por ahora: "Matemática Interactiva" (se cambia en `contenido/sitio.md`). La dirección web usa `matematica-interactiva`; si se cambia el nombre, conviene cambiar también el del repositorio.
- **Convenciones nuevas**, ya usadas en el interactivo y en la página de Notación, que hay que confirmar:
  - ℝ para "todos los reales" y ∅ para "vacío" (por ejemplo, C⁻ = ∅).
  - Los intervalos de crecimiento y decrecimiento se escriben **abiertos** en el vértice: crece en (1, +∞).
  - Los números que no son exactos se muestran redondeados a 2 decimales con "≈" (x₁ ≈ 1.27).
- **Tabla x | f(x):** por ahora arranca **apagada** (es opcional, con su casilla).
- **Cantidad de puntos de la animación:** se usan solo los puntos que se ven en pantalla, con x "redondos" (de 0.5 en 0.5, de 1 en 1…). Así quedan entre 10 y 25 puntos: con la parábola inicial son 11. Si se prefieren ~20 siempre, los x quedan menos lindos (0.2, 0.25…).
- La forma de los parámetros de los polinomios de grado ≥ 3.
- Los detalles de la animación de la integral (7.a).
- Si se incluyen espacios vectoriales.

## Notas técnicas
- Para trabajar en la compu: Node.js (LTS) y GitHub CLI están instalados. `npm run dev` levanta la página en http://localhost:4321/matematica-interactiva/.
- Los interactivos están en `src/interactivos/` (lógica) y `src/components/interactivos/` (HTML). Un interactivo nuevo se registra en `src/components/Interactivo.astro`.
- Los temas se leen y se dividen por títulos (`## Intuición`, `## Explicación`…) en `src/lib/contenido.js`. Si un ejercicio está mal escrito, el armado falla con un mensaje claro, y la página publicada no se toca.
