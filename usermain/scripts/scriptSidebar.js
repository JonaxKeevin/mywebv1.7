document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.getElementById("sidebar");
  const mainContent = document.getElementById("main-content");
  const collapseBtn = document.getElementById("sidebarCollapse");
  const expandBtn = document.getElementById("sidebarExpand");
  const sidebarItems = document.querySelectorAll(".sidebar-item");
  const sidebarTexts = document.querySelectorAll(".sidebar-text");

  // Asignar índices para la animación escalonada
  sidebarItems.forEach((item, index) => {
    item.style.setProperty("--item-index", index);
  });

  // Verificar si hay preferencia guardada en localStorage
  const sidebarState = localStorage.getItem("sidebarState");
  if (sidebarState === "collapsed") {
    sidebar.classList.add("collapsed");
    mainContent.classList.add("expanded");
    hideTexts();
  }

  // Función para ocultar textos
  function hideTexts() {
    sidebarTexts.forEach((text) => {
      text.style.opacity = "0";
      text.style.visibility = "hidden";
    });
  }

  // Función para mostrar textos
  function showTexts() {
    sidebarTexts.forEach((text) => {
      text.style.opacity = "1";
      text.style.visibility = "visible";
    });
  }

  // Función para colapsar el sidebar
  function collapseSidebar() {
    // Primero ocultamos los textos
    hideTexts();

    // Luego colapsamos después de un pequeño retraso
    setTimeout(() => {
      sidebar.classList.add("collapsed");
      mainContent.classList.add("expanded");
      localStorage.setItem("sidebarState", "collapsed");
    }, 100);
  }

  // Función para expandir el sidebar
  function expandSidebar() {
    // Primero expandimos el contenedor
    sidebar.classList.remove("collapsed");
    mainContent.classList.remove("expanded");

    // Luego mostramos los textos después de un retraso
    setTimeout(() => {
      showTexts();
    }, 150);

    localStorage.setItem("sidebarState", "expanded");
  }

  // Event listeners para los botones
  if (collapseBtn) {
    collapseBtn.addEventListener("click", collapseSidebar);
  }

  if (expandBtn) {
    expandBtn.addEventListener("click", expandSidebar);
  }

  // El resto del código se mantiene igual...
});
