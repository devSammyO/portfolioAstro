document.addEventListener('DOMContentLoaded', function () {
    const nav = document.querySelector('.nav-links');
    const pill = document.getElementById('navPill');
    if (!nav || !pill) return;

    const links = Array.from(nav.querySelectorAll('.nav-link'));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function activeLink() {
        return links.find((link) => link.classList.contains('active'));
    }

    function movePillTo(link) {
        if (!link || window.innerWidth < 900) {
            pill.style.opacity = '0';
            return;
        }
        const navRect = nav.getBoundingClientRect();
        const linkRect = link.getBoundingClientRect();
        pill.style.opacity = '1';
        pill.style.width = `${linkRect.width}px`;
        pill.style.transform = `translateX(${linkRect.left - navRect.left}px)`;
    }

    function moveToActive() {
        movePillTo(activeLink());
    }

    if (!reduceMotion) {
        links.forEach((link) => {
            link.addEventListener('mouseenter', () => movePillTo(link));
        });
        nav.addEventListener('mouseleave', moveToActive);
    }

    const observer = new MutationObserver(moveToActive);
    links.forEach((link) => {
        observer.observe(link, { attributes: true, attributeFilter: ['class'] });
    });

    window.addEventListener('resize', moveToActive);
    requestAnimationFrame(moveToActive);
    setTimeout(moveToActive, 300);
});
