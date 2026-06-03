# 🎯 REFERENCIA RÁPIDA - Sistema de Control Interno

## 📦 Estructura Completa

```
Prueba3/
├── index.html              Página HTML (estructura de vistas)
├── css/
│   └── styles.css         Estilos CSS (todo el diseño)
├── js/
│   ├── app.js             Coordinador principal
│   ├── modules/
│   │   ├── auth.js        Login: validar ID → tipo usuario
│   │   ├── roles.js       Permisos: ¿qué puede hacer cada uno?
│   │   └── actions.js     Funciones: mover piezas, eliminar, etc.
│   └── services/
│       └── navigation.js   Cambiar entre vistas
├── README.md              Documentación completa
└── ESTRUCTURA.md          Guía detallada
```

---

## 🔑 Conceptos Clave

### 1. AUTENTICACIÓN (auth.js)
- **Input:** ID de usuario (ej: C001, P001)
- **Validación:** 
  - No vacío
  - Comienza con C → CALIDAD
  - Comienza con P → PRODUCCIÓN
- **Output:** Tipo de usuario almacenado

### 2. PERMISOS (roles.js)
```
CALIDAD:        [1]           → Eliminar caja
PRODUCCIÓN:     [1, 2, 3]     → Eliminar caja, Borrar historial, Mover piezas
OTROS:          4, 5          → Botón sin asignar
```

### 3. ACCIONES (actions.js)
```
1. Eliminar caja                        → Mensaje simple
2. Borrar historial de pieza            → Mensaje simple
3. Mover piezas (Retrabajado)          → Modal con formulario
4. Botón sin asignar                    → Mensaje informativo
5. Botón sin asignar                    → Mensaje informativo
```

### 4. LÓGICA MOVER PIEZAS
```
Input:
  - Orden original (ej: 20)
  - Pieza devuelta (ej: 2)
  - Orden nueva (ej: 45)

Proceso:
  1. Validar campos llenos
  2. Crear ID "R" + pieza (ej: R2)
  3. Registrar cambio de orden

Output:
  ✓ Pieza 2 se retiró de orden 20
  ✓ Pieza R2 se asignó a orden 45
```

---

## 🎨 Vistas

### VISTA 1: LOGIN
- ID input
- Botón "Ingresar"
- Mensaje de error
- Info de prueba

### VISTA 2: PANEL
- Tipo de usuario (CALIDAD / PRODUCCIÓN)
- 5 botones de opciones
- Botón "Cerrar sesión"
- Mensaje de estado

### MODAL: MOVER PIEZAS
- 3 inputs (orden orig, pieza, orden nueva)
- Botones "Ejecutar" / "Cancelar"
- Resultado en pantalla

---

## 🔄 Flujo de Eventos

```
1. Usuario ingresa ID
   ↓
2. handleLoginClick() → AuthModule.login()
   ↓
3. ¿ID válido? SÍ → Mostrar panel
             NO → Mostrar error
   ↓
4. Usuario hace clic en botón (1-5)
   ↓
5. handleOptionClick() → RolesModule.hasPermission()
   ↓
6. ¿Tiene permiso? SÍ → ActionsModule.executeAction()
              NO → Mostrar error
   ↓
7. ¿Necesita formulario? SÍ → Abrir modal
                        NO → Mostrar resultado
```

---

## 🧪 Casos de Prueba

### LOGIN
```
C001            ✓ Login OK → CALIDAD
P001            ✓ Login OK → PRODUCCIÓN
ABC123          ✗ Error: ID no válido
(vacío)         ✗ Error: Ingresa tu ID
```

### CALIDAD (C001)
```
Botón 1 (Eliminar caja)     ✓ Funciona
Botón 2 (Borrar historial)  ✗ No permitido
Botón 3 (Mover piezas)      ✗ No permitido
Botón 4 (Sin asignar)       ⓘ Botón sin asignar
Botón 5 (Sin asignar)       ⓘ Botón sin asignar
```

