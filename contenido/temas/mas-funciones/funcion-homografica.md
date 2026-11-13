---
titulo: Función homográfica
subseccion: Funciones
resumen: f(x) = a/(x − h) + k. Dos asíntotas, una vertical y una horizontal.
orden: 60
# Qué temas hay que saber antes (para el Mapa): los nombres de sus archivos, sin ".md".
necesita: [operaciones-con-fracciones, resolver-ecuaciones, que-es-una-funcion]
interactivo: familia
familia: homografica
---

## Intuición

Arrastrá el punto azul cada vez más cerca de la línea punteada vertical. ¿Qué pasa con la cuenta de arriba?

- ¿Y si lo llevás muy lejos, a la derecha o a la izquierda?
- Mové **h** y **k**: ¿qué se mueve junto con las asíntotas?

## Explicación

- La función homográfica más simple es $\frac{1}{x}$: "1 dividido por $x$".
- **Asíntota vertical:** no se puede dividir por 0. Cerca de ese $x$ se divide por algo muy chiquito y da un número **enorme** (positivo o negativo).
- **Asíntota horizontal:** cuando $x$ es muy grande, se divide por algo enorme y da **casi 0**.
- $f(x) = \frac{a}{x - h} + k$:
  - Asíntota vertical en $x = h$ (donde lo de abajo da 0).
  - Asíntota horizontal en $y = k$.
  - Dominio: $\mathbb{R} - \{h\}$. Imagen: $\mathbb{R} - \{k\}$.
- También se escribe como $\frac{mx + n}{x - h}$ (haciendo la cuenta). El interactivo muestra las dos formas.

## Para recordar

- $\frac{a}{x - h} + k$: asíntotas $x = h$ e $y = k$.
- Dominio $\mathbb{R} - \{h\}$, imagen $\mathbb{R} - \{k\}$.
- Raíz: resolver $\frac{a}{x - h} + k = 0$.

## Ejemplo resuelto

Encontrá las asíntotas y la raíz de $f(x) = \frac{2}{x - 1} + 1$.

### Paso 1: las asíntotas

Vertical: $x = 1$ (ahí se dividiría por 0). Horizontal: $y = 1$.

### Paso 2: la raíz

$\frac{2}{x - 1} + 1 = 0 \Rightarrow \frac{2}{x - 1} = -1 \Rightarrow 2 = -1 \cdot (x - 1) \Rightarrow 2 = -x + 1 \Rightarrow x = -1$.

### Paso 3: comprobar

$f(-1) = \frac{2}{-2} + 1 = -1 + 1 = 0$ ✓

## Ejercicios

### Nivel: Para arrancar

### Un valor

Si $f(x) = \frac{6}{x - 1}$, ¿cuánto vale $f(4)$?

respuesta: 2

#### Resolución

$f(4) = 6 : (4 - 1) = 6 : 3 = 2$.

### La asíntota vertical

¿Dónde está la asíntota vertical de $f(x) = \frac{3}{x + 2}$?

- [x] $x = -2$
- [ ] $x = 2$
- [ ] $x = 3$

pista: ¿Para qué $x$ lo de abajo da 0?

### La asíntota horizontal

¿Dónde está la asíntota horizontal de $f(x) = \frac{1}{x - 5} + 4$?

- [x] $y = 4$
- [ ] $y = 5$
- [ ] $y = 0$

### Nivel: Para animarse

### El dominio

¿Cuál es el dominio de $f(x) = \frac{2}{x - 3} - 1$?

- [x] $\mathbb{R} - \{3\}$
- [ ] $\mathbb{R} - \{-1\}$
- [ ] $\mathbb{R}$

### La raíz

¿Cuál es la raíz de $f(x) = \frac{4}{x} - 2$?

respuesta: 2

#### Resolución

$\frac{4}{x} = 2 \Rightarrow 4 = 2x \Rightarrow x = 2$.

### Otra raíz

¿Cuál es la raíz de $f(x) = \frac{3}{x - 1} + 1$?

respuesta: -2

#### Resolución

$\frac{3}{x - 1} = -1 \Rightarrow 3 = -(x - 1) \Rightarrow 3 = -x + 1 \Rightarrow x = -2$.

### La imagen

¿Cuál es la imagen de $f(x) = \frac{1}{x} + 2$?

- [x] $\mathbb{R} - \{2\}$
- [ ] $\mathbb{R} - \{0\}$
- [ ] $\mathbb{R}$

pista: ¿Qué valor nunca llega a tomar? Mirá la asíntota horizontal.

## Para tutores

### Objetivo

- Entender de dónde salen las asíntotas: dividir por algo muy chico o muy grande.
- Encontrar asíntotas, dominio, imagen y raíz en $\frac{a}{x - h} + k$.

### Antes tiene que saber

- [Operaciones con fracciones](tema:operaciones-con-fracciones), [resolver ecuaciones](tema:resolver-ecuaciones) y [qué es una función](tema:que-es-una-funcion).

### Errores típicos

- Poner la asíntota vertical en $x = -2$ para $\frac{1}{x - 2}$ (el signo al revés).
- Creer que la curva "toca" la asíntota.
- Pensar que $\frac{1}{0} = 0$.

### Cómo destrabarlo

- La asíntota vertical está donde el denominador da 0: resolver esa ecuación ($x - 2 = 0$) en vez de mirar el signo.
- "No existe" no es "vale 0": probar con 1.9 y 2.1 en la calculadora y ver qué números enormes salen.
- Para la horizontal: probar con $x = 1000$ y ver a qué número se parece el resultado.
- La curva se acerca todo lo que quiera a la asíntota, pero no la toca: $\frac{1}{x}$ nunca da 0.

### En el pizarrón

- Tabla de $\frac{1}{x}$ con $x$ = 1, 0.5, 0.1, 0.01 y con 10, 100: se ve que crece mucho y que se achica.
- Dibujar primero las dos asíntotas punteadas y después las dos ramas.
- Marcar un punto de cada rama, para saber de qué lado va cada una.

### Preguntas para el alumno

- ¿Cuánto da 1 : 0.001? ¿Y 1 : 1000?
- ¿Por qué la curva nunca toca la recta $y = k$?
- ¿Dónde está la asíntota vertical de $\frac{2}{x - 3}$? ¿Y la horizontal?
- ¿Cuál es el dominio? ¿Y la imagen?
