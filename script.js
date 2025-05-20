const premios = [
  "Tarjeta Amazon $100",
  "Audífonos Bluetooth",
  "Botella térmica",
  "Power Bank",
  "Camiseta",
  "Mochila",
  "Gorra",
  "Llavero exclusivo",
  "Gracias por participar"
];

const colores = [
  "#e74c3c", "#f39c12", "#2ecc71", "#9b59b6", "#3498db",
  "#1abc9c", "#e67e22", "#fd79a8", "#95a5a6"
];

const canvas = document.getElementById("ruleta");
const ctx = canvas.getContext("2d");
const btnGirar = document.getElementById("girar");
const resultado = document.getElementById("resultado");

const slices = premios.length;
const anglePerSlice = 2 * Math.PI / slices;
let angle = 0;
let spinning = false;

function drawWheel() {
  for (let i = 0; i < slices; i++) {
    const start = i * anglePerSlice;
    const end = start + anglePerSlice;

    ctx.beginPath();
    ctx.fillStyle = colores[i % colores.length];
    ctx.moveTo(250, 250);
    ctx.arc(250, 250, 250, start, end);
    ctx.fill();

    ctx.save();
    ctx.translate(250, 250);
    ctx.rotate(start + anglePerSlice / 2);
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.textAlign = "right";
    ctx.fillText(premios[i], 230, 10);
    ctx.restore();
  }

  // círculo central
  ctx.beginPath();
  ctx.arc(250, 250, 40, 0, 2 * Math.PI);
  ctx.fillStyle = "#fff";
  ctx.fill();

  // triángulo indicador
  ctx.beginPath();
  ctx.moveTo(250, 0);
  ctx.lineTo(240, 20);
  ctx.lineTo(260, 20);
  ctx.fillStyle = "#fff";
  ctx.fill();
}

function elegirPremio(finalAngle) {
  const index = Math.floor(slices - (finalAngle % (2 * Math.PI)) / anglePerSlice) % slices;
  return premios[index];
}

async function verificarToken(token) {
  const response = await fetch(`https://script.google.com/macros/s/AKfycbydXzCGQ5snd1iU3gAMVdesxDyAPfYSogF9vYfsBWK2mTv52NcHcuBN0ZCQwz3_2jQz/exec`);
  const data = await response.json();
  return data.usado;
}

async function registrarPremio(token, premio) {
  await fetch(`https://script.google.com/macros/s/AKfycbydXzCGQ5snd1iU3gAMVdesxDyAPfYSogF9vYfsBWK2mTv52NcHcuBN0ZCQwz3_2jQz/exec?token=${token}`);
}

btnGirar.addEventListener("click", async () => {
  if (spinning) return;

  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");

  const yaUsado = await verificarToken(token);
  if (yaUsado) {
    alert("Este token ya fue usado.");
    return;
  }

  spinning = true;
  let velocidad = Math.random() * 0.2 + 0.3;
  let tiempo = 0;
  const duracion = 5;

  const intervalo = setInterval(() => {
    ctx.clearRect(0, 0, 500, 500);
    ctx.save();
    ctx.translate(250, 250);
    ctx.rotate(angle);
    ctx.translate(-250, -250);
    drawWheel();
    ctx.restore();

    angle += velocidad;
    tiempo += 0.1;
    velocidad *= 0.98;

    if (tiempo >= duracion) {
      clearInterval(intervalo);
      const premio = elegirPremio(angle);
      resultado.innerHTML = `
        🎉 ¡Muchas felicidades! Has ganado:<br><strong>${premio}</strong><br>
        ¡Gracias por participar en nuestra Security Ruleta!<br><br>
        <a href="https://www.securityeasymexico.com" target="_blank">Ir al sitio</a>
      `;
      registrarPremio(token, premio);
      spinning = false;
    }
  }, 50);
});

drawWheel();
