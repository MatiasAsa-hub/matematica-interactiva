---
titulo: Funciones partidas
subseccion: Funciones
resumen: Funciones con distintas fórmulas según dónde esté x. Puntos llenos y huecos, saltos.
orden: 10
# Qué temas hay que saber antes (para el Mapa): los nombres de sus archivos, sin ".md".
necesita: [desigualdades-e-intervalos, funcion-lineal, que-es-una-funcion]
interactivo: partida
# Los ejemplos del interactivo. Cada tramo es "fórmula si condición", separados por ";".
# Condiciones: x < 1, x <= 1, x > 1, x >= 1, o entre dos números: -2 <= x < 2
partidas:
  - "x + 2 si x < 1 ; 3 si x >= 1"
  - "x^2 si x <= 1 ; -x + 4 si x > 1"
  - "-x si x < 0 ; x si x >= 0"
  - "-1 si x < -2 ; x + 1 si -2 <= x < 2 ; 3 si x >= 2"
---

## Intuición

Arrastrá el punto azul grande y fijate qué renglón de la llave se marca.

- ¿Qué cuenta se hace cuando el punto está a la izquierda del corte? ¿Y a la derecha?
- Mové el **corte**: ¿dónde tiene que estar para que la curva no salte?
- Tocá **Cambiar de qué lado va el punto del corte**: ¿qué punto se llena y cuál queda hueco?
- Pasá a las otras funciones con las flechitas ‹ ›. La tercera, ¿a qué función que ya conocés se parece?

## Explicación

- Una **función partida** usa **distintas fórmulas** según dónde esté $x$. Se escribe con una llave:

$$
f(x) = \begin{cases} x + 2 & \text{si } x < 1 \\ 3 & \text{si } x \geq 1 \end{cases}
$$

- Para calcular $f$ de un número: **primero** se mira en qué tramo cae, **después** se hace la cuenta de ese tramo.
  - $f(-2)$: como $-2 < 1$, uso $x + 2$: $f(-2) = 0$.
  - $f(5)$: como $5 \geq 1$, uso $3$: $f(5) = 3$.
- En el **corte**, el punto va **lleno** del lado que tiene el igual ($\leq$ o $\geq$) y **hueco** del otro. Es lo mismo que el corchete y el paréntesis de los [intervalos](tema:desigualdades-e-intervalos).
- Si los dos tramos llegan a la misma altura en el corte, la curva **se pega**. Si no, **salta**.
- El [módulo](tema:funcion-modulo) es una función partida: $|x| = -x$ si $x < 0$, y $x$ si $x \geq 0$.

## Para recordar

- Primero ver en qué tramo cae $x$, después hacer la cuenta.
- $\leq$ o $\geq$: punto lleno. $<$ o $>$: punto hueco.
- En el corte la curva puede pegarse o saltar.

## Ejemplo resuelto

Para $f(x) = \begin{cases} x^2 & \text{si } x \leq 1 \\ -x + 4 & \text{si } x > 1 \end{cases}$, calculá $f(1)$ y $f(3)$, y fijate si salta en $x = 1$.

### Paso 1: f(1)

$1 \leq 1$, así que uso $x^2$: $f(1) = 1^2 = 1$.

### Paso 2: f(3)

$3 > 1$, así que uso $-x + 4$: $f(3) = -3 + 4 = 1$.

### Paso 3: ¿salta?

El tramo de la izquierda llega a $1^2 = 1$. El de la derecha arranca en $-1 + 4 = 3$. No coinciden: **salta 2**. En $x = 1$ el punto lleno está abajo, en $(1, 1)$, y el hueco arriba, en $(1, 3)$.

## Ejercicios

### Nivel: Para arrancar

### A la izquierda

Si $f(x) = \begin{cases} 2x & \text{si } x < 0 \\ x + 5 & \text{si } x \geq 0 \end{cases}$, ¿cuánto vale $f(-3)$?

respuesta: -6

#### Resolución

$-3 < 0$, así que uso $2x$: $f(-3) = 2 \cdot (-3) = -6$.

### A la derecha

Con la misma función, ¿cuánto vale $f(2)$?

respuesta: 7

### Justo en el corte

Con la misma función, ¿cuánto vale $f(0)$?

respuesta: 5

pista: ¿Qué tramo tiene el igual?

#### Resolución

$0 \geq 0$, así que uso $x + 5$: $f(0) = 5$.

### Lleno o hueco

En $f(x) = \begin{cases} 1 & \text{si } x < 2 \\ 4 & \text{si } x \geq 2 \end{cases}$, ¿cómo va el punto $(2, 1)$?

- [x] Hueco
- [ ] Lleno

pista: El 2, ¿está incluido en "x < 2"?

### Nivel: Para animarse

### Tres tramos

Si $f(x) = \begin{cases} -1 & \text{si } x < -2 \\ x + 1 & \text{si } -2 \leq x < 2 \\ 3 & \text{si } x \geq 2 \end{cases}$, ¿cuánto vale $f(1.5)$?

respuesta: 2.5

### ¿Salta?

$f(x) = \begin{cases} x + 1 & \text{si } x < 2 \\ 5 & \text{si } x \geq 2 \end{cases}$. ¿Cuánto salta en $x = 2$?

respuesta: 2

#### Resolución

El tramo de la izquierda llega a $2 + 1 = 3$; el de la derecha vale 5. Salta $5 - 3 = 2$.

### Que no salte

$f(x) = \begin{cases} 2x & \text{si } x < 3 \\ k & \text{si } x \geq 3 \end{cases}$. ¿Cuánto tiene que valer $k$ para que la curva no salte?

respuesta: 6

pista: ¿A qué altura llega el primer tramo en $x = 3$?

#### Resolución

El primer tramo llega a $2 \cdot 3 = 6$. Para que se pegue, $k = 6$.

## Para tutores

### Objetivo

- Leer una función partida: primero el tramo, después la cuenta.
- Dibujarla con puntos llenos y huecos, y ver si salta.

### Antes tiene que saber

- [Desigualdades e intervalos](tema:desigualdades-e-intervalos), [función lineal](tema:funcion-lineal) y [qué es una función](tema:que-es-una-funcion).

### Errores típicos

- Hacer la cuenta con todos los tramos, o con el equivocado.
- En el corte, no saber qué tramo usar (mirar el igual).
- Dibujar cada fórmula entera en vez de solo su pedazo.

### Cómo destrabarlo

- Antes de calcular, una sola pregunta: "¿en qué tramo cae este $x$?". Recién después se elige la fórmula.
- En el corte, mirar quién tiene el $\leq$ o el $\geq$: ese tramo se queda con el punto.
- Al dibujar, tapar con la mano el lado que no le toca a esa fórmula.

### En el pizarrón

- Marcar el corte con una línea vertical suave y dibujar cada tramo de su lado.
- Primero los puntos del corte (lleno o hueco), después el resto.
- Escribir la función con la llave y, debajo de cada renglón, una tablita de 2 o 3 puntos de ese tramo.

### Preguntas para el alumno

- ¿Cuánto vale $f$ justo en el corte? ¿Por qué?
- ¿Se puede dibujar sin levantar el lápiz?
- ¿Qué fórmula usás para calcular $f(0)$? ¿Y $f(5)$?
- ¿Cómo tendría que ser el segundo tramo para que no haya salto?
