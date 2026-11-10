---
titulo: Composición de funciones
subseccion: Funciones
resumen: "f ∘ g: dos máquinas en cadena. Primero la de adentro. El orden importa."
orden: 52
interactivo: composicion
# Los ejemplos del interactivo: cada uno con su f y su g.
# Las fórmulas se escriben con x, + − · : ^ y paréntesis (x^2 es x²; 2x es 2 · x).
composiciones:
  - { f: "x^2", g: "x + 1" }
  - { f: "2x", g: "x - 3" }
  - { f: "x + 5", g: "x^2" }
  - { f: "3x - 1", g: "2x" }
---

## Intuición

Mové el deslizador y seguí el número: entra en la primera máquina, lo que sale entra en la segunda.

- Tocá **Dar vuelta el orden**. ¿Sale lo mismo?
- Mirá la fórmula de abajo: ¿dónde quedó la fórmula de *g*?

## Explicación

- **Componer** es encadenar dos funciones: lo que sale de una entra en la otra.
- $(f \circ g)(x) = f(g(x))$ se lee "$f$ de $g$ de $x$". Se hace **primero $g$** (la de adentro) y después $f$.
  - Ejemplo: $f(x) = x^2$ y $g(x) = x + 1$. $(f \circ g)(2) = f(g(2)) = f(3) = 9$.
- **La fórmula:** en la fórmula de $f$, donde dice $x$, se pone **toda** la fórmula de $g$ (entre paréntesis):
  - $f(g(x)) = (x + 1)^2$.
- **El orden importa:** $(g \circ f)(2) = g(f(2)) = g(4) = 5$, que no es 9.

## Para recordar

- $(f \circ g)(x) = f(g(x))$: primero $g$, después $f$.
- Para la fórmula, reemplazar la $x$ de $f$ por toda $g$.
- $f \circ g$ y $g \circ f$ casi siempre son distintas.

## Ejemplo resuelto

Con $f(x) = 2x$ y $g(x) = x - 3$, calculá $(f \circ g)(5)$ y la fórmula de $f \circ g$.

### Paso 1: primero g

$g(5) = 5 - 3 = 2$.

### Paso 2: después f

$f(2) = 2 \cdot 2 = 4$. Entonces $(f \circ g)(5) = 4$.

### Paso 3: la fórmula

En $f(x) = 2x$ pongo $(x - 3)$ en lugar de $x$: $(f \circ g)(x) = 2(x - 3) = 2x - 6$. Compruebo: $2 \cdot 5 - 6 = 4$ ✓

## Ejercicios

### Nivel: Para arrancar

### Un número

Si $f(x) = x + 4$ y $g(x) = 3x$, ¿cuánto vale $(f \circ g)(2)$?

respuesta: 10

#### Resolución

Primero $g(2) = 3 \cdot 2 = 6$. Después $f(6) = 6 + 4 = 10$.

### Al revés

Con las mismas funciones, ¿cuánto vale $(g \circ f)(2)$?

respuesta: 18

#### Resolución

Primero $f(2) = 2 + 4 = 6$. Después $g(6) = 3 \cdot 6 = 18$.

### Con un cuadrado

Si $f(x) = x^2$ y $g(x) = x - 1$, ¿cuánto vale $f(g(4))$?

respuesta: 9

### Nivel: Para animarse

### Con negativos

Si $f(x) = x^2$ y $g(x) = x - 5$, ¿cuánto vale $f(g(2))$?

respuesta: 9

pista: $g(2)$ da negativo. Acordate de los paréntesis al elevar.

#### Resolución

$g(2) = 2 - 5 = -3$. $f(-3) = (-3)^2 = 9$.

### La fórmula

Si $f(x) = 2x + 1$ y $g(x) = x^2$, ¿cuál es $(f \circ g)(x)$?

- [x] $2x^2 + 1$
- [ ] $(2x + 1)^2$
- [ ] $2x + 1 + x^2$

#### Resolución

En $f$ pongo $x^2$ donde dice $x$: $2 \cdot x^2 + 1$. La otra, $(2x + 1)^2$, es $g \circ f$.

### ¿Qué va primero?

En $(f \circ g)(x)$, ¿qué función se aplica primero?

- [x] $g$
- [ ] $f$

## Para tutores

### Objetivo

- Componer dos funciones con números y con la fórmula.
- Entender que se hace primero la de adentro y que el orden importa.

### Antes tiene que saber

- [Qué es una función](tema:que-es-una-funcion) (la máquina) y [orden de las operaciones](tema:orden-de-las-operaciones).

### Errores típicos

- Hacer primero $f$ porque "aparece primero" en $f \circ g$.
- Multiplicar $f(x) \cdot g(x)$ en vez de componer.
- Olvidar los paréntesis al reemplazar: $x - 3$ elevado al cuadrado no es $x - 3^2$.

### En el pizarrón

- Dibujar dos cajitas en fila con flechas: "entra → g → f → sale".
- Hacer la cuenta con un número antes de buscar la fórmula.
- _(para completar)_

### Preguntas para el alumno

- ¿Qué sale si cambio el orden de las máquinas?
- ¿Qué hay que poner en lugar de la $x$ de $f$?
- _(para completar)_
