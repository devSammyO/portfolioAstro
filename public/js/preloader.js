document.addEventListener('DOMContentLoaded', function () {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const nameEl = document.getElementById('preloaderName');
    const fillEl = document.getElementById('preloaderFill');
    const statusEl = document.getElementById('preloaderStatus');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const totalDuration = reduceMotion ? 500 : 3000;

    function finish() {
        document.documentElement.classList.remove('is-loading');
        preloader.classList.add('preloader-hide');
        setTimeout(() => preloader.remove(), 550);
    }

    if (reduceMotion) {
        if (nameEl) nameEl.textContent = nameEl.dataset.text || '';
        if (fillEl) fillEl.style.width = '100%';
        if (statusEl) {
            const messages = JSON.parse(statusEl.dataset.messages || '[]');
            statusEl.textContent = messages[messages.length - 1] || '';
        }
        setTimeout(finish, totalDuration);
        return;
    }

    if (nameEl) {
        const target = nameEl.dataset.text || '';
        const chars = '!<>-_\\/[]{}=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const scrambleDuration = 1300;
        const start = performance.now();

        function frame(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / scrambleDuration, 1);
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
            nameEl.textContent = output;
            if (progress < 1) {
                requestAnimationFrame(frame);
            } else {
                nameEl.textContent = target;
            }
        }
        requestAnimationFrame(frame);
    }

    requestAnimationFrame(() => {
        if (fillEl) fillEl.style.width = '100%';
    });

    if (statusEl) {
        const messages = JSON.parse(statusEl.dataset.messages || '[]');
        if (messages.length) {
            let i = 0;
            statusEl.textContent = messages[0];
            const stepDuration = totalDuration / messages.length;
            const interval = setInterval(() => {
                i++;
                if (i >= messages.length) {
                    clearInterval(interval);
                    return;
                }
                statusEl.textContent = messages[i];
            }, stepDuration);
        }
    }

    setTimeout(finish, totalDuration);
});
