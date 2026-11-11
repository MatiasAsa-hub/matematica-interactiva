---
titulo: "Sistemas 3×3: tres planos"
subseccion: Sistemas de ecuaciones
resumen: Tres ecuaciones con x, y, z. Cada una es un plano en el espacio, y la solución es el punto que está en los tres.
orden: 30
interactivo: sistema
modo: explorar
sistemas:
  - "x + y + z = 6 ; 2x - y + z = 3 ; x + 2y - z = 2"
  - "x + y + z = 3 ; x - y + z = 1 ; 2x + 2z = 4"
  - "x + y + z = 2 ; x + y + z = 5 ; x - y = 0"
  - "x + y = 2 ; y + z = 2 ; x - z = 1"
---

## Intuición

Girá el dibujo con el dedo (o con el mouse) y mirá los tres planos desde distintos lados.

- En el primer sistema, ¿dónde está el punto amarillo? Probá sus coordenadas en las tres ecuaciones.
- Prendé **Rectas de corte**. ¿Por dónde pasan las tres rectas?
- Pasá a los otros sistemas. ¿Cuántos puntos tienen en común los tres planos en cada caso?
- Apagá un plano con su casilla: ¿qué ves con solo dos?

## Explicación

- Una ecuación con tres letras, como $x + y + z = 6$, es un **plano** en el espacio (una "hoja" infinita).
- Para dibujar, se agrega un tercer eje: el $z$, que va **para arriba**.
- Un **sistema 3×3** son tres ecuaciones con $x$, $y$, $z$. La solución es el **punto que está en los tres planos**.
- Dos planos (que no sean paralelos) se cortan en una **recta**. Con el tercer plano puede pasar:
  - Corta a esa recta en un punto: **compatible determinado**.
  - Contiene a toda la recta (los tres comparten una recta): **compatible indeterminado**.
  - No hay ningún punto en los tres (hay planos paralelos, o se cortan de a dos como una carpa): **incompatible**.
- Las cuentas se hacen con el [método de Gauss](tema:metodo-de-gauss).

## Para recordar

- Ecuación con $x$, $y$, $z$ = un plano.
- Solución del sistema 3×3 = el punto común a los tres planos.
- Se clasifica igual que los 2×2: CD, CI o I.

## Ejemplo resuelto

Comprobá que $(1, 2, 3)$ es solución del sistema $x + y + z = 6$, $2x - y + z = 3$, $x + 2y - z = 2$.

### Ecuación 1

$1 + 2 + 3 = 6$ ✓

### Ecuación 2

$2 \cdot 1 - 2 + 3 = 3$ ✓

### Ecuación 3

$1 + 2 \cdot 2 - 3 = 2$ ✓. Cumple las tres: es la solución (el punto donde se cruzan los tres planos).

## Ejercicios

### Nivel: Para arrancar

### ¿Es solución?

¿El punto $(1, 1, 1)$ es solución del sistema $x + y + z = 3$, $x - y + z = 1$, $x + y - z = 1$?

- [x] Sí
- [ ] No

pista: Reemplazá en las tres.

### Qué es cada ecuación

Una ecuación con $x$, $y$ y $z$ (como $2x - y + z = 4$), ¿qué es en el espacio?

- [x] Un plano
- [ ] Una recta
- [ ] Un punto

### Nivel: Para animarse

### Planos paralelos

El sistema $x + y + z = 1$, $x + y + z = 4$, $x - z = 0$, ¿cómo es?

- [x] Incompatible
- [ ] Compatible determinado
- [ ] Compatible indeterminado

pista: Las dos primeras tienen los mismos números adelante pero distinto resultado.

### Una que falta

En el sistema $x + y + z = 6$, $y + z = 5$, $z = 3$, ¿cuánto vale $x$?

respuesta: 1

#### Resolución

De abajo hacia arriba: $z = 3$; $y + 3 = 5 \Rightarrow y = 2$; $x + 2 + 3 = 6 \Rightarrow x = 1$.

## Para tutores

### Objetivo

- Ver que una ecuación con tres letras es un plano, y que la solución de un 3×3 es el punto común a los tres.

### Antes tiene que saber

- [Sistemas 2×2: dos rectas](tema:sistemas-2x2) y la [clasificación](tema:clasificacion-de-sistemas).

### Errores típicos

- Pensar que $x + y + z = 6$ es una recta (como en 2D).
- Comprobar en dos ecuaciones y no en las tres.

### Cómo destrabarlo

- Con tres letras, cada ecuación es un plano y no una recta: en el espacio hace falta una "pared" para cumplir una sola condición.
- Ir de a poco: dos planos se cortan en una recta, y el tercero corta a esa recta en un punto.
- La solución tiene tres números: verificar en las tres ecuaciones.

### En el pizarrón

- Usar la esquina del aula como ejes: el piso es $z = 0$ y cada pared es otro plano. Las tres se cortan en un punto (la esquina).
- Con hojas o carpetas se pueden mostrar los casos: tres hojas que se cortan en un punto, que comparten una recta (como un libro abierto) o una "carpa".
- No intentar dibujar los tres planos: escribir el sistema y la terna solución, y verificar reemplazando.
- Un esquema simple de los casos: un punto en común, una recta en común, nada en común.

### Preguntas para el alumno

- ¿En qué se parecen y en qué se diferencian un sistema 2×2 y uno 3×3?
- ¿Cuántos números tiene la solución? ¿Qué es en el dibujo?
- ¿Pueden tres planos no tener ningún punto en común aunque no sean paralelos?
