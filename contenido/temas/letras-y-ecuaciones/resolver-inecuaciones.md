---
titulo: Resolver inecuaciones
subseccion: Ecuaciones e inecuaciones
resumen: Se despeja como una ecuación, pero ojo al dividir por un negativo. La solución es un intervalo.
orden: 60
interactivo: inecuacion
# Las inecuaciones del interactivo, en orden. Se pueden agregar o cambiar.
# Se puede escribir >= y <= en lugar de ≥ y ≤.
inecuaciones:
  - "2x − 3 > 5"
  - "3x + 2 ≤ x + 8"
  - "−2x + 1 < 7"
  - "4 − x ≥ 2"
  - "x + 1 > x"
---

## Intuición

Probá números con el deslizador y mirá cuáles cumplen: se van marcando en la recta.

- ¿Dónde están los que cumplen?
- Tocá **Resolver paso a paso**. ¿Coincide con lo que probaste?
- Mirá la tercera: ¿qué le pasa al signo?

## Explicación

- Una **inecuación** es como una ecuación, pero con $<$, $>$, $\leq$ o $\geq$.
- La solución no es un número: es un **intervalo** (muchos números).
- Se despeja igual que una ecuación: lo mismo de los dos lados.
- **La trampa:** si multiplicás o dividís por un número **negativo**, **se da vuelta el signo**.
  - ¿Por qué? $2 < 3$, pero $-2 > -3$. Multiplicar por un negativo da vuelta la recta, como un espejo en el 0 (lo viste en [multiplicar con signos](tema:multiplicar-y-dividir-con-signos)).
- Sumar o restar (aunque sea un negativo) **no** da vuelta el signo.
- Casos raros: si las $x$ se van, queda algo siempre verdadero (solución $\mathbb{R}$) o siempre falso (solución $\varnothing$).

## Para recordar

- Igual que una ecuación…
- …pero **dividir o multiplicar por un negativo da vuelta el signo**.
- La solución se escribe como intervalo.
- Para verificar: probá un número de adentro y uno de afuera.

## Ejemplo resuelto

Resolvé $-3x + 2 \geq 11$.

### Paso 1: sacar el número

Restamos 2 de los dos lados: $-3x \geq 9$.

### Paso 2: dividir por −3

Dividimos por $-3$, que es **negativo**: se da vuelta el signo. $x \leq -3$.

### Paso 3: el intervalo

$(-\infty, -3]$.

### Paso 4: verificar

Con $x = -4$ (adentro): $-3 \cdot (-4) + 2 = 14 \geq 11$ ✓. Con $x = 0$ (afuera): $2 \geq 11$ ✗.

## Ejercicios

### Nivel: Para arrancar

### Sin trampa

Resolvé $x + 4 > 9$.

- [x] $(5, +\infty)$
- [ ] $[5, +\infty)$
- [ ] $(-\infty, 5)$

### Dividir por positivo

Resolvé $3x \leq 12$.

- [ ] $(-\infty, 4)$
- [x] $(-\infty, 4]$
- [ ] $[4, +\infty)$

### ¿Cumple?

¿El $x = 2$ cumple $5x - 1 < 9$?

- [ ] Sí
- [x] No

#### Resolución

$5 \cdot 2 - 1 = 9$, y $9 < 9$ es falso (9 no es menor que 9).

### Nivel: Para animarse

### Con la trampa

Resolvé $-2x > 8$.

- [ ] $(-4, +\infty)$
- [x] $(-\infty, -4)$
- [ ] $(4, +\infty)$

pista: Dividís por −2, que es negativo.

#### Resolución

Dividimos por $-2$ y se da vuelta el signo: $x < -4$.

### x de los dos lados

Resolvé $5x - 2 \geq 2x + 7$.

- [x] $[3, +\infty)$
- [ ] $(3, +\infty)$
- [ ] $(-\infty, 3]$

#### Resolución

Restamos $2x$: $3x - 2 \geq 7$. Sumamos 2: $3x \geq 9$. Dividimos por 3: $x \geq 3$.

### El borde

En $7 - x < 4$, la solución es $x > \,?$. ¿Qué número va?

respuesta: 3

#### Resolución

Restamos 7: $-x < -3$. Dividimos por $-1$ (se da vuelta): $x > 3$.

### ¿Siempre?

¿Cuál es la solución de $2x + 3 > 2x$?

- [x] $\mathbb{R}$ (todos los números)
- [ ] $\varnothing$ (ninguno)
- [ ] $(0, +\infty)$

## Para tutores

### Objetivo

- Resolver inecuaciones lineales y escribir la solución como intervalo.
- Saber por qué se da vuelta el signo al multiplicar o dividir por un negativo.

### Antes tiene que saber

- [Resolver ecuaciones](tema:resolver-ecuaciones) y [desigualdades e intervalos](tema:desigualdades-e-intervalos).

### Errores típicos

- Olvidarse de dar vuelta el signo al dividir por un negativo.
- Darlo vuelta cuando se **resta** un número (no hace falta).
- Dar un solo número como respuesta.

### Cómo destrabarlo

- Probar con números: elegir uno de la respuesta y uno de afuera, y ver si cumplen la inecuación del principio.
- Para el signo que gira: partir de $2 < 3$, multiplicar los dos por $-1$ y mirar la recta: $-2 > -3$.
- Si dan un solo número como respuesta: "¿y el 10 cumple? ¿y el 100?".

### En el pizarrón

- Mostrar $2 < 3$ y $-2 > -3$ en una recta, para ver por qué se da vuelta.
- Resolver $2x + 1 > 7$ igual que una ecuación y pintar la solución en la recta.
- Resolver $-2x > 8$ marcando con un círculo el momento en que gira el signo.
- Escribir la respuesta de tres formas: $x < -4$, en la recta y $(-\infty, -4)$.

### Preguntas para el alumno

- ¿Por qué en $-2x > 8$ cambia el signo y en $x - 2 > 8$ no?
- Decime un número que cumpla y uno que no.
- Si la solución es $x \geq 3$, ¿el 3 cumple? ¿Cómo lo comprobás?
- ¿Qué pasa si al final queda $0 < 5$? ¿Y si queda $0 > 5$?
