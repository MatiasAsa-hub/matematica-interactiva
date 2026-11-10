# Cómo editar los textos de la página

Esta guía es para cambiar textos **sin tocar código**. Todo el texto de la página está en la carpeta **`contenido/`**, en archivos `.md` (Markdown: texto común con algunas marcas simples).

Cuando guardás un cambio en GitHub, la página se vuelve a publicar sola en uno o dos minutos.

---

## 1. Editar desde la web de GitHub (lo más fácil)

1. Entrá a **https://github.com/MatiasAsa-hub/matematica-interactiva**.
2. Abrí la carpeta **`contenido`** y después el archivo que quieras cambiar (por ejemplo `temas` → `analisis` → `funcion-cuadratica.md`).
3. Arriba a la derecha del archivo, tocá el **lápiz** ✏️ ("Edit this file").
4. Cambiá el texto.
5. Tocá el botón verde **"Commit changes…"**. En el cuadrito escribí qué cambiaste (por ejemplo: "Corrijo la pista del ejercicio 2") y confirmá con **"Commit changes"**.
6. Esperá uno o dos minutos y recargá la página.

**¿Cómo sé si se publicó bien?** En el repositorio, entrá a la pestaña **Actions**. Si el último ítem tiene un ✅ verde, está publicado. Si tiene una ❌ roja, hubo un error: hacé clic para ver qué dice (casi siempre indica el archivo y el ejercicio). **Mientras tanto, la página publicada sigue como estaba**, así que no se rompe nada.

---

## 2. Dónde está cada cosa

| Qué querés cambiar | Archivo |
|---|---|
| Nombre de la página, frase de presentación, secciones | `contenido/sitio.md` |
| Textos de la página de inicio | `contenido/paginas/inicio.md` |
| Página de notación y convenciones | `contenido/paginas/notacion.md` |
| "Cómo usar esta página en una clase" (tutores) | `contenido/paginas/como-usar.md` |
| Laboratorio de funciones | `contenido/paginas/laboratorio.md` |
| Un tema (explicación, ejemplo, ejercicios, notas para tutores) | `contenido/temas/<sección>/<tema>.md` |

---

## 3. Marcas básicas de Markdown

| Escribís | Se ve |
|---|---|
| `**negrita**` | **negrita** |
| `*cursiva*` | *cursiva* |
| `- algo` (al principio del renglón) | un punto de una lista |
| `1. algo` | lista numerada |
| `[texto](https://...)` | un link |
| `[función lineal](tema:funcion-lineal)` | link a otro tema de la página (si el tema todavía no existe, aparece "(próximamente)") |
| `> texto` | un recuadro de nota |

Un renglón vacío separa párrafos.

### Fórmulas

Las fórmulas se escriben entre signos `$` (se usa el formato LaTeX):

- En el medio del texto: `$f(x) = a(x - h)^2 + k$`
- Sola y centrada, en su propio bloque:

```
$$
x_{1,2} = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$
```

Algunas cosas útiles: `x^2` (potencia), `x_1` (subíndice), `\frac{a}{b}` (fracción), `\sqrt{x}` (raíz), `\cdot` (por), `\infty` (infinito), `\le` y `\ge` (≤ y ≥).

---

## 4. Cómo está armado un tema

Cada tema es **un solo archivo**. Arriba de todo, entre dos líneas `---`, van los datos del tema:

```
---
titulo: Función cuadrática
subseccion: Funciones
resumen: La parábola, su vértice y sus raíces.
orden: 30
interactivo: cuadratica
---
```

- **Ojo:** si un texto de esta parte tiene **dos puntos seguidos de un espacio** (por ejemplo `resumen: Y al revés: sacar factor común`), hay que ponerlo **entre comillas**: `resumen: "Y al revés: sacar factor común"`. Si no, el armado falla.
- `orden`: decide en qué orden aparecen los temas en la lista (más chico = más arriba).
- `interactivo`: qué gráfico interactivo va en la parte de "Intuición". Si el tema no tiene, se borra esa línea.
- Algunos interactivos usan datos extra. Por ejemplo, el de **orden de las operaciones** lee la lista `cuentas:`. Cada cuenta va entre comillas, con `·` para multiplicar, `:` para dividir y `^` para las potencias (`2^2` es 2²):

