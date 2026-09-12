document.addEventListener('DOMContentLoaded', function () {
    const header = document.getElementById('siteHeader');
    const menu = document.getElementById('navMenu');
    if (!header) return;

    let lastY = window.scrollY;

    function onScroll() {
        const y = window.scrollY;
        header.classList.toggle('is-scrolled', y > 40);

        if (menu && menu.classList.contains('open')) {
            header.classList.remove('is-hidden');
            lastY = y;
            return;
        }

        if (y > lastY && y > 160) {
            header.classList.add('is-hidden');
        } else {
            header.classList.remove('is-hidden');
        }
        lastY = y;
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
});
