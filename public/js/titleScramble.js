document.addEventListener('DOMContentLoaded', function () {
    const titles = document.querySelectorAll('[data-scramble]');
    if (!titles.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const chars = '!<>-_\\/[]{}=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    function scramble(el) {
        const target = el.textContent;
        const duration = 650;
        const start = performance.now();

        function frame(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const revealCount = Math.floor(progress * target.length);
            let output = '';
            for (let i = 0; i < target.length; i++) {
                if (target[i] === ' ') {
                    output += ' ';
                } else if (i < revealCount) {
                    output += target[i];
                } else {
                    output += chars[Math.floor(Math.random() * chars.length)];
                }
            }
            el.textContent = output;
            if (progress < 1) {
                requestAnimationFrame(frame);
            } else {
                el.textContent = target;
            }
        }
        requestAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    scramble(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.4 }
    );

    titles.forEach((el) => observer.observe(el));
});
