document.addEventListener('DOMContentLoaded', function () {
    const header = document.getElementById('siteHeader');
    const menu = document.getElementById('navMenu');
    const scanlines = document.getElementById('pageScanlines');

    let lastY = window.scrollY;

    function onScroll() {
        const y = window.scrollY;

        // Las scanlines solo aparecen pasado el hero, para no tocar su look.
        if (scanlines) {
            scanlines.classList.toggle('is-visible', y > window.innerHeight * 0.7);
        }

        if (!header) return;

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
