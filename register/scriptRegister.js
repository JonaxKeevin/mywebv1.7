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
