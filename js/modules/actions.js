/**
 * MÓDULO DE ACCIONES
 * 
 * Gestiona la funcionalidad de cada opción del panel
 * Incluye la lógica especial para "Mover piezas" (Retrabajado)
 */

const ActionsModule = {
    // Datos simulados (en memoria) de órdenes y piezas
    database: {
        orders: {
            20: { pieces: [1, 2, 3] },
            45: { pieces: [] }
        }
    },

    /**
     * Ejecuta la acción especificada
     * @param {number} actionNumber - Número de acción (1-5)
     * @returns {object} - { title: string, requiresForm: boolean, result: string }
     */
    executeAction: function(actionNumber) {
        switch (actionNumber) {
            case 1:
                return this.deleteBatch();
            case 2:
                return this.deleteHistory();
            case 3:
                return {
                    title: 'Mover piezas de orden de trabajo',
                    requiresForm: true,
                    form: 'movePiecesForm'
                };
            case 4:
                return this.unassignedButton();
            case 5:
                return this.unassignedButton();
            default:
                return { title: 'Desconocido', result: 'Acción no reconocida' };
        }
    },

    /**
     * Acción 1: Eliminar caja
     * @returns {object}
     */
    deleteBatch: function() {
        return {
            title: 'Eliminar caja',
            requiresForm: true,
            form: 'deleteBatchForm'
        };
    },

    /**
     * Acción 2: Borrar historial de pieza
     * @returns {object}
     */
    deleteHistory: function() {
        return {
            title: 'Borrar historial de pieza',
            requiresForm: true,
            form: 'deleteHistoryForm'
        };
    },

    /**
     * Acción 3: Mover piezas (Retrabajado)
     * Esta función procesa los datos del formulario
     * @param {number} originalOrder - Número de orden original
     * @param {number} pieceId - ID de la pieza devuelta
     * @param {number} newOrder - Número de orden nueva
     * @returns {object} - { success: boolean, result: string }
     */
    movePieces: function(originalOrder, pieceId, newOrder) {
        // VALIDACIÓN: Verificar que todos los campos estén completos
        if (!originalOrder || !pieceId || !newOrder) {
            return {
                success: false,
                result: ' ERROR: Todos los campos son obligatorios'
            };
        }

        // VALIDACIÓN: Las órdenes deben ser diferentes
        if (originalOrder === newOrder) {
            return {
                success: false,
                result: ' ERROR: La orden original y la nueva orden deben ser diferentes'
            };
        }

        // VALIDACIÓN: Los valores deben ser positivos
        if (originalOrder <= 0 || pieceId <= 0 || newOrder <= 0) {
            return {
                success: false,
                result: ' ERROR: Los valores deben ser números positivos'
            };
        }

        // LÓGICA PRINCIPAL: Crear pieza retrabajada
        // Al reutilizar una pieza, se le agrega "R" al inicio
        const rePieceId = 'R' + pieceId;

        // Construir el resultado
        let result = 'Proceso de retrabajado completado exitosamente\n';
        // result += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
        result += 'INFORMACIÓN DEL PROCESO:\n';
        result += 'Orden original: ' + originalOrder + '\n';
        result += 'Pieza devuelta: ' + pieceId + '\n';
        result += 'Nueva orden: ' + newOrder + '\n\n';
        result += 'ESTADO FINAL:\n';
        result += 'Orden ' + originalOrder + ': Se retiró pieza ' + pieceId + '\n';
        result += 'Orden ' + newOrder + ': Se asignó pieza ' + rePieceId + '\n\n';
        result += 'ID de pieza reasignada: ' + rePieceId;

        return {
            success: true,
            result: result
        };
    },

    /**
     * Acciones 4 y 5: Botones sin asignar
     * @returns {object}
     */
    unassignedButton: function() {
        return {
            title: 'Botón sin asignar',
            requiresForm: false,
            result: 'Este botón aún no tiene una función asignada.'
        };
    },

    /**
     * Obtiene una descripción de una acción
     * @param {number} actionNumber - Número de acción
     * @returns {string}
     */
    getActionDescription: function(actionNumber) {
        const descriptions = {
            1: 'Eliminar caja',
            2: 'Borrar historial de pieza',
            3: 'Mover piezas de orden de trabajo (Retrabajado)',
            4: 'Botón sin asignar',
            5: 'Botón sin asignar'
        };
        return descriptions[actionNumber] || 'Acción desconocida';
    }
};
