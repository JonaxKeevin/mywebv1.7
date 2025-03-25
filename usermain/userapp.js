/* filepath: /e:/proyectos_html/login_particulas/PANELSTREAMER-main/usermain/scripts/scriptnavigation.js */
document.addEventListener("DOMContentLoaded", function () {
  // Referencias a elementos de navegación
  const sidebarLinks = document.querySelectorAll(".sidebar-link");
  const navLinks = document.querySelectorAll(".nav-link");

  // Mapa de enlaces a secciones
  const sectionMap = {
    Home: "dashboard",
    Products: "sectionproducts-content",
    Download: "sectiondownload-content",
    Updates: "sectionupdates-content", // Añadir esta línea
    "Create Website": "sectioncreate-website", // Cambiado de Settings a Create Website
    About: "sectionabout-content",
    Settings: "settings-section",
    Profile: "profile-section",
    Contact: "sectioncontact-content",
    Clients: "sectionclients-content", // Añadir esta línea

    // Añadir más mappings según sea necesario
  };

  // Función para cambiar de sección
  function switchSection(sectionId) {
    // Oculta todas las secciones
    document.querySelectorAll("main > section").forEach((section) => {
      section.classList.remove("active-section");
      section.classList.add("hidden-section");
    });

    // Muestra la sección solicitada
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.remove("hidden-section");
      targetSection.classList.add("active-section");

      // Actualizar la URL con hash para facilitar recargar/compartir URLs
      window.location.hash = sectionId;

      // Scroll al inicio
      window.scrollTo(0, 0);
    }
  }

  // Manejador de clics para sidebar
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Solo prevenir el comportamiento predeterminado si estamos en la misma página
      const href = this.getAttribute("href");
      const linkText = this.querySelector(".sidebar-text").textContent;

      if (href === "userindex.html" || href === "#" || href.startsWith("#")) {
        e.preventDefault();
        const sectionId = sectionMap[linkText] || "dashboard";
        switchSection(sectionId);

        // Marcar enlace activo en sidebar
        sidebarLinks.forEach((l) => l.classList.remove("active"));
        this.classList.add("active");
      }
    });
  });

  // Cargar sección según hash URL al cargar la página
  function loadInitialSection() {
    let hash = window.location.hash.substring(1);

    // Si no hay hash o no corresponde a una sección existente, mostrar dashboard
    if (!hash || !document.getElementById(hash)) {
      hash = "dashboard";
    }

    switchSection(hash);

    // Marcar como activo el enlace correspondiente
    const linkText = Object.keys(sectionMap).find(
      (key) => sectionMap[key] === hash
    );
    if (linkText) {
      sidebarLinks.forEach((link) => {
        if (link.querySelector(".sidebar-text").textContent === linkText) {
          link.classList.add("active");
        }
      });
    }
  }

  // Cargar sección inicial
  loadInitialSection();

  // Escuchar cambios en el hash para navegación por historia
  window.addEventListener("hashchange", loadInitialSection);
});
