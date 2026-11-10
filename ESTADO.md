# Estado del proyecto

_Última actualización: 10/11/2026 — sesión 2_

**Página publicada:** https://matiasasa-hub.github.io/matematica-interactiva/
**Repositorio:** https://github.com/MatiasAsa-hub/matematica-interactiva

## Hecho

### Etapa 0 — Base y prototipo ✅ (aprobada por Mati)
- Proyecto Astro, contenido en `contenido/` (Markdown), publicación automática en GitHub Pages.
- Diseño aprobado: pizarra gris azulada, Nunito, colores fijos por concepto (ver `src/styles/global.css`), navegación abajo en el celular.
- Módulo de graficado 2D (`src/lib/grafico/`): plano, zoom con dos dedos, animación de puntos, deslizadores, casillas y puntos arrastrables. Ahora también tiene un **modo recta numérica** (`soloEjeX`) y `mostrarRango()` para que la vista siga lo que se está mostrando.
- **Cuadrática** (después de la devolución de Mati):
  - Botón **Polinómica / Canónica**. Arranca en la polinómica, ax² + bx + c. Al cambiar de forma, la parábola queda igual y cambian los deslizadores.
  - Casillas prendidas por defecto: raíces, vértice y animación. El resto arranca apagado.
  - Con a = 0 en la forma polinómica, avisa que queda una función lineal.
  - Texto más corto y en ítems. 6 ejercicios, casi todos en forma polinómica. Notas para tutores genéricas.

### Etapa 1 — Básico (en curso)
- **Sumar y restar con signos** (`contenido/temas/basico/sumar-y-restar-con-signos.md`): interactivo de **recta numérica** (`recta-signos`).
  - Se arranca en *a* y se dan saltitos de a uno: verdes a la derecha y rojos punteados a la izquierda.
  - Botón Sumar / Restar. Al restar se muestra que es sumar el opuesto: 8 − (−9) = 8 + 9 = 17.
  - Los dos puntos se pueden arrastrar con el dedo.
  - 8 ejercicios, 2 de ellos con *x* (reemplazar *x* por un negativo).
- **Multiplicar y dividir con signos** (`multiplicar-y-dividir-con-signos.md`): interactivo `recta-multiplicacion`.
  - **Multiplicar** a · b: desde el 0 se hacen |a| saltos de tamaño b. Si a es negativo, todo se **da vuelta como en un espejo en el 0**, con animación y los saltos de antes en "fantasma". Así se ve por qué menos por menos da más.
  - **Dividir** a : b: ¿cuántos saltos de b hacen falta para llegar a a? Si hay que saltar al revés, la cantidad es negativa. Avisa que no se puede dividir por 0.
  - Debajo hay una tablita con la regla de los signos que marca el caso que se está usando.
  - 9 ejercicios, 2 con *x*.
- Los saltos de la recta ahora son una pieza compartida: `src/lib/grafico/saltos.js`.

## Falta
- Etapa 1, el resto:
  - Orden de las operaciones.
  - Fracciones (propuesta: barras).
  - Potencias y raíces.
  - Distributiva y factor común (propuesta: modelo de área).
- Etapas 2 a 8, según la hoja de ruta de `CLAUDE.md`.
- **Guía imprimible: al final de todo** (decisión de Mati).

## Decisiones tomadas en la sesión 2
- Convenciones confirmadas por Mati:
  - ℝ y ∅.
  - Intervalos de crecimiento abiertos en el vértice.
  - "≈" con 2 decimales para lo que no es exacto.
- La tabla x | f(x) queda opcional y apagada.
- Los textos de alumnos y tutores van cortos y genéricos. Mati los va a escribir después.

## Ideas anotadas (sin hacer)
- **Glosario al tocar una palabra** (idea de Mati): tocar o señalar con el mouse una palabra formal (C⁺, vértice, resolvente…) y que aparezca una descripción corta.
- **Celular:** al mover los deslizadores de la cuadrática no se ve el gráfico al mismo tiempo. Es un detalle menor; posible solución: gráfico "pegajoso" arriba.

## Decisiones pendientes
- **Convención nueva para confirmar:** se usa **·** para multiplicar y **:** para dividir (como en la escuela). Las divisiones que no dan exacto se muestran con decimales (7 : 4 = 1.75).
- La forma de los parámetros de los polinomios de grado ≥ 3.
- Los detalles de la animación de la integral (7.a).
- Si se incluyen espacios vectoriales.

## Notas técnicas
- Node.js y GitHub CLI están instalados. En la terminal: `npm run dev` y abrir http://localhost:4321/matematica-interactiva/.
- Interactivos: lógica en `src/interactivos/`, HTML en `src/components/interactivos/`. Para registrar uno nuevo, se agrega en `src/components/Interactivo.astro`.
- Los temas se leen en `src/lib/contenido.js`. Si un ejercicio está mal escrito, el armado falla con un mensaje claro y la página publicada no se toca.
