document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('heroCanvas');
    const hero = document.querySelector('.hero-bg');
    if (!canvas || !hero) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const ACCENT = '26, 188, 156';
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let particles = [];
    let pings = [];
    let offsetX = 0;
    let offsetY = 0;
    let targetOffsetX = 0;
    let targetOffsetY = 0;
    let running = false;
    let rafId = null;
    let pingIntervalId = null;
    let heroVisible = true;

    function createParticles() {
        const area = width * height;
        const count = Math.min(70, Math.max(28, Math.round(area / 18000)));
        particles = new Array(count).fill(null).map(() => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.15,
            vy: (Math.random() - 0.5) * 0.15,
            r: Math.random() * 1.4 + 0.6,
            phase: Math.random() * Math.PI * 2,
        }));
    }

    function resize() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = hero.clientWidth;
        height = hero.clientHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        createParticles();
    }

    function spawnPing() {
        if (!particles.length) return;
        const p = particles[Math.floor(Math.random() * particles.length)];
        pings.push({ x: p.x, y: p.y, r: 0, alpha: 0.5 });
    }

    function drawConnections(time) {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i];
                const b = particles[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.strokeStyle = `rgba(${ACCENT}, ${(1 - dist / 120) * 0.15})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(a.x + offsetX, a.y + offsetY);
                    ctx.lineTo(b.x + offsetX, b.y + offsetY);
                    ctx.stroke();
                }
            }
        }
    }

    function drawParticles(time) {
        particles.forEach((p) => {
            const twinkle = time === null ? 0.7 : 0.5 + 0.5 * Math.sin(time / 1000 + p.phase);
            ctx.fillStyle = `rgba(${ACCENT}, ${0.3 + twinkle * 0.5})`;
            ctx.beginPath();
            ctx.arc(p.x + offsetX, p.y + offsetY, p.r, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    function drawPings() {
        pings.forEach((ping) => {
            ping.r += 0.6;
            ping.alpha -= 0.008;
        });
        pings = pings.filter((ping) => ping.alpha > 0);
        pings.forEach((ping) => {
            ctx.strokeStyle = `rgba(${ACCENT}, ${Math.max(ping.alpha, 0)})`;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(ping.x + offsetX, ping.y + offsetY, ping.r, 0, Math.PI * 2);
            ctx.stroke();
        });
    }

    function step(time) {
        ctx.clearRect(0, 0, width, height);
        offsetX += (targetOffsetX - offsetX) * 0.04;
        offsetY += (targetOffsetY - offsetY) * 0.04;

        particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;
        });

        drawConnections(time);
        drawParticles(time);
        drawPings();

        if (running) rafId = requestAnimationFrame(step);
    }

    function start() {
        if (running || reduceMotion) return;
        running = true;
        rafId = requestAnimationFrame(step);
        pingIntervalId = setInterval(spawnPing, 3500);
    }

    function stop() {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
        if (pingIntervalId) clearInterval(pingIntervalId);
        rafId = null;
        pingIntervalId = null;
    }

    function drawStaticFrame() {
        ctx.clearRect(0, 0, width, height);
        drawConnections(null);
        drawParticles(null);
    }

    resize();
    window.addEventListener('resize', resize);

    if (reduceMotion) {
        drawStaticFrame();
        return;
    }

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;
        targetOffsetX = relX * -14;
        targetOffsetY = relY * -14;
    });

    hero.addEventListener('mouseleave', () => {
        targetOffsetX = 0;
        targetOffsetY = 0;
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stop();
        } else if (heroVisible) {
            start();
        }
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                heroVisible = entry.isIntersecting;
                if (heroVisible && !document.hidden) {
                    start();
                } else {
                    stop();
                }
            });
        },
        { threshold: 0 }
    );
    observer.observe(hero);

    start();
});
