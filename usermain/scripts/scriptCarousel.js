document.addEventListener("DOMContentLoaded", function () {
  // Seleccionar elementos del carousel
  const track = document.querySelector(".carousel-track");
  const slides = Array.from(document.querySelectorAll(".carousel-slide"));
  const prevButton = document.querySelector(".prev-btn");
  const nextButton = document.querySelector(".next-btn");
  const indicators = Array.from(
    document.querySelectorAll(".carousel-indicator")
  );

  // Validar que existan los elementos necesarios
  if (!track || slides.length === 0) {
    console.error("Elementos del carousel no encontrados");
    return;
  }

  // Variables de control
  let currentIndex = 0;

  // Añadir clase active-slide al primer slide
  slides[0].classList.add("active-slide");

  // Función para mover a un slide específico
  const moveToSlide = (index) => {
    // Validar límites de forma circular
    if (index < 0) {
      index = slides.length - 1;
    } else if (index >= slides.length) {
      index = 0;
    }

    // Actualizar índice actual
    currentIndex = index;

    // Mover el track
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Actualizar los indicadores
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle("active", i === currentIndex);
    });

    // Actualizar clases active-slide
    slides.forEach((slide, i) => {
      slide.classList.toggle("active-slide", i === currentIndex);
    });
  };

  // Event listeners para los botones
  if (prevButton) {
    prevButton.addEventListener("click", () => {
      moveToSlide(currentIndex - 1);
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      moveToSlide(currentIndex + 1);
    });
  }

  // Event listeners para los indicadores
  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => {
      moveToSlide(index);
    });
  });

  // Event listener para navegación con teclado
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      moveToSlide(currentIndex - 1);
    } else if (e.key === "ArrowRight") {
      moveToSlide(currentIndex + 1);
    }
  });

  // Soporte para gestos táctiles (swipe)
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  track.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    },
    { passive: true }
  );

  function handleSwipe() {
    const swipeThreshold = 50;

    if (touchEndX < touchStartX - swipeThreshold) {
      // Swipe izquierda - siguiente
      moveToSlide(currentIndex + 1);
    }

    if (touchEndX > touchStartX + swipeThreshold) {
      // Swipe derecha - anterior
      moveToSlide(currentIndex - 1);
    }
  }

  // Autoplay
  let autoplayInterval;

  const startAutoplay = () => {
    autoplayInterval = setInterval(() => {
      moveToSlide(currentIndex + 1);
    }, 5000);
  };

  const stopAutoplay = () => {
    clearInterval(autoplayInterval);
  };

  // Detener autoplay al interactuar
  const carouselContainer = document.querySelector(
    ".product-carousel-container"
  );
  if (carouselContainer) {
    carouselContainer.addEventListener("mouseenter", stopAutoplay);
    carouselContainer.addEventListener("mouseleave", startAutoplay);
    carouselContainer.addEventListener("touchstart", stopAutoplay, {
      passive: true,
    });
    carouselContainer.addEventListener("touchend", startAutoplay);
  }

  // Acción para los botones de productos
  slides.forEach((slide) => {
    const button = slide.querySelector(".product-action");

    if (button) {
      button.addEventListener("click", function (e) {
        e.preventDefault();
        const productName = slide.querySelector(".product-title").textContent;
        alert(`Has seleccionado: ${productName}`);
        // Aquí puedes implementar la navegación a la página de detalles
      });
    }
  });

  // Inicializar
  moveToSlide(0);
  startAutoplay();
});
