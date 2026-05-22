/**
 * Rabeens Technologies - Main JavaScript
 * Handles: Theme toggle, mobile menu, modal, scroll animations, form, header scroll
 */

(function () {
    'use strict';

    // ==========================================
    // Theme Management (System + Manual Toggle)
    // ==========================================
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function applyTheme(theme) {
        if (theme === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
    }

    function initTheme() {
        const stored = localStorage.getItem('theme');
        if (stored) {
            applyTheme(stored);
        } else {
            applyTheme(getSystemTheme());
        }
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    themeToggle.addEventListener('click', () => {
        const isDark = html.classList.contains('dark');
        const newTheme = isDark ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });

    initTheme();

    // ==========================================
    // Mobile Menu
    // ==========================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    function toggleMobileMenu() {
        const isHidden = mobileMenu.classList.contains('hidden');
        mobileMenu.classList.toggle('hidden');
        // Update aria
        mobileMenuBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
        // Update icon
        const icon = mobileMenuBtn.querySelector('svg');
        if (isHidden) {
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>';
        } else {
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>';
        }
    }

    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Close mobile menu on link click
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            const icon = mobileMenuBtn.querySelector('svg');
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>';
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        });
    });

    // ==========================================
    // Header Scroll Effect
    // ==========================================
    const header = document.getElementById('header');
    let lastScroll = 0;

    function handleHeaderScroll() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }

    window.addEventListener('scroll', handleHeaderScroll, { passive: true });

    // ==========================================
    // Consultants Modal
    // ==========================================
    const consultantsBtn = document.getElementById('consultants-btn');
    const consultantsModal = document.getElementById('consultants-modal');
    const closeModal = document.getElementById('close-modal');
    const modalOverlay = document.getElementById('modal-overlay');

    function openModal() {
        consultantsModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        // Focus trap - focus the close button
        setTimeout(() => closeModal.focus(), 100);
    }

    function closeModalFn() {
        consultantsModal.classList.add('hidden');
        document.body.style.overflow = '';
        consultantsBtn.focus();
    }

    consultantsBtn.addEventListener('click', openModal);
    closeModal.addEventListener('click', closeModalFn);
    modalOverlay.addEventListener('click', closeModalFn);

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !consultantsModal.classList.contains('hidden')) {
            closeModalFn();
        }
    });

    // ==========================================
    // Scroll Animations (Intersection Observer)
    // ==========================================
    function initScrollAnimations() {
        const elements = document.querySelectorAll('.animate-on-scroll');

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            // Respect animation-delay via style attribute
                            const delay = entry.target.style.animationDelay || '0s';
                            const delayMs = parseFloat(delay) * 1000;

                            setTimeout(() => {
                                entry.target.classList.add('visible');
                            }, delayMs);

                            observer.unobserve(entry.target);
                        }
                    });
                },
                {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px',
                }
            );

            elements.forEach((el) => observer.observe(el));
        } else {
            // Fallback for older browsers
            elements.forEach((el) => el.classList.add('visible'));
        }
    }

    initScrollAnimations();

    // ==========================================
    // Contact Form Handling
    // ==========================================
    const contactForm = document.getElementById('contact-form');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        // Basic validation
        if (!data.name || !data.email || !data.message) {
            showFormMessage('Please fill in all required fields.', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Simulate form submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        setTimeout(() => {
            showFormMessage('Thank you! Your message has been sent. We\'ll get back to you soon.', 'success');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });

    function showFormMessage(message, type) {
        // Remove existing messages
        const existing = contactForm.querySelector('.form-message');
        if (existing) existing.remove();

        const msgEl = document.createElement('div');
        msgEl.className = `form-message mt-4 p-4 rounded-xl text-sm font-medium ${
            type === 'success'
                ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
        }`;
        msgEl.textContent = message;
        contactForm.appendChild(msgEl);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (msgEl.parentNode) {
                msgEl.style.opacity = '0';
                msgEl.style.transition = 'opacity 0.3s ease';
                setTimeout(() => msgEl.remove(), 300);
            }
        }, 5000);
    }

    // ==========================================
    // Smooth Scroll for Anchor Links
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth',
                });
            }
        });
    });

    // ==========================================
    // Active Nav Link Highlight on Scroll
    // ==========================================
    function updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        const headerHeight = header.offsetHeight;

        let current = '';

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove('text-primary-600', 'dark:text-primary-400', 'bg-primary-50', 'dark:bg-primary-950/50');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('text-primary-600', 'dark:text-primary-400', 'bg-primary-50', 'dark:bg-primary-950/50');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

})();
