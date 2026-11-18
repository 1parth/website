const experienceItems = document.querySelectorAll(".experience-item");

experienceItems.forEach((item) => {
    item.addEventListener("mousemove", (event) => {
        const rect = item.getBoundingClientRect();

        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const xPercent = mouseX / rect.width - 0.5;
        const yPercent = mouseY / rect.height - 0.5;

        const maximumTilt = 1;

        const rotateY = xPercent * maximumTilt * 2;
        const rotateX = -yPercent * maximumTilt * 2;

        item.style.transform = `
            perspective(800px)
            rotateX(${rotateX}deg)
            rotateY(${rotateY}deg)
            scale(1.02)
        `;
    });

    item.addEventListener("mouseleave", () => {
        item.style.transform =
            "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
    });
});

(function () {
    const hero = document.getElementById("hero-banner");
    const canvas = document.getElementById("starfield");
    if (!hero || !canvas) return;

    const ctx = canvas.getContext("2d");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w, h, dpr;
    let stars = [];
    let shooters = [];
    let targetX = 0, targetY = 0, mouseX = 0, mouseY = 0;
    let nextShooter = 2000;

    function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = hero.clientWidth;
        h = hero.clientHeight;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const count = Math.floor((w * h) / 4500);
        stars = Array.from({ length: count }, function () {
            const depth = Math.random(); // 0 = far, 1 = near
            return {
                x: Math.random() * w,
                y: Math.random() * h,
                r: 0.3 + depth * 1.3,
                depth: depth,
                speed: 0.02 + depth * 0.08,
                phase: Math.random() * Math.PI * 2,
                twinkle: 0.5 + Math.random() * 1.5
            };
        });

        if (reduceMotion) draw(0);
    }

    function spawnShooter() {
        shooters.push({
            x: Math.random() * w * 0.8 + w * 0.2,
            y: Math.random() * h * 0.4,
            vx: -(6 + Math.random() * 4),
            vy: 2.5 + Math.random() * 2,
            life: 1
        });
    }

    function draw(t) {
        ctx.clearRect(0, 0, w, h);

        // ease the parallax toward the mouse position
        mouseX += (targetX - mouseX) * 0.05;
        mouseY += (targetY - mouseY) * 0.05;

        for (const s of stars) {
            if (!reduceMotion) {
                s.x -= s.speed;
                if (s.x < -2) s.x = w + 2;
            }
            const px = s.x + mouseX * s.depth * 24;
            const py = s.y + mouseY * s.depth * 24;
            const alpha = reduceMotion
                ? 0.8
                : 0.3 + 0.7 * Math.abs(Math.sin(t * 0.001 * s.twinkle + s.phase));

            ctx.beginPath();
            ctx.arc(px, py, s.r, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(220, 230, 255, " + alpha + ")";
            ctx.fill();
        }

        for (let i = shooters.length - 1; i >= 0; i--) {
            const m = shooters[i];
            m.x += m.vx;
            m.y += m.vy;
            m.life -= 0.012;
            if (m.life <= 0) { shooters.splice(i, 1); continue; }

            const tailX = m.x - m.vx * 8;
            const tailY = m.y - m.vy * 8;
            const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
            grad.addColorStop(0, "rgba(255, 255, 255, 0)");
            grad.addColorStop(1, "rgba(255, 255, 255, " + m.life + ")");
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(tailX, tailY);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
        }

        if (!reduceMotion && t > nextShooter) {
            spawnShooter();
            nextShooter = t + 4000 + Math.random() * 5000;
        }
    }

    function loop(t) {
        draw(t);
        requestAnimationFrame(loop);
    }

    hero.addEventListener("mousemove", function (e) {
        const rect = hero.getBoundingClientRect();
        targetX = (e.clientX - rect.left) / rect.width - 0.5;
        targetY = (e.clientY - rect.top) / rect.height - 0.5;
    });

    window.addEventListener("resize", resize);
    resize();
    if (!reduceMotion) requestAnimationFrame(loop);
})();

