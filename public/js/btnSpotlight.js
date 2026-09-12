document.addEventListener('DOMContentLoaded', function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.addEventListener(
        'pointermove',
        function (e) {
            const btn = e.target.closest('[data-spotlight]');
            if (!btn) return;
            const rect = btn.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            btn.style.setProperty('--x', x + '%');
            btn.style.setProperty('--y', y + '%');
        },
        { passive: true }
    );
});
