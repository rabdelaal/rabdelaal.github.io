/**
 * AAA Gold Standard Animations
 * GSAP ScrollTrigger, Custom Cursor, Magnetic Buttons, Count-up Stats
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ─────────────────────────────────────────────────────────────────────────
    // 1. GSAP SETUP
    // ─────────────────────────────────────────────────────────────────────────
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Animate elements with data-animate attribute
        const animatedElements = document.querySelectorAll('[data-animate]');

        animatedElements.forEach((el) => {
            const delay = parseInt(el.dataset.delay) || 0;
            const animationType = el.dataset.animate;

            if (prefersReducedMotion) {
                el.classList.add('animated');
                return;
            }

            gsap.fromTo(el,
                {
                    opacity: 0,
                    y: animationType === 'scale-in' ? 0 : 40,
                    scale: animationType === 'scale-in' ? 0.9 : 1
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1,
                    delay: delay / 1000,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        once: true
                    },
                    onComplete: () => el.classList.add('animated')
                }
            );
        });

        // Parallax for profile image
        const profileContainer = document.querySelector('.profile-container');
        if (profileContainer && !prefersReducedMotion) {
            gsap.to(profileContainer, {
                y: -50,
                ease: 'none',
                scrollTrigger: {
                    trigger: '#hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });
        }
    } else {
        // Fallback if GSAP not loaded
        document.querySelectorAll('[data-animate]').forEach(el => {
            el.classList.add('animated');
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 2. CUSTOM CURSOR
    // ─────────────────────────────────────────────────────────────────────────
    const cursor = document.getElementById('cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');

    if (cursor && !prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
        let mouseX = 0, mouseY = 0;
        let dotX = 0, dotY = 0;
        let ringX = 0, ringY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            // Dot follows mouse instantly
            dotX += (mouseX - dotX) * 0.5;
            dotY += (mouseY - dotY) * 0.5;
            cursorDot.style.left = dotX + 'px';
            cursorDot.style.top = dotY + 'px';

            // Ring follows with delay
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';

            requestAnimationFrame(animateCursor);
        }

        animateCursor();

        // Hover states
        const interactiveElements = document.querySelectorAll('a, button, [data-magnetic]');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });

        document.addEventListener('mouseenter', () => {
            cursor.style.opacity = '1';
        });
    } else if (cursor) {
        cursor.style.display = 'none';
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 3. MAGNETIC BUTTONS
    // ─────────────────────────────────────────────────────────────────────────
    const magneticElements = document.querySelectorAll('[data-magnetic]');

    if (!prefersReducedMotion) {
        magneticElements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });

            el.addEventListener('mouseleave', () => {
                el.style.transform = '';
            });
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 4. COUNT-UP STATS
    // ─────────────────────────────────────────────────────────────────────────
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');

    const countObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                const duration = 2000;
                const start = performance.now();

                function updateCount(currentTime) {
                    const elapsed = currentTime - start;
                    const progress = Math.min(elapsed / duration, 1);

                    // Ease out cubic
                    const easeProgress = 1 - Math.pow(1 - progress, 3);
                    const current = Math.floor(easeProgress * target);

                    el.textContent = current + '+';

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    }
                }

                requestAnimationFrame(updateCount);
                countObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => countObserver.observe(el));

    // ─────────────────────────────────────────────────────────────────────────
    // 5. HEADER SCROLL BEHAVIOR
    // ─────────────────────────────────────────────────────────────────────────
    const header = document.getElementById('site-header');
    let lastScroll = 0;
    let ticking = false;

    function updateHeader() {
        const currentScroll = window.pageYOffset;

        // Add scrolled class
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide/show on scroll
        if (currentScroll > lastScroll && currentScroll > 200) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }

        lastScroll = currentScroll;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    });

    // ─────────────────────────────────────────────────────────────────────────
    // 5.B FLOATING CTA VISIBILITY
    // ─────────────────────────────────────────────────────────────────────────
    const floatingCTA = document.getElementById('floating-cta');
    if (floatingCTA) {
        function updateFloatingCTA() {
            if (window.pageYOffset > 500) {
                floatingCTA.classList.add('visible');
            } else {
                floatingCTA.classList.remove('visible');
            }
        }
        window.addEventListener('scroll', updateFloatingCTA);
        updateFloatingCTA(); // Check initial state
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 6. SMOOTH SCROLL
    // ─────────────────────────────────────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ─────────────────────────────────────────────────────────────────────────
    // 7. 3D TILT FOR PAPER CARDS
    // ─────────────────────────────────────────────────────────────────────────
    const paperCards = document.querySelectorAll('.paper-card');

    if (!prefersReducedMotion) {
        paperCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 15;
                const rotateY = (centerX - x) / 15;

                card.style.transform = `
                    perspective(1000px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    translateY(-8px)
                `;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 8. TIMELINE NAV BUTTONS
    // ─────────────────────────────────────────────────────────────────────────
    const prevBtn = document.getElementById('timeline-prev');
    const nextBtn = document.getElementById('timeline-next');

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            // This will be handled by timeline.js
            window.dispatchEvent(new CustomEvent('timeline-prev'));
        });

        nextBtn.addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('timeline-next'));
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 9. VIDEO LAZY LOAD
    // ─────────────────────────────────────────────────────────────────────────
    const videos = document.querySelectorAll('video[preload="metadata"]');

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const video = entry.target;
                video.preload = 'auto';
                videoObserver.unobserve(video);
            }
        });
    }, { rootMargin: '200px' });

    videos.forEach(video => videoObserver.observe(video));
});

// Console branding
console.log(
    '%c🚀 Romain Abdel-Aal Portfolio',
    'color: #667eea; font-size: 16px; font-weight: bold;'
);
console.log(
    '%cBuilt with Three.js, GSAP & modern web standards',
    'color: #764ba2; font-size: 12px;'
);
