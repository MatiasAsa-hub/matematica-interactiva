# Cómo editar los textos de la página

Esta guía es para cambiar textos **sin tocar código**. Todo el texto de la página está en la carpeta **`contenido/`**, en archivos `.md` (Markdown: texto común con algunas marcas simples).

Cuando guardás un cambio en GitHub, la página se vuelve a publicar sola en uno o dos minutos.

---

## 1. Editar desde la web de GitHub (lo más fácil)

1. Entrá a **https://github.com/MatiasAsa-hub/matematica-interactiva**.
2. Abrí la carpeta **`contenido`** y después el archivo que quieras cambiar (por ejemplo `temas` → `funciones` → `funcion-cuadratica.md`).
3. Arriba a la derecha del archivo, tocá el **lápiz** ✏️ ("Edit this file").
4. Cambiá el texto.
5. Tocá el botón verde **"Commit changes…"**. En el cuadrito escribí qué cambiaste (por ejemplo: "Corrijo la pista del ejercicio 2") y confirmá con **"Commit changes"**.
6. Esperá uno o dos minutos y recargá la página.

**¿Cómo sé si se publicó bien?** En el repositorio, entrá a la pestaña **Actions**. Si el último ítem tiene un ✅ verde, está publicado. Si tiene una ❌ roja, hubo un error: hacé clic para ver qué dice (casi siempre indica el archivo y el ejercicio). **Mientras tanto, la página publicada sigue como estaba**, así que no se rompe nada.

---

## 2. Dónde está cada cosa

| Qué querés cambiar | Archivo |
|---|---|
| Nombre de la página, frase de presentación, etapas y unidades | `contenido/sitio.md` |
| Textos de la página de inicio | `contenido/paginas/inicio.md` |
| Página de notación y convenciones | `contenido/paginas/notacion.md` |
| "Cómo usar esta página en una clase" (tutores) | `contenido/paginas/como-usar.md` |
| Laboratorio de funciones | `contenido/paginas/laboratorio.md` |
| Texto de arriba de la lista de Temas | `contenido/paginas/alumnos.md` |
| Texto de arriba de la sección Interactivos | `contenido/paginas/interactivos.md` |
| Un tema (explicación, ejemplo, ejercicios, notas para tutores) | `contenido/temas/<unidad>/<tema>.md` |

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
| `[Laboratorio](pagina:laboratorio)` | link a una página suelta: `laboratorio`, `notacion` |
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
- `orden`: decide en qué orden aparecen los temas **dentro de su unidad** (más chico = más arriba). También decide cuál es el "tema siguiente" y el "tema anterior" de los botones del final.
- La **unidad** de un tema es la carpeta donde está el archivo (`contenido/temas/funciones/`, `contenido/temas/derivadas/`…). Para pasar un tema a otra unidad, se mueve el archivo de carpeta. Los nombres, el orden y las descripciones de las unidades están en `contenido/sitio.md`.
- `subseccion`: solo se usa en las unidades largas (más de 6 temas), para separar los temas con subtítulos.
- `interactivo`: qué gráfico interactivo va en la parte de "Intuición" (a los alumnos ese título se les muestra como **"Para probar"**). Si el tema no tiene, se borra esa línea.
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
| `## Para tutores` | Las notas para tutores. **No las ven los alumnos**: van en una página aparte. Adentro llevan seis apartados con `### `: Objetivo, Antes tiene que saber, Errores típicos, Cómo destrabarlo, En el pizarrón y Preguntas para el alumno. |

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

1. En GitHub, entrá a la carpeta de la unidad donde va el tema (por ejemplo `contenido/temas/funciones`). Las unidades y su orden están en `contenido/sitio.md`.
2. Tocá **"Add file" → "Create new file"**.
3. Poné el nombre en minúsculas, sin acentos y con guiones, terminado en `.md`. Por ejemplo: `funcion-lineal.md`. Ese nombre es el que va en la dirección de la página y en los links `tema:funcion-lineal`.
4. Lo más fácil: copiá el contenido de `funcion-cuadratica.md`, pegalo y cambiá los textos.
5. Si el tema todavía no tiene interactivo, borrá la línea `interactivo:`.

---

## 6 bis. La página de Notación

Está en `contenido/paginas/notacion.md`. Cada título `## ...` es una sección (y aparece sola en el índice de arriba). Dentro de una sección, cada renglón es una ficha: **lo que se escribe, en negrita**, después una raya y qué quiere decir.

```
## Intervalos y conjuntos

- **$[2, 5)$** — Con el 2, sin el 5.
- **CD** — Compatible determinado: una sola solución.
```

Los colores de la leyenda del final están arriba de todo del archivo, en la lista `colores:`.

---

## 7. Trabajar con Claude: sesiones nuevas

Todo lo importante queda guardado en tres lugares que no dependen de la sesión: **`CLAUDE.md`** (el brief y las decisiones), **`ESTADO.md`** (qué está hecho y qué sigue) y el **historial de cambios** del repositorio.

**Para arrancar una sesión nueva** (por ejemplo, al empezar una etapa):

1. En la app de Claude, abrí una **sesión nueva** en la carpeta `PAGINA_MATEMATICA`.
2. Escribí algo como: *"Leé ESTADO.md y seguimos con la Etapa 2"*.
3. Listo: Claude lee `CLAUDE.md` solo y con `ESTADO.md` sabe dónde quedamos.

**Si una sesión se llena** (la conversación es muy larga): la app resume sola lo anterior y se puede seguir. Igual conviene cerrar la etapa (que Claude actualice `ESTADO.md` y suba los cambios) y seguir en una sesión nueva.

**Si una sesión se corta a la mitad de algo:** abrí una sesión nueva y escribí *"La sesión anterior se cortó mientras hacías X. Revisá `git status` y `ESTADO.md` y terminalo"*. Los archivos que se estaban cambiando quedan en la carpeta, aunque no se hayan subido.

## 8. Si algo sale mal

- Si en **Actions** aparece una ❌ roja, abrila: el mensaje suele decir qué falta, por ejemplo *"Falta la línea respuesta: ... en contenido/temas/funciones/funcion-cuadratica.md, ejercicio 'El vértice'"*.
- Para volver atrás un cambio: en el archivo, tocá **"History"**, elegí la versión anterior y copiá el texto de ahí.
- Cualquier duda, pedíselo a Claude en una sesión: "corregí tal cosa en tal tema".
