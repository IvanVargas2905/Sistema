# Sistema de Control Interno - Documentación

## 📋 Descripción del Proyecto

Aplicación web simple para gestionar acceso a funciones según el rol del usuario (CALIDAD o PRODUCCIÓN). Sistema de login sin contraseña, panel con permisos personalizados y funcionalidad de retrabajado de piezas.

---

## 🏗️ Estructura del Proyecto

```
project/
│
├── index.html                    # Archivo HTML principal
├── css/
│   └── styles.css               # Estilos CSS (diseño simple y limpio)
├── js/
│   ├── app.js                   # Archivo principal (conecta todo)
│   ├── modules/
│   │   ├── auth.js              # Lógica de autenticación y login
│   │   ├── roles.js             # Sistema de permisos y roles
│   │   └── actions.js           # Funcionalidades de cada botón
│   └── services/
│       └── navigation.js         # Servicio de navegación entre vistas
└── README.md                     # Esta documentación
```

---

## 📄 Descripción de Archivos

### **index.html**
- Estructura HTML de la aplicación
- Contiene dos vistas principales:
  - **Login View**: Formulario de inicio de sesión
  - **Panel View**: Panel de control con opciones
- Modal para funcionalidades especiales (mover piezas)
- Importa CSS y scripts en orden correcto

### **css/styles.css**
- Estilos para todas las vistas
- Diseño simple: fondo gris claro, cajas blancas, bordes suaves
- Sin estilos modernos ni complejos
- Responsive para dispositivos móviles
- Clases reutilizables para mensajes, botones, formas

### **js/app.js** (Archivo Principal)
- Inicializa toda la aplicación
- Conecta los módulos entre sí
- Gestiona todos los eventos del usuario:
  - Eventos de login
  - Eventos del panel
  - Eventos del modal
- Funciones de utilidad para mostrar/limpiar mensajes

**Flujo principales:**
1. `DOMContentLoaded` → `initializeApp()` → Registra eventos
2. Usuario escribe ID → `handleLoginClick()` → Valida con `AuthModule`
3. Login exitoso → `updatePanelWithUserInfo()` → `NavigationService.goToPanel()`
4. Usuario hace clic en botón → `handleOptionClick()` → Verifica permisos con `RolesModule`
5. Si tiene permiso → Ejecuta acción con `ActionsModule`

### **js/modules/auth.js** (Autenticación)
**Responsabilidades:**
- Validar que el ID no esté vacío
- Determinar tipo de usuario (C=CALIDAD, P=PRODUCCIÓN)
- Almacenar datos del usuario actual
- Verificar si hay sesión activa

**Funciones principales:**
- `login(userId)` - Valida y autentica usuario
- `logout()` - Cierra sesión
- `getUserType()` - Obtiene tipo actual
- `isLoggedIn()` - Verifica si hay sesión

**Lógica de login:**
```
1. Limpiar espacios, convertir a mayúsculas
2. ¿Vacío? → Error "Ingresa tu ID"
3. ¿Empieza con C? → CALIDAD
4. ¿Empieza con P? → PRODUCCIÓN
5. Otro → Error "ID no válido"
6. Si válido → Guardar currentUser y currentUserType
```

### **js/modules/roles.js** (Permisos)
**Responsabilidades:**
- Definir qué puede hacer cada tipo de usuario
- Verificar permisos antes de ejecutar acciones
- Proporcionar mensajes apropiadospara acciones denegadas

**Permisos:**
- **CALIDAD**: [1] → Solo "Eliminar caja"
- **PRODUCCIÓN**: [1, 2, 3] → "Eliminar caja", "Borrar historial", "Mover piezas"
- **Acciones 4-5**: "Botón sin asignar" (mensaje diferente)

**Funciones principales:**
- `hasPermission(userType, actionNumber)` - ¿Tiene permiso?
- `getDeniedMessage(actionNumber)` - Mensaje de denegación
- `getAllowedActions(userType)` - Lista de acciones permitidas
- `getPermissionsSummary()` - Resumen de permisos (para debugging)

### **js/modules/actions.js** (Funcionalidades)
**Responsabilidades:**
- Implementar la lógica de cada acción
- Gestionar datos simulados en memoria
- Procesar formularios (especialmente "Mover piezas")

**Acciones:**
1. **Eliminar caja** - Mensaje de confirmación
2. **Borrar historial de pieza** - Mensaje de confirmación
3. **Mover piezas** - Proceso especial con formulario (VER ABAJO)
4-5. **Botones sin asignar** - Mensaje informativo

**Lógica de "Mover piezas" (Retrabajado):**
```
Entrada:
- Orden original (ej: 20)
- ID de pieza devuelta (ej: 2)
- Orden nueva (ej: 45)

Validaciones:
✓ Todos los campos llenos
✓ Orden original ≠ Orden nueva
✓ Todos los valores > 0

Proceso:
1. Crear ID retrabajado: "R" + pieceId
   Ejemplo: 2 → "R2"
2. Registrar que se retiró de orden 20
3. Registrar que se asignó a orden 45

Salida:
Mensaje detallado con información del proceso
```

**Funciones principales:**
- `executeAction(actionNumber)` - Ejecuta acción por número
- `movePieces(originalOrder, pieceId, newOrder)` - Lógica de retrabajado
- `getActionDescription(actionNumber)` - Describe una acción

