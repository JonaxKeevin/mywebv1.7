document.addEventListener("DOMContentLoaded", function () {
  // Referencias a elementos del DOM
  const colorPickerToggle = document.getElementById("color-picker-toggle");
  const colorSettings = document.getElementById("color-settings");

  // Colores predefinidos con sus nombres
  const predefinedColors = [
    { name: "Rojo", value: "#ff0000" },
    { name: "Azul", value: "#0066ff" },
    { name: "Verde", value: "#00cc66" },
    { name: "Morado", value: "#9933ff" },
    { name: "Naranja", value: "#ff6600" },
    { name: "Rosa", value: "#ff3399" },
    { name: "Cian", value: "#00ccff" },
    { name: "Amarillo", value: "#ffcc00" },
  ];

  // Crear el panel de selección de color
  function createColorPanel() {
    // Contenedor principal
    const colorPanel = document.createElement("div");
    colorPanel.className = "color-panel";

    // Título del panel
    const panelTitle = document.createElement("h3");
    panelTitle.className = "color-panel-title";
    panelTitle.textContent = "Selecciona un color";
    colorPanel.appendChild(panelTitle);

    // Contenedor de colores predefinidos
    const colorGrid = document.createElement("div");
    colorGrid.className = "color-grid";

    // Agregar colores predefinidos
    predefinedColors.forEach((color) => {
      const colorOption = document.createElement("button");
      colorOption.className = "color-option";
      colorOption.style.backgroundColor = color.value;
      colorOption.setAttribute("data-color", color.value);
      colorOption.setAttribute("title", color.name);

      colorOption.addEventListener("click", function () {
        applyColorTheme(color.value);
        hideColorPanel();
      });

      colorGrid.appendChild(colorOption);
    });

    colorPanel.appendChild(colorGrid);

    // Separador
    const divider = document.createElement("div");
    divider.className = "color-divider";
    colorPanel.appendChild(divider);

    // Selector de color personalizado
    const customColorContainer = document.createElement("div");
    customColorContainer.className = "custom-color-container";

    const customColorLabel = document.createElement("label");
    customColorLabel.htmlFor = "custom-color-input";
    customColorLabel.textContent = "Elige un color personalizado:";

    const customColorInput = document.createElement("input");
    customColorInput.type = "color";
    customColorInput.id = "custom-color-input";
    customColorInput.className = "custom-color-input";
    customColorInput.value = "#ff0000";

    const applyCustomBtn = document.createElement("button");
    applyCustomBtn.className = "apply-custom-btn";
    applyCustomBtn.textContent = "Aplicar";
    applyCustomBtn.addEventListener("click", function () {
      applyColorTheme(customColorInput.value);
      hideColorPanel();
    });

    customColorContainer.appendChild(customColorLabel);
    customColorContainer.appendChild(customColorInput);
    customColorContainer.appendChild(applyCustomBtn);

    colorPanel.appendChild(customColorContainer);

    // Botón para cerrar
    const closeBtn = document.createElement("button");
    closeBtn.className = "color-panel-close";
    closeBtn.innerHTML = "&times;";
    closeBtn.addEventListener("click", hideColorPanel);
    colorPanel.appendChild(closeBtn);

    return colorPanel;
  }

  // Función para mostrar el panel de colores
  function showColorPanel() {
    // Crear panel si no existe
    if (!document.querySelector(".color-panel")) {
      const panel = createColorPanel();
      colorSettings.appendChild(panel);
    }

    // Mostrar el panel con animación
    setTimeout(() => {
      document.querySelector(".color-panel").classList.add("visible");
    }, 10);

    // Establecer estado activo en el botón de toggle
    colorPickerToggle.classList.add("active");
  }

  // Función para ocultar el panel de colores
  function hideColorPanel() {
    const panel = document.querySelector(".color-panel");
    if (panel) {
      panel.classList.remove("visible");

      // Remover después de la animación
      setTimeout(() => {
        if (panel.parentNode) {
          panel.parentNode.removeChild(panel);
        }
      }, 300);
    }

    // Quitar estado activo del botón
    colorPickerToggle.classList.remove("active");
  }

  // Función para aplicar el color seleccionado a todo el sitio
  function applyColorTheme(colorValue) {
    // Convertir a formato RGB para operaciones
    const rgbColor = hexToRgb(colorValue);
    if (!rgbColor) return;

    // Guardar preferencia en localStorage
    localStorage.setItem("userThemeColor", colorValue);

    // 1. Actualizar las partículas
    updateParticlesColor(rgbColor.r, rgbColor.g, rgbColor.b);

    // 2. Aplicar el color a CSS custom properties (variables)
    document.documentElement.style.setProperty("--theme-color", colorValue);
    document.documentElement.style.setProperty(
      "--theme-color-rgb",
      `${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}`
    );

    // 3. Actualizar elementos específicos con clases para colores temáticos
    applyColorToElements(colorValue, rgbColor);

    // 4. Crear y aplicar estilos dinámicos para sobrescribir colores a nivel global
    applyDynamicStyles(colorValue, rgbColor);
  }

  // Función para actualizar el color de las partículas
  function updateParticlesColor(r, g, b) {
    // Acceder a la función Particle en el archivo de partículas
    if (window.Particle) {
      // Si está disponible la función de partículas a nivel global

      // Actualizar método draw de Particle
      const originalDraw = Particle.prototype.draw;
      Particle.prototype.draw = function () {
        const angle = (Math.PI * 2) / 3;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        for (let j = 0; j < 5; j++) {
          const alpha = 0.1 - j * 0.02;
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(0, 0, this.size + j * 2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
          const x = this.size * Math.cos(this.rotation + i * angle);
          const y = this.size * Math.sin(this.rotation + i * angle);
          ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      };
    } else {
      // Alternativa: sobrescribir directamente las partículas existentes
      // al acceder a la variable global particles si está disponible
      if (window.particles && Array.isArray(window.particles)) {
        window.particleColor = { r, g, b };
      }
    }
  }

  // Aplicar colores a elementos específicos
  function applyColorToElements(colorValue, rgbColor) {
    // Elementos que usan directamente el color temático
    const themeColorElements = [
      ".site-header",
      ".sidebar",
      ".sidebar-link.active",
      ".product-action",
      ".carousel-indicator.active",
      ".carousel-title::after",
      ".fullscreen-close",
    ];

    // Aplicar a elementos de fondo con colores más oscuros (para botones, etc.)
    const backgroundElements = [
      ".product-action",
      ".carousel-control",
      ".carousel-indicator.active",
    ];

    // Elementos que usan el color para texto o bordes
    const accentElements = [
      ".sidebar-icon",
      ".product-price",
      ".carousel-title",
      ".site-title",
      ".nav-link:hover",
    ];

    // Aplicar estilos inline para forzar cambios
    document.querySelectorAll(themeColorElements.join(",")).forEach((el) => {
      if (
        el.classList.contains("active") ||
        backgroundElements.includes(`.${Array.from(el.classList).join(".")}`)
      ) {
        el.style.backgroundColor = colorValue;
      }
    });

    document.querySelectorAll(accentElements.join(",")).forEach((el) => {
      el.style.color = colorValue;
    });
  }

  // Aplicar estilos dinámicos globales
  function applyDynamicStyles(colorValue, rgbColor) {
    // Eliminar hoja de estilos dinámica anterior si existe
    const existingStyle = document.getElementById("dynamic-color-styles");
    if (existingStyle) {
      document.head.removeChild(existingStyle);
    }

    // Crear nueva hoja de estilos para los colores dinámicos
    const styleEl = document.createElement("style");
    styleEl.id = "dynamic-color-styles";

    // Crear versiones más claras y oscuras del color
    const darkerColor = darkenColor(rgbColor, 0.3);
    const lighterColor = lightenColor(rgbColor, 0.3);

    // Definir estilos globales
    styleEl.textContent = `
        :root {
          --theme-color: ${colorValue};
          --theme-color-rgb: ${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b};
          --theme-color-dark: rgb(${darkerColor.r}, ${darkerColor.g}, ${darkerColor.b});
          --theme-color-light: rgb(${lighterColor.r}, ${lighterColor.g}, ${lighterColor.b});
        }
        
        /* Cambios en elementos de navegación */
        .sidebar-link:hover {
          background-color: rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.1);
        }
        
        .sidebar-link:hover::before,
        .sidebar-link.active::before {
          background-color: ${colorValue};
        }
        
        /* Cambios en botones y controles */
        .product-action:hover {
          background-color: rgb(${darkerColor.r}, ${darkerColor.g}, ${darkerColor.b});
        }
        
        .carousel-control {
          background: rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.15);
          color: ${colorValue};
        }
        
        .carousel-control:hover {
          background: rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.25);
        }
        
        /* Cambios en efectos y partículas */
        .product-card::after {
          background: linear-gradient(
            to bottom right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0) 40%,
            rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.3) 50%,
            rgba(255, 255, 255, 0) 60%,
            rgba(255, 255, 255, 0) 100%
          );
        }
        
        .carousel-progress-bar {
          background: ${colorValue};
        }
      `;

    document.head.appendChild(styleEl);
  }

  // Utilidad: Convertir hex a rgb
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  // Utilidad: Oscurecer color
  function darkenColor(rgb, factor) {
    return {
      r: Math.max(0, Math.floor(rgb.r * (1 - factor))),
      g: Math.max(0, Math.floor(rgb.g * (1 - factor))),
      b: Math.max(0, Math.floor(rgb.b * (1 - factor))),
    };
  }

  // Utilidad: Aclarar color
  function lightenColor(rgb, factor) {
    return {
      r: Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * factor)),
      g: Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * factor)),
      b: Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * factor)),
    };
  }

  // Patch para las partículas
  // Esta función reemplaza la parte relevante del código de partículas
  function patchParticlesSystem() {
    // Crear un observador MutationObserver para detectar cambios en las partículas
    const observer = new MutationObserver((mutations) => {
      if (window.particleColor) {
        // Si existe la variable global de color, aplica el color a las partículas
        const particles = window.particles;
        if (particles && Array.isArray(particles)) {
          const { r, g, b } = window.particleColor;

          // Modificar el método draw de las partículas existentes
          particles.forEach((particle) => {
            particle.originalDraw = particle.draw;
            particle.draw = function () {
              const angle = (Math.PI * 2) / 3;
              ctx.save();
              ctx.translate(this.x, this.y);
              ctx.rotate(this.rotation);

              for (let j = 0; j < 5; j++) {
                const alpha = 0.1 - j * 0.02;
                ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
                ctx.beginPath();
                ctx.arc(0, 0, this.size + j * 2, 0, Math.PI * 2);
                ctx.fill();
              }

              ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
              ctx.beginPath();
              for (let i = 0; i < 3; i++) {
                const x = this.size * Math.cos(this.rotation + i * angle);
                const y = this.size * Math.sin(this.rotation + i * angle);
                ctx.lineTo(x, y);
              }
              ctx.closePath();
              ctx.fill();
              ctx.restore();
            };
          });
        }
      }
    });

    // Observar cambios en el document para detectar cuando se carga el script de partículas
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  // Integración directa con userparticles.js
  function monkeyPatchUserParticles() {
    // Crear un hook para sobrescribir la función Particle cuando se cargue
    const originalParticle = window.Particle;
    window.particleColorOverride = { r: 255, g: 0, b: 0 }; // Color por defecto (rojo)

    Object.defineProperty(window, "Particle", {
      set: function (newParticle) {
        // Cuando se asigna la clase Particle, modificamos su método draw
        const prototypeDesc = Object.getOwnPropertyDescriptor(
          newParticle,
          "prototype"
        );
        if (prototypeDesc && prototypeDesc.writable) {
          const originalDraw = newParticle.prototype.draw;

          newParticle.prototype.draw = function () {
            const { r, g, b } = window.particleColorOverride;
            const angle = (Math.PI * 2) / 3;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);

            for (let j = 0; j < 5; j++) {
              const alpha = 0.1 - j * 0.02;
              ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
              ctx.beginPath();
              ctx.arc(0, 0, this.size + j * 2, 0, Math.PI * 2);
              ctx.fill();
            }

            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.beginPath();
            for (let i = 0; i < 3; i++) {
              const x = this.size * Math.cos(this.rotation + i * angle);
              const y = this.size * Math.sin(this.rotation + i * angle);
              ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          };
        }

        originalParticle = newParticle;
      },
      get: function () {
        return originalParticle;
      },
      configurable: true,
    });
  }

  // Evento para mostrar/ocultar el panel de colores
  colorPickerToggle.addEventListener("click", function () {
    if (
      document.querySelector(".color-panel") &&
      document.querySelector(".color-panel").classList.contains("visible")
    ) {
      hideColorPanel();
    } else {
      showColorPanel();
    }
  });

  // Cerrar panel al hacer clic fuera
  document.addEventListener("click", function (e) {
    const panel = document.querySelector(".color-panel");
    if (
      panel &&
      panel.classList.contains("visible") &&
      !panel.contains(e.target) &&
      e.target !== colorPickerToggle &&
      !colorPickerToggle.contains(e.target)
    ) {
      hideColorPanel();
    }
  });

  // Inicializar
  function init() {
    // Verificar si hay un color guardado en localStorage
    const savedColor = localStorage.getItem("userThemeColor");
    if (savedColor) {
      applyColorTheme(savedColor);
    }

    // Crear CSS para el panel de selección de colores
    const styleEl = document.createElement("style");
    styleEl.textContent = `
        /* Estilos para el panel de selección de colores */
        .color-settings {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
        }
        
        .color-picker-toggle {
          background-color: #333;
          color: white;
          border: none;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
          overflow: hidden;
        }
        
        .color-picker-toggle:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
        }
        
        .color-picker-toggle.active {
          background-color: var(--theme-color, #ff0000);
        }
        
        .color-icon {
          font-size: 24px;
        }
        
        .color-label {
          display: none;
        }
        
        .color-panel {
          position: absolute;
          bottom: 65px;
          right: 0;
          width: 280px;
          background-color: #222;
          border-radius: 8px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.4);
          padding: 15px;
          transform: translateY(20px);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          z-index: 1001;
        }
        
        .color-panel.visible {
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
        }
        
        .color-panel-title {
          color: white;
          font-size: 16px;
          margin: 0 0 15px;
          text-align: center;
        }
        
        .color-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-bottom: 15px;
        }
        
        .color-option {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 2px solid #444;
          cursor: pointer;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        
        .color-option:hover {
          transform: scale(1.1);
          border-color: white;
        }
        
        .color-divider {
          height: 1px;
          background-color: #444;
          margin: 15px 0;
        }
        
        .custom-color-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .custom-color-container label {
          color: white;
          font-size: 14px;
        }
        
        .custom-color-input {
          width: 100%;
          height: 40px;
          border: none;
          background: none;
          cursor: pointer;
        }
        
        .apply-custom-btn {
          background-color: var(--theme-color, #ff0000);
          color: white;
          border: none;
          padding: 8px 15px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          transition: background-color 0.2s ease;
        }
        
        .apply-custom-btn:hover {
          background-color: var(--theme-color-dark, #cc0000);
        }
        
        .color-panel-close {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        
        .color-panel-close:hover {
          transform: scale(1.2);
        }
        
        @media (max-width: 768px) {
          .color-panel {
            width: 240px;
          }
          
          .color-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `;

    document.head.appendChild(styleEl);

    // Iniciar el monitoreo de partículas
    patchParticlesSystem();
  }

  // Método directo para cambiar el color de las partículas
  window.changeParticlesColor = function (r, g, b) {
    window.particleColorOverride = { r, g, b };
  };

  // Inicializar la configuración
  init();
});
