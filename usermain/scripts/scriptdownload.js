document.addEventListener("DOMContentLoaded", function () {
  // Referencias a elementos del DOM
  const filterButtons = document.querySelectorAll(".filter-btn");
  const searchInput = document.getElementById("download-search-input");
  const downloadCards = document.querySelectorAll(".download-card");
  const downloadCategories = document.querySelectorAll(".download-category");

  // Estado actual de la búsqueda y filtro
  let currentFilter = "all";
  let currentSearch = "";

  // Función para actualizar la visualización de tarjetas según filtros y búsqueda
  function updateCardVisibility() {
    // Recorremos todas las tarjetas de descarga
    downloadCards.forEach((card) => {
      const cardCategory = card.getAttribute("data-category");
      const cardTitle = card
        .querySelector(".download-title")
        .textContent.toLowerCase();
      const cardDescription = card
        .querySelector(".download-description")
        .textContent.toLowerCase();
      const searchContent = cardTitle + " " + cardDescription;

      // Verificar si la tarjeta coincide con el filtro actual
      const matchesFilter =
        currentFilter === "all" || cardCategory === currentFilter;

      // Verificar si la tarjeta coincide con la búsqueda actual
      const matchesSearch =
        currentSearch === "" || searchContent.includes(currentSearch);

      // Mostrar u ocultar la tarjeta según si coincide con ambos criterios
      if (matchesFilter && matchesSearch) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });

    // Actualizar contadores de archivos visibles por categoría
    updateFileCounts();

    // Mostrar u ocultar categorías según si tienen elementos visibles
    updateCategoryVisibility();
  }

  // Función para actualizar los contadores de archivos por categoría
  function updateFileCounts() {
    downloadCategories.forEach((category) => {
      const categoryId = category.id;
      const categoryType = categoryId.replace("-category", "");
      const visibleCards = category.querySelectorAll(
        `.download-card[style="display: flex;"]`
      );
      const fileCountElement = category.querySelector(".file-count");

      if (fileCountElement) {
        fileCountElement.textContent = `${visibleCards.length} archivo${
          visibleCards.length !== 1 ? "s" : ""
        }`;
      }
    });
  }

  // Función para mostrar u ocultar categorías sin elementos visibles
  function updateCategoryVisibility() {
    downloadCategories.forEach((category) => {
      const visibleCards = category.querySelectorAll(
        `.download-card[style="display: flex;"]`
      );
      if (visibleCards.length > 0) {
        category.style.display = "block";
      } else {
        // Solo ocultar si estamos filtrando o buscando
        if (currentFilter !== "all" || currentSearch !== "") {
          category.style.display = "none";
        } else {
          category.style.display = "block";
        }
      }
    });

    // Verificar si hay resultados visibles en total
    const hasVisibleResults = Array.from(downloadCards).some(
      (card) => card.style.display === "flex"
    );

    // Mostrar mensaje si no hay resultados
    showNoResultsMessage(!hasVisibleResults);
  }

  // Función para mostrar/ocultar el mensaje de "No se encontraron resultados"
  function showNoResultsMessage(show) {
    // Eliminar mensaje existente si lo hay
    const existingMessage = document.querySelector(".no-results");
    if (existingMessage) {
      existingMessage.remove();
    }

    // Si no hay resultados y estamos filtrando/buscando, mostrar mensaje
    if (show && (currentFilter !== "all" || currentSearch !== "")) {
      const downloadsSection = document.querySelector(".downloads-section");
      const noResults = document.createElement("div");
      noResults.className = "no-results";
      noResults.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="8" y1="15" x2="16" y2="15"></line>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
          <h3>No se encontraron resultados</h3>
          <p>Intenta con otros términos de búsqueda o selecciona otra categoría.</p>
        `;

      // Insertar el mensaje después de los filtros
      const downloadFilter = document.querySelector(".download-filter");
      if (downloadFilter) {
        downloadFilter.insertAdjacentElement("afterend", noResults);
      } else {
        downloadsSection.appendChild(noResults);
      }
    }
  }

  // Event listener para los botones de filtro
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Actualizar la clase 'active' en los botones
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      // Actualizar filtro actual
      currentFilter = this.getAttribute("data-filter");

      // Actualizar visualización
      updateCardVisibility();
    });
  });

  // Event listener para el campo de búsqueda con debounce para mejor rendimiento
  let searchTimeout;
  searchInput.addEventListener("input", function () {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      currentSearch = this.value.toLowerCase().trim();
      updateCardVisibility();
    }, 300); // 300ms de debounce
  });

  // Inicializar la visualización
  updateCardVisibility();

  // Adición: Restaurar la vista cuando se selecciona "Todo"
  const resetFilterBtn = document.querySelector(
    '.filter-btn[data-filter="all"]'
  );
  if (resetFilterBtn) {
    resetFilterBtn.addEventListener("click", function () {
      // Limpiar la búsqueda cuando se presiona "Todo"
      searchInput.value = "";
      currentSearch = "";
      currentFilter = "all";
      updateCardVisibility();
    });
  }
});
