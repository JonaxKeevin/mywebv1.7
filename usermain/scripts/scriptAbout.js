/* filepath: /e:/proyectos_html/login_particulas/PANELSTREAMER-main/usermain/scripts/scriptAbout.js */
document.addEventListener("DOMContentLoaded", function () {
  // Referencias a elementos
  const faqItems = document.querySelectorAll(".faq-item");
  const aboutSections = document.querySelectorAll(".about-container > div");

  // Manejar interacciones de FAQ
  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {
      // Cerrar otras respuestas abiertas
      faqItems.forEach((otherItem) => {
        if (otherItem !== item && otherItem.classList.contains("active")) {
          otherItem.classList.remove("active");
        }
      });

      // Alternar estado actual
      item.classList.toggle("active");
    });
  });

  // Animación al hacer scroll para secciones
  function handleIntersection(entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
        observer.unobserve(entry.target);
      }
    });
  }

  // Configurar IntersectionObserver
  const sectionObserver = new IntersectionObserver(handleIntersection, {
    threshold: 0.2,
    rootMargin: "0px 0px -100px 0px",
  });

  // Observar todas las secciones para animación al scroll
  aboutSections.forEach((section) => {
    section.classList.add("fade-section");
    sectionObserver.observe(section);
  });

  // Inicializar la primera pregunta del FAQ como abierta
  if (faqItems.length > 0) {
    faqItems[0].classList.add("active");
  }

  // Actualizar el menú lateral para que el enlace apunte a la sección correcta
  const aboutLink = document.querySelector(
    '.sidebar-link[data-tooltip="About"]'
  );
  if (aboutLink) {
    aboutLink.href = "#sectionabout-content";
  }

  // Agregar estilo CSS dinámico para animaciones de secciones
  const style = document.createElement("style");
  style.textContent = `
      .fade-section {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
      }
      
      .animate-in {
        opacity: 1;
        transform: translateY(0);
      }
      
      .fade-section:nth-child(2n) {
        transition-delay: 0.2s;
      }
      
      .fade-section:nth-child(3n) {
        transition-delay: 0.4s;
      }
    `;
  document.head.appendChild(style);

  // Hacer que las imágenes de fondo utilicen carga diferida
  const lazyImages = document.querySelectorAll(
    ".about-header-image img, .about-story-image img, .team-member img, .testimonial-avatar"
  );

  lazyImages.forEach((img) => {
    // Si la imagen tiene atributo src, moverlo a data-src
    if (img.src && !img.dataset.src) {
      img.dataset.src = img.src;
      img.src =
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
      img.classList.add("lazy-load");
    }
  });

  // Configurar IntersectionObserver para carga diferida de imágenes
  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
            img.classList.remove("lazy-load");
          }
          observer.unobserve(img);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "200px 0px",
    }
  );

  // Observar todas las imágenes para carga diferida
  lazyImages.forEach((img) => {
    imageObserver.observe(img);
  });

  // Agregar eventos para enlaces CTA dentro de la sección
  const ctaButtons = document.querySelectorAll(".about-cta .cta-button");

  ctaButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");

      // Si es un enlace interno a otra sección
      if (targetId.startsWith("#")) {
        e.preventDefault();

        // Ocultar todas las secciones
        document.querySelectorAll("main > section").forEach((section) => {
          section.classList.remove("active-section");
          section.classList.add("hidden-section");
        });

        // Mostrar la sección de destino
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          targetSection.classList.remove("hidden-section");
          targetSection.classList.add("active-section");

          // Actualizar la URL
          window.location.hash = targetId;

          // Scroll al inicio
          window.scrollTo(0, 0);

          // Actualizar el menú lateral
          document.querySelectorAll(".sidebar-link").forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === targetId) {
              link.classList.add("active");
            }
          });
        }
      }
    });
  });
});
