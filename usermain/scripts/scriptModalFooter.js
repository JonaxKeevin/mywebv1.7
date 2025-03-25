document.addEventListener("DOMContentLoaded", function () {
  // Función para abrir modales
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      document.body.style.overflow = "hidden"; // Prevenir scroll del body
      modal.classList.add("active");

      // Enfoque en el modal para accesibilidad
      setTimeout(() => {
        const firstFocusable = modal.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (firstFocusable) {
          firstFocusable.focus();
        }
      }, 100);

      // Cerrar al presionar Escape
      const handleEscape = function (e) {
        if (e.key === "Escape") {
          closeModal(modalId);
          document.removeEventListener("keydown", handleEscape);
        }
      };
      document.addEventListener("keydown", handleEscape);
    }
  }

  // Función para cerrar modales
  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = ""; // Restaurar scroll

      // Retornar el foco al elemento que abrió el modal
      if (lastFocusedElement) {
        setTimeout(() => {
          lastFocusedElement.focus();
        }, 100);
      }
    }
  }

  // Rastrear el último elemento enfocado
  let lastFocusedElement;

  // Configurar listeners para abrir modales
  const termsLink =
    document.querySelector('a[href="#terms-of-service"]') ||
    document.querySelector(".footer-links a:nth-child(1)");
  const privacyLink =
    document.querySelector('a[href="#privacy-policy"]') ||
    document.querySelector(".footer-links a:nth-child(2)");

  if (termsLink) {
    termsLink.addEventListener("click", function (e) {
      e.preventDefault();
      lastFocusedElement = this;
      openModal("termsModal");
    });
  }

  if (privacyLink) {
    privacyLink.addEventListener("click", function (e) {
      e.preventDefault();
      lastFocusedElement = this;
      openModal("privacyModal");
    });
  }

  // Configurar listeners para cerrar modales
  const closeButtons = document.querySelectorAll("[data-close-modal]");
  closeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const modalId = this.getAttribute("data-close-modal");
      closeModal(modalId);
    });
  });

  // Cerrar al hacer clic fuera del contenido del modal
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    modal.addEventListener("click", function (e) {
      if (e.target === this) {
        closeModal(this.id);
      }
    });
  });

  // Prevenir que el clic dentro del contenido cierre el modal
  const modalContents = document.querySelectorAll(".modal-content");
  modalContents.forEach((content) => {
    content.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  });
});
