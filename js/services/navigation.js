/**
 * SERVICIO DE NAVEGACIÓN
 *
 * Gestiona el cambio entre vistas de la aplicación
 * - Cambia entre login y panel principal
 * - Controla la visibilidad de elementos
 */

const NavigationService = {
    // Obtener elemento de vista por ID
    getView: function(viewId) {
        return document.getElementById(viewId);
    },

    // Ocultar todas las vistas
    hideAllViews: function() {
        const views = document.querySelectorAll('.view');
        views.forEach(view => {
            view.classList.remove('active');
        });
    },

    // Mostrar una vista específica
    showView: function(viewId) {
        this.hideAllViews();
        const view = this.getView(viewId);
        if (view) {
            view.classList.add('active');
        }
    },

    // Navegar al login
    goToLogin: function() {
        this.showView('loginView');
    },

    // Navegar al panel
    goToPanel: function() {
        this.showView('panelView');
    },

    // Abrir modal
    openModal: function() {
        const modal = document.getElementById('modalOverlay');
        modal.classList.add('active');
    },

    // Cerrar modal
    closeModal: function() {
        const modal = document.getElementById('modalOverlay');
        modal.classList.remove('active');
    }
};
