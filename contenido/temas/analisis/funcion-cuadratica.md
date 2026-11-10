---
titulo: Función cuadrática
subseccion: Funciones
resumen: La parábola, su vértice y sus raíces. Qué hacen a, h y k en f(x) = a(x − h)² + k.
orden: 30
interactivo: cuadratica
---

## Intuición

Mové el deslizador $a$ y fijate qué pasa con la parábola. ¿Qué pasa si $a$ es negativo? ¿Y si $a = 0$?

Después probá con $h$ y con $k$: ¿hacia dónde se mueve el vértice?

## Explicación

Una **función cuadrática** es una función donde la $x$ aparece elevada al cuadrado. Su gráfico es una curva llamada **parábola**.

Empecemos con números. Si $f(x) = (x - 1)^2 - 4$, calculamos algunos valores:

| $x$    | −1 | 0  | 1  | 2  | 3 |
|--------|----|----|----|----|---|
| $f(x)$ | 0  | −3 | −4 | −3 | 0 |

Fijate que los valores bajan hasta $-4$ (en $x = 1$) y después vuelven a subir, **simétricos**. Ese punto más bajo, $(1, -4)$, es el **vértice**.

Escrita así, $f(x) = a(x - h)^2 + k$, se llama **forma canónica**, y cada letra hace una cosa:

- $a$ dice **para dónde abre** y **qué tan cerrada** es. Si $a > 0$, abre para arriba; si $a < 0$, para abajo. Cuanto más grande es $a$ (sin mirar el signo), más cerrada.
- $h$ corre la parábola **a los costados**. Ojo con el signo: $(x - 2)^2$ la corre 2 a la **derecha**, y $(x + 2)^2$, 2 a la **izquierda**.
- $k$ la sube o la baja.

Por eso el **vértice** es $V = (h, k)$, y el **eje de simetría** es la recta vertical $x = h$.

**Las raíces** son los $x$ donde la parábola corta al eje $x$, o sea donde $f(x) = 0$. Puede haber dos, una o ninguna. Para encontrarlas se puede despejar, o desarrollar el cuadrado y usar la **resolvente**.

> La cuadrática es un caso particular de la **función polinómica**: es un polinomio de grado 2. Si desarrollás el cuadrado, te queda de la forma $ax^2 + bx + c$.

## Ejemplo resuelto

Para $f(x) = 2(x - 3)^2 - 2$, encontrá el vértice, las raíces, la ordenada al origen y los conjuntos C⁺ y C⁻. Abrí cada paso cuando quieras verlo.

### Paso 1: el vértice

Está en forma canónica, con $a = 2$, $h = 3$ y $k = -2$. Entonces el vértice es

$$
V = (3, -2)
$$

Como $a = 2 > 0$, la parábola abre para arriba: el vértice es el punto más bajo (un **mínimo**).

### Paso 2: las raíces

Buscamos los $x$ donde $f(x) = 0$:

$$
2(x - 3)^2 - 2 = 0 \;\Rightarrow\; (x - 3)^2 = 1 \;\Rightarrow\; x - 3 = 1 \;\text{ o }\; x - 3 = -1
$$

Entonces $x_1 = 2$ y $x_2 = 4$.

**Con la resolvente** da lo mismo: desarrollando, $f(x) = 2x^2 - 12x + 16$, con $a = 2$, $b = -12$ y $c = 16$.

$$
x_{1,2} = \frac{12 \pm \sqrt{144 - 128}}{4} = \frac{12 \pm 4}{4} \;\Rightarrow\; x_1 = 2, \; x_2 = 4
$$

### Paso 3: la ordenada al origen

Es $f(0)$, donde la parábola corta al eje $y$:

$$
f(0) = 2(0 - 3)^2 - 2 = 2 \cdot 9 - 2 = 16
$$

El punto es $(0, 16)$.

### Paso 4: C⁺ y C⁻

Abre para arriba y corta al eje $x$ en 2 y en 4. Entre las raíces está abajo del eje; afuera, arriba:

- C⁺ = $(-\infty, 2) \cup (4, +\infty)$
- C⁻ = $(2, 4)$
- C⁰ = $\{2, 4\}$

Podés comprobarlo con el gráfico de arriba: poné $a = 2$, $h = 3$ y $k = -2$.

## Ejercicios

