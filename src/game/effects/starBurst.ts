type StarParticle = {
  element: HTMLSpanElement;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  mass: number;
  rotation: number;
  spin: number;
  bornAt: number;
  ttl: number;
};

const GRAVITY = 1450;
const WALL_BOUNCE = 0.76;
const PARTICLE_BOUNCE = 0.72;
const MAX_DT = 0.033;

export function createChestStarBurst(chestImg: HTMLImageElement): () => void {
  const starLayer = document.createElement('div');
  starLayer.id = 'star-layer';
  document.body.appendChild(starLayer);

  const stars: StarParticle[] = [];

  let animationFrameId: number | null = null;
  let previousFrameTime = 0;

  function syncStarVisuals(now: number): void {
    const viewportHeight = window.innerHeight;

    for (let index = stars.length - 1; index >= 0; index -= 1) {
      const star = stars[index];
      const age = now - star.bornAt;
      const fadeProgress = Math.min(age / star.ttl, 1);

      if (age >= star.ttl || star.y - star.radius > viewportHeight) {
        star.element.remove();
        stars.splice(index, 1);
        continue;
      }

      star.element.style.opacity = String(1 - fadeProgress * 0.9);
      star.element.style.transform = `translate3d(${star.x - star.radius}px, ${star.y - star.radius}px, 0) rotate(${star.rotation}deg)`;
    }
  }

  function resolveWallCollisions(star: StarParticle, width: number): void {
    if (star.x - star.radius < 0) {
      star.x = star.radius;
      star.vx = Math.abs(star.vx) * WALL_BOUNCE;
    }

    if (star.x + star.radius > width) {
      star.x = width - star.radius;
      star.vx = -Math.abs(star.vx) * WALL_BOUNCE;
    }

    if (star.y - star.radius < 0) {
      star.y = star.radius;
      star.vy = Math.abs(star.vy) * WALL_BOUNCE;
    }
  }

  function resolveParticleCollisions(): void {
    for (let i = 0; i < stars.length; i += 1) {
      for (let j = i + 1; j < stars.length; j += 1) {
        const a = stars[i];
        const b = stars[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const distance = Math.hypot(dx, dy);
        const minDistance = a.radius + b.radius;

        if (distance === 0 || distance >= minDistance) {
          continue;
        }

        const nx = dx / distance;
        const ny = dy / distance;
        const overlap = minDistance - distance;

        a.x -= nx * overlap * 0.5;
        a.y -= ny * overlap * 0.5;
        b.x += nx * overlap * 0.5;
        b.y += ny * overlap * 0.5;

        const relativeVelocity = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
        if (relativeVelocity > 0) {
          continue;
        }

        const impulse = (-(1 + PARTICLE_BOUNCE) * relativeVelocity) / (1 / a.mass + 1 / b.mass);
        a.vx -= (impulse * nx) / a.mass;
        a.vy -= (impulse * ny) / a.mass;
        b.vx += (impulse * nx) / b.mass;
        b.vy += (impulse * ny) / b.mass;
      }
    }
  }

  function stepStarPhysics(deltaTime: number): void {
    const width = window.innerWidth;

    for (const star of stars) {
      star.vy += GRAVITY * deltaTime;
      star.x += star.vx * deltaTime;
      star.y += star.vy * deltaTime;
      star.rotation += star.spin * deltaTime;
      resolveWallCollisions(star, width);
    }

    resolveParticleCollisions();
  }

  function animateStars(timestamp: number): void {
    if (previousFrameTime === 0) {
      previousFrameTime = timestamp;
    }

    const deltaTime = Math.min((timestamp - previousFrameTime) / 1000, MAX_DT);
    previousFrameTime = timestamp;

    stepStarPhysics(deltaTime);
    syncStarVisuals(performance.now());

    if (stars.length === 0) {
      animationFrameId = null;
      previousFrameTime = 0;
      return;
    }

    animationFrameId = requestAnimationFrame(animateStars);
  }

  function ensureStarAnimationLoop(): void {
    if (animationFrameId !== null) {
      return;
    }

    animationFrameId = requestAnimationFrame(animateStars);
  }

  function emitStarsFromChest(count: number): void {
    const chestRect = chestImg.getBoundingClientRect();
    const centerX = chestRect.left + chestRect.width / 2;
    const centerY = chestRect.top + chestRect.height / 2;
    const now = performance.now();
    const starEmoji = ['⭐', '🌟', '✨'];

    for (let index = 0; index < count; index += 1) {
      const element = document.createElement('span');
      const symbol = starEmoji[Math.floor(Math.random() * starEmoji.length)];
      const radius = 10 + Math.random() * 8;
      const launchAngle = -Math.PI / 2 + (Math.random() - 0.5) * 1.5;
      const launchSpeed = 360 + Math.random() * 420;

      element.className = 'star-particle';
      element.textContent = symbol;
      element.style.fontSize = `${16 + Math.random() * 16}px`;
      starLayer.appendChild(element);

      stars.push({
        element,
        x: centerX + (Math.random() - 0.5) * 18,
        y: centerY + (Math.random() - 0.5) * 10,
        vx: Math.cos(launchAngle) * launchSpeed,
        vy: Math.sin(launchAngle) * launchSpeed,
        radius,
        mass: radius * 0.18,
        rotation: Math.random() * 360,
        spin: (Math.random() - 0.5) * 420,
        bornAt: now,
        ttl: 4600 + Math.random() * 2200,
      });
    }

    ensureStarAnimationLoop();
  }

  return function triggerChestStarBurst(): void {
    emitStarsFromChest(36);
    window.setTimeout(() => emitStarsFromChest(24), 120);
    window.setTimeout(() => emitStarsFromChest(18), 260);
  };
}
