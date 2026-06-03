# 📁 ESTRUCTURA DEL PROYECTO - Guía Rápida

## Árbol de Archivos

```
proyecto/
│
├── 📄 index.html                    # Página principal (HTML)
│
├── 📁 css/
│   └── 📄 styles.css               # Todos los estilos (CSS)
│
├── 📁 js/
│   ├── 📄 app.js                   # Archivo PRINCIPAL (conecta todo)
│   │
│   ├── 📁 modules/
│   │   ├── 📄 auth.js              # Módulo de autenticación
│   │   ├── 📄 roles.js             # Módulo de permisos
│   │   └── 📄 actions.js           # Módulo de acciones/funciones
│   │
│   └── 📁 services/
│       └── 📄 navigation.js         # Servicio de navegación
│
├── 📄 README.md                    # Documentación completa
└── 📄 ESTRUCTURA.md                # Este archivo
```

---

##  QUÉ HACE CADA ARCHIVO

### Archivos Principales

| Archivo | Tipo | Responsabilidad |
|---------|------|-----------------|
| **index.html** | HTML | Estructura de la aplicación (2 vistas + modal) |
| **styles.css** | CSS | Diseño visual (login, panel, modal) |
| **app.js** | JavaScript | Centro nervioso (eventos + coordinación) |

### Módulos (js/modules/)

| Archivo | Tipo | Responsabilidad |
|---------|------|-----------------|
| **auth.js** | JS Module | Validar ID y determinar tipo de usuario |
| **roles.js** | JS Module | Verificar permisos (CALIDAD vs PRODUCCIÓN) |
| **actions.js** | JS Module | Ejecutar funciones (eliminar, mover piezas, etc.) |

### Servicios (js/services/)

| Archivo | Tipo | Responsabilidad |
|---------|------|-----------------|
| **navigation.js** | JS Service | Cambiar entre vistas (login ↔ panel) |

---

## 🔌 Cómo Se Conectan Los Archivos

### Importación en index.html
```html
<script src="js/services/navigation.js"></script>  <!-- Primero: servicios -->
<script src="js/modules/auth.js"></script>         <!-- Luego: módulos -->
<script src="js/modules/roles.js"></script>
<script src="js/modules/actions.js"></script>
<script src="js/app.js"></script>                   <!-- Último: app principal -->
```

### Flujo de Dependencias
```
app.js (principal)
  ├── usa → AuthModule (auth.js)
  ├── usa → RolesModule (roles.js)
  ├── usa → ActionsModule (actions.js)
  └── usa → NavigationService (navigation.js)
```

---

## 📊 Resumen por Líneas de Código

```
index.html          ~300 líneas   (HTML + estructura)
styles.css          ~350 líneas   (CSS todo diseño)
app.js              ~250 líneas   (JS coordinación)
auth.js             ~100 líneas   (JS login)
roles.js            ~100 líneas   (JS permisos)
actions.js          ~150 líneas   (JS funciones)
navigation.js       ~50 líneas    (JS navegación)
─────────────────────────────────
TOTAL              ~1200 líneas
```

---

## 🔄 CICLO DE VIDA DE LA APP

### 1️⃣ Página carga (index.html)
```
<html>
  <body>
    <div id="loginView"> ... </div>      ← Visible al inicio
    <div id="panelView"> ... </div>      ← Oculto
    <div id="modalOverlay"> ... </div>   ← Oculto
    
    <script src="js/services/navigation.js"></script>
    <script src="js/modules/auth.js"></script>
    <script src="js/modules/roles.js"></script>
    <script src="js/modules/actions.js"></script>
    <script src="js/app.js"></script>
  </body>
</html>
```

### 2️⃣ Scripts se cargan (app.js)
```
DOMContentLoaded
  ↓
initializeApp()
  ├── attachLoginEvents()      ← Registra: botón "Ingresar", Enter
  ├── attachPanelEvents()      ← Registra: 5 botones, "Cerrar sesión"
  └── attachModalEvents()      ← Registra: "Ejecutar", "Cancelar", ESC
```

### 3️⃣ Usuario escribe ID y presiona "Ingresar"
```
handleLoginClick()
  ↓
AuthModule.login(userId)
  ├── ¿Vacío?              → Error "Ingresa tu ID"
  ├── ¿Empieza con C?      → CALIDAD
  ├── ¿Empieza con P?      → PRODUCCIÓN
  └── Otro                 → Error "ID no válido"
  
Si OK:
  ↓
updatePanelWithUserInfo()  ← Muestra "Usuario: CALIDAD"
  ↓
NavigationService.goToPanel()  ← LoginView oculta, PanelView visible
```

### 4️⃣ Usuario hace clic en un botón (1-5)
```
handleOptionClick(actionNumber)
  ↓
RolesModule.hasPermission(userType, actionNumber)
  ├── SÍ → Ejecutar acción
  │   └── ActionsModule.executeAction(actionNumber)
  │       ├── Acción 1: Eliminar caja
  │       ├── Acción 2: Borrar historial
  │       ├── Acción 3: Mover piezas (abre modal)
  │       └── Acciones 4-5: Botón sin asignar
  │
  └── NO → Mostrar error "No tienes permitido..."
```