### PRODUCCIÓN (P001)
```
Botón 1 (Eliminar caja)     ✓ Funciona
Botón 2 (Borrar historial)  ✓ Funciona
Botón 3 (Mover piezas)      ✓ Abre modal
Botón 4 (Sin asignar)       ⓘ Botón sin asignar
Botón 5 (Sin asignar)       ⓘ Botón sin asignar
```

### MOVER PIEZAS (Acción 3)
```
Orden orig: 20, Pieza: 2, Orden nueva: 45
✓ Resultado: Pieza registrada como R2

Campos vacíos
✗ Error: Todos los campos son obligatorios

Orden orig = Orden nueva
✗ Error: Las órdenes deben ser diferentes
```

---

## 📝 Archivos - Resumen

| Archivo | Líneas | Función | Dependencias |
|---------|--------|---------|--------------|
| index.html | ~300 | Estructura HTML | - |
| styles.css | ~350 | Estilos CSS | - |
| app.js | ~250 | Coordinación | auth, roles, actions, navigation |
| auth.js | ~100 | Login | - |
| roles.js | ~100 | Permisos | - |
| actions.js | ~150 | Funciones | - |
| navigation.js | ~50 | Navegación | - |

---

## 🚀 Cómo Usar

### 1. Abrir la aplicación
```
Abre index.html en navegador
```

### 2. Hacer login
```
Escribe: C001 o P001
Presiona: Ingresar o Enter
```

### 3. Usar funciones
```
Haz clic en botones (según tus permisos)
Para Mover Piezas:
  - Rellena los 3 campos
  - Haz clic en "Ejecutar"
  - Lee el resultado
```

### 4. Cerrar sesión
```
Haz clic en "Cerrar Sesión"
Vuelves a la pantalla de login
```

---

## ⚙️ Datos en Memoria

```javascript
// Usuario actual (auth.js)
AuthModule.currentUser       // ej: "C001"
AuthModule.currentUserType   // ej: "CALIDAD"

// Órdenes simuladas (actions.js)
ActionsModule.database.orders
  {
    20: { pieces: [1, 2, 3] },
    45: { pieces: [] }
  }
```

Todos los datos se pierden al recargar la página.

---

## 🔧 Modificar / Extender

### Agregar un nuevo rol
```javascript
// roles.js - permissions
'GERENTE': [1, 2, 3, 4, 5]
```

### Cambiar colores
```css
/* styles.css */
.btn-primary { background-color: #blue; }
```

### Agregar una acción
```javascript
// index.html - agregar botón
<button class="btn-option" data-action="6">6. Nueva acción</button>

// actions.js - implementar
case 6:
    return this.newFunction();
```

---

## ❓ FAQ Rápido

**¿Dónde está la base de datos?**
- No hay. Todo está en memoria (variables JS).

**¿Se guardan los datos?**
- No. Al recargar, se pierden.

**¿Puedo agregar más usuarios?**
- Sí, cualquier ID que empiece con C o P funciona.

**¿Cómo cambio los permisos?**
- En `roles.js`, modify el objeto `permissions`.

**¿Dónde está la contraseña?**
- No hay. Solo se usa ID.

**¿Qué pasa si ingreso un ID vacío?**
- Muestra error: "Por favor, ingresa un ID de usuario".

**¿Cómo funciona ESC para cerrar modal?**
- En `app.js`, hay un event listener para `keydown`.

---

## ✅ Checklist Final

- [ ] Abierto index.html en navegador
- [ ] Se ve pantalla de login
- [ ] Prueba con C001 → Ve "CALIDAD"
- [ ] Prueba con P001 → Ve "PRODUCCIÓN"
- [ ] CALIDAD solo usa botón 1
- [ ] PRODUCCIÓN usa botones 1, 2, 3
- [ ] Botón 3 abre modal
- [ ] Modal se cierra con ESC o "Cancelar"
- [ ] "Cerrar sesión" vuelve al login
- [ ] Código está comentado

---

**Listo para usar. ¡Abre index.html y prueba!** 🎉