Si te trabás, abrí la pista. Podés usar el gráfico de arriba para comprobar.

### El vértice

Para $f(x) = (x + 2)^2 - 1$, ¿cuál es la coordenada $x$ del vértice?

respuesta: -2
pista: Fijate el signo: $(x + 2)$ es lo mismo que $(x - (-2))$.

#### Resolución

En la forma canónica $a(x - h)^2 + k$ va un **menos** adelante de $h$. Como $(x + 2) = (x - (-2))$, queda $h = -2$. El vértice es $(-2, -1)$.

### Las raíces

Encontrá las dos raíces de $f(x) = -(x - 1)^2 + 9$.

respuesta: -2 ; 4
pista: Igualá a cero y despejá: te queda $(x - 1)^2 = 9$. ¿Qué números al cuadrado dan 9?

#### Resolución

$$
-(x - 1)^2 + 9 = 0 \;\Rightarrow\; (x - 1)^2 = 9 \;\Rightarrow\; x - 1 = 3 \;\text{ o }\; x - 1 = -3
$$

Entonces $x = 4$ o $x = -2$.

### ¿Cuántas raíces?

¿Cuántas raíces reales tiene $f(x) = 3(x - 2)^2 + 5$?

- [ ] Dos
- [ ] Una
- [x] Ninguna

pista: ¿Dónde está el vértice? ¿Para dónde abre la parábola?

#### Resolución

El vértice es $(2, 5)$, que está **arriba** del eje $x$, y como $a = 3 > 0$ la parábola abre para arriba. Entonces nunca baja hasta el eje: **no tiene raíces reales**.

### La ordenada al origen

¿Cuánto vale la ordenada al origen de $f(x) = 2(x - 1)^2 - 5$?

respuesta: -3
pista: La ordenada al origen es $f(0)$: reemplazá la $x$ por 0.

#### Resolución

$$
f(0) = 2(0 - 1)^2 - 5 = 2 \cdot 1 - 5 = -3
$$

## Para tutores

### Qué tiene que llevarse el alumno

Que en $f(x) = a(x - h)^2 + k$ puede **leer el vértice sin hacer cuentas** y saber qué hace cada letra.

### Qué tiene que saber antes

- [Función lineal](tema:funcion-lineal) y qué es un gráfico.
- [Potencias](tema:potencias): que $(-3)^2 = 9$.
- [Despejar ecuaciones](tema:ecuaciones) simples.

### Errores típicos y cómo destrabarlos

- **El signo de $h$.** Ven $(x + 2)^2$ y dicen "$h = 2$". Preguntale: *¿para qué $x$ el paréntesis da cero?* Da cero en $x = -2$, y ahí está el vértice.
- **$(x - 3)^2 = x^2 - 9$.** Se olvidan del doble producto. Probá con números: $(5 - 3)^2 = 4$, pero $25 - 9 = 16$. No da lo mismo.
- **Creer que toda parábola tiene dos raíces.** Mostrá en el gráfico una con el vértice arriba del eje que abre para arriba.
- **En la resolvente, el $-b$** cuando $b$ ya es negativo: si $b = -12$, entonces $-b = 12$.
- **Confundir $-x^2$ con $(-x)^2$.** Con $x = 3$: $-3^2 = -9$, pero $(-3)^2 = 9$.

### Cómo explicarlo en un pizarrón chico

1. Dibujá ejes chiquitos y hacé con el alumno la tabla de $y = x^2$ para $x = -2, -1, 0, 1, 2$. Marcá los puntos y unilos: la parábola "madre".
2. Al lado, $y = x^2 + 2$: misma forma, **subida** 2. Eso es $k$.
3. Después $y = (x - 3)^2$: corrida a la **derecha**. Ahí está la trampa del signo.
4. Por último, $a$: con $a = -1$ se da vuelta; con $a = 3$ se cierra.
5. Escribí grande $V = (h, k)$ y recuadralo.

### Preguntas para hacerle al alumno

- Sin hacer cuentas: ¿dónde está el vértice de $f(x) = (x - 4)^2 + 1$?
- ¿Puede una parábola con $a > 0$ y $k > 0$ cortar el eje $x$? ¿Por qué?
- ¿Qué cambia si $a$ pasa de 1 a 3? ¿Y si pasa a −1?
- ¿Cuántas raíces puede tener una cuadrática? Dibujá un ejemplo de cada caso.
