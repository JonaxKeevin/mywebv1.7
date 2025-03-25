/* filepath: /e:/proyectos_html/login_particulas/PANELSTREAMER-main/usermain/scripts/scriptUpdates.js */
document.addEventListener("DOMContentLoaded", function () {
  // Referencias a elementos del DOM para la sección de actualizaciones
  const sortSelect = document.getElementById("update-sort");
  const filterSelect = document.getElementById("update-filter");
  const searchInput = document.getElementById("update-search-input");
  const updatesTimeline = document.querySelector(".updates-timeline");
  const updateItems = document.querySelectorAll(".update-item");

  // Estado actual de ordenamiento, filtro y búsqueda
  let currentSort = "date-desc";
  let currentFilter = "all";
  let currentSearch = "";

  // Función para convertir formato de versión a número comparable
  function versionToNumber(version) {
    // Eliminar 'v' inicial si existe
    version = version.replace(/^v/i, "");
    // Dividir por puntos y convertir a números
    const parts = version.split(".").map((part) => parseInt(part, 10));
    // Calcular valor numérico (ej: 2.4.1 -> 2*10000 + 4*100 + 1 = 20401)
    return parts[0] * 10000 + (parts[1] || 0) * 100 + (parts[2] || 0);
  }

  // Función para convertir fecha a objeto Date
  function parseDate(dateStr) {
    return new Date(dateStr);
  }

  // Función para ordenar los elementos
  function sortUpdateItems() {
    const items = Array.from(updateItems);

    items.sort((a, b) => {
      const versionA = a.dataset.version;
      const versionB = b.dataset.version;
      const dateA = new Date(a.dataset.date);
      const dateB = new Date(b.dataset.date);

      switch (currentSort) {
        case "date-desc":
          return dateB - dateA;
        case "date-asc":
          return dateA - dateB;
        case "version-desc":
          return versionToNumber(versionB) - versionToNumber(versionA);
        case "version-asc":
          return versionToNumber(versionA) - versionToNumber(versionB);
        case "importance":
          // Orden de importancia: security > feature > improvement > bugfix
          const typeOrder = {
            security: 0,
            feature: 1,
            improvement: 2,
            bugfix: 3,
          };
          const typeA = a.dataset.type;
          const typeB = b.dataset.type;
          return typeOrder[typeA] - typeOrder[typeB] || dateB - dateA;
        default:
          return 0;
      }
    });

    // Reordenar en el DOM
    items.forEach((item) => updatesTimeline.appendChild(item));
  }

  // Función para actualizar la visualización según filtros, búsqueda y ordenamiento
  function updateDisplay() {
    let visibleCount = 0;

    updateItems.forEach((item) => {
      const itemType = item.dataset.type;
      const itemTitle = item
        .querySelector(".update-title")
        .textContent.toLowerCase();
      const itemDescription = item
        .querySelector(".update-description p")
        .textContent.toLowerCase();
      const searchContent = itemTitle + " " + itemDescription;

      // Verificar si coincide con el filtro y la búsqueda
      const matchesFilter =
        currentFilter === "all" || itemType === currentFilter;
      const matchesSearch =
        currentSearch === "" || searchContent.includes(currentSearch);

      if (matchesFilter && matchesSearch) {
        item.style.display = "block";
        visibleCount++;
      } else {
        item.style.display = "none";
      }
    });

    // Mostrar mensaje si no hay resultados
    showNoResultsMessage(visibleCount === 0);

    // Reordenar los elementos visibles
    sortUpdateItems();
  }

  // Función para mostrar mensaje cuando no hay resultados
  function showNoResultsMessage(show) {
    // Eliminar mensaje existente si lo hay
    const existingMessage = document.querySelector(".no-updates");
    if (existingMessage) {
      existingMessage.remove();
    }

    // Si no hay resultados y estamos filtrando/buscando, mostrar mensaje
    if (show) {
      const noResults = document.createElement("div");
      noResults.className = "no-updates";
      noResults.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="8" y1="15" x2="16" y2="15"></line>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
          <h3>No se encontraron actualizaciones</h3>
          <p>Prueba con otros criterios de búsqueda o cambia los filtros aplicados.</p>
        `;

      updatesTimeline.appendChild(noResults);
    }
  }

  // Event listener para el selector de ordenamiento
  if (sortSelect) {
    sortSelect.addEventListener("change", function () {
      currentSort = this.value;
      updateDisplay();
    });
  }

  // Event listener para el selector de filtro
  if (filterSelect) {
    filterSelect.addEventListener("change", function () {
      currentFilter = this.value;
      updateDisplay();
    });
  }

  // Event listener para el campo de búsqueda con debounce
  let searchTimeout;
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        currentSearch = this.value.toLowerCase().trim();
        updateDisplay();
      }, 300); // 300ms de debounce
    });
  }

  // Inicializar la vista por defecto (ordenar por fecha descendente)
  updateDisplay();

  // Actualizar sidebar para navegar a la sección de actualizaciones
  const updatesLink = document.querySelector(
    '.sidebar-link[data-tooltip="Updates"]'
  );
  if (updatesLink) {
    updatesLink.href = "#sectionupdates-content";
  }

  // Animar entrada de elementos cuando se hace visible la sección
  const updateSection = document.getElementById("sectionupdates-content");
  if (updateSection) {
    // Observer para detectar cuando la sección se hace visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Aplicar animación escalonada a cada elemento
            updateItems.forEach((item, index) => {
              setTimeout(() => {
                item.style.opacity = "0";
                item.style.transform = "translateY(20px)";
                item.style.animation = "fadeSlideIn 0.5s ease forwards";
              }, index * 100);
            });
            // Dejar de observar después de animar
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(updateSection);
  }
});
