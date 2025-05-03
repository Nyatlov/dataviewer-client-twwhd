document.addEventListener("DOMContentLoaded", () => {
  // ================================
  // Tab switch logic
  // ================================
  function switchTab(tab) {
    document.getElementById("tab-viewer").classList.remove("active");
    document.getElementById("tab-map").classList.remove("active");
    document.getElementById("btn-viewer").classList.remove("active");
    document.getElementById("btn-map").classList.remove("active");

    document.getElementById("tab-" + tab).classList.add("active");
    document.getElementById("btn-" + tab).classList.add("active");

    if (tab === "map" && lastPosition) {
      updateMapCursor(lastPosition.x, lastPosition.y);
    }
  }
  window.switchTab = switchTab;

  // ================================
  // Buttons
  // ================================
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

  // ================================
  // Stick drawing
  // ================================
  function updateStick(canvasId, x, y) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const center = canvas.width / 2;
    const radius = 48;
    const drawX = center + x * radius;
    const drawY = center + y * radius;

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

  // ================================
  // Input update logic
  // ================================
  let lastPosition = null;

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
      if (btn?.pressed) {
        el.classList.add("pressed");
      } else {
        el.classList.remove("pressed");
      }
    });

    if ("speed" in data) {
      document.getElementById("speed").textContent = data.speed.toFixed(2);
    }

    if ("position" in data) {
      const { x, y, z } = data.position;
      document.getElementById("pos-x").textContent = `x=${x.toFixed(2)}`;
      document.getElementById("pos-y").textContent = `y=${y.toFixed(2)}`;
      document.getElementById("pos-z").textContent = `z=${z.toFixed(2)}`;
      lastPosition = { x, y };
    
      if (mapLoaded) {
        updateMapCursor(x, y);
      }
    }
    

    if ("facing" in data) {
      document.getElementById("facing").textContent = data.facing;
    }
  };

  // ================================
  // World Map setup
  // ================================
  const canvas = document.getElementById("mapCanvas");
  const ctx = canvas?.getContext("2d");
  const mapImg = new Image();
  mapImg.src = "Worldmap.png"; // place the image in the same folder as index.html
  let mapLoaded = false;

  const worldMinX = -350000, worldMaxX = 350000;
  const worldMinY = -350000, worldMaxY = 350000;

  const mapWidth = canvas.width;
  const mapHeight = canvas.height;

  mapImg.onload = () => {
    mapLoaded = true;
    if (lastPosition) {
      updateMapCursor(lastPosition.x, lastPosition.y);
    }
  };

  function worldToMap(x, y) {
    const normX = (x - worldMinX) / (worldMaxX - worldMinX);
    const normY = (y - worldMinY) / (worldMaxY - worldMinY);
    const mapX = normX * mapWidth;
    const mapY = normY * mapHeight;  
    return { mapX, mapY };
  }

  window.updateMapCursor = function (x, y) {
    if (!mapLoaded || !ctx) return;
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
    const delta = Math.sign(e.deltaY);
    mapZoom -= delta * 0.1;
    mapZoom = Math.max(0.5, Math.min(2, mapZoom)); // clamp between 0.5x and 2x
    document.getElementById("mapWrapper").style.transform = `scale(${mapZoom})`;
  });
  
});
