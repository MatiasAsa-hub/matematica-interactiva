---
titulo: Función cuadrática
subseccion: Funciones
resumen: La parábola, sus raíces y su vértice. La forma polinómica y la canónica.
orden: 30
interactivo: cuadratica
---

## Intuición

Mové el deslizador $a$ y fijate qué pasa con la parábola. ¿Qué pasa si $a$ es negativo? ¿Y si $a = 0$?

Después probá con $b$ y con $c$. Por último, tocá **Canónica**: ¡es la misma parábola, escrita de otra forma!

## Explicación

- Una **función cuadrática** tiene $x^2$. Su gráfico es una **parábola**.
- **Forma polinómica:** $f(x) = ax^2 + bx + c$. Es un polinomio de grado 2.
  - $a > 0$: abre para arriba. $a < 0$: abre para abajo.
  - $c$ es la **ordenada al origen**: $f(0) = c$.
- **Raíces:** los $x$ donde $f(x) = 0$. Se calculan con la **resolvente**:

$$
x_{1,2} = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
$$

- Si $b^2 - 4ac > 0$ hay dos raíces; si es $0$, una; si es negativo, ninguna.
- **Vértice:** $x_v = \dfrac{-b}{2a}$, y después $y_v = f(x_v)$.
- **Forma canónica:** $f(x) = a(x - h)^2 + k$. Ahí el vértice se lee directo: $V = (h, k)$.

## Para recordar

- **Raíces:** con la resolvente, $x_{1,2} = \dfrac{-b \pm \sqrt{b^2 - 4ac}}{2a}$.
- **Vértice:** $x_v = \dfrac{-b}{2a}$, y después $y_v = f(x_v)$.
- **Ordenada al origen:** es $c$.

## Ejemplo resuelto

Para $f(x) = x^2 - 2x - 3$, encontrá las raíces, el vértice y la ordenada al origen.

### Paso 1: las raíces

$a = 1$, $b = -2$, $c = -3$. Con la resolvente:

$$
x_{1,2} = \frac{2 \pm \sqrt{4 + 12}}{2} = \frac{2 \pm 4}{2} \;\Rightarrow\; x_1 = -1, \; x_2 = 3
$$

### Paso 2: el vértice

$$
x_v = \frac{-(-2)}{2 \cdot 1} = 1, \qquad y_v = f(1) = 1 - 2 - 3 = -4
$$

$V = (1, -4)$.

### Paso 3: la ordenada al origen

$f(0) = c = -3$. El punto es $(0, -3)$.

## Ejercicios

### Nivel: Para arrancar

### Raíces

Encontrá las raíces de $f(x) = x^2 - 5x + 6$.

respuesta: 2 ; 3
pista: $a = 1$, $b = -5$, $c = 6$. Usá la resolvente.

#### Resolución

$$
x_{1,2} = \frac{5 \pm \sqrt{25 - 24}}{2} = \frac{5 \pm 1}{2} \;\Rightarrow\; x_1 = 2, \; x_2 = 3
$$

### Raíces sin b

Encontrá las raíces de $f(x) = 2x^2 - 8$.

respuesta: -2 ; 2
pista: No hace falta la resolvente: igualá a cero y despejá $x^2$.

#### Resolución

$2x^2 - 8 = 0 \Rightarrow x^2 = 4 \Rightarrow x = 2$ o $x = -2$.

### Nivel: Para animarse

### ¿Cuántas raíces?

¿Cuántas raíces reales tiene $f(x) = x^2 + 2x + 5$?

- [ ] Dos
- [ ] Una
- [x] Ninguna

pista: Calculá $b^2 - 4ac$.

#### Resolución

$b^2 - 4ac = 4 - 20 = -16$, que es negativo: **no tiene raíces reales**.

### El vértice

¿Cuál es la coordenada $x$ del vértice de $f(x) = x^2 - 6x + 5$?

respuesta: 3
pista: $x_v = \dfrac{-b}{2a}$.

#### Resolución

$x_v = \dfrac{-(-6)}{2 \cdot 1} = 3$. (Y $y_v = f(3) = 9 - 18 + 5 = -4$.)

### La ordenada al origen

¿Cuánto vale la ordenada al origen de $f(x) = 2x^2 + 3x - 4$?

respuesta: -4
pista: Es $f(0)$.

#### Resolución

$f(0) = 2 \cdot 0 + 3 \cdot 0 - 4 = -4$. En la forma polinómica, es directamente $c$.

### Vértice en la forma canónica

¿Cuál es la coordenada $x$ del vértice de $f(x) = (x + 2)^2 - 1$?

respuesta: -2
pista: Ojo con el signo: $(x + 2) = (x - (-2))$.

#### Resolución

En $a(x - h)^2 + k$ va un menos adelante de $h$. Como $(x + 2) = (x - (-2))$, $h = -2$.

## Para tutores

### Objetivo

- Calcular raíces con la resolvente y el vértice.
- Ver que la forma polinómica y la canónica son la misma parábola.

### Antes tiene que saber

- [Potencias](tema:potencias-y-raices) y [números con signo](tema:sumar-y-restar-con-signos).
- [Resolver ecuaciones](tema:resolver-ecuaciones) y [función lineal](tema:funcion-lineal).

### Errores típicos

- Signo de $-b$ cuando $b$ es negativo.
- Dividir por $2a$ solo una parte de la resolvente.
- Creer que siempre hay dos raíces.
- El signo de $h$ en la forma canónica.

### En el pizarrón

- _(para completar)_

### Preguntas para el alumno

- _(para completar)_
