/*
 * Copyright (c) 2025 Zhenyu Yang <yangzhenyu@sust.edu.cn>
 * Copyright (c) 2025 Yuchen Wu <chemistry985211@163.com>
 * Copyright (c) 2025 Zihan Zhang
 * All rights reserved.
 *
 * This source code is the property of Zhenyu Yang and Yuchen Wu.
 * Unauthorized copying, modification, or distribution of this file,
 * via any medium, is strictly prohibited.
 *
 * Url: https://github.com/zyang4418/web-eos-project
 */

let currentTheme = 'light';

$(function() {
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
    const $container = $('#particles-canvas');
    const canvas = $('<canvas aria-hidden="true"></canvas>').appendTo($container)[0];
    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 45;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() * 2 - 1) * 0.8,
            vy: (Math.random() * 2 - 1) * 0.8,
            size: Math.random() * 3 + 2,
            opacity: Math.random() * 0.4 + 0.3,
        };
    }

    function init() {
        resizeCanvas();
        particles.length = 0;
        for (let i = 0; i < particleCount; i += 1) {
            particles.push(createParticle());
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p) => {
            ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        });

        for (let i = 0; i < particles.length; i += 1) {
            for (let j = i + 1; j < particles.length; j += 1) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 110) {
                    ctx.strokeStyle = `rgba(255,255,255,${(1 - dist / 110) * 0.25})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(draw);
    }

    $(window).on('resize', resizeCanvas);
    init();
    draw();
}

function initMobileMenu() {
    const $mobileMenuBtn = $('#mobile-menu-btn');
    const $mobileMenu = $('#mobile-menu');

    if (!$mobileMenuBtn.length || !$mobileMenu.length) {
        return;
    }

    $mobileMenuBtn.on('click', () => {
        const isOpen = $mobileMenu.hasClass('open') && !$mobileMenu.hasClass('hidden');
        if (!isOpen) {
            $mobileMenu.removeClass('hidden');
            void $mobileMenu[0].offsetHeight;
            $mobileMenu.addClass('open');
        } else {
            $mobileMenu.removeClass('open');
            $mobileMenu.one('transitionend', (event) => {
                if (event.originalEvent && event.originalEvent.propertyName !== 'max-height') {
                    return;
                }
                $mobileMenu.addClass('hidden');
            });
        }
    });
}

function initContactForm() {
    const $form = $('#contact-form');
    const $feedback = $('#contact-form-feedback');
    const $messageCounter = $('#message-counter');

    if (!$form.length) {
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
            const trimmedValue = value.trim();
            if (!trimmedValue) {
                return 'Please enter your email address.';
            }

            if (trimmedValue.includes('..')) {
                return 'Please enter a valid email address.';
            }

            const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
            if (!emailPattern.test(trimmedValue)) {
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
        acc[field] = $form.find(`[name="${field}"]`);
        return acc;
    }, {});

    const updateMessageCounter = () => {
        const messageValue = fieldElements.message?.val() || '';
        if (!$messageCounter.length) {
            return;
        }
        $messageCounter.text(`${messageValue.trim().length}/500`);
        $messageCounter.toggleClass('text-amber-200', messageValue.trim().length < 10);
        $messageCounter.toggleClass('text-teal-100', messageValue.trim().length >= 10);
    };

    const updateFieldVisuals = (fieldName, errorMessage) => {
        const $fieldElement = fieldElements[fieldName];
        const $feedbackElement = $(`#${fieldName}-feedback`);
        const $fieldContainer = $fieldElement?.closest('.form-field');
        const $icon = $fieldContainer?.find('.validation-icon');

        if (!$fieldElement?.length || !$feedbackElement.length || !$fieldContainer?.length || !$icon?.length) {
            return;
        }

        const hasError = Boolean(errorMessage);
        $feedbackElement.text(errorMessage);
        $feedbackElement.toggleClass('visible', hasError || $fieldElement.val().trim().length > 0);
        $feedbackElement.toggleClass('error', hasError);
        $feedbackElement.toggleClass('success', !hasError && $fieldElement.val().trim().length > 0);

        $fieldContainer.toggleClass('has-error', hasError);
        $fieldContainer.toggleClass('is-valid', !hasError && $fieldElement.val().trim().length > 0);
        $icon.text(hasError ? '⚠️' : '✅');
        $icon.attr('aria-label', hasError ? 'Field has errors' : 'Field is valid');
    };

    const validateField = (fieldName) => {
        const $fieldElement = fieldElements[fieldName];
        if (!$fieldElement?.length || !validators[fieldName]) {
            return '';
        }
        const value = $fieldElement.val() || '';
        const errorMessage = validators[fieldName](value);
        updateFieldVisuals(fieldName, errorMessage);
        return errorMessage;
    };

    fields.forEach((field) => {
        const $element = fieldElements[field];
        if (!$element?.length) {
            return;
        }
        $element.on('input', () => {
            validateField(field);
            if (field === 'message') {
                updateMessageCounter();
            }
        });
        $element.on('blur', () => validateField(field));
    });

    const displayStatus = (message, isError = false) => {
        if (!$feedback.length) {
            return;
        }
        $feedback.text(message);
        $feedback.removeClass('hidden');
        $feedback.toggleClass('error', isError);
        $feedback.toggleClass('success', !isError);
    };

    $form.on('submit', (event) => {
        event.preventDefault();

        const errorMessages = fields
            .map((fieldName) => ({ fieldName, message: validateField(fieldName) }))
            .filter(({ message }) => Boolean(message));

        const firstInvalidField = errorMessages[0]?.fieldName;
        if (firstInvalidField) {
            const $invalidElement = fieldElements[firstInvalidField];
            $invalidElement?.focus();
            displayStatus(errorMessages.map(({ message }) => message).join(' '), true);
            $form.effect('shake');
            return;
        }

        displayStatus('Thank you! Your message has been submitted successfully.', false);
        $form[0].reset();
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
