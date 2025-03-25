/* filepath: /e:/proyectos_html/login_particulas/PANELSTREAMER-main/usermain/scripts/scriptyourwebsite.js */
document.addEventListener("DOMContentLoaded", function () {
  // Referencias a elementos del DOM
  const contactNowBtn = document.querySelector(".contact-now-btn");
  const ctaContactBtn = document.getElementById("cta-contact-btn");
  const skillCards = document.querySelectorAll(".skill-card");
  const skillBars = document.querySelectorAll(".skill-progress");

  // Función para manejar el clic en los botones de contacto
  function handleContactButtonClick() {
    // ...código existente...
  }

  // Agregar event listeners a los botones
  if (contactNowBtn) {
    contactNowBtn.addEventListener("click", handleContactButtonClick);
  }

  if (ctaContactBtn) {
    ctaContactBtn.addEventListener("click", handleContactButtonClick);
  }

  // Actualizar el menú lateral para que el enlace apunte a la sección correcta
  const createWebsiteLink = document.querySelector(
    '.sidebar-link[data-tooltip="Create Website"]'
  );
  if (createWebsiteLink) {
    createWebsiteLink.href = "#sectioncreate-website";
  }

  // Inicializar las tarjetas de habilidades con animación
  skillCards.forEach((card, index) => {
    setTimeout(() => {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, 100 * index);
  });

  // Configurar las barras de progreso con sus porcentajes reales
  skillBars.forEach((bar) => {
    const percent = bar.getAttribute("data-percent");

    // Iniciar las barras en 0%
    bar.style.width = "0%";

    // Agregar evento para hover manual
    const skillLevel = bar.parentElement;
    skillLevel.addEventListener("mouseenter", function () {
      bar.style.width = percent;
    });

    skillLevel.addEventListener("mouseleave", function () {
      // Opcional: si deseas que la barra se mantenga llena después del hover
      // No hagas nada aquí
      // Si deseas que vuelva a 0%, descomenta la siguiente línea:
      // bar.style.width = "0%";
    });
  });

  // Función para mostrar animación de barras cuando la sección es visible
  function handleIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Animar todas las barras de progreso tras un pequeño retraso
        setTimeout(() => {
          document.querySelectorAll(".skill-progress").forEach((bar) => {
            const percent = bar.getAttribute("data-percent");
            bar.style.width = percent;
          });
        }, 500);
      } else {
        // Opcional: resetear barras cuando la sección no está visible
        document.querySelectorAll(".skill-progress").forEach((bar) => {
          bar.style.width = "0%";
        });
      }
    });
  }

  // Configurar IntersectionObserver para detectar cuando la sección es visible
  const observer = new IntersectionObserver(handleIntersection, {
    threshold: 0.2, // Activa cuando al menos el 20% de la sección es visible
  });

  const skillsSection = document.querySelector(".skills-section");
  if (skillsSection) {
    observer.observe(skillsSection);
  }
});
