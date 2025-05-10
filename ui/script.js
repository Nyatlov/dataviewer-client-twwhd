document.addEventListener("DOMContentLoaded", () => {
  function switchTab(tab) {
    ["viewer", "map"].forEach(t => {
      document.getElementById("tab-" + t).classList.remove("active");
      document.getElementById("btn-" + t).classList.remove("active");
    });

    document.getElementById("tab-" + tab).classList.add("active");
    document.getElementById("btn-" + tab).classList.add("active");

    if (tab === "map" && lastPosition) updateMapCursor(lastPosition.x, lastPosition.y);
  }
  window.switchTab = switchTab;

  const buttonNames = [
    "a", "b", "x", "y", "l3", "r3", "l", "r",
    "zl", "zr", "+", "-", "d-left", "d-up", "d-right", "d-down"
  ];

  const buttonsContainer = document.getElementById("buttons");
  const buttonElements = {};
  buttonNames.forEach(name => {
    const div = document.createElement("div");
    div.className = "button";
    div.id = `btn-${name}`;
    div.textContent = name.toUpperCase();
    buttonsContainer.appendChild(div);
    buttonElements[name] = div;
  });

  function updateStick(canvasId, x, y) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    const center = canvas.width / 2;
    const radius = 48;
    const drawX = center + x * radius;
    const drawY = center + y * radius;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#444";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.lineTo(drawX, drawY);
    ctx.strokeStyle = "#00aaff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(drawX, drawY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = "blue";
    ctx.fill();
  }

  const bMashTimestamps = [];
  let prevBPressed = false;

  setInterval(() => {
    const now = Date.now();
    while (bMashTimestamps.length > 0 && now - bMashTimestamps[0] > 1000) {
      bMashTimestamps.shift();
    }
    document.getElementById("mash-b").textContent = `${bMashTimestamps.length} / sec`;
  }, 100);

  window.onInputData = function (data) {
    const [lx, ly, rx, ry] = data.axes;

    document.getElementById("lx").textContent = `LX: ${Math.round((lx + 1) * 127.5)}`;
    document.getElementById("ly").textContent = `LY: ${Math.round((-ly + 1) * 127.5)}`;
    document.getElementById("rx").textContent = `RX: ${Math.round((rx + 1) * 127.5)}`;
    document.getElementById("ry").textContent = `RY: ${Math.round((-ry + 1) * 127.5)}`;

    updateStick("stickL", lx, ly);
    updateStick("stickR", rx, ry);

    data.buttons.forEach((btn, i) => {
      const name = buttonNames[i];
      const el = buttonElements[name];
      if (!el) return;
      el.classList.toggle("pressed", btn?.pressed);

      if (name === "b") {
        if (btn?.pressed && !prevBPressed) {
          bMashTimestamps.push(Date.now());
        }
        prevBPressed = btn?.pressed;
      }
    });

    if ("speed" in data) document.getElementById("speed").textContent = data.speed.toFixed(2);

    if ("position" in data) {
      const { x, y, z } = data.position;
      document.getElementById("pos-x").textContent = `x=${x.toFixed(2)}`;
      document.getElementById("pos-y").textContent = `y=${y.toFixed(2)}`;
      document.getElementById("pos-z").textContent = `z=${z.toFixed(2)}`;
      lastPosition = { x, y };
      if (mapLoaded) updateMapCursor(x, y);
    }

    if ("facing" in data) {
      document.getElementById("facing").textContent = data.facing;
    }
    
    if ("stage" in data) {
    document.getElementById("stage").textContent = data.stage;
    lastStage = data.stage;
    }
    if ("spawn" in data) document.getElementById("spawn").textContent = data.spawn;
    if ("room" in data) document.getElementById("room").textContent = data.room;
    if ("layer" in data) document.getElementById("layer").textContent = data.layer;

  };

  const canvas = document.getElementById("mapCanvas");
  const ctx = canvas?.getContext("2d");
  const mapImg = new Image();
  mapImg.src = "Worldmap.png";
  let mapLoaded = false;
  let lastStage = "";
  const worldMinX = -350000, worldMaxX = 350000;
  const worldMinY = -350000, worldMaxY = 350000;

  const mapWidth = canvas.width;
  const mapHeight = canvas.height;

  mapImg.onload = () => {
    mapLoaded = true;
    if (lastPosition) updateMapCursor(lastPosition.x, lastPosition.y);
  };

  function worldToMap(x, y) {
    const normX = (x - worldMinX) / (worldMaxX - worldMinX);
    const normY = (y - worldMinY) / (worldMaxY - worldMinY);
    return {
      mapX: normX * mapWidth,
      mapY: normY * mapHeight,
    };
  }

window.updateMapCursor = function (x, y) {
  if (!mapLoaded || !ctx) return;

  const msg = document.getElementById("mapMessage");

  if (!lastStage.toLowerCase().includes("sea")) {
    ctx.clearRect(0, 0, mapWidth, mapHeight);
    ctx.drawImage(mapImg, 0, 0, mapWidth, mapHeight);
    msg.textContent = "You are not in the sea.";
    return;
  }

  msg.textContent = "";
  ctx.clearRect(0, 0, mapWidth, mapHeight);
  ctx.drawImage(mapImg, 0, 0, mapWidth, mapHeight);
  const { mapX, mapY } = worldToMap(x, y);
  ctx.beginPath();
  ctx.arc(mapX, mapY, 5, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();
};


  let mapZoom = 1;
  document.getElementById("mapWrapper").addEventListener("wheel", (e) => {
    e.preventDefault();
    mapZoom = Math.max(0.5, Math.min(2, mapZoom - Math.sign(e.deltaY) * 0.1));
    document.getElementById("mapWrapper").style.transform = `scale(${mapZoom})`;
  });
});
