---
titulo: Ecuación del plano
subseccion: Vectores y planos
resumen: "a·x + b·y + c·z = d: los números de adelante forman el vector normal, la flecha perpendicular al plano."
orden: 90
interactivo: plano3d
# Los planos de ejemplo (los números de adelante, de −3 a 3; el resultado, de −8 a 8)
planos:
  - "x + y + 2z = 4"
  - "z = 2"
  - "2x + 3y = 6"
  - "x + y + z = 0"
---

## Intuición

Girá el dibujo con el dedo y mové los deslizadores de a uno.

- ¿Qué pasa con el plano cuando movés solo **d**? ¿Y la flecha lila?
- ¿Y cuando movés **a**, **b** o **c**?
- Pasá al plano $z = 2$. ¿Cómo es? ¿Para dónde apunta la flecha?
- Prendé **Cortes con los ejes**. En $x + y + 2z = 4$, ¿dónde corta a cada eje?

## Explicación

- Un plano en el espacio se escribe así (la **ecuación general**):

$$
a \cdot x + b \cdot y + c \cdot z = d
$$

- Los números de adelante forman el **vector normal** $n = (a, b, c)$: una flecha **perpendicular** al plano. Dice para dónde "mira" el plano.
- Si cambiás solo $d$, el plano se corre **paralelo**. Con $d = 0$, pasa por el origen.
- Dos planos son **paralelos** si sus vectores normales son uno múltiplo del otro: $x + y + z = 1$ y $2x + 2y + 2z = 7$.
- **Para armar la ecuación** con un punto $P = (x_0, y_0, z_0)$ y el normal $(a, b, c)$:
  1. Se escribe $a \cdot x + b \cdot y + c \cdot z = d$ con los números del normal.
  2. Para encontrar $d$, se reemplaza el punto: $d = a \cdot x_0 + b \cdot y_0 + c \cdot z_0$.
- **¿Un punto está en el plano?** Se reemplaza y se mira si se cumple la ecuación.
- **Cortes con los ejes:** para el eje $x$, se pone $y = 0$ y $z = 0$ y se despeja $x$.
- Cada ecuación de un [sistema 3×3](tema:sistemas-3x3) es uno de estos planos.

## Para recordar

- Plano: $a x + b y + c z = d$.
- Vector normal: $(a, b, c)$, perpendicular al plano.
- $d$ se encuentra reemplazando un punto del plano.

## Ejemplo resuelto

Encontrá la ecuación del plano que pasa por $P = (1, 2, 0)$ y tiene vector normal $n = (2, -1, 3)$.

### Paso 1: los números de adelante

Con el normal: $2x - y + 3z = d$.

### Paso 2: encontrar d

Reemplazo el punto: $d = 2 \cdot 1 - 2 + 3 \cdot 0 = 0$.

### Paso 3: la ecuación

$2x - y + 3z = 0$. (Pasa por el origen, porque $d = 0$.)

## Ejercicios

### Nivel: Para arrancar

### El vector normal

¿Cuál es un vector normal del plano $3x - y + 2z = 5$?

- [x] $(3, -1, 2)$
- [ ] $(3, -1, 5)$
- [ ] $(3, 1, 2)$

### ¿Está en el plano?

¿El punto $(1, 1, 1)$ está en el plano $x + 2y - z = 2$?

- [x] Sí
- [ ] No

pista: $1 + 2 - 1$.

### Nivel: Para animarse

### Corte con el eje x

¿En qué valor de $x$ corta el plano $2x + 3y + z = 8$ al eje $x$?

respuesta: 4

pista: Poné $y = 0$ y $z = 0$.

### Encontrar d

El plano con normal $(1, 2, -1)$ pasa por el punto $(3, 0, 1)$. Su ecuación es $x + 2y - z = d$. ¿Cuánto vale $d$?

respuesta: 2

#### Resolución

$d = 3 + 2 \cdot 0 - 1 = 2$.

### Paralelos

¿Cuál de estos planos es paralelo a $x - 2y + z = 3$?

- [x] $2x - 4y + 2z = 1$
- [ ] $x + 2y + z = 3$
- [ ] $2x - 2y + z = 3$

pista: Los vectores normales tienen que ser uno múltiplo del otro.

## Para tutores

### Objetivo

- Leer y armar la ecuación de un plano, y entender el vector normal.

### Antes tiene que saber

- [Vectores](tema:vectores) y [sistemas 3×3](tema:sistemas-3x3).

### Errores típicos

- Confundir el vector normal con un vector que está "dentro" del plano.
- Poner el $d$ dentro del vector normal.
- Errores de signo al reemplazar el punto.

### Cómo destrabarlo

- El vector normal no está "en" el plano: sale parado, como un poste en el piso.
- Se lee directo de los números que acompañan a $x$, $y$, $z$: $(a, b, c)$. El $d$ queda afuera: solo corre el plano sin inclinarlo.
- Para saber si un punto está en el plano: reemplazar $x$, $y$, $z$ (con paréntesis si son negativos) y ver si se cumple la igualdad.
- Los cortes con los ejes: poner en 0 las otras dos letras y despejar.

### En el pizarrón

- Usar una carpeta como plano y un lápiz parado encima como vector normal: si se inclina la carpeta, el lápiz se inclina con ella.
- Escribir $2x + y + z = 4$, sacar los tres cortes con los ejes y unirlos: queda un triángulo que muestra el plano.
- Anotar al lado el vector normal $(2, 1, 1)$.

### Preguntas para el alumno

- ¿Qué cambia en el plano si cambiás $d$? ¿Y si cambiás el vector normal?
- ¿Cómo sabés si dos planos son paralelos?
- ¿El punto $(1, 1, 1)$ está en el plano $2x + y + z = 4$?
