document.addEventListener("DOMContentLoaded", function () {
  // Elementos para la vista de pantalla completa
  const overlay = document.getElementById("fullscreen-overlay");
  const fullscreenImage = document.getElementById("fullscreen-image");
  const fullscreenTitle = document.getElementById("fullscreen-title");
  const closeButton = document.getElementById("fullscreen-close");

  // Obtener todas las imágenes del carousel
  const productImages = document.querySelectorAll(".product-image");

  // Función para abrir la imagen en pantalla completa
  function openFullscreen(imageSrc, title) {
    fullscreenImage.src = imageSrc;
    fullscreenTitle.textContent = title;
    overlay.classList.add("active");
    document.body.style.overflow = "hidden"; // Evitar scroll en el fondo

    // Añadir evento de tecla Escape para cerrar
    document.addEventListener("keydown", handleEscapeKey);
  }

  // Función para cerrar la pantalla completa
  function closeFullscreen() {
    overlay.classList.remove("active");
    document.body.style.overflow = ""; // Restaurar scroll

    // Eliminar evento de tecla Escape
    document.removeEventListener("keydown", handleEscapeKey);

    // Limpiar la imagen después de la animación
    setTimeout(() => {
      fullscreenImage.src = "";
      fullscreenTitle.textContent = "";
    }, 300);
  }

  // Manejador para la tecla Escape
  function handleEscapeKey(e) {
    if (e.key === "Escape") {
      closeFullscreen();
    }
  }

  // Asignar evento de clic a cada imagen
  productImages.forEach((imageContainer) => {
    imageContainer.addEventListener("click", function () {
      const img = this.querySelector("img");
      const title =
        this.closest(".product-card").querySelector(
          ".product-title"
        ).textContent;
      openFullscreen(img.src, title);
    });
  });

  // Cerrar al hacer clic en el botón X
  if (closeButton) {
    closeButton.addEventListener("click", closeFullscreen);
  }

  // Cerrar al hacer clic fuera de la imagen
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay) {
      closeFullscreen();
    }
  });
});
