document.addEventListener('DOMContentLoaded', function () {
    const glow = document.getElementById('pageGlow');
    if (!glow) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(hover: none)').matches) return;

    document.addEventListener(
        'pointermove',
        function (e) {
            glow.style.setProperty('--mx', e.clientX + 'px');
            glow.style.setProperty('--my', e.clientY + 'px');
            glow.classList.add('is-active');
        },
        { passive: true }
    );

    document.addEventListener('pointerleave', function () {
        glow.classList.remove('is-active');
    });
});
