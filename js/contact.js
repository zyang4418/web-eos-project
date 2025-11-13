/*
 * Copyright (c) 2025 Zhenyu Yang <yangzhenyu@sust.edu.cn>
 * Copyright (c) 2025 Yuchen Wu <chemistry985211@163.com>
 * All rights reserved.
 *
 * This source code is the property of Zhenyu Yang and Yuchen Wu.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium, is strictly prohibited.
 *
 * Url: https://github.com/zyang4418/web-eos-project
 */

let currentTheme = 'light';

window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
        currentTheme = savedTheme;
    }

    applyTheme(currentTheme);
    initParticles();
    initMobileMenu();
    initContactForm();
});

function initParticles() {
    if (typeof p5 === 'undefined') {
        return;
    }

    const sketch = (p) => {
        const particles = [];
        const PARTICLE_COUNT = 45;

        p.setup = () => {
            const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
            canvas.parent('particles-canvas');

            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push({
                    x: p.random(p.width),
                    y: p.random(p.height),
                    vx: p.random(-1, 1),
                    vy: p.random(-1, 1),
                    size: p.random(2, 5),
                    opacity: p.random(0.3, 0.7)
                });
            }
        };

        p.draw = () => {
            p.clear();

            particles.forEach((particle) => {
                p.fill(255, 255, 255, particle.opacity * 255);
                p.noStroke();
                p.circle(particle.x, particle.y, particle.size);

                particle.x += particle.vx;
                particle.y += particle.vy;

                if (particle.x < 0 || particle.x > p.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > p.height) particle.vy *= -1;
            });

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dist = p.dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                    if (dist < 110) {
                        p.stroke(255, 255, 255, (1 - dist / 110) * 60);
                        p.strokeWeight(1);
                        p.line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                    }
                }
            }
        };

        p.windowResized = () => {
            p.resizeCanvas(p.windowWidth, p.windowHeight);
        };
    };

    new p5(sketch);
}

function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (!mobileMenuBtn || !mobileMenu) {
        return;
    }

    const handleTransitionEnd = (event) => {
        if (event.propertyName !== 'max-height') {
            return;
        }

        if (!mobileMenu.classList.contains('open')) {
            mobileMenu.classList.add('hidden');
        }

        mobileMenu.removeEventListener('transitionend', handleTransitionEnd);
    };

    mobileMenuBtn.addEventListener('click', () => {
        const isMenuOpen = mobileMenu.classList.contains('open') && !mobileMenu.classList.contains('hidden');

        if (!isMenuOpen) {
            mobileMenu.classList.remove('hidden');
            mobileMenu.removeEventListener('transitionend', handleTransitionEnd);
            void mobileMenu.offsetHeight;
            mobileMenu.classList.add('open');
        } else {
            mobileMenu.classList.remove('open');
            mobileMenu.addEventListener('transitionend', handleTransitionEnd);
        }
    });
}

function initContactForm() {
    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('contact-form-feedback');

    if (!form) {
        return;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const subject = formData.get('subject').trim();
        const message = formData.get('message').trim();
        const errors = [];

        if (!name) {
            errors.push('Please enter your name.');
        }

        if (!email) {
            errors.push('Please enter your email address.');
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            errors.push('Please enter a valid email address.');
        }

        if (!subject) {
            errors.push('Please enter a subject.');
        }

        if (!message) {
            errors.push('Please enter your message.');
        }

        if (errors.length > 0) {
            if (feedback) {
                feedback.classList.remove('hidden');
                feedback.textContent = errors.join(' ');
                feedback.classList.remove('text-teal-100');
                feedback.classList.add('text-red-200');
            }
            return;
        }

        alert('Your message has been sent successfully!');
        form.reset();

        if (feedback) {
            feedback.classList.remove('hidden');
            feedback.textContent = 'Thank you! Your message has been submitted successfully.';
            feedback.classList.remove('text-red-200');
            feedback.classList.add('text-teal-100');
        }
    });
}

window.toggleTheme = function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
};

function applyTheme(theme) {
    currentTheme = theme;
    const isDarkTheme = theme === 'dark';

    document.body.classList.toggle('dark-theme', isDarkTheme);

    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.textContent = isDarkTheme ? '☀️' : '🌙';
        const toggleLabel = isDarkTheme ? 'Switch to light theme' : 'Switch to dark theme';
        themeToggle.setAttribute('aria-label', toggleLabel);
        themeToggle.setAttribute('title', toggleLabel);
    }

    localStorage.setItem('theme', theme);
}
