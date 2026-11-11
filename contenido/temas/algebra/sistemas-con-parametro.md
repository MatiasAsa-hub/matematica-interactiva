---
titulo: Sistemas con parámetro k
subseccion: Sistemas de ecuaciones
resumen: Un sistema con una letra k adentro. Según cuánto vale k, tiene una solución, infinitas o ninguna.
orden: 18
interactivo: sistema
modo: parametro
# El deslizador de k va de min a max (con imán en los valores especiales)
k:
  min: -6
  max: 6
  valor: 0
sistemas:
  - "x + k y = 1 ; k x + y = 1"
  - "x + y + z = 1 ; x + 2y + 3z = 2 ; x + 3y + k z = 3"
  - "x + y + z = 1 ; x + 2y + 3z = 2 ; x + 3y + k z = 4"
---

## Intuición

Mové el deslizador de **k** despacito y mirá el cartel.

- En el primer sistema, ¿para qué valores de $k$ deja de haber una sola solución? ¿Qué pasa con las rectas ahí?
- En el segundo y el tercero (con planos), ¿en qué $k$ cambia el cartel? ¿Qué diferencia hay entre los dos?
- Para $k = 0$ en el primero, ¿cuál es la solución?

## Explicación

- A veces el sistema tiene una letra más, un **parámetro** (acá, $k$), que es un número fijo pero que no sabemos cuánto vale.
- La pregunta es: **¿para qué valores de $k$ el sistema es compatible determinado, compatible indeterminado o incompatible?**
- Casi siempre es compatible determinado, salvo en unos pocos valores "especiales" de $k$. Para encontrarlos:
  1. Se hace Gauss (o reducción) con la $k$ adentro, como si fuera un número.
  2. Se mira la última fila: si queda algo como $(k - 5) \cdot z = \ldots$, el valor especial es $k = 5$ (ahí la $z$ se va).
  3. Se reemplaza ese $k$ y se mira si queda $0 = 0$ (CI) o $0 = $ otro número (I).
- Otra forma: el **determinante** de los números de adelante. Donde da 0, cambia la clasificación.

## Para recordar

- Valores especiales de $k$: donde se "va" una letra (el determinante da 0).
- En esos valores: $0 = 0$ → CI; $0 = $ otro número → I.
- En todos los demás: CD.

## Ejemplo resuelto

Clasificá según $k$: $x + y + z = 1$, $x + 2y + 3z = 2$, $x + 3y + kz = 3$.

### Paso 1: Gauss

$F_2 - F_1 \to F_2$ y $F_3 - F_1 \to F_3$:

$\left(\begin{array}{ccc|c} 1 & 1 & 1 & 1 \\ 0 & 1 & 2 & 1 \\ 0 & 2 & k - 1 & 2 \end{array}\right)$

### Paso 2: escalonar

$F_3 - 2 \cdot F_2 \to F_3$:

$\left(\begin{array}{ccc|c} 1 & 1 & 1 & 1 \\ 0 & 1 & 2 & 1 \\ 0 & 0 & k - 5 & 0 \end{array}\right)$

### Paso 3: el valor especial

La última fila dice $(k - 5) \cdot z = 0$. Si $k \neq 5$, se puede despejar: **compatible determinado**.

### Paso 4: con k = 5

La última fila queda $0 = 0$: **compatible indeterminado** (los tres planos comparten una recta).

## Ejercicios

### Nivel: Para arrancar

### El valor especial

Al escalonar, la última fila quedó $(k - 2) \cdot y = 3$. ¿Para qué valor de $k$ no se puede despejar $y$?

respuesta: 2

### ¿Y ahí qué pasa?

Con ese valor ($k = 2$), la fila $(k - 2) \cdot y = 3$ queda $0 = 3$. El sistema es...

- [x] Incompatible
- [ ] Compatible indeterminado
- [ ] Compatible determinado

### Nivel: Para animarse

### Rectas paralelas

¿Para qué valor de $k$ el sistema $x + 2y = 3$, $2x + ky = 1$ es incompatible?

respuesta: 4

pista: $F_2 - 2 \cdot F_1 \to F_2$ da $(k - 4) \cdot y = -5$.

#### Resolución

$F_2 - 2 \cdot F_1 \to F_2$: $(k - 4) \cdot y = 1 - 6 = -5$. Con $k = 4$ queda $0 = -5$: incompatible (las rectas son paralelas).

### El ejemplo con 4

En el sistema $x + y + z = 1$, $x + 2y + 3z = 2$, $x + 3y + kz = 4$, ¿cómo es con $k = 5$?

- [x] Incompatible
- [ ] Compatible indeterminado
- [ ] Compatible determinado

pista: Hacé los mismos pasos que en el ejemplo resuelto: ahora la última fila da $(k - 5) \cdot z = 1$.

## Para tutores

### Objetivo

- Entender que un sistema con parámetro puede cambiar de tipo según el valor de $k$, y encontrar esos valores.

### Antes tiene que saber

- [Método de Gauss](tema:metodo-de-gauss) y la [clasificación de sistemas](tema:clasificacion-de-sistemas).

### Errores típicos

- Dividir por $k - 5$ sin aclarar que tiene que ser $k \neq 5$.
- Encontrar el valor especial y no revisar si da CI o I.

### En el pizarrón

- Hacer Gauss con la $k$ como si fuera un número, y recuadrar la última fila.
- Hacer un cuadrito: "$k \neq 5$: CD" y "$k = 5$: CI (o I)".
- _(para completar)_

### Preguntas para el alumno

- ¿Por qué en casi todos los valores de $k$ el sistema tiene una sola solución?
- ¿Cómo distinguís CI de I en el valor especial?
- _(para completar)_
