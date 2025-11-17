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
    const messageCounter = document.getElementById('message-counter');

    if (!form) {
        return;
    }

    const validators = {
        name: (value) => {
            if (!value.trim()) {
                return 'Please enter your name.';
            }
            if (value.trim().length < 2) {
                return 'Name should be at least 2 characters.';
            }
            return '';
        },
        email: (value) => {
            if (!value.trim()) {
                return 'Please enter your email address.';
            }
            const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
            if (!emailPattern.test(value.trim())) {
                return 'Please enter a valid email address.';
            }
            return '';
        },
        subject: (value) => {
            if (!value.trim()) {
                return 'Please enter a subject.';
            }
            if (value.trim().length < 5) {
                return 'Subject should be at least 5 characters.';
            }
            if (value.trim().length > 80) {
                return 'Subject should be under 80 characters.';
            }
            return '';
        },
        message: (value) => {
            if (!value.trim()) {
                return 'Please enter your message.';
            }
            if (value.trim().length < 10) {
                return 'Message should be at least 10 characters.';
            }
            if (value.trim().length > 500) {
                return 'Message should be under 500 characters.';
            }
            return '';
        }
    };

    const fields = ['name', 'email', 'subject', 'message'];
    const fieldElements = fields.reduce((acc, field) => {
        acc[field] = form.querySelector(`[name="${field}"]`);
        return acc;
    }, {});

    const updateMessageCounter = () => {
        const messageValue = fieldElements.message?.value || '';
        if (!messageCounter) {
            return;
        }
        messageCounter.textContent = `${messageValue.trim().length}/500`;
        messageCounter.classList.toggle('text-amber-200', messageValue.trim().length < 10);
        messageCounter.classList.toggle('text-teal-100', messageValue.trim().length >= 10);
    };

    const updateFieldVisuals = (fieldName, errorMessage) => {
        const fieldElement = fieldElements[fieldName];
        const feedbackElement = document.getElementById(`${fieldName}-feedback`);
        const fieldContainer = fieldElement?.closest('.form-field');
        const icon = fieldContainer?.querySelector('.validation-icon');

        if (!fieldElement || !feedbackElement || !fieldContainer || !icon) {
            return;
        }

        const hasError = Boolean(errorMessage);
        feedbackElement.textContent = errorMessage;
        feedbackElement.classList.toggle('visible', hasError || fieldElement.value.trim().length > 0);
        feedbackElement.classList.toggle('error', hasError);
        feedbackElement.classList.toggle('success', !hasError && fieldElement.value.trim().length > 0);

        fieldContainer.classList.toggle('has-error', hasError);
        fieldContainer.classList.toggle('is-valid', !hasError && fieldElement.value.trim().length > 0);
        icon.textContent = hasError ? '⚠️' : '✅';
        icon.setAttribute('aria-label', hasError ? 'Field has errors' : 'Field is valid');
    };

    const validateField = (fieldName) => {
        const fieldElement = fieldElements[fieldName];
        if (!fieldElement || !validators[fieldName]) {
            return '';
        }
        const value = fieldElement.value || '';
        const errorMessage = validators[fieldName](value);
        updateFieldVisuals(fieldName, errorMessage);
        return errorMessage;
    };

    fields.forEach((field) => {
        const element = fieldElements[field];
        if (!element) {
            return;
        }
        element.addEventListener('input', () => {
            validateField(field);
            if (field === 'message') {
                updateMessageCounter();
            }
        });
        element.addEventListener('blur', () => validateField(field));
    });

    const displayStatus = (message, isError = false) => {
        if (!feedback) {
            return;
        }
        feedback.textContent = message;
        feedback.classList.remove('hidden');
        feedback.classList.toggle('error', isError);
        feedback.classList.toggle('success', !isError);
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const errorMessages = fields
            .map((fieldName) => ({ fieldName, message: validateField(fieldName) }))
            .filter(({ message }) => Boolean(message));

        const firstInvalidField = errorMessages[0]?.fieldName;
        if (firstInvalidField) {
            const invalidElement = fieldElements[firstInvalidField];
            invalidElement?.focus();
            displayStatus(errorMessages.map(({ message }) => message).join(' '), true);
            form.classList.add('shake');
            setTimeout(() => form.classList.remove('shake'), 500);
            return;
        }

        displayStatus('Thank you! Your message has been submitted successfully.', false);
        form.reset();
        fields.forEach((fieldName) => updateFieldVisuals(fieldName, ''));
        updateMessageCounter();
    });

    updateMessageCounter();
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
