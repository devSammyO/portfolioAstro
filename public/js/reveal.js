document.addEventListener('DOMContentLoaded', function () {
    const revealEls = document.querySelectorAll('.reveal');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        revealEls.forEach((el) => el.classList.add('in-view'));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    revealEls.forEach((el) => observer.observe(el));
});
