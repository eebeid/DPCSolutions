document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Reveal Animation
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos]').forEach(el => {
        el.classList.add('reveal-item');
        observer.observe(el);
    });

    // Header Scroll Effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(5, 10, 16, 0.95)';
            header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.4)';
        } else {
            header.style.background = 'rgba(5, 10, 16, 0.8)';
            header.style.boxShadow = 'none';
        }
    });

    // Flip Card Logic
    document.querySelectorAll('.service-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.service-card');
            if (card) {
                card.classList.add('flipped');
            }
        });
    });

    document.querySelectorAll('.close-card-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const card = btn.closest('.service-card');
            if (card) {
                card.classList.remove('flipped');
            }
        });
    });
});
