/**
 * ARCHIVO PRINCIPAL DE LA APLICACIÓN
 * Conecta todos los módulos y gestiona los eventos del usuario
 * - Inicializa la aplicación
 * - Maneja eventos de botones
 * - Coordina entre módulos
 */

// INICIALIZACIÓN

/**
 * Inicializa la aplicación cuando el DOM está listo
 */
function initializeApp() {
    console.log('Inicializando aplicación...');

    // Registrar eventos del login
    attachLoginEvents();

    // Registrar eventos del panel
    attachPanelEvents();

    // Registrar eventos del modal
    attachModalEvents();

    console.log('Aplicación inicializada correctamente');
}

/**
 * Se ejecuta cuando el DOM está completamente cargado
 */
document.addEventListener('DOMContentLoaded', initializeApp);

// EVENTOS DE LOGIN 
function attachLoginEvents() {
    const loginBtn = document.getElementById('loginBtn');
    const userIdInput = document.getElementById('userId');

    // Evento del botón Ingresar
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLoginClick);
    }

    // Evento de tecla Enter en el input
    if (userIdInput) {
        userIdInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                handleLoginClick();
            }
        });
    }
}

/**
 * Maneja el evento de click en "Ingresar"
 */
function handleLoginClick() {
    const userIdInput = document.getElementById('userId');
    const errorDiv = document.getElementById('loginError');
    const userId = userIdInput.value;

    // Limpiar mensaje de error anterior
    errorDiv.classList.remove('show');
    errorDiv.textContent = '';

    // Intentar login
    const result = AuthModule.login(userId);

    if (!result.success) {
        // Login fallido: mostrar error
        errorDiv.textContent = result.message;
        errorDiv.classList.add('show');
    } else {
        // Login exitoso: ir al panel
        updatePanelWithUserInfo();
        NavigationService.goToPanel();
        userIdInput.value = ''; // Limpiar input
    }
}

//  EVENTOS DEL PANEL 

function attachPanelEvents() {
    // Botones de opciones (1-5)
    const optionButtons = document.querySelectorAll('.btn-option');
    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const actionNumber = parseInt(this.getAttribute('data-action'));
            handleOptionClick(actionNumber);
        });
    });

    // Botón Cerrar Sesión
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}

/**
 * Maneja el click en un botón de opción (1-5)
 */
function handleOptionClick(actionNumber) {
    const userType = AuthModule.getUserType();
    const statusMessage = document.getElementById('statusMessage');

    // Limpiar mensajes anteriores
    clearStatusMessage();

    // VERIFICAR PERMISOS
    if (!RolesModule.hasPermission(userType, actionNumber)) {
        // Usuario no tiene permiso
        const message = RolesModule.getDeniedMessage(actionNumber);
        showStatusMessage(message, 'info');
        return;
    }

    // Usuario tiene permiso: ejecutar acción
    const action = ActionsModule.executeAction(actionNumber);

    if (action.requiresForm) {
        // Abrir modal con formulario
        openActionModal(actionNumber, action.title);
    } else {
        // Mostrar resultado directamente
        showStatusMessage(action.result, 'success');
    }
}

/**
 * Actualiza el panel con la información del usuario
 */
function updatePanelWithUserInfo() {
    const userTypeDisplay = document.getElementById('userTypeDisplay');
    const userType = AuthModule.getUserType();
    userTypeDisplay.textContent = userType;
}

/**
 * Maneja el logout
 */
function handleLogout() {
    // Limpiar estado
    AuthModule.logout();
    clearStatusMessage();
    clearModalData();

    // Volver al login
    NavigationService.goToLogin();
}

//  EVENTOS DEL MODAL 

function attachModalEvents() {
    const closeBtn = document.getElementById('modalCloseBtn');
    const cancelBtn = document.getElementById('modalCancelBtn');
    const executeBtn = document.getElementById('modalExecuteBtn');

    // Botón X para cerrar
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Botón Cancelar
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }

    // Botón Ejecutar
    if (executeBtn) {
        executeBtn.addEventListener('click', handleModalExecute);
    }

    // Cerrar modal al presionar ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    });
}

/**
 * Abre el modal para una acción específica
 */
function openActionModal(actionNumber, title) {
    const modalTitle = document.getElementById('modalTitle');
    const movePiecesForm = document.getElementById('movePiecesForm');
    const modalResult = document.getElementById('modalResult');

    // Establecer el título
    modalTitle.textContent = title;

    // Limpiar resultado anterior
    modalResult.style.display = 'none';
    modalResult.textContent = '';

    // Mostrar formulario si es necesario
    if (actionNumber === 3) {
        // Acción: Mover piezas
        movePiecesForm.style.display = 'block';
        clearModalFormFields();
    } else {
        movePiecesForm.style.display = 'none';
    }

    // Guardar número de acción actual
    window.currentModalAction = actionNumber;

    // Abrir modal
    NavigationService.openModal();
}

/**
 * Cierra el modal
 */
function closeModal() {
    NavigationService.closeModal();
    clearModalData();
}

/**
 * Maneja el click en "Ejecutar" del modal
 */
function handleModalExecute() {
    const actionNumber = window.currentModalAction;
    const modalResult = document.getElementById('modalResult');

    if (actionNumber === 3) {
        // Acción: Mover piezas - procesar formulario
        const originalOrder = parseInt(document.getElementById('originalOrder').value);
        const pieceId = parseInt(document.getElementById('pieceId').value);
        const newOrder = parseInt(document.getElementById('newOrder').value);

        // Ejecutar función de mover piezas
        const result = ActionsModule.movePieces(originalOrder, pieceId, newOrder);

        // Mostrar resultado en el modal
        modalResult.textContent = result.result;
        modalResult.style.display = 'block';

        // Si fue exitoso, actualizar mensaje del panel también
        if (result.success) {
            console.log('Acción completada exitosamente');
        }
    }
}

/**
 * Limpiar los campos del formulario del modal
 */
function clearModalFormFields() {
    document.getElementById('originalOrder').value = '';
    document.getElementById('pieceId').value = '';
    document.getElementById('newOrder').value = '';
}

/**
 * Limpiar todos los datos del modal
 */
function clearModalData() {
    clearModalFormFields();
    window.currentModalAction = null;
    document.getElementById('modalResult').style.display = 'none';
    document.getElementById('modalResult').textContent = '';
}

//  FUNCIONES DE UTILIDAD 

/**
 * Muestra un mensaje de estado en el panel
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo: 'error', 'success', 'info'
 */
function showStatusMessage(message, type) {
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.textContent = message;
    statusMessage.className = 'status-message show ' + type;
}

/**
 * Limpia el mensaje de estado
 */
function clearStatusMessage() {
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.textContent = '';
    statusMessage.className = 'status-message';
    statusMessage.style.display = 'none';
}
