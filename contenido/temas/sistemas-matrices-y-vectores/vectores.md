---
titulo: Vectores
subseccion: Vectores y planos
resumen: Flechas con componentes. Suma, resta, producto por un número, módulo y producto escalar, en el plano y en el espacio.
orden: 80
interactivo: vectores
---

## Intuición

Arrastrá las puntas de las flechas y probá las cuatro operaciones de arriba.

- En **Suma**, ¿adónde llega la flecha blanca? Fijate en la naranja punteada.
- En **Por un número**, ¿qué pasa si el número es negativo? ¿Y si es 0.5?
- En **Producto escalar**, buscá una posición donde dé 0. ¿Cómo quedan las flechas?

## Explicación

- Un **vector** es una flecha: tiene un largo, una dirección y un sentido. Se escribe con sus **componentes**: $u = (3, 1)$ quiere decir "avanzo 3 en $x$ y subo 1 en $y$".
- **Suma:** se suman las componentes. $(3, 1) + (1, 2) = (4, 3)$. En el dibujo: se pone una flecha a continuación de la otra.
- **Resta:** $u - v$ es la flecha que va de la punta de $v$ a la punta de $u$. $(3, 1) - (1, 2) = (2, -1)$.
- **Por un número:** $2 \cdot (3, 1) = (6, 2)$. La flecha se estira; si el número es negativo, se da vuelta.
- **Módulo** (el largo), con Pitágoras: $|u| = \sqrt{3^2 + 1^2} = \sqrt{10} \approx 3.16$.
- **Producto escalar:** se multiplican las componentes de a pares y se suman. Da un **número**:

$$
u \cdot v = u_1 \cdot v_1 + u_2 \cdot v_2
$$

- Si el producto escalar da **0**, los vectores son **perpendiculares** (forman un ángulo recto).
- **En el espacio**, es todo igual pero con tres componentes $(x, y, z)$:
  - $(1, 2, 3) + (0, 1, -1) = (1, 3, 2)$.
  - $|(1, 2, 2)| = \sqrt{1 + 4 + 4} = 3$.
  - $(1, 2, 3) \cdot (2, 0, -1) = 2 + 0 - 3 = -1$.
- Los vectores en el espacio se usan para la [ecuación del plano](tema:ecuacion-del-plano).

## Para recordar

- Suma y resta: componente por componente.
- $|u| = \sqrt{u_1^2 + u_2^2}$ (en el espacio, con $u_3^2$ también).
- $u \cdot v = 0$ → perpendiculares.

## Ejemplo resuelto

Con $u = (2, 3)$ y $v = (3, -2)$: calculá $u + v$, $|u|$ y $u \cdot v$.

### Suma

$u + v = (2 + 3, 3 + (-2)) = (5, 1)$.

### Módulo

$|u| = \sqrt{2^2 + 3^2} = \sqrt{13} \approx 3.61$.

### Producto escalar

$u \cdot v = 2 \cdot 3 + 3 \cdot (-2) = 6 - 6 = 0$. ¡Son perpendiculares!

## Ejercicios

### Nivel: Para arrancar

### Una suma

$(4, -1) + (2, 5) = (a, b)$. ¿Cuánto vale $b$?

respuesta: 4

### Por un número

$-3 \cdot (2, -1) = (a, b)$. ¿Cuánto vale $a$?

respuesta: -6

### El largo

¿Cuál es el módulo de $(3, 4)$?

respuesta: 5

pista: $\sqrt{3^2 + 4^2}$.

### Nivel: Para animarse

### Producto escalar

¿Cuánto vale $(1, 2) \cdot (4, -3)$?

respuesta: -2

#### Resolución

$1 \cdot 4 + 2 \cdot (-3) = 4 - 6 = -2$.

### Perpendiculares

¿Cuánto tiene que valer $k$ para que $(2, k)$ sea perpendicular a $(3, 6)$?

respuesta: -1

#### Resolución

El producto escalar tiene que dar 0: $2 \cdot 3 + k \cdot 6 = 0 \Rightarrow 6k = -6 \Rightarrow k = -1$.

### En el espacio

¿Cuál es el módulo de $(2, 3, 6)$?

respuesta: 7

pista: $\sqrt{4 + 9 + 36}$.

## Para tutores

### Objetivo

- Operar con vectores (suma, resta, por un número, módulo y producto escalar) y ver qué quiere decir cada operación en el dibujo.

### Antes tiene que saber

- Ubicar puntos en el plano y [potencias y raíces](tema:potencias-y-raices) (para el módulo).

### Errores típicos

- Confundir el vector $(3, 1)$ con el punto $(3, 1)$: el vector es la flecha, que se puede mover a cualquier lado.
- Pensar que el producto escalar da un vector.
- Olvidarse de los paréntesis con los negativos: $3 \cdot (-2)$.

### En el pizarrón

- Dibujar en una cuadrícula: la suma como "una flecha a continuación de la otra".
- Para el módulo, marcar el triángulo rectángulo con los catetos (las componentes).
- _(para completar)_

### Preguntas para el alumno

- ¿Qué le pasa a una flecha si la multiplicás por −1?
- ¿Cómo te das cuenta de que dos vectores son perpendiculares sin dibujarlos?
- _(para completar)_
