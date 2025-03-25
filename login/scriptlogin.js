// Funcionalidad para mostrar/ocultar contraseña
document.addEventListener("DOMContentLoaded", function () {
  const togglePasswordBtn = document.querySelector(".toggle-password");
  const passwordInput = document.getElementById("password");

  if (togglePasswordBtn && passwordInput) {
    togglePasswordBtn.addEventListener("click", function () {
      // Alternar el tipo de input entre 'password' y 'text'
      const type =
        passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);

      // Alternar la clase para cambiar los íconos
      this.classList.toggle("show-password");

      // Opcional: Efecto de pulsación para feedback visual
      this.classList.add("pulse-effect");
      setTimeout(() => {
        this.classList.remove("pulse-effect");
      }, 300);
    });
  }
});

/*SCRIPT QUE HACE APAREZER LA SECTION PARA CLIENTES*/
document.addEventListener("DOMContentLoaded", function () {
  console.log("Script de clientes cargado");

  // Verificar si hay un usuario en sesión
  const usuarioActualJSON = localStorage.getItem("usuarioActual");
  console.log("Datos en localStorage:", usuarioActualJSON);

  if (usuarioActualJSON) {
    const usuarioActual = JSON.parse(usuarioActualJSON);
    console.log("Usuario actual:", usuarioActual);

    // Sección de clientes
    const clientsSection = document.getElementById("sectionclients-content");

    if (clientsSection) {
      console.log("Sección de clientes encontrada");

      // Verificar si el usuario tiene acceso a la sección de clientes
      if (usuarioActual.tieneAccesoClientes === true) {
        console.log("Usuario tiene acceso - mostrando sección");
        // Revelar la sección si tiene acceso
        clientsSection.classList.remove("hidden-section");

        // Asegurarse de que la sección sea visible
        clientsSection.style.display = "block";
      } else {
        console.log("Usuario NO tiene acceso - la sección permanece oculta");
        // Mantener la sección oculta
        clientsSection.classList.add("hidden-section");
      }
    } else {
      console.error("No se encontró el elemento 'sectionclients-content'");
    }
  } else {
    console.log("No hay usuario en sesión");
  }
});
