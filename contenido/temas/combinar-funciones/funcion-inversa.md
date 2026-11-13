---
titulo: Función inversa
subseccion: Funciones
resumen: f⁻¹ deshace lo que hace f. El espejo en y = x. Cuándo existe.
orden: 30
# Qué temas hay que saber antes (para el Mapa): los nombres de sus archivos, sin ".md".
necesita: [resolver-ecuaciones, funcion-lineal, composicion-de-funciones]
interactivo: inversa
# Los ejemplos del interactivo. Se escriben con x, + − · : ^ y paréntesis.
inversas:
  - "2x + 1"
  - "-x + 4"
  - "x^3"
  - "2^x"
  - "x^2"
---

## Intuición

Arrastrá el punto azul sobre la recta y mirá dónde aparece su "gemelo" rosa.

- Leé la línea de arriba: si $f$ lleva el 2 al 5, ¿a dónde lleva el 5 la inversa?
- Pasá los ejemplos con ‹ ›. ¿Qué pasa con el último, $x^2$?

## Explicación

- La **inversa** $f^{-1}$ **deshace** lo que hace $f$: si $f(2) = 5$, entonces $f^{-1}(5) = 2$. Es la máquina andando para atrás.
- **El gráfico:** cada punto $(a, b)$ de $f$ pasa a $(b, a)$. Por eso $f^{-1}$ es el **espejo** de $f$ en la recta $y = x$.
- **La fórmula** (para la lineal): se escribe $y$ en lugar de $f(x)$ y se **despeja $x$**:
  - $y = 2x + 1 \Rightarrow y - 1 = 2x \Rightarrow x = (y - 1) : 2$. Entonces $f^{-1}(x) = (x - 1) : 2$.
- **No siempre existe:** con $f(x) = x^2$, el 4 sale del 2 y también del −2. Al volver, no se sabe cuál elegir. Si nos quedamos con los $x \geq 0$, sí: la inversa es $\sqrt{x}$ (la [parábola acostada](tema:funcion-raiz)).
- Ya viste una: la [logarítmica](tema:funcion-logaritmica) es la inversa de la [exponencial](tema:funcion-exponencial).

## Para recordar

- $f(a) = b \iff f^{-1}(b) = a$.
- Gráfico: espejo en $y = x$.
- Fórmula: despejar $x$ de $y = f(x)$.
- Para que exista, cada valor tiene que salir de un solo $x$.

## Ejemplo resuelto

Encontrá la inversa de $f(x) = 3x - 6$.

### Paso 1: escribir y

$y = 3x - 6$.

### Paso 2: despejar x

$y + 6 = 3x \Rightarrow x = (y + 6) : 3$.

### Paso 3: cambiar las letras y comprobar

$f^{-1}(x) = (x + 6) : 3$. Compruebo: $f(4) = 6$ y $f^{-1}(6) = 12 : 3 = 4$ ✓

## Ejercicios

### Nivel: Para arrancar

### Deshacer

Si $f(3) = 10$, ¿cuánto vale $f^{-1}(10)$?

respuesta: 3

### El espejo

Si el punto $(1, 7)$ está en el gráfico de $f$, ¿qué punto está en el de $f^{-1}$?

- [x] $(7, 1)$
- [ ] $(-1, -7)$
- [ ] $(1, -7)$

### Una cuenta

Si $f(x) = x + 5$, ¿cuánto vale $f^{-1}(8)$?

respuesta: 3

pista: ¿Qué número más 5 da 8?

### Nivel: Para animarse

### La fórmula

¿Cuál es la inversa de $f(x) = 2x - 4$?

- [x] $f^{-1}(x) = (x + 4) : 2$
- [ ] $f^{-1}(x) = (x - 4) : 2$
- [ ] $f^{-1}(x) = 2x + 4$

#### Resolución

$y = 2x - 4 \Rightarrow y + 4 = 2x \Rightarrow x = (y + 4) : 2$.

### Con la fórmula

Si $f(x) = 4x + 1$, ¿cuánto vale $f^{-1}(9)$?

respuesta: 2

#### Resolución

Busco el $x$ con $4x + 1 = 9$: $4x = 8$, $x = 2$.

### Exponencial

Si $f(x) = 2^x$, ¿cuánto vale $f^{-1}(8)$?

respuesta: 3

pista: ¿A qué hay que elevar 2 para que dé 8? Es un logaritmo.

### ¿Tiene inversa?

¿Cuál de estas funciones **no** tiene inversa (en todo $\mathbb{R}$)?

- [x] $f(x) = x^2$
- [ ] $f(x) = 3x + 2$
- [ ] $f(x) = x^3$

#### Resolución

En $x^2$, el 9 sale del 3 y del −3: al volver no se sabe cuál elegir.

## Para tutores

### Objetivo

- Entender la inversa como "deshacer" y como espejo en $y = x$.
- Calcular la inversa de una lineal despejando.

### Antes tiene que saber

- [Resolver ecuaciones](tema:resolver-ecuaciones), [función lineal](tema:funcion-lineal) y [composición](tema:composicion-de-funciones).

### Errores típicos

- Creer que $f^{-1}(x) = \frac{1}{f(x)}$ (el $-1$ no es un exponente).
- Despejar mal: cambiar el orden de las operaciones al deshacer.
- Pensar que cualquier función tiene inversa.

### Cómo destrabarlo

- $f^{-1}$ no es $\frac{1}{f}$: acá el $-1$ quiere decir "al revés".
- Para despejar, deshacer en orden inverso: lo último que hizo $f$ es lo primero que se deshace (como sacarse primero las zapatillas y después las medias).
- Comprobar: meter un número en $f$ y el resultado en $f^{-1}$. Tiene que volver el número del principio.
- Si dos $x$ distintos dan el mismo resultado, no se puede volver para atrás: no hay inversa (salvo que nos quedemos con una mitad).

### En el pizarrón

- Dibujar la recta $y = x$ y doblar el pizarrón "con la mente": cada punto se refleja.
- Con la máquina: "entra 2, sale 5" y al revés "entra 5, sale 2".
- Despejar $y = 2x + 1$ paso a paso y escribir $f^{-1}(x) = (x - 1) : 2$.
- La tabla de $f$ y, al lado, la misma tabla con las columnas cambiadas de lugar.

### Preguntas para el alumno

- Si $f$ suma 3, ¿qué hace $f^{-1}$? ¿Y si $f$ multiplica por 2?
- ¿Por qué $x^2$ no tiene inversa?
- Si $f(4) = 9$, ¿cuánto vale $f^{-1}(9)$?
- Mirando el gráfico, ¿cómo te das cuenta de que una función no tiene inversa?
