document.addEventListener("DOMContentLoaded", function () {
  // Referencia a la sección de clientes
  const clientsSection = document.getElementById("sectionclients-content");

  // Ocultar la sección de clientes al inicio
  if (clientsSection) {
    clientsSection.classList.add("hidden-section");
  }

  // Manejar eventos de botones en la sección de clientes

  // Botones de vista previa
  document.querySelectorAll(".preview-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      alert("Vista previa disponible solo para clientes Premium+");
    });
  });

  // Manejar la navegación a la sección de clientes desde el sidebar
  const clientsLink = document.querySelector(
    "#clients-section-link .sidebar-link"
  );

  if (clientsLink) {
    clientsLink.addEventListener("click", function (e) {
      e.preventDefault();

      // Verificar si el usuario tiene acceso
      const usuarioActualJSON = localStorage.getItem("usuarioActual");

      if (usuarioActualJSON) {
        try {
          const usuarioActual = JSON.parse(usuarioActualJSON);
          const username = usuarioActual.nombreUsuario;

          if (usuarioActual.tieneAccesoClientes) {
            // Ocultar todas las secciones
            const allSections = document.querySelectorAll(
              ".main-content > section"
            );
            allSections.forEach((section) => {
              section.classList.add("hidden-section");
              section.classList.remove("active-section");
            });

            // Mostrar la sección de clientes
            clientsSection.classList.remove("hidden-section");
            clientsSection.classList.add("active-section");
            console.log("Sección de clientes activada para: " + username);
          } else {
            alert(
              "No tienes acceso a esta sección. Inicia sesión como usuario autorizado."
            );
          }
        } catch (e) {
          console.error("Error al procesar datos de usuario:", e);
          alert(
            "Error al verificar credenciales. Por favor, inicia sesión nuevamente."
          );
        }
      } else {
        alert("Debes iniciar sesión para acceder a esta sección.");
      }
    });
  }
});

// SCRIPT PARA CONFIRMAR CIERRE DE SESION
document.addEventListener("DOMContentLoaded", function () {
  // Seleccionar ambos botones de logout
  const logoutSidebarBtn = document.querySelector(
    ".sidebar-logout .logout-btn"
  );
  const logoutNavBtn = document.querySelector(".nav-item .nav-logout");
  const logoutModal = document.getElementById("logout-confirm-modal");
  const logoutCancelBtn = document.getElementById("logout-cancel-btn");
  const logoutConfirmBtn = document.getElementById("logout-confirm-btn");

  // Función para mostrar el modal de confirmación
  function showLogoutConfirmation(e) {
    e.preventDefault();

    // Mostrar el modal con animación
    logoutModal.classList.add("show");

    // Animación de los botones
    const modalButtons = document.querySelectorAll(".modal-button");
    modalButtons.forEach((button) => {
      button.addEventListener("mousedown", function () {
        this.classList.add("button-pressed");
      });

      button.addEventListener("mouseup", function () {
        this.classList.remove("button-pressed");
      });

      button.addEventListener("mouseleave", function () {
        this.classList.remove("button-pressed");
      });
    });
  }

  // Función para cerrar el modal
  function closeLogoutModal() {
    // Efecto de salida
    logoutModal.style.animation = "fadeOut 0.3s forwards";

    setTimeout(() => {
      logoutModal.classList.remove("show");
      logoutModal.style.animation = "";
    }, 300);
  }

  // Función para manejar el cierre de sesión
  function handleLogout() {
    // Efecto de click en el botón de confirmar
    logoutConfirmBtn.classList.add("button-pressed");

    // Añadir un ícono de carga al botón
    const originalButtonContent = logoutConfirmBtn.innerHTML;
    logoutConfirmBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Cerrando sesión...';

    // Eliminar datos de la sesión del localStorage con un pequeño retraso para mostrar la animación
    setTimeout(() => {
      localStorage.removeItem("usuarioActual");

      // Mensaje de confirmación (opcional)
      console.log("Sesión cerrada correctamente");

      // Redirigir a la página de login
      window.location.href = "../login/loginhtml.html";
    }, 800);
  }

  // Asignar el evento a los botones de logout
  if (logoutSidebarBtn) {
    logoutSidebarBtn.addEventListener("click", showLogoutConfirmation);
  }

  if (logoutNavBtn) {
    logoutNavBtn.addEventListener("click", showLogoutConfirmation);
  }

  // Eventos para los botones del modal
  if (logoutCancelBtn) {
    logoutCancelBtn.addEventListener("click", function () {
      // Efecto de click
      this.classList.add("button-pressed");
      setTimeout(() => {
        closeLogoutModal();
      }, 200);
    });
  }

  if (logoutConfirmBtn) {
    logoutConfirmBtn.addEventListener("click", handleLogout);
  }

  // Cerrar modal al hacer clic fuera del contenido
  logoutModal.addEventListener("click", function (e) {
    if (e.target === this) {
      closeLogoutModal();
    }
  });

  // Cerrar modal con la tecla ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && logoutModal.classList.contains("show")) {
      closeLogoutModal();
    }
  });
});