```
cuentas:
  - "2 + 3 · 4"
  - "(5 − 8) · 2 + 10"
```

Después vienen las partes, cada una con un título que empieza con `## `. **Los títulos tienen que ser estos** (la página los reconoce por el nombre):

| Título | Qué es |
|---|---|
| `## Intuición` | La consigna corta del interactivo. El interactivo aparece justo abajo. |
| `## Explicación` | La explicación. |
| `## Ejemplo resuelto` | Un ejemplo. Cada paso empieza con `### ` y aparece como desplegable. |
| `## Ejercicios` | Los ejercicios autocorregibles (ver abajo). |
| `## Para tutores` | Las notas para tutores. **No las ven los alumnos**: van en una página aparte. |

### Recuadro "Para recordar"

Un título `## Para recordar` (ponelo después de la explicación) se muestra como un recuadro amarillo destacado. Ahí van 2 o 3 renglones con lo más importante.

### Pasos del ejemplo resuelto

```
## Ejemplo resuelto

Para $f(x) = 2(x - 3)^2 - 2$, encontrá el vértice.

### Paso 1: el vértice

El vértice es $(3, -2)$.

### Paso 2: las raíces

...
```

---

## 5. Cómo escribir ejercicios

**Niveles:** un renglón `### Nivel: Para arrancar` (o `### Nivel: Para animarse`) no es un ejercicio: es un subtítulo que agrupa los ejercicios que vienen abajo.

Cada ejercicio empieza con `### ` y su título. Adentro van:

- El **enunciado** (texto normal).
- `respuesta:` con el resultado.
- `pista:` (opcional) con una ayuda de un renglón.
- `#### Resolución` (opcional): todo lo que sigue es la resolución desplegable.

### Respuesta numérica

```
### El vértice

Para $f(x) = (x + 2)^2 - 1$, ¿cuál es la coordenada $x$ del vértice?

respuesta: -2
pista: Fijate el signo: $(x + 2)$ es lo mismo que $(x - (-2))$.

#### Resolución

Como $(x + 2) = (x - (-2))$, queda $h = -2$.
```

- La respuesta puede ser entera (`3`), decimal con punto (`2.5`) o fracción (`1/2`).
- **Varias respuestas** (por ejemplo, dos raíces): separalas con punto y coma: `respuesta: -2 ; 4`. Aparecen dos casilleros y el alumno puede ponerlas en cualquier orden.
- Se acepta una diferencia de 0.01. Para cambiarla, agregá un renglón `tolerancia: 0.1`.
- El alumno puede escribir con coma o con punto (2,5 o 2.5), y fracciones (1/2).

### Opción múltiple

Las opciones van como lista con corchetes. La correcta lleva una **x** adentro: `[x]`.

```
### ¿Cuántas raíces?

¿Cuántas raíces reales tiene $f(x) = 3(x - 2)^2 + 5$?

- [ ] Dos
- [ ] Una
- [x] Ninguna

pista: ¿Dónde está el vértice?

#### Resolución

El vértice está arriba del eje y la parábola abre para arriba.
```

---

## 6. Agregar un tema nuevo

1. En GitHub, entrá a la carpeta de la sección (`contenido/temas/basico`, `analisis` o `algebra`).
2. Tocá **"Add file" → "Create new file"**.
3. Poné el nombre en minúsculas, sin acentos y con guiones, terminado en `.md`. Por ejemplo: `funcion-lineal.md`. Ese nombre es el que va en la dirección de la página y en los links `tema:funcion-lineal`.
4. Lo más fácil: copiá el contenido de `funcion-cuadratica.md`, pegalo y cambiá los textos.
5. Si el tema todavía no tiene interactivo, borrá la línea `interactivo:`.

---

## 7. Si algo sale mal

- Si en **Actions** aparece una ❌ roja, abrila: el mensaje suele decir qué falta, por ejemplo *"Falta la línea respuesta: ... en contenido/temas/analisis/funcion-cuadratica.md, ejercicio 'El vértice'"*.
- Para volver atrás un cambio: en el archivo, tocá **"History"**, elegí la versión anterior y copiá el texto de ahí.
- Cualquier duda, pedíselo a Claude en una sesión: "corregí tal cosa en tal tema".
