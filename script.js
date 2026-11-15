const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

// Smooth scroll (and close the mobile menu after choosing a link)
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        navLinks.classList.remove('active');
        menuBtn.setAttribute('aria-expanded', 'false');
    });
});

// Mobile menu
menuBtn.addEventListener('click', () => {
    const open = navLinks.classList.toggle('active');
    menuBtn.setAttribute('aria-expanded', open);
});

// Hide images that fail to load so the neutral placeholder shows instead
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => { img.style.visibility = 'hidden'; });
});

// Project videos: preview on hover, full video in a modal on click
const modal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');

function closeModal() {
    modal.classList.remove('open');
    modalVideo.pause();
}

document.querySelectorAll('.project-media').forEach(media => {
    const preview = media.querySelector('video');
    media.tabIndex = 0;
    media.setAttribute('role', 'button');
    const open = () => {
        modalVideo.src = media.dataset.videoSrc;
        modal.classList.add('open');
        modalVideo.play();
    };
    media.addEventListener('mouseenter', () => preview.play());
    media.addEventListener('mouseleave', () => { preview.pause(); preview.currentTime = 0; });
    media.addEventListener('click', open);
    media.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
});

modal.querySelector('.modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// Contact form: sends the fields to a Google Form (linked to a Google Sheet).
// Google doesn't let the page read its reply, so "no-cors" can only tell us
// whether the request left the browser. A network failure shows an error with
// an email fallback; a normal send shows a careful message, not a guarantee.
const form = document.getElementById('contact-form');
const status = form.querySelector('.form-status');
const sendBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async e => {
    e.preventDefault();
    // Honeypot: bots fill this hidden field, so drop their submissions
    if (form._honey.value) return;

    status.className = 'form-status';
    status.textContent = 'Sending...';
    sendBtn.disabled = true;

    try {
        await fetch(form.action, { method: 'POST', mode: 'no-cors', body: new FormData(form) });
        status.textContent = 'Your message was submitted. If you do not hear back, please email me directly.';
        form.reset();
    } catch (err) {
        status.className = 'form-status error';
        status.textContent = 'The message could not be sent. Please email me at beladibabeker@gmail.com instead.';
    } finally {
        sendBtn.disabled = false;
    }
});