//SCRIPT PARA MOSTRAR UNA TARJETA DE BIENVENIDA AL USUARIO

document.addEventListener("DOMContentLoaded", function () {
  // Mostrar el div flotante de bienvenida
  const welcomeCard = document.getElementById("welcome-floating-card");
  const closeWelcomeBtn = document.getElementById("close-welcome-card");
  const welcomeUsername = document.getElementById("welcome-username");
  const cardHeader = document.getElementById("welcome-card-header");

  // Obtener información del usuario
  const usuarioActualJSON = localStorage.getItem("usuarioActual");

  if (welcomeCard && usuarioActualJSON) {
    try {
      const usuarioActual = JSON.parse(usuarioActualJSON);

      // Actualizar el nombre de usuario
      if (welcomeUsername) {
        welcomeUsername.textContent = usuarioActual.nombreUsuario || "Usuario";
      }

      // Mostrar el div flotante con una pequeña demora
      setTimeout(() => {
        welcomeCard.classList.add("visible");
      }, 1000);

      // Ocultar el div al hacer clic en el botón de cerrar
      if (closeWelcomeBtn) {
        closeWelcomeBtn.addEventListener("click", function () {
          welcomeCard.classList.remove("visible");

          // Eliminar el div después de la animación
          setTimeout(() => {
            welcomeCard.style.display = "none";
          }, 500);
        });
      }

      // Hacer el div arrastrable
      makeElementDraggable(welcomeCard, cardHeader);
    } catch (e) {
      console.error("Error al mostrar la tarjeta de bienvenida:", e);
    }
  }

  // Función para hacer un elemento arrastrable
  function makeElementDraggable(element, handle) {
    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;

    if (handle) {
      // Si se proporciona un elemento de "handle", el arrastre comenzará en ese elemento
      handle.onmousedown = dragMouseDown;
    } else {
      // De lo contrario, el arrastre puede comenzar en cualquier parte del elemento
      element.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // Obtener la posición inicial del cursor
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // Llamar a la función cada vez que el cursor se mueva
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // Calcular la nueva posición
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // Establecer la nueva posición del elemento
      element.style.top = element.offsetTop - pos2 + "px";
      element.style.left = element.offsetLeft - pos1 + "px";
      element.style.right = "auto";
      element.style.bottom = "auto";
    }

    function closeDragElement() {
      // Detener el movimiento cuando se suelte el botón del mouse
      document.onmouseup = null;
      document.onmousemove = null;

      // Guardar la posición en localStorage
      const position = {
        top: element.style.top,
        left: element.style.left,
      };
      localStorage.setItem("welcomeCardPosition", JSON.stringify(position));
    }

    // Restaurar la posición guardada, si existe
    const savedPosition = localStorage.getItem("welcomeCardPosition");
    if (savedPosition) {
      try {
        const position = JSON.parse(savedPosition);
        element.style.top = position.top;
        element.style.left = position.left;
        element.style.right = "auto";
        element.style.bottom = "auto";
      } catch (e) {
        console.error("Error al restaurar la posición guardada:", e);
      }
    }
  }
});
