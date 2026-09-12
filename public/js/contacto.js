document.addEventListener('DOMContentLoaded', function () {
    const btnContacto = document.querySelector('.btn-contacto');
    btnContacto.addEventListener('click', mostrarSwal);
});

function mostrarSwal() {
    Swal.fire({
        title: false,
        background: 'transparent',
        showConfirmButton: false,
        showCloseButton: true,
        width: 'min(380px, 92vw)',
        padding: 0,
        customClass: {
            popup: 'contact-modal-popup',
            closeButton: 'contact-modal-close',
        },
        html: `
            <div class="term-window contact-modal">
                <div class="term-bar">
                    <span class="term-dot term-dot-red"></span>
                    <span class="term-dot term-dot-yellow"></span>
                    <span class="term-dot term-dot-green"></span>
                    <span class="term-bar-title">sammy@portfolio: ~/contacto</span>
                </div>
                <div class="contact-modal-body">
                    <p class="contact-modal-prompt">
                        <span class="contact-modal-prompt-arrow">&gt;</span> elige un canal
                    </p>
                    <a
                        href="tel:+34636731525"
                        class="btn btn-ghost contact-modal-link"
                        data-spotlight
                    >
                        <span class="btn-spotlight" aria-hidden="true"></span>
                        <span class="btn-content">
                            <i class="fa-solid fa-phone btn-icon" aria-hidden="true"></i>
                            Llamar
                        </span>
                    </a>
                    <a
                        href="https://wa.me/34636731525"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="btn btn-ghost contact-modal-link"
                        data-spotlight
                    >
                        <span class="btn-spotlight" aria-hidden="true"></span>
                        <span class="btn-content">
                            <i class="fa-brands fa-whatsapp btn-icon" aria-hidden="true"></i>
                            WhatsApp
                        </span>
                    </a>
                    <a
                        href="mailto:sam_po13@hotmail.com"
                        class="btn btn-ghost contact-modal-link"
                        data-spotlight
                    >
                        <span class="btn-spotlight" aria-hidden="true"></span>
                        <span class="btn-content">
                            <i class="fa-solid fa-envelope btn-icon" aria-hidden="true"></i>
                            Email
                        </span>
                    </a>
                </div>
            </div>
        `,
    });
}
