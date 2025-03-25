/* filepath: /e:/proyectos_html/login_particulas/PANELSTREAMER-main/login/arañaScript.js */
// Inicialización del canvas para la araña
document.addEventListener("DOMContentLoaded", function () {
  console.log("Spider script initialized");

  const spiderCanvas = document.getElementById("spiderCanvas");
  if (!spiderCanvas) {
    console.error("Spider canvas not found!");
    return;
  }

  const ctx = spiderCanvas.getContext("2d");

  // Configurar el tamaño del canvas
  function setupCanvas() {
    spiderCanvas.width = window.innerWidth;
    spiderCanvas.height = window.innerHeight;
    console.log(
      "Canvas size set:",
      spiderCanvas.width,
      "x",
      spiderCanvas.height
    );
  }
  setupCanvas();

  // Variables principales
  let head = {
    x: Math.random() * spiderCanvas.width,
    y: Math.random() * spiderCanvas.height,
    radius: 5,
  };
  let legPoints = [];
  let realLegs = [];
  let numLegs = 6;
  let radius = 70;
  let moveThreshold = 130;
  let trails = []; // Almacena las huellas

  // Variables para movimiento autónomo
  let velocity = {
    x: 3 * (Math.random() > 0.5 ? 1 : -1),
    y: 2 * (Math.random() > 0.5 ? 1 : -1),
  };
  const minSpeed = 1; // Reducido de 2 a 1 para movimientos más suaves
  const maxSpeed = 4; // Reducido de 5 a 4 para evitar movimientos erráticos
  const changeDirectionChance = 0.002; // Reducido para menos cambios aleatorios

  // Cache para evitar cálculos repetidos
  let formRect = null;
  let lastFormCheck = 0;

  // Inicializar posiciones de las patas
  function initializeLegs() {
    legPoints = [];
    realLegs = [];
    for (let i = 0; i < numLegs; i++) {
      let angle = (Math.PI * 2 * i) / numLegs;
      legPoints.push({
        x: head.x + Math.cos(angle) * radius,
        y: head.y + Math.sin(angle) * radius,
        baseAngle: angle,
      });
      realLegs.push({
        x: head.x + Math.cos(angle) * radius,
        y: head.y + Math.sin(angle) * radius,
        baseAngle: angle,
      });
    }
  }
  initializeLegs();

  // Manejar cambio de tamaño del navegador
  window.addEventListener("resize", () => {
    setupCanvas();
    // Evitar que la araña quede fuera de los límites después de redimensionar
    head.x = Math.min(Math.max(head.x, 0), spiderCanvas.width);
    head.y = Math.min(Math.max(head.y, 0), spiderCanvas.height);
  });

  // Función para mover la araña de forma autónoma
  function moveAutonomously() {
    // Actualizar posición basada en velocidad
    head.x += velocity.x;
    head.y += velocity.y;

    // Comprobar rebote en los bordes (con corrección para evitar "pegarse" a los bordes)
    if (head.x > spiderCanvas.width - head.radius) {
      head.x = spiderCanvas.width - head.radius;
      velocity.x = -Math.abs(velocity.x); // Asegurar dirección hacia la izquierda
      velocity.y += (Math.random() - 0.5) * 1; // Menor variación
    } else if (head.x < head.radius) {
      head.x = head.radius;
      velocity.x = Math.abs(velocity.x); // Asegurar dirección hacia la derecha
      velocity.y += (Math.random() - 0.5) * 1;
    }

    if (head.y > spiderCanvas.height - head.radius) {
      head.y = spiderCanvas.height - head.radius;
      velocity.y = -Math.abs(velocity.y); // Asegurar dirección hacia arriba
      velocity.x += (Math.random() - 0.5) * 1;
    } else if (head.y < head.radius) {
      head.y = head.radius;
      velocity.y = Math.abs(velocity.y); // Asegurar dirección hacia abajo
      velocity.x += (Math.random() - 0.5) * 1;
    }

    // Suavizar la velocidad para evitar movimientos erráticos
    velocity.x = velocity.x * 0.98 + velocity.x * 0.02;
    velocity.y = velocity.y * 0.98 + velocity.y * 0.02;

    // Mantener la velocidad dentro de los límites
    velocity.x = Math.max(Math.min(velocity.x, maxSpeed), -maxSpeed);
    velocity.y = Math.max(Math.min(velocity.y, maxSpeed), -maxSpeed);

    // Cambio aleatorio de dirección ocasionalmente (menos frecuente)
    if (Math.random() < changeDirectionChance) {
      velocity.x += (Math.random() - 0.5) * 1; // Cambios más suaves
      velocity.y += (Math.random() - 0.5) * 1;
    }

    // Asegurar que no se quede demasiado lenta
    const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
    if (speed < minSpeed) {
      const factor = minSpeed / (speed || 0.001); // Evitar división por cero
      velocity.x *= factor;
      velocity.y *= factor;
    }
  }

  // Función mejorada para evitar el formulario de login
  function avoidLoginForm() {
    // Solo recalcular la posición del formulario cada 30 frames para mejorar rendimiento
    if (Date.now() - lastFormCheck > 500) {
      const loginForm = document.querySelector(".login-form-container");
      if (loginForm) {
        formRect = loginForm.getBoundingClientRect();
        lastFormCheck = Date.now();
      }
    }

    if (formRect) {
      // Usar un buffer más pequeño para ser menos sensible
      const buffer = 20;

      // Verificar si la araña está cerca del formulario
      if (
        head.x > formRect.left - buffer &&
        head.x < formRect.right + buffer &&
        head.y > formRect.top - buffer &&
        head.y < formRect.bottom + buffer
      ) {
        // Determinar la mejor dirección para alejarse
        let escapeX = 0;
        let escapeY = 0;

        // Calcular en qué lado del formulario está la araña
        if (head.x < formRect.left) escapeX = -1;
        else if (head.x > formRect.right) escapeX = 1;

        if (head.y < formRect.top) escapeY = -1;
        else if (head.y > formRect.bottom) escapeY = 1;

        // Si está dentro del formulario, calcular la ruta de escape más corta
        if (escapeX === 0 && escapeY === 0) {
          const distToLeft = head.x - formRect.left;
          const distToRight = formRect.right - head.x;
          const distToTop = head.y - formRect.top;
          const distToBottom = formRect.bottom - head.y;

          // Encontrar la distancia mínima
          const minDist = Math.min(
            distToLeft,
            distToRight,
            distToTop,
            distToBottom
          );

          if (minDist === distToLeft) escapeX = -1;
          else if (minDist === distToRight) escapeX = 1;
          else if (minDist === distToTop) escapeY = -1;
          else if (minDist === distToBottom) escapeY = 1;
        }

        // Aplicar impulso de escape gradual
        velocity.x += escapeX * 0.2;
        velocity.y += escapeY * 0.2;
      }
    }
  }

  // Actualizar posiciones de las patas
  function updateLegs() {
    realLegs.forEach((leg) => {
      let dx = leg.x - head.x;
      let dy = leg.y - head.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > moveThreshold) {
        // Agregar huella antes de actualizar
        trails.push({ x: leg.x, y: leg.y, alpha: 0.4 });
        leg.x = head.x + Math.cos(leg.baseAngle) * radius;
        leg.y = head.y + Math.sin(leg.baseAngle) * radius;
      } else if (dist < moveThreshold / 4) {
        trails.push({ x: leg.x, y: leg.y, alpha: 0.4 });
        leg.x = head.x + Math.cos(leg.baseAngle) * radius;
        leg.y = head.y + Math.sin(leg.baseAngle) * radius;
      }
    });

    legPoints.forEach((leg, index) => {
      const legSpeed = 0.6;
      let realx = realLegs[index].x;
      let realy = realLegs[index].y;
      leg.x += (realx - leg.x) * legSpeed;
      leg.y += (realy - leg.y) * legSpeed;
    });
  }

  // Función principal de dibujo
  function draw() {
    ctx.clearRect(0, 0, spiderCanvas.width, spiderCanvas.height);

    moveAutonomously();

    updateLegs();

    // Dibujar huellas
    trails.forEach((trail, index) => {
      ctx.fillStyle = `rgba(255, 0, 0, ${trail.alpha})`;
      ctx.beginPath();
      ctx.arc(trail.x, trail.y, 1, 0, Math.PI * 2);
      ctx.fill();
      trail.alpha -= 0.005;
      if (trail.alpha <= 0) trails.splice(index, 1);
    });

    // Dibujar cabeza
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(head.x, head.y, head.radius, 0, Math.PI * 2);
    ctx.fill();

    // Dibujar patas con efecto neón y curvas
    ctx.strokeStyle = "#f00";
    ctx.lineWidth = 2;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#f00";

    legPoints.forEach((leg) => {
      ctx.beginPath();
      ctx.moveTo(head.x, head.y);
      let midX = (head.x + leg.x) / 2 + (Math.random() - 0.5) * 15;
      let midY = (head.y + leg.y) / 2 + (Math.random() - 0.5) * 15;
      ctx.quadraticCurveTo(midX, midY, leg.x, leg.y);
      ctx.stroke();
    });

    // Resetear shadow para mejor rendimiento
    ctx.shadowBlur = 0;

    // Llamar a la próxima animación
    requestAnimationFrame(draw);
  }

  // Función para manejar clics y hacer que la araña huya
  document.addEventListener("click", function (event) {
    // Evitar procesar clics si la araña está oculta
    if (document.body.classList.contains("spider-hidden")) return;

    // Calcular distancia entre el clic y la araña
    const dx = event.clientX - head.x;
    const dy = event.clientY - head.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Si el clic está cerca de la araña (dentro de un radio de 150px)
    if (distance < 150) {
      // Calcular dirección opuesta al clic (huir)
      const angle = Math.atan2(dy, dx);
      velocity.x = -Math.cos(angle) * maxSpeed;
      velocity.y = -Math.sin(angle) * maxSpeed;

      // Añadir huellas cuando huye (efecto de pánico)
      for (let i = 0; i < 5; i++) {
        const randomAngle = Math.random() * Math.PI * 2;
        const randomDist = Math.random() * 20;
        trails.push({
          x: head.x + Math.cos(randomAngle) * randomDist,
          y: head.y + Math.sin(randomAngle) * randomDist,
          alpha: 0.6,
        });
      }
    }
  });

  // Iniciar la animación con un pequeño retraso
  setTimeout(() => {
    console.log("Starting spider animation");
    draw();
  }, 500);

  // Reposicionar la araña periódicamente (menos frecuentemente)
  setInterval(() => {
    // Solo reposicionar si está fuera de la vista durante mucho tiempo
    const isOffscreen =
      head.x < -100 ||
      head.x > spiderCanvas.width + 100 ||
      head.y < -100 ||
      head.y > spiderCanvas.height + 100;

    if (isOffscreen) {
      // Posición aleatoria en los bordes del canvas
      const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left

      switch (side) {
        case 0: // arriba
          head.x = Math.random() * spiderCanvas.width;
          head.y = 0;
          velocity.y = Math.abs(velocity.y) * 0.5; // Más lento inicialmente
          break;
        case 1: // derecha
          head.x = spiderCanvas.width;
          head.y = Math.random() * spiderCanvas.height;
          velocity.x = -Math.abs(velocity.x) * 0.5;
          break;
        case 2: // abajo
          head.x = Math.random() * spiderCanvas.width;
          head.y = spiderCanvas.height;
          velocity.y = -Math.abs(velocity.y) * 0.5;
          break;
        case 3: // izquierda
          head.x = 0;
          head.y = Math.random() * spiderCanvas.height;
          velocity.x = Math.abs(velocity.x) * 0.5;
          break;
      }

      // Reinicializar posiciones de las patas
      initializeLegs();

      // Limpiar todas las huellas anteriores
      trails = [];
    }
  }, 60000); // Reducido de 30s a 60s - sólo reposiciona si realmente es necesario

  // Botón para mostrar/ocultar araña
  const toggleSpiderBtn = document.getElementById("toggleSpider");
  if (toggleSpiderBtn) {
    toggleSpiderBtn.addEventListener("click", function () {
      document.body.classList.toggle("spider-hidden");
      console.log(
        "Spider toggled:",
        !document.body.classList.contains("spider-hidden")
      );
    });
  } else {
    console.warn("Toggle spider button not found");
  }
});
