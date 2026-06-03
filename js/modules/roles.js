/**
 * MÓDULO DE ROLES Y PERMISOS
 * 
 * Define qué acciones puede realizar cada tipo de usuario
 * - CALIDAD: solo puede "Eliminar caja"
 * - PRODUCCIÓN: puede "Eliminar caja", "Borrar historial", "Mover piezas"
 */

const RolesModule = {
    // Definir permisos por tipo de usuario
    // Cada número corresponde a un botón de acción
    permissions: {
        'CALIDAD': [1],                  // Solo acción 1
        'PRODUCCIÓN': [1, 2, 3]          // Acciones 1, 2 y 3
    },

    /**
     * Verifica si un usuario puede realizar una acción específica
     * @param {string} userType - Tipo de usuario (CALIDAD o PRODUCCIÓN)
     * @param {number} actionNumber - Número de acción (1-5)
     * @returns {boolean} - true si tiene permiso, false si no
     */
    hasPermission: function(userType, actionNumber) {
        // Obtener permisos del tipo de usuario
        const allowedActions = this.permissions[userType];

        // Si el tipo de usuario no existe, retornar false
        if (!allowedActions) {
            return false;
        }

        // Verificar si la acción está en la lista de permitidas
        return allowedActions.includes(actionNumber);
    },

    /**
     * Obtiene el mensaje de error para una acción no permitida
     * @param {number} actionNumber - Número de acción
     * @returns {string} - Mensaje apropiado
     */
    getDeniedMessage: function(actionNumber) {
        // Acciones 4 y 5 son "botón sin asignar"
        if (actionNumber === 4 || actionNumber === 5) {
            return 'Botón sin asignar';
        }

        // Otras acciones: permisos insuficientes
        return 'No tienes permitido acceder a esta opción';
    },

    /**
     * Obtiene todas las acciones permitidas para un usuario
     * @param {string} userType - Tipo de usuario
     * @returns {array} - Array de números de acción permitidos
     */
    getAllowedActions: function(userType) {
        return this.permissions[userType] || [];
    },

    /**
     * Describe qué puede hacer cada tipo de usuario
     * Útil para debugging
     */
    getPermissionsSummary: function() {
        return {
            'CALIDAD': {
                allowed: this.permissions['CALIDAD'],
                description: 'Puede usar: Eliminar caja'
            },
            'PRODUCCIÓN': {
                allowed: this.permissions['PRODUCCIÓN'],
                description: 'Puede usar: Eliminar caja, Borrar historial, Mover piezas'
            }
        };
    }
};
