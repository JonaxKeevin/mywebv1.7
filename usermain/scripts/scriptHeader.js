document.addEventListener("DOMContentLoaded", function () {
  // Referencias a los elementos del DOM con los nuevos IDs
  const menuButton = document.getElementById("mobile-menu-toggle");
  const menuContainer = document.getElementById("main-navigation-container");
  const dropdownToggle = document.querySelector(".dropdown-toggle");
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const colorPickerToggle = document.getElementById("color-picker-toggle");

  // Toggle de menú móvil
  if (menuButton) {
    menuButton.addEventListener("click", function (e) {
      e.stopPropagation(); // Previene que el clic se propague al documento
      menuContainer.classList.toggle("show");
    });
  }

  // Cerrar el menú al hacer clic fuera
  document.addEventListener("click", function (e) {
    // Verifica si el menú está abierto
    if (menuContainer && menuContainer.classList.contains("show")) {
      // Verifica si el clic fue fuera del menú y del botón hamburguesa
      if (
        !menuContainer.contains(e.target) &&
        e.target !== menuButton &&
        !menuButton.contains(e.target)
      ) {
        menuContainer.classList.remove("show");
      }
    }
  });

  // Configurar comportamiento del dropdown
  if (dropdownToggle) {
    setupDropdown(dropdownToggle);
  } else {
    // Si no se encuentra el selector, intentar con clase
    const allDropdowns = document.querySelectorAll(".dropdown-toggle");
    allDropdowns.forEach((dropdown) => {
      setupDropdown(dropdown);
    });
  }

  // Función para configurar el comportamiento del dropdown
  function setupDropdown(element) {
    element.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation(); // Evita que el clic se propague

      const dropdown = this.nextElementSibling;

      // Toggle de la clase para mostrar/ocultar
      if (dropdown) {
        dropdown.classList.toggle("show-dropdown");
        // Actualizar atributo aria-expanded para accesibilidad
        const expanded = dropdown.classList.contains("show-dropdown");
        this.setAttribute("aria-expanded", expanded);
      }
    });
  }

  // Cerrar dropdowns al hacer clic fuera
  document.addEventListener("click", function () {
    const dropdowns = document.querySelectorAll(".dropdown-menu");
    dropdowns.forEach((dropdown) => {
      dropdown.classList.remove("show-dropdown");
      // Actualizar atributo aria-expanded del toggler
      const toggler = dropdown.previousElementSibling;
      if (toggler) {
        toggler.setAttribute("aria-expanded", "false");
      }
    });
  });

  // Configurar búsqueda
  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const searchTerm = searchInput.value.trim();
      if (searchTerm) {
        console.log("Búsqueda realizada:", searchTerm);
        // Aquí puedes implementar la funcionalidad de búsqueda
        searchInput.value = "";
      }
    });
  }

  // Configurar botón de color (para ser implementado posteriormente)
  if (colorPickerToggle) {
    colorPickerToggle.addEventListener("click", function () {
      // Aquí se implementará la funcionalidad del selector de color
      console.log("Selector de color activado");
      // Puedes disparar un evento personalizado aquí
      document.dispatchEvent(new CustomEvent("openColorPicker"));
    });
  }
});
