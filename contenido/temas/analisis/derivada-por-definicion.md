---
titulo: Derivada por definición
subseccion: Derivadas
resumen: La cuenta con x y x + h. Con esto se puede llegar a cualquier derivada.
orden: 62
interactivo: secante
# conH: true prende la casilla "Con h en la cuenta" (la pendiente escrita con h)
conH: true
funciones:
  - "x^2"
  - "2x + 1"
  - "x^3"
---

## Intuición

Mirá la casilla **Con h en la cuenta**: la pendiente de la secante escrita con *h*.

- Para $x^2$ en $x = 1$ dice $2 + h$. Achicá *h*: ¿qué le pasa a $2 + h$?
- Mové el punto azul a $x = 2$, $x = 3$… ¿Qué número queda cada vez? ¿Ves un patrón?
- Pasá a $2x + 1$ con ‹ ›. ¿Por qué la cuenta no tiene *h*?

## Explicación

- La derivada es a qué número se acerca el cociente incremental cuando $h$ se achica. Se escribe con un **límite**:

$$
f'(x) = \lim_{h \to 0} \frac{f(x + h) - f(x)}{h}
$$

- "$\lim_{h \to 0}$" se lee "límite cuando $h$ tiende a 0": $h$ se achica todo lo que queramos, pero no es 0.
- **El truco:** primero se hace la cuenta con letras y se simplifica la $h$ de abajo. Recién después se achica $h$.
- Primero con números. Para $f(x) = x^2$ en $x = 3$:
  - $f(3 + h) - f(3) = (3 + h)^2 - 9 = 9 + 6h + h^2 - 9 = 6h + h^2$
  - Divido por $h$: $(6h + h^2) : h = 6 + h$
  - Achico $h$: queda $6$. Entonces $f'(3) = 6$.
- Después con $x$, y sale para todos los puntos de una: para $x^2$ queda $f'(x) = 2x$. Con esto se puede llegar a **cualquier** derivada.
- Para el cuadrado de una suma se usa la [distributiva](tema:distributiva-y-factor-comun): $(x + h)^2 = x^2 + 2xh + h^2$.

## Para recordar

- $f'(x)$: el límite de $(f(x + h) - f(x)) : h$ cuando $h \to 0$.
- Primero simplificar la $h$ de abajo, después achicar $h$.
- $(x^2)' = 2x$.

## Ejemplo resuelto

Calculá por definición la derivada de $f(x) = x^2$.

### Paso 1: f(x + h)

$f(x + h) = (x + h)^2 = x^2 + 2xh + h^2$

### Paso 2: restar f(x)

$f(x + h) - f(x) = x^2 + 2xh + h^2 - x^2 = 2xh + h^2$

### Paso 3: dividir por h

$(2xh + h^2) : h = 2x + h$ (los dos términos tienen $h$: se saca [factor común](tema:distributiva-y-factor-comun) y se simplifica).

### Paso 4: achicar h

Cuando $h \to 0$, $2x + h$ se acerca a $2x$. Entonces $f'(x) = 2x$.

Comprobación: en $x = 1$, $f'(1) = 2$, igual que en la tablita del interactivo.

## Ejercicios

### Nivel: Para arrancar

### Una recta

Para $f(x) = 2x + 1$, ¿cuánto da $(f(x + h) - f(x)) : h$?

respuesta: 2

pista: $f(x + h) = 2(x + h) + 1 = 2x + 2h + 1$.

#### Resolución

$f(x + h) - f(x) = 2x + 2h + 1 - (2x + 1) = 2h$. Dividido $h$ da $2$. La pendiente de una recta es la misma en todos lados.

### Con números

Para $f(x) = x^2$ en $x = 1$, la cuenta da $2 + h$. ¿Cuánto vale $f'(1)$?

respuesta: 2

### Usando la fórmula

Ya sabemos que la derivada de $x^2$ es $2x$. ¿Cuánto vale $f'(5)$?

respuesta: 10

### Una constante

Si $f(x) = 5$ (una recta horizontal), ¿cuánto vale $f'(x)$?

- [x] 0
- [ ] 5
- [ ] 1
- [ ] No tiene derivada

pista: $f(x + h) - f(x) = 5 - 5$.

### Nivel: Para animarse

### Tres por x²

Para $f(x) = 3x^2$, la cuenta da $f'(x) = 6x$. ¿Cuánto vale $f'(2)$?

respuesta: 12

#### Resolución

$3(x + h)^2 - 3x^2 = 6xh + 3h^2$. Dividido $h$: $6x + 3h$. Achicando $h$: $6x$. En $x = 2$: $6 \cdot 2 = 12$.

### Con una suma

Para $f(x) = x^2 + x$, ¿cuánto vale $f'(3)$?

respuesta: 7

pista: Hacé la cuenta con letras: $(x + h)^2 + (x + h) - (x^2 + x)$.

#### Resolución

$(x + h)^2 + (x + h) - x^2 - x = 2xh + h^2 + h$. Dividido $h$: $2x + h + 1$. Achicando $h$: $f'(x) = 2x + 1$. En $x = 3$: $7$.

### El cubo

Usando que $(x + h)^3 = x^3 + 3x^2h + 3xh^2 + h^3$, ¿cuánto vale la derivada de $x^3$ en $x = 2$?

respuesta: 12

#### Resolución

$(x + h)^3 - x^3 = 3x^2h + 3xh^2 + h^3$. Dividido $h$: $3x^2 + 3xh + h^2$. Achicando $h$: $3x^2$. En $x = 2$: $3 \cdot 4 = 12$.

## Para tutores

### Objetivo

- Hacer la cuenta de la definición para funciones simples y ver que da una fórmula para todos los puntos.

### Antes tiene que saber

- [¿Qué es la derivada?](tema:que-es-la-derivada), [distributiva y factor común](tema:distributiva-y-factor-comun) y [términos semejantes](tema:terminos-semejantes).

### Errores típicos

- Poner $h = 0$ antes de simplificar (queda $0 : 0$).
- $(x + h)^2 = x^2 + h^2$ (se olvida el $2xh$).
- No restar todo $f(x)$: olvidar el paréntesis en $-(2x + 1)$.

### En el pizarrón

- Escribir la fórmula del límite arriba y resolver en renglones, como una ecuación.
- Hacerlo primero con $x = 3$ y después con $x$.
- _(para completar)_

### Preguntas para el alumno

- ¿Por qué hay que simplificar antes de achicar $h$?
- Con $f'(x) = 2x$, ¿cuánto vale la pendiente en $x = -1$? ¿Sube o baja?
- _(para completar)_
