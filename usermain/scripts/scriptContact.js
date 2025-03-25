/* filepath: /e:/proyectos_html/login_particulas/PANELSTREAMER-main/usermain/scripts/scriptContact.js */
document.addEventListener("DOMContentLoaded", function () {
  // Referencias a elementos
  const contactForm = document.getElementById("contact-form");
  const faqItems = document.querySelectorAll(".contact-faq .faq-item");
  const formInputs = document.querySelectorAll(".form-input");

  // Manejar envío del formulario
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Animación de carga
      const submitBtn = this.querySelector(".submit-button");
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = `
          <div class="loading-spinner"></div>
          <span>Enviando...</span>
        `;
      submitBtn.disabled = true;

      // Simular envío (aquí iría tu lógica real de envío)
      setTimeout(function () {
        // Mostrar mensaje de éxito
        contactForm.innerHTML = `
            <div class="success-message">
              <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <h2>¡Mensaje enviado!</h2>
              <p>Gracias por contactarnos. Te responderemos lo antes posible.</p>
              <button class="reset-form-btn">Enviar otro mensaje</button>
            </div>
          `;

        // Resetear formulario
        const resetBtn = document.querySelector(".reset-form-btn");
        if (resetBtn) {
          resetBtn.addEventListener("click", function () {
            window.location.reload();
          });
        }
      }, 2000);
    });
  }

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

  // Efectos de hover en los campos del formulario
  formInputs.forEach((input) => {
    input.addEventListener("focus", function () {
      // Crear efecto de destello
      const glowEffect = document.createElement("div");
      glowEffect.classList.add("input-glow-effect");

      // Aplicar estilo al destello
      const rect = this.getBoundingClientRect();
      glowEffect.style.cssText = `
          position: absolute;
          width: 40px;
          height: 40px;
          background: radial-gradient(circle, rgba(var(--theme-color-rgb, 255, 0, 0), 0.5), transparent 70%);
          border-radius: 50%;
          pointer-events: none;
          z-index: -1;
          opacity: 0;
          transform: scale(0);
          transition: all 0.5s ease;
        `;

      // Añadir al contenedor de entrada
      const inputContainer = this.closest(".input-container");
      inputContainer.style.position = "relative";
      inputContainer.appendChild(glowEffect);

      // Animar el destello
      setTimeout(() => {
        glowEffect.style.opacity = "1";
        glowEffect.style.transform = "scale(5)";

        // Posicionar aleatoriamente
        const randomX = Math.floor(Math.random() * rect.width);
        const randomY = Math.floor(Math.random() * rect.height);
        glowEffect.style.left = `${randomX}px`;
        glowEffect.style.top = `${randomY}px`;
      }, 10);

      // Eliminar el efecto después de la animación
      setTimeout(() => {
        glowEffect.style.opacity = "0";
        setTimeout(() => {
          if (inputContainer.contains(glowEffect)) {
            inputContainer.removeChild(glowEffect);
          }
        }, 500);
      }, 1000);
    });
  });

  // Animar partículas de fondo
  const particleElements = document.querySelectorAll(".particle");

  function animateParticles() {
    particleElements.forEach((particle) => {
      // Posición inicial aleatoria
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      particle.style.left = `${startX}%`;
      particle.style.top = `${startY}%`;

      // Tamaño aleatorio
      const size = 50 + Math.random() * 100;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      // Desenfoque aleatorio
      const blur = 15 + Math.random() * 15;
      particle.style.filter = `blur(${blur}px)`;

      // Opacidad aleatoria
      const opacity = 0.3 + Math.random() * 0.3;
      particle.style.opacity = opacity;
    });
  }

  // Inicializar las partículas
  animateParticles();

  // Efecto parallax en las partículas
  document.addEventListener("mousemove", function (e) {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    particleElements.forEach((particle, index) => {
      const depth = 0.05 + (index % 5) * 0.01;
      const moveX = mouseX * depth * 100;
      const moveY = mouseY * depth * 100;

      particle.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  });

  // Actualizar referencias en la navegación
  const contactLink = document.querySelector(
    '.sidebar-link[data-tooltip="Contact"]'
  );
  if (contactLink) {
    contactLink.href = "#sectioncontact-content";
  }

  // Inicializar la primera pregunta del FAQ como abierta
  if (faqItems.length > 0) {
    faqItems[0].classList.add("active");
  }

  // Agregar estilos CSS dinámicos
  const style = document.createElement("style");
  style.textContent = `
      .loading-spinner {
        width: 20px;
        height: 20px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        border-top-color: white;
        animation: spin 0.8s linear infinite;
      }
      
      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
      
      .success-message {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 40px 20px;
        animation: fadeIn 0.5s ease;
      }
      
      .success-message svg {
        color: var(--theme-color, #ff0000);
        margin-bottom: 20px;
        animation: checkmark 0.5s ease-in-out;
      }
      
      @keyframes checkmark {
        0% {
          transform: scale(0);
          opacity: 0;
        }
        50% {
          transform: scale(1.2);
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
      
      .success-message h2 {
        font-size: 1.8rem;
        margin: 0 0 15px;
        color: white;
      }
      
      .success-message p {
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 30px;
      }
      
      .reset-form-btn {
        background: var(--theme-color, #ff0000);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      
      .reset-form-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(var(--theme-color-rgb, 255, 0, 0), 0.3);
      }
    `;
  document.head.appendChild(style);
});
