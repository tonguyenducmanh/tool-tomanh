chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setIcon({
    path: {
      16: "icons/disabled/icon16.png",
      48: "icons/disabled/icon48.png",
      128: "icons/disabled/icon128.png",
    },
  });
});
class AnimatedBackground {
  constructor() {
    this.canvas = document.getElementById("bgCanvas");
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.waves = [];
    this.mouse = { x: 150, y: 200 };
    this.width = 300;
    this.height = 400;

    this.init();
  }

  init() {
    this.createParticles();
    this.createWaves();

    this.canvas.addEventListener("mousemove", (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    this.animate();
  }

  createParticles() {
    const particleCount = 30;
    this.particles = [];

    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 2.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.5 ? "#42b883" : "#4fc08d",
      });
    }
  }

  createWaves() {
    this.waves = [];
    for (let i = 0; i < 3; i++) {
      this.waves.push({
        amplitude: 20 + i * 10,
        frequency: 0.012 + i * 0.006,
        phase: (i * Math.PI) / 3,
        speed: 0.015 + i * 0.008,
        opacity: 0.1 - i * 0.025,
      });
    }
  }

  drawParticles() {
    this.particles.forEach((particle) => {
      particle.x += particle.speedX;
      particle.y += particle.speedY;

      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 70) {
        const force = (70 - distance) / 70;
        particle.x -= dx * force * 0.015;
        particle.y -= dy * force * 0.015;
      }

      if (particle.x < 0) particle.x = this.width;
      if (particle.x > this.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.height;
      if (particle.y > this.height) particle.y = 0;

      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle =
        particle.color +
        Math.floor(particle.opacity * 255)
          .toString(16)
          .padStart(2, "0");
      this.ctx.fill();

      this.particles.forEach((otherParticle) => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 80) {
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(otherParticle.x, otherParticle.y);
          const opacity = ((80 - distance) / 80) * 0.15;
          this.ctx.strokeStyle =
            "#42b883" +
            Math.floor(opacity * 255)
              .toString(16)
              .padStart(2, "0");
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      });
    });
  }

  drawWaves() {
    const time = Date.now() * 0.001;

    this.waves.forEach((wave) => {
      this.ctx.beginPath();

      for (let x = 0; x <= this.width; x += 5) {
        const y =
          this.height / 2 +
          Math.sin(x * wave.frequency + time * wave.speed + wave.phase) *
            wave.amplitude;

        if (x === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }

      this.ctx.strokeStyle =
        "#42b883" +
        Math.floor(wave.opacity * 255)
          .toString(16)
          .padStart(2, "0");
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    });
  }

  drawGeometry() {
    const time = Date.now() * 0.001;

    for (let i = 0; i < 5; i++) {
      const x = (Math.sin(time * 0.3 + i) * 0.35 + 0.5) * this.width;
      const y = (Math.cos(time * 0.2 + i * 0.8) * 0.25 + 0.35) * this.height;
      const size = 12 + Math.sin(time + i) * 4;
      const opacity = 0.1 + Math.sin(time * 2 + i) * 0.04;

      this.ctx.save();
      this.ctx.translate(x, y);
      this.ctx.rotate(time * 0.5 + i);

      this.ctx.beginPath();
      for (let j = 0; j < 6; j++) {
        const angle = (j * Math.PI * 2) / 6;
        const px = Math.cos(angle) * size;
        const py = Math.sin(angle) * size;
        if (j === 0) {
          this.ctx.moveTo(px, py);
        } else {
          this.ctx.lineTo(px, py);
        }
      }
      this.ctx.closePath();

      this.ctx.strokeStyle =
        "#42b883" +
        Math.floor(opacity * 255)
          .toString(16)
          .padStart(2, "0");
      this.ctx.lineWidth = 1.5;
      this.ctx.stroke();

      this.ctx.restore();
    }

    for (let i = 0; i < 3; i++) {
      const orbX = (Math.sin(time * 0.4 + i * 2.1) * 0.35 + 0.5) * this.width;
      const orbY = (Math.cos(time * 0.35 + i * 1.7) * 0.3 + 0.45) * this.height;
      const orbSize = 30 + Math.sin(time * 2.5 + i) * 12;

      const orbGradient = this.ctx.createRadialGradient(
        orbX,
        orbY,
        0,
        orbX,
        orbY,
        orbSize
      );
      orbGradient.addColorStop(0, "rgba(66, 184, 131, 0.15)");
      orbGradient.addColorStop(0.5, "rgba(79, 192, 141, 0.08)");
      orbGradient.addColorStop(1, "rgba(66, 184, 131, 0)");

      this.ctx.beginPath();
      this.ctx.arc(orbX, orbY, orbSize, 0, Math.PI * 2);
      this.ctx.fillStyle = orbGradient;
      this.ctx.fill();
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.drawWaves();
    this.drawGeometry();
    this.drawParticles();

    requestAnimationFrame(() => this.animate());
  }
}

new AnimatedBackground();

async function getCurrentDomain() {
  const [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });

  if (!tab?.url) return null;
  return new URL(tab.url).hostname;
}

(async function initEnableToggle() {
  const checkbox = document.getElementById("enableSite");
  if (!checkbox) return;

  const domain = await getCurrentDomain();
  if (!domain) {
    checkbox.disabled = true;
    return;
  }

  const { enabledSites = [] } = await chrome.storage.local.get("enabledSites");

  checkbox.checked = enabledSites.includes(domain);

  checkbox.addEventListener("change", async () => {
    let sites = enabledSites.slice();

    if (checkbox.checked) {
      if (!sites.includes(domain)) sites.push(domain);
    } else {
      sites = sites.filter((d) => d !== domain);
    }

    await chrome.storage.local.set({ enabledSites: sites });

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (tab?.id && tab?.url) {
      chrome.runtime.sendMessage({
        action: "updateIcon",
        tabId: tab.id,
        url: tab.url,
      });
    }
  });
})();