### **js/services/navigation.js** (Navegación)
**Responsabilidades:**
- Cambiar entre vistas (login ↔ panel)
- Abrir/cerrar modal
- Gestionar visibilidad de elementos

**Funciones principales:**
- `showView(viewId)` - Mostrar una vista
- `hideAllViews()` - Ocultar todas las vistas
- `goToLogin()` - Navegar a login
- `goToPanel()` - Navegar a panel
- `openModal()` / `closeModal()` - Abrir/cerrar modal

**Cómo funciona:**
- Las vistas tienen clase `.view`
- Solo la vista con clase `.active` se muestra
- Cambiar vista = remover `.active` de todas, agregar a una

---

## 🔄 Flujo de la Aplicación

### **1. Inicio de sesión**
```
Usuario abre index.html
     ↓
Entra ID (ej: C001)
     ↓
Presiona "Ingresar" o Enter
     ↓
app.js → handleLoginClick()
     ↓
AuthModule.login(userId)
     ↓
¿ID válido? 
  SÍ → Mostrar panel
   NO → Mostrar error
```

### **2. Acceso al panel**
```
Panel muestra: Usuario: CALIDAD (o PRODUCCIÓN)
     ↓
Usuario ve 5 botones
     ↓
Usuario hace clic en botón
     ↓
app.js → handleOptionClick()
     ↓
RolesModule.hasPermission(userType, actionNumber)
     ↓
¿Tiene permiso?
  NO → Mostrar mensaje: "No tienes permitido..."
  SÍ → Ejecutar acción
```

### **3. Ejecutar acción (ejemplo: Mover piezas)**
```
Usuario hace clic en "Mover piezas"
     ↓
Tiene permiso (solo PRODUCCIÓN)
     ↓
ActionsModule.executeAction(3) → requiresForm: true
     ↓
app.js → openActionModal()
     ↓
Mostrar modal con formulario:
- Número de orden original
- ID de pieza devuelta
- Número de orden nueva
     ↓
Usuario rellena y presiona "Ejecutar"
     ↓
app.js → handleModalExecute()
     ↓
ActionsModule.movePieces(values)
     ↓
¿Validaciones OK?
  NO → Mostrar error
  SÍ → Crear pieza "R" + ID, mostrar resultado
```

---

## 🧪 Cómo Probar

### **Login**
```
Usuario CALIDAD: C001
Usuario PRODUCCIÓN: P001
ID inválido: ABC123 (muestra error)
ID vacío: (muestra error)
```

### **Permisos CALIDAD**
- ✅ Botón 1 (Eliminar caja) - Funciona
- ❌ Botón 2 (Borrar historial) - Error
- ❌ Botón 3 (Mover piezas) - Error
- ❌ Botón 4 (Sin asignar) - Mensaje "Botón sin asignar"
- ❌ Botón 5 (Sin asignar) - Mensaje "Botón sin asignar"

### **Permisos PRODUCCIÓN**
- ✅ Botón 1 (Eliminar caja) - Funciona
- ✅ Botón 2 (Borrar historial) - Funciona
- ✅ Botón 3 (Mover piezas) - Abre modal con formulario
  - Ingresa: Orden orig=20, Pieza=2, Orden nueva=45
  - Resultado: Pieza registrada como "R2"
- ❌ Botón 4 (Sin asignar) - Mensaje "Botón sin asignar"
- ❌ Botón 5 (Sin asignar) - Mensaje "Botón sin asignar"

---

## 💾 Almacenamiento de Datos

**Todo está en memoria (variables JavaScript):**
- Usuario actual: `AuthModule.currentUser`
- Tipo de usuario: `AuthModule.currentUserType`
- Órdenes simuladas: `ActionsModule.database.orders`

**Al recargar la página:** Se pierden todos los datos (comportamiento normal)

---

## 🎨 Diseño

- Fondo gris claro (#f0f0f0)
- Cajas blancas con borde gris suave
- Botones verde (#4CAF50) para acciones primarias
- Botones gris para secundarias
- Mensajes con colores: rojo (error), verde (éxito), azul (info)
- Tipografía simple: Arial
- Sin sombras complejas ni estilos modernos

---

## 🔧 Extensiones Posibles

1. **Agregar más roles** → Modificar `roles.js`
2. **Más acciones** → Agregar a `actions.js`
3. **Persistencia** → Guardar en localStorage o backend
4. **Validaciones adicionales** → Extender `auth.js` o `actions.js`
5. **Histórico de acciones** → Guardar en base de datos simulada

---

## ❌ Limitaciones Actuales

- No hay base de datos (todo en memoria)
- Sin autenticación de contraseña
- Sin historial o logging
- Sin notificaciones por email
- Sin recuperación de sesión

---

## 📝 Notas de Desarrollo

- Código comentado línea por línea en cada archivo
- Funciones con descripción JSDoc
- Nombres descriptivos de variables y funciones
- Módulos independientes y reutilizables
- Evitar variables globales (usar namespaces: `AuthModule`, `RolesModule`, etc.)

---

**Versión:** 1.0  
**Fecha:** Junio 2026  
**Autor:** Sistema interno  
**Estado:** Producción
