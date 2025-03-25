// Modificación en loginindex.js
document.addEventListener("DOMContentLoaded", function () {
  // NO modifico la lógica de toggle de contraseña - solo uso la ya existente

  // Base de datos de usuarios (para demostración)
  // En una aplicación real, esto estaría en el servidor
  const usuariosValidos = [
    {
      usuario: "admin",
      contraseña: "1",
      rol: "admin",
      redireccion: "../usermain/clientsindex.html", // Cambiado a clientsindex.html
      tieneAccesoClientes: true,
    },
    {
      usuario: "1",
      contraseña: "1",
      rol: "1",
      redireccion: "../usermain/clientsindex.html", // Cambiado a clientsindex.html
      tieneAccesoClientes: true,
    },
    {
      usuario: "test",
      contraseña: "1",
      rol: "test",
      redireccion: "../usermain/clientsindex.html", // Cambiado a clientsindex.html
      tieneAccesoClientes: true,
    },
    {
      usuario: "JONAXXX",
      contraseña: "1",
      rol: "JONAXXX",
      redireccion: "../usermain/clientsindex.html", // Cambiado a clientsindex.html
      tieneAccesoClientes: true,
    },
    {
      usuario: "chipi",
      contraseña: "1",
      rol: "chipi",
      redireccion: "../usermain/clientsindex.html", // Cambiado a clientsindex.html
      tieneAccesoClientes: true,
    },
    // Puedes añadir más usuarios aquí siguiendo el mismo formato
  ];

  // Validación de formulario
  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Evitar el envío del formulario

      // Obtener valores de los campos
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value;

      // Botón de envío para mostrar animación
      const submitButton = document.querySelector(".submit-button");
      const originalButtonContent = submitButton.innerHTML;

      // Agregar clase de animación al botón y mostrar estado de carga
      submitButton.innerHTML = `
          <svg class="loading-spinner" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" stroke-dasharray="62.83" stroke-dashoffset="0" />
          </svg>
          <span>Verificando...</span>
        `;
      submitButton.disabled = true;

      // Simular tiempo de verificación
      setTimeout(function () {
        // Buscar si existe el usuario y la contraseña coincide
        const usuarioEncontrado = usuariosValidos.find(
          (user) => user.usuario === username && user.contraseña === password
        );

        if (usuarioEncontrado) {
          // Login exitoso
          submitButton.innerHTML = `
              <span>¡Bienvenido ${usuarioEncontrado.rol}!</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            `;

          // Almacenar información de sesión en localStorage con valores correctos
          localStorage.setItem(
            "usuarioActual",
            JSON.stringify({
              nombreUsuario: usuarioEncontrado.usuario,
              rol: usuarioEncontrado.rol,
              tieneAccesoClientes:
                usuarioEncontrado.tieneAccesoClientes === true,
              fechaLogin: new Date().toISOString(),
            })
          );

          console.log("Usuario autenticado:", {
            usuario: usuarioEncontrado.usuario,
            rol: usuarioEncontrado.rol,
            tieneAcceso: usuarioEncontrado.tieneAccesoClientes,
          });

          // Mostrar mensaje de éxito según el rol
          mostrarMensaje(`¡Bienvenido ${usuarioEncontrado.rol}!`, "success");

          // Redirigir después de un breve retraso a la página correspondiente
          setTimeout(function () {
            window.location.href = usuarioEncontrado.redireccion;
          }, 1500);
        } else {
          // Login fallido
          submitButton.innerHTML = originalButtonContent;
          submitButton.disabled = false;

          // Mostrar mensaje de error
          mostrarMensaje("Usuario o contraseña incorrectos", "error");

          // Agregar animación de vibración al formulario
          const loginFormElement = document.querySelector(".login-form");
          loginFormElement.classList.add("shake-error");
          setTimeout(() => {
            loginFormElement.classList.remove("shake-error");
          }, 500);
        }
      }, 1500);
    });
  }

  // Función para mostrar mensajes al usuario
  function mostrarMensaje(mensaje, tipo) {
    // Verificar si ya existe un mensaje y eliminarlo
    const mensajeExistente = document.querySelector(".mensaje-alerta");
    if (mensajeExistente) {
      mensajeExistente.remove();
    }

    // Crear elemento de mensaje
    const mensajeAlerta = document.createElement("div");
    mensajeAlerta.className = `mensaje-alerta mensaje-${tipo}`;
    mensajeAlerta.textContent = mensaje;

    // Añadir mensaje al body
    document.body.appendChild(mensajeAlerta);

    // Eliminar el mensaje después de unos segundos
    setTimeout(function () {
      mensajeAlerta.classList.add("mensaje-oculto");
      setTimeout(function () {
        mensajeAlerta.remove();
      }, 500);
    }, 3000);
  }
});
