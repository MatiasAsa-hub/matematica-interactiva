---
titulo: ¿Qué es una función?
subseccion: Funciones
resumen: Una regla que a cada x le da un f(x). Tabla, fórmula y gráfico. Dominio e imagen.
orden: 10
# Qué temas hay que saber antes (para el Mapa): los nombres de sus archivos, sin ".md".
necesita: [orden-de-las-operaciones, potencias-y-raices, que-es-una-ecuacion]
interactivo: funcion
# Las funciones de la "máquina". Se escriben con x, + − · : ^ y paréntesis
# (x^2 es x²; 2x es 2 · x). Se prueban con x de −4 a 4.
funciones:
  - "2x + 1"
  - "x^2"
  - "3 − x"
  - "6 : x"
---

## Intuición

La función es una **máquina**: entra un número, la regla hace la cuenta y sale otro. Mové el deslizador y mirá qué sale.

- Cada número que probás aparece en la **tabla** y como un **punto** en el gráfico.
- Cuando tengas varios, tocá **Unir los puntos**.
- Probá la última función con $x = 0$: ¿qué pasa?

## Explicación

- Una **función** es una regla que a cada número $x$ le asigna **un solo** resultado, $f(x)$ (se lee "f de x").
- Se puede mostrar de tres formas, que dicen lo mismo:
  - **Fórmula:** $f(x) = 2x + 1$.
  - **Tabla:** cada $x$ con su $f(x)$.
  - **Gráfico:** cada par $(x, f(x))$ es un punto. Con todos los puntos se forma una línea.
- $f(3)$ quiere decir: "reemplazá $x$ por 3 y hacé la cuenta". $f(3) = 2 \cdot 3 + 1 = 7$, y el punto es $(3, 7)$.
- **Dominio:** los $x$ que pueden entrar en la máquina. Casi siempre son todos ($\mathbb{R}$). Pero en $f(x) = 6 : x$ el 0 no puede entrar (no se divide por 0).
- **Imagen:** los resultados que pueden salir. Por ejemplo, $x^2$ nunca da negativo: su imagen es $[0, +\infty)$.

## Para recordar

- Función = regla: a cada $x$, **un** $f(x)$.
- $f(3)$: reemplazar $x$ por 3.
- Cada $(x, f(x))$ es un punto del gráfico.
- Dominio: lo que puede entrar. Imagen: lo que puede salir.

## Ejemplo resuelto

Para $f(x) = x^2 - 1$, completá la tabla con $x = -2, 0, 2$ y decí qué puntos son.

### Paso 1: reemplazar

$f(-2) = (-2)^2 - 1 = 4 - 1 = 3$.
$f(0) = 0^2 - 1 = -1$.
$f(2) = 2^2 - 1 = 3$.

### Paso 2: los puntos

$(-2, 3)$, $(0, -1)$ y $(2, 3)$. Ojo: el $-2$ va entre paréntesis al elevarlo.

## Ejercicios

### Nivel: Para arrancar

### Reemplazar

Si $f(x) = 3x - 2$, ¿cuánto vale $f(4)$?

respuesta: 10

### Con un negativo

Si $f(x) = 5 - x$, ¿cuánto vale $f(-3)$?

respuesta: 8

pista: $5 - (-3)$.

### Al cuadrado

Si $f(x) = x^2 + 1$, ¿cuánto vale $f(-3)$?

respuesta: 10

#### Resolución

$f(-3) = (-3)^2 + 1 = 9 + 1 = 10$.

### Nivel: Para animarse

### ¿Está en el gráfico?

Si $f(x) = 2x + 1$, ¿cuál de estos puntos está en su gráfico?

- [ ] $(2, 4)$
- [x] $(2, 5)$
- [ ] $(5, 2)$

pista: Calculá $f(2)$.

### Al revés

Si $f(x) = 2x + 1$, ¿para qué $x$ da $f(x) = 9$?

respuesta: 4

pista: Es una ecuación: $2x + 1 = 9$.

### Dominio

¿Qué número **no** está en el dominio de $f(x) = 10 : (x - 2)$?

respuesta: 2

pista: ¿Para qué $x$ quedaría dividir por 0?

#### Resolución

Si $x = 2$, queda $10 : 0$, que no se puede hacer. Todos los demás números sí pueden entrar.

## Para tutores

### Objetivo

- Entender la función como una regla que transforma números.
- Pasar de fórmula a tabla y a gráfico.

### Antes tiene que saber

- [Orden de las operaciones](tema:orden-de-las-operaciones) y [potencias](tema:potencias-y-raices).
- [Qué es una ecuación](tema:que-es-una-ecuacion) (reemplazar $x$ por un número).

### Errores típicos

- Leer $f(x)$ como "f por x".
- Escribir $-2^2$ en lugar de $(-2)^2$ al reemplazar.
- Dar vuelta el punto: $(f(x), x)$ en vez de $(x, f(x))$.

### Cómo destrabarlo

- $f(3)$ no es "f por 3": leerlo siempre "f de 3", lo que sale cuando entra el 3.
- Al reemplazar por un negativo, escribir el paréntesis antes de hacer la cuenta: $(-2)^2$.
- Para el punto: primero camino en $x$ (lo que entra) y después subo o bajo $f(x)$ (lo que sale).
- Dominio: "¿qué números puedo meter en la máquina sin que se rompa?".

### En el pizarrón

- Dibujar la máquina (entra $x$ → regla → sale $f(x)$), al lado la tabla y al lado los ejes.
- Llenar la tabla con 4 o 5 valores de $x$ (alguno negativo) para $f(x) = 2x + 1$.
- Pasar cada renglón de la tabla a un punto y unirlos.
- Repetir rápido con $6 : x$ y frenar en $x = 0$: no se puede.

### Preguntas para el alumno

- ¿Qué quiere decir $f(5) = 2$? ¿Qué punto es?
- Si $f(x) = x^2$, ¿cuánto vale $f(-3)$?
- ¿Puede haber dos $x$ distintos con el mismo resultado? ¿Y un $x$ con dos resultados?
- ¿Qué número no se puede usar en $6 : x$? ¿Por qué?
