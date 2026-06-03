/**
 * MÓDULO DE AUTENTICACIÓN
 * 
 * Gestiona el proceso de inicio de sesión
 * - Validar que el ID no esté vacío
 * - Determinar el tipo de usuario (CALIDAD o PRODUCCIÓN)
 * - Almacenar datos del usuario actual
 */

const AuthModule = {
    // Usuario actual (se actualiza al hacer login)
    currentUser: null,
    currentUserType: null,

    /**
     * Valida el ID y realiza el login
     * @param {string} userId - ID del usuario ingresado
     * @returns {object} - { success: boolean, message: string, userType: string }
     */
    login: function(userId) {
        // Limpiar espacios y convertir a mayúsculas
        const cleanId = userId.trim().toUpperCase();

        // VALIDACIÓN 1: Campo no vacío
        if (!cleanId) {
            return {
                success: false,
                message: 'Por favor, ingresa un ID de usuario'
            };
        }

        // VALIDACIÓN 2: Determinar tipo de usuario
        let userType = null;

        if (cleanId.startsWith('1')) {
            // ID comienza con 1 → CALIDAD
            userType = 'CALIDAD';
        } else if (cleanId.startsWith('2')) {
            // ID comienza con 2 → PRODUCCIÓN
            userType = 'PRODUCCIÓN';
        } else {
            // ID no válido
            return {
                success: false,
                message: 'ID no válido. Debe comenzar con "1" (CALIDAD) o "2" (PRODUCCIÓN)'
            };
        }

        // Login exitoso: guardar datos del usuario
        this.currentUser = cleanId;
        this.currentUserType = userType;

        return {
            success: true,
            message: 'Login exitoso',
            userType: userType,
            userId: cleanId
        };
    },

    /**
     * Cierra la sesión actual
     */
    logout: function() {
        this.currentUser = null;
        this.currentUserType = null;
    },

    /**
     * Obtiene el tipo de usuario actual
     * @returns {string|null} - Tipo de usuario o null si no hay sesión
     */
    getUserType: function() {
        return this.currentUserType;
    },

    /**
     * Obtiene el ID del usuario actual
     * @returns {string|null} - ID del usuario o null si no hay sesión
     */
    getUserId: function() {
        return this.currentUser;
    },

    /**
     * Verifica si hay un usuario logueado
     * @returns {boolean}
     */
    isLoggedIn: function() {
        return this.currentUser !== null && this.currentUserType !== null;
    }
};