### 5️⃣ Usuario usa "Mover piezas" (acción 3)
```
handleOptionClick(3)
  ↓
¿Tiene permiso PRODUCCIÓN?  ← Sí, solo PRODUCCIÓN
  ↓
openActionModal()           ← Abre modal con formulario
  ├── Orden original
  ├── ID de pieza devuelta
  └── Orden nueva
  ↓
Usuario rellena y presiona "Ejecutar"
  ↓
handleModalExecute()
  ↓
ActionsModule.movePieces(originalOrder, pieceId, newOrder)
  ├── Validar no vacíos
  ├── Validar órdenes diferentes
  ├── Crear pieza "R" + ID
  └── Mostrar resultado
```

---

## 🧩 Objetos Globales (Namespaces)

Cada módulo es un objeto global para evitar conflictos:

```javascript
// En auth.js
const AuthModule = {
    currentUser: null,
    currentUserType: null,
    login() { ... },
    logout() { ... }
};

// En roles.js
const RolesModule = {
    permissions: { ... },
    hasPermission() { ... }
};

// En actions.js
const ActionsModule = {
    database: { ... },
    executeAction() { ... }
};

// En navigation.js
const NavigationService = {
    showView() { ... },
    openModal() { ... }
};

// En app.js se usan así:
AuthModule.login(userId)
RolesModule.hasPermission(userType, actionNumber)
ActionsModule.executeAction(actionNumber)
NavigationService.goToPanel()
```

---

## 💡 Por Qué Esta Estructura

### ✅ VENTAJAS

1. **Modular**: Cada archivo tiene una responsabilidad clara
2. **Reutilizable**: Módulos pueden usarse en otros proyectos
3. **Mantenible**: Fácil encontrar dónde cambiar algo
4. **Escalable**: Agregar más roles, acciones o vistas es simple
5. **Organizado**: Como proyectos profesionales reales
6. **Testeab**: Cada módulo puede probarse independientemente

### ❌ COMPARADO CON TODO EN UN ARCHIVO

**Archivo único:**
- ❌ 2000+ líneas en un solo archivo
- ❌ Difícil de encontrar código
- ❌ Imposible reutilizar lógica
- ❌ Cambios afectan a todo

**Estructura actual:**
- ✅ ~150 líneas por archivo
- ✅ Fácil de encontrar
- ✅ Reutilizable
- ✅ Cambios aislados

---

## 🚀 CÓMO EXTENDER

### Agregar un nuevo rol
```javascript
// En roles.js
permissions: {
    'CALIDAD': [1],
    'PRODUCCIÓN': [1, 2, 3],
    'ADMINISTRADOR': [1, 2, 3, 4, 5]  ← Nuevo
}
```

### Agregar una nueva acción
```javascript
// En actions.js
executeAction(actionNumber) {
    case 6:
        return this.newFunction();
}

newFunction() {
    return { title: '...', result: '...' };
}
```

### Cambiar diseño
```css
/* En styles.css */
.login-container {
    background-color: white;  ← Cambiar color
    border: 1px solid #ccc;   ← Cambiar borde
    padding: 40px;            ← Cambiar espaciado
}
```

---

## 📱 Archivos Usados por Cada Página

### Vista LOGIN
```
index.html      (estructura HTML)
  ├── #loginView
  ├── #userId (input)
  ├── #loginBtn (botón)
  └── #loginError (mensaje)

styles.css      (estilos)
  ├── .login-container
  ├── .input-field
  ├── .btn-primary
  └── .error-message

app.js          (eventos)
  └── attachLoginEvents()
      ├── loginBtn click
      └── userId keypress (Enter)

auth.js         (lógica)
  └── AuthModule.login(userId)
```

### Vista PANEL
```
index.html      (estructura HTML)
  ├── #panelView
  ├── #userTypeDisplay
  ├── #logoutBtn
  ├── .btn-option (5 botones)
  └── #statusMessage

styles.css      (estilos)
  ├── .panel-header
  ├── .buttons-grid
  ├── .btn-option
  └── #statusMessage

app.js          (eventos)
  └── attachPanelEvents()
      ├── btn-option click (x5)
      └── logoutBtn click

roles.js        (permisos)
  └── RolesModule.hasPermission()

actions.js      (funciones)
  └── ActionsModule.executeAction()

navigation.js   (vista)
  └── NavigationService.goToPanel()
```

### Modal MOVER PIEZAS
```
index.html      (estructura HTML)
  ├── #modalOverlay
  ├── #modalTitle
  ├── #movePiecesForm
  ├── #originalOrder
  ├── #pieceId
  ├── #newOrder
  └── #modalResult

styles.css      (estilos)
  ├── .modal-overlay
  ├── .modal-content
  └── .modal-result

app.js          (eventos)
  └── attachModalEvents()
      ├── modalExecuteBtn click
      ├── modalCancelBtn click
      └── modalCloseBtn click

actions.js      (lógica)
  └── ActionsModule.movePieces()

navigation.js   (vista)
  └── NavigationService.openModal()
```

---

## ✅ Checklist: Todo Funciona Si...

- [ ] Todos los archivos están en sus carpetas
- [ ] index.html importa los scripts en orden correcto
- [ ] styles.css está vinculado en index.html
- [ ] Al abrir, se ve el formulario de login
- [ ] ID "C001" → CALIDAD
- [ ] ID "P001" → PRODUCCIÓN
- [ ] ID "ABC" → Error "ID no válido"
- [ ] CALIDAD solo puede usar opción 1
- [ ] PRODUCCIÓN puede usar opciones 1, 2, 3
- [ ] Modal se abre con la opción 3
- [ ] Botón "Cerrar sesión" vuelve al login
- [ ] ESC cierra el modal

---

**¡Proyecto listo para usar!** 🎉

Abre `index.html` en cualquier navegador y comienza a probar.
