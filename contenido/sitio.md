---
# Datos generales de la página.
nombre: Matemática para todos
descripcion: Matemática de secundaria para entender probando. Primero mirás y jugás; después viene la explicación.
pie: Página gratuita y de acceso libre, hecha para un espacio de apoyo escolar.

# Las etapas son los tres grandes momentos del recorrido. Solo son títulos:
# sirven para agrupar las unidades en la lista de temas y en el inicio.
etapas:
  - id: arrancar
    nombre: Para arrancar
    descripcion: Las cuentas de base. Si acá hay dudas, todo lo demás cuesta el doble.
  - id: funciones
    nombre: Funciones
    descripcion: Qué es una función y las que más aparecen en la escuela.
  - id: avanzado
    nombre: Para 4.º y 5.º año
    descripcion: Derivadas, integrales, sistemas y matrices.

# Las unidades, en el orden en que aparecen. El "id" tiene que coincidir con
# el nombre de la carpeta dentro de contenido/temas/. "etapa" es el id de
# una de las etapas de arriba.
unidades:
  - id: numeros-y-operaciones
    etapa: arrancar
    nombre: Números y operaciones
    descripcion: Signos, división y el orden de las cuentas.
  - id: fracciones-y-potencias
    etapa: arrancar
    nombre: Fracciones y potencias
    descripcion: Múltiplos y divisores, fracciones, potencias y raíces.
  - id: letras-y-ecuaciones
    etapa: arrancar
    nombre: Letras y ecuaciones
    descripcion: Operar con x, resolver ecuaciones e inecuaciones.
  - id: funciones
    etapa: funciones
    nombre: "Funciones: las primeras"
    descripcion: Qué es una función, la lineal, la cuadrática y las polinómicas.
  - id: mas-funciones
    etapa: funciones
    nombre: Más funciones
    descripcion: Exponencial, logaritmo, trigonométricas, módulo, raíz y homográfica.
  - id: combinar-funciones
    etapa: funciones
    nombre: Combinar funciones
    descripcion: Funciones partidas, composición e inversa.
  - id: derivadas
    etapa: avanzado
    nombre: Derivadas
    descripcion: La pendiente en cada punto y cómo calcularla.
  - id: integrales
    etapa: avanzado
    nombre: Integrales
    descripcion: El área bajo la curva y la regla de Barrow.
  - id: sistemas-matrices-y-vectores
    etapa: avanzado
    nombre: Sistemas, matrices y vectores
    descripcion: Sistemas de ecuaciones, Gauss, matrices, vectores y planos.
---
