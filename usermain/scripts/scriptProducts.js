/* filepath: /e:/proyectos_html/login_particulas/PANELSTREAMER-main/usermain/scripts/scriptProducts.js */
document.addEventListener("DOMContentLoaded", function () {
  // Referencias a elementos del DOM para la sección de productos
  const filterButtons = document.querySelectorAll(
    ".products-filter .filter-btn"
  );
  const searchInput = document.getElementById("product-search-input");
  const productItems = document.querySelectorAll(".product-item");
  const productCategories = document.querySelectorAll(".product-category");

  // Estado actual de la búsqueda y filtro de productos
  let currentProductFilter = "all";
  let currentProductSearch = "";

  // Función para actualizar la visualización de productos según filtros y búsqueda
  function updateProductVisibility() {
    // Recorremos todas los productos
    productItems.forEach((item) => {
      const itemCategory = item.getAttribute("data-category");
      const itemTitle = item
        .querySelector(".product-title")
        .textContent.toLowerCase();
      const itemDescription = item
        .querySelector(".product-description")
        .textContent.toLowerCase();
      const searchContent = itemTitle + " " + itemDescription;

      // Verificar si el producto coincide con el filtro actual
      const matchesFilter =
        currentProductFilter === "all" || itemCategory === currentProductFilter;

      // Verificar si el producto coincide con la búsqueda actual
      const matchesSearch =
        currentProductSearch === "" ||
        searchContent.includes(currentProductSearch);

      // Mostrar u ocultar el producto según si coincide con ambos criterios
      if (matchesFilter && matchesSearch) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });

    // Actualizar contadores de productos visibles por categoría
    updateProductCounts();

    // Mostrar u ocultar categorías según si tienen elementos visibles
    updateProductCategoryVisibility();
  }

  // Función para actualizar los contadores de productos por categoría
  function updateProductCounts() {
    productCategories.forEach((category) => {
      const categoryId = category.id;
      const visibleItems = category.querySelectorAll(
        `.product-item[style="display: flex;"]`
      );
      const countElement = category.querySelector(".product-count");

      if (countElement) {
        countElement.textContent = `${visibleItems.length} producto${
          visibleItems.length !== 1 ? "s" : ""
        }`;
      }
    });
  }

  // Función para mostrar u ocultar categorías sin productos visibles
  function updateProductCategoryVisibility() {
    productCategories.forEach((category) => {
      const visibleItems = category.querySelectorAll(
        `.product-item[style="display: flex;"]`
      );
      if (visibleItems.length > 0) {
        category.style.display = "block";
      } else {
        // Solo ocultar si estamos filtrando o buscando
        if (currentProductFilter !== "all" || currentProductSearch !== "") {
          category.style.display = "none";
        } else {
          category.style.display = "block";
        }
      }
    });

    // Verificar si hay resultados visibles en total
    const hasVisibleResults = Array.from(productItems).some(
      (item) => item.style.display === "flex"
    );

    // Mostrar mensaje si no hay resultados
    showNoProductsMessage(!hasVisibleResults);
  }

  // Función para mostrar/ocultar el mensaje de "No se encontraron productos"
  function showNoProductsMessage(show) {
    // Eliminar mensaje existente si lo hay
    const existingMessage = document.querySelector(".no-products");
    if (existingMessage) {
      existingMessage.remove();
    }

    // Si no hay resultados y estamos filtrando/buscando, mostrar mensaje
    if (
      show &&
      (currentProductFilter !== "all" || currentProductSearch !== "")
    ) {
      const productsSection = document.querySelector(".products-section");
      const noResults = document.createElement("div");
      noResults.className = "no-products";
      noResults.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="8" y1="15" x2="16" y2="15"></line>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
          <h3>No se encontraron productos</h3>
          <p>Intenta con otros términos de búsqueda o selecciona otra categoría.</p>
        `;

      // Insertar el mensaje después de los filtros
      const productsFilter = document.querySelector(".products-filter");
      if (productsFilter) {
        productsFilter.insertAdjacentElement("afterend", noResults);
      } else {
        productsSection.appendChild(noResults);
      }
    }
  }

  // Event listener para los botones de filtro de productos
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Actualizar la clase 'active' en los botones
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      // Actualizar filtro actual
      currentProductFilter = this.getAttribute("data-filter");

      // Actualizar visualización
      updateProductVisibility();
    });
  });

  // Event listener para el campo de búsqueda con debounce para mejor rendimiento
  let searchTimeout;
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        currentProductSearch = this.value.toLowerCase().trim();
        updateProductVisibility();
      }, 300); // 300ms de debounce
    });
  }

  // Inicializar comportamiento de botones de acciones
  const detailsBtns = document.querySelectorAll(".details-btn");
  const contactBtns = document.querySelectorAll(".contact-btn");
  const buyBtns = document.querySelectorAll(".buy-btn");
  const notifyBtns = document.querySelectorAll(".notify-btn");

  // Evento para botones de detalles
  detailsBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const productItem = this.closest(".product-item");
      const productTitle =
        productItem.querySelector(".product-title").textContent;
      alert(
        `Detalles de: ${productTitle}\nPróximamente más información detallada sobre este producto.`
      );
    });
  });

  // Evento para botones de contacto
  contactBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const productItem = this.closest(".product-item");
      const productTitle =
        productItem.querySelector(".product-title").textContent;
      alert(
        `Contactar por: ${productTitle}\nPróximamente formulario de contacto para consultas sobre este producto.`
      );
    });
  });

  // Evento para botones de compra
  buyBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const productItem = this.closest(".product-item");
      const productTitle =
        productItem.querySelector(".product-title").textContent;
      const productPrice =
        productItem.querySelector(".product-price").textContent;
      alert(
        `Comprar: ${productTitle}\nPrecio: ${productPrice}\nPróximamente pasarela de pago para adquirir este producto.`
      );
    });
  });

  // Evento para botones de notificación
  notifyBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const productItem = this.closest(".product-item");
      const productTitle =
        productItem.querySelector(".product-title").textContent;
      alert(
        `Te avisaremos cuando ${productTitle} esté disponible nuevamente.\nPróximamente sistema de notificaciones para productos sin stock.`
      );
    });
  });

  // Inicializar la visualización
  updateProductVisibility();

  // Actualizar sidebar para navegar a la sección de productos
  const productsLink = document.querySelector(
    '.sidebar-link[data-tooltip="Products"]'
  );
  if (productsLink) {
    productsLink.href = "#sectionproducts-content";
  }
});
