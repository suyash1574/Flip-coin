let segmentCount = 0;
let segments = [];
let angle = 0;
let spinning = false;
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");

function generateSegments() {
  const count = parseInt(document.getElementById("segmentCount").value);
  const container = document.getElementById("segmentInputs");
  container.innerHTML = "";
  segments = [];
  for (let i = 0; i < count; i++) {
    const input = document.createElement("input");
    input.placeholder = `Segment ${i + 1}`;
    input.id = `seg${i}`;
    container.appendChild(input);
  }
}

function drawWheel() {
  segmentCount = parseInt(document.getElementById("segmentCount").value);
  segments = [];
  for (let i = 0; i < segmentCount; i++) {
    const name = document.getElementById(`seg${i}`).value || `Segment ${i+1}`;
    segments.push(name);
  }
  const arcSize = (2 * Math.PI) / segmentCount;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < segmentCount; i++) {
    const angleStart = angle + i * arcSize;
    ctx.beginPath();
    ctx.fillStyle = `hsl(${i * 360 / segmentCount}, 80%, 60%)`;
    ctx.moveTo(200, 200);
    ctx.arc(200, 200, 200, angleStart, angleStart + arcSize);
    ctx.fill();
    ctx.save();
    ctx.translate(200, 200);
    ctx.rotate(angleStart + arcSize / 2);
    ctx.fillStyle = "#000";
    ctx.font = "16px sans-serif";
    ctx.fillText(segments[i], 120, 10);
    ctx.restore();
  }
}

function spinWheel() {
  if (spinning || segments.length === 0) return;
  spinning = true;
  let rotation = 0;
  const extra = Math.random() * 360;
  const total = 360 * 5 + extra;
  const duration = 4000;
  const start = performance.now();

  function animate(now) {
    const time = now - start;
    const progress = Math.min(time / duration, 1);
    const easeOut = 1 - Math.pow(1 - progress, 4);
    rotation = easeOut * total;
    angle = (rotation * Math.PI) / 180;
    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      const finalDeg = (360 - (rotation % 360)) % 360;
      const segmentAngle = 360 / segmentCount;
      const index = Math.floor(finalDeg / segmentAngle) % segmentCount;
      showResult(segments[index]);
      launchConfetti();
    }
  }

  requestAnimationFrame(animate);
}

function showResult(result) {
  document.getElementById("resultText").innerText = `🎯 ${result}`;
  document.getElementById("resultModal").style.display = "block";
}

function closeModal() {
  document.getElementById("resultModal").style.display = "none";
}

function launchConfetti() {
  const confetti = document.getElementById("confetti");
  const cctx = confetti.getContext("2d");
  confetti.width = window.innerWidth;
  confetti.height = window.innerHeight;
  const pieces = [];

  for (let i = 0; i < 100; i++) {
    pieces.push({
      x: Math.random() * confetti.width,
      y: Math.random() * confetti.height - confetti.height,
      size: Math.random() * 6 + 4,
      speed: Math.random() * 3 + 2,
      color: `hsl(${Math.random() * 360}, 80%, 60%)`,
      angle: Math.random() * Math.PI * 2
    });
  }

  function update() {
    cctx.clearRect(0, 0, confetti.width, confetti.height);
    for (let p of pieces) {
      p.y += p.speed;
      p.angle += 0.02;
      cctx.beginPath();
      cctx.fillStyle = p.color;
      cctx.arc(p.x + Math.sin(p.angle) * 10, p.y, p.size, 0, Math.PI * 2);
      cctx.fill();
    }
    requestAnimationFrame(update);
  }

  update();

  setTimeout(() => {
    cctx.clearRect(0, 0, confetti.width, confetti.height);
  }, 4000);
}

function generateSegments(defaultGames = []) {
    const container = document.getElementById("segmentInputs");
    container.innerHTML = "";
    segments = [];
  
    let count = parseInt(document.getElementById("segmentCount").value);
    if (!count || count <= 0) {
      defaultGames = defaultGames.length ? defaultGames : ["Call of Duty", "Clash Of Clans", "Valorant", "PUBG", "GTA 5"];
      count = defaultGames.length;
      document.getElementById("segmentCount").value = count;
    }
  
    for (let i = 0; i < count; i++) {
      const input = document.createElement("input");
      input.placeholder = `Segment ${i + 1}`;
      input.id = `seg${i}`;
      input.value = defaultGames[i] || `Segment ${i + 1}`;
      container.appendChild(input);
    }
  
    drawWheel();
  }

  // Auto-generate default 5 segments on load
window.onload = function () {
    generateSegments();
  };
  