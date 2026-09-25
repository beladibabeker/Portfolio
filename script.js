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

// Contact form: this is a normal HTML form that posts straight to FormSubmit
// (formsubmit.co), which forwards the message to your email. No fetch/AJAX
// is used here, so it works even when the page is opened from a local file
// rather than a hosted URL. This script only shows a "Sending..." message
// while the browser navigates to FormSubmit.
const form = document.getElementById('contact-form');
const status = form.querySelector('.form-status');
const sendBtn = form.querySelector('button[type="submit"]');

form.addEventListener('submit', () => {
    status.className = 'form-status';
    status.textContent = 'Sending...';
    sendBtn.disabled = true;
    // Let the form submit normally; FormSubmit will show its own
    // confirmation page (or your activation prompt, the first time).
});
