---
titulo: "Múltiplos y divisores: mcm y mcd"
subseccion: Fracciones
resumen: El mínimo común múltiplo y el máximo común divisor, y para qué sirven en las fracciones.
orden: 10
# Qué temas hay que saber antes (para el Mapa): los nombres de sus archivos, sin ".md".
necesita: [division-cociente-y-resto]
interactivo: mcm-mcd
---

## Intuición

Mirá los saltos de a 4 (arriba) y de a 6 (abajo). ¿Dónde caen los dos por primera vez? Cambiá los números y probá de nuevo.

Después pasá a **mcd** y buscá el número más grande que está en las dos listas.

## Explicación

- **Múltiplos** de un número: los resultados de su tabla. Múltiplos de 4: 4, 8, 12, 16…
- **Divisores** de un número: los que lo dividen justo (resto 0). Divisores de 12: 1, 2, 3, 4, 6, 12.
- **mcm** (mínimo común múltiplo): el múltiplo más chico que tienen en común. $\text{mcm}(4, 6) = 12$.
- **mcd** (máximo común divisor): el divisor más grande que tienen en común. $\text{mcd}(12, 18) = 6$.
- **Para qué sirven:**
  - el **mcm** da el **denominador común** para sumar fracciones: $\frac{1}{4} + \frac{1}{6} = \frac{3}{12} + \frac{2}{12}$;
  - el **mcd** sirve para **simplificar** de una vez: $\frac{12}{18} = \frac{2}{3}$, dividiendo por 6.

## Para recordar

- **mcm:** el primer número donde "caen" los dos saltando. Sirve para el denominador común.
- **mcd:** el número más grande que divide a los dos. Sirve para simplificar.

## Ejemplo resuelto

Calculá $\frac{5}{6} + \frac{3}{8}$.

### Paso 1: el mcm de los denominadores

Múltiplos de 6: 6, 12, 18, **24**… Múltiplos de 8: 8, 16, **24**… Entonces $\text{mcm}(6, 8) = 24$.

### Paso 2: pasar a 24avos

$$
\frac{5}{6} = \frac{20}{24} \qquad \frac{3}{8} = \frac{9}{24}
$$

### Paso 3: sumar

$$
\frac{20}{24} + \frac{9}{24} = \frac{29}{24}
$$

## Ejercicios

### Nivel: Para arrancar

### mcm

¿Cuánto es $\text{mcm}(4, 6)$?

respuesta: 12

### Otro mcm

¿Cuánto es $\text{mcm}(3, 5)$?

respuesta: 15
pista: Si no tienen divisores en común, el mcm es la multiplicación.

### mcd

¿Cuánto es $\text{mcd}(12, 18)$?

respuesta: 6

### Nivel: Para animarse

### Para simplificar

Para simplificar $\frac{24}{36}$ de una sola vez, ¿por qué número dividís?

respuesta: 12
pista: Es el mcd de 24 y 36.

### ¿Cuál es divisor?

¿Cuál de estos números es divisor de 30?

- [ ] 4
- [x] 6
- [ ] 8

### Con letras

$\text{mcd}(6x, 9x)$ es…

- [ ] $3$
- [x] $3x$
- [ ] $18x$

#### Resolución

Los dos tienen un $3$ y una $x$: el mayor factor común es $3x$. Es lo mismo que buscás al **sacar factor común**: $6x + 9x = 3x \cdot (2 + 3)$.

## Para tutores

### Objetivo

- Encontrar mcm y mcd de números chicos.
- Usarlos para el denominador común y para simplificar.

### Antes tiene que saber

- Las tablas de multiplicar y la [división con cociente y resto](tema:division-cociente-y-resto).

### Errores típicos

- Confundir mcm con mcd.
- Creer que el denominador común siempre es la multiplicación de los denominadores (sirve, pero no siempre es el más chico).

### Cómo destrabarlo

- Para no confundirlos: los **múltiplos** son iguales o más grandes que el número; los **divisores**, iguales o más chicos.
- mcm: escribir las dos tablas, una debajo de la otra, y buscar el primer número que se repite.
- mcd: hacer las dos listas de divisores y marcar los que están en las dos.

### En el pizarrón

- Dos renglones: los múltiplos de 4 y los de 6. Redondear los que se repiten (12, 24…): el primero es el mcm.
- Dos listas: los divisores de 12 y los de 18. Redondear los comunes (1, 2, 3, 6): el más grande es el mcd.
- Conectar con lo que viene: el mcm sirve para sumar fracciones; el mcd, para simplificar.

### Preguntas para el alumno

- ¿Puede el mcm de dos números ser más chico que uno de ellos? ¿Y el mcd, más grande?
- ¿Cuál es el mcm de 3 y 5? ¿Por qué justo da $3 \cdot 5$?
- ¿Cuál es el mcd de 7 y 10? ¿Qué quiere decir eso?
