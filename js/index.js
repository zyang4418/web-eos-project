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

// Global variables
let currentTheme = 'light';
let calcDisplay = '0';
let calcHistory = [];
let lastGreetingPeriod = null;

const greetingsByPeriod = {
    morning: [
        'Good morning, a brand-new day is waiting for your brilliance.',
        'May the first light of the morning bring you a wonderful mood.',
        'Wishing everything today goes just the way you hope.',
        'Good morning—don’t forget to take your smile with you.',
        'May your steps be light today, and your heart feel bright.',
        'A new day—may kindness surround you.',
        'Morning! I hope good news finds you as soon as you wake.',
        'May even the small things today make you quietly happy.',
        'Wishing you a sunny mood today, free of winds and storms.',
        'Good morning—hope every click today feels light and full of anticipation.',
    ],
    noon: [
        'Good noon—take care of yourself and treat your body to something it likes.',
        'You’ve worked hard—take a moment to rest before going on.',
        'May your noon bring you some comfort and some warmth.',
        'Good noon—give yourself a minute or two to breathe.',
        'Hope your afternoon self stays in great shape.',
        'It’s lunchtime—reward yourself for the effort you’ve made.',
        'Good noon—I hope your heart feels gently filled.',
        'Remember, you deserve moments of ease.',
        'The midday sun is just right—may it warm your heart too.',
        'Good noon—may your busy day be wrapped in gentleness.',
    ],
    afternoon: [
        'Good afternoon—you’ve already done great today.',
        'I hope you feel calm and steady at this moment.',
        'The afternoon breeze is soft—may it reach your heart too.',
        'If you\'re tired, blink, stretch, and relax a little.',
        'Good afternoon—things will slowly get better.',
        'May your heart stay soft, yet strong.',
        'Keep going this afternoon, but remember to be kind to yourself.',
        'I hope the hours ahead treat you gently.',
        'A tiny pause can make your heart feel lighter.',
        'Good afternoon—may your little wishes come true bit by bit.',
    ],
    evening: [
        'Good evening—you’ve worked hard today.',
        'May your evening be a mix of relaxation and joy.',
        'Gather your tiredness and let yourself unwind.',
        'I hope you enjoy the hours before bedtime.',
        'You did great today—don’t be too hard on yourself.',
        'May the evening be gentle, and people kind.',
        'Good evening—let your heart settle, it’ll feel better.',
        'The evening breeze is soft—let it whisper “well done” to you.',
        'Slow down and give yourself a little breathing room.',
        'Good evening—may your night feel peaceful and free.',
    ],
    lateNight: [
        'It’s late—thank you for getting through today.',
        'May the quiet of the night gently relax you.',
        'If you’re still awake, I hope this place keeps you company.',
        'The night can feel cold—be gentle with yourself.',
        'Good late night—may you feel wrapped in warmth.',
        'The story of today can pause here—take a rest.',
        'May your heart feel calm, soft, and understood.',
        'Before putting down your phone, tell yourself “you did well.”',
        'The deeper the night, the more gently you should treat yourself.',
        'If you’re pushing through the night, may light accompany your path.',
    ],
};

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
        currentTheme = savedTheme;
    }

    initializeApp();
    applyTheme(currentTheme);
    restoreCalcHistory();
});

// Main initialization function
function initializeApp() {
    initParticles();
    initTypedText();
    initMobileMenu();
    initCalculator();
    updateDateTime();

    // Update date and time every second
    setInterval(updateDateTime, 1000);

    // Start animations after a short delay
    setTimeout(() => {
        startAnimations();
    }, 500);
}

// Particle background functions
function initParticles() {
    const sketch = (p) => {
        let particles = [];
        
        p.setup = () => {
            const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
            canvas.parent('particles-canvas');
            
            // Initialize particles
            for (let i = 0; i < 50; i++) {
                particles.push({
                    x: p.random(p.width),
                    y: p.random(p.height),
                    vx: p.random(-1, 1),
                    vy: p.random(-1, 1),
                    size: p.random(2, 6),
                    opacity: p.random(0.3, 0.8)
                });
            }
        };
        
        p.draw = () => {
            p.clear();
            
            // Draw particles
            particles.forEach(particle => {
                p.fill(255, 255, 255, particle.opacity * 255);
                p.noStroke();
                p.circle(particle.x, particle.y, particle.size);
                
                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Bounce off edges
                if (particle.x < 0 || particle.x > p.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > p.height) particle.vy *= -1;
            });
            
            // Draw connections
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dist = p.dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
                    if (dist < 100) {
                        p.stroke(255, 255, 255, (1 - dist / 100) * 50);
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

// Typed text animation
function initTypedText() {
    const typed = new Typed('#typed-text', {
        strings: [
            'Hello, World!',
            'Web EOS Project',
            'Client-Side Development',
            'Interactive Web Authoring',
        ],
        typeSpeed: 80,
        backSpeed: 50,
        backDelay: 2000,
        loop: true,
        showCursor: true,
        cursorChar: '|'
    });
}

// Mobile menu toggle
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

// Calculator functions
function initCalculator() {
    calcDisplay = '0';
    updateCalcDisplay();
}

function appendToDisplay(value) {
    if (calcDisplay === '0' && value !== '.') {
        calcDisplay = value;
    } else {
        calcDisplay += value;
    }
    updateCalcDisplay();
}

function clearCalc() {
    calcDisplay = '0';
    updateCalcDisplay();
}

function deleteLast() {
    if (calcDisplay.length > 1) {
        calcDisplay = calcDisplay.slice(0, -1);
    } else {
        calcDisplay = '0';
    }
    updateCalcDisplay();
}

function calculate() {
    try {
        const result = eval(calcDisplay);
        calcHistory.unshift(`${calcDisplay} = ${result}`);
        if (calcHistory.length > 5) calcHistory.pop();
        
        calcDisplay = result.toString();
        updateCalcDisplay();
        updateCalcHistory();
    } catch (error) {
        calcDisplay = 'Error';
        updateCalcDisplay();
        setTimeout(() => {
            calcDisplay = '0';
            updateCalcDisplay();
        }, 2000);
    }
}

function updateCalcDisplay() {
    const display = document.getElementById('calc-display');
    if (display) {
        display.value = calcDisplay;
    }
}

function updateCalcHistory() {
    const historyElement = document.getElementById('calc-history');
    if (historyElement) {
        historyElement.textContent = calcHistory.length > 0 ? calcHistory[0] : 'None';
    }
}

// Listen for keyboard input
document.addEventListener('keydown', function(e) {    
    // Calculator input
    if (e.key >= '0' && e.key <= '9') {
        appendToDisplay(e.key);
    } else if (e.key === '.') {
        appendToDisplay('.');
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        appendToDisplay(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        calculate();
    } else if (e.key === 'Escape' || e.key === 'c' || e.key === 'C') {
        clearCalc();
    } else if (e.key === 'Backspace') {
        deleteLast();
    }
});

// Save calculator history before unload
window.addEventListener('beforeunload', function() {
    // Save only if there is history
    if (calcHistory.length > 0) {
        localStorage.setItem('calcHistory', JSON.stringify(calcHistory));
    }
});

// Restore calculator history on load
function restoreCalcHistory() {
    const savedHistory = localStorage.getItem('calcHistory');
    if (!savedHistory) {
        return;
    }

    try {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory)) {
            calcHistory = parsedHistory;
            updateCalcHistory();
        }
    } catch (error) {
        console.error('Failed to restore calculator history:', error);
    }
}

// Date and time function
function updateDateTime() {
    const now = new Date();
    const timeElement = document.getElementById('current-time');
    const dateElement = document.getElementById('current-date');

    if (timeElement) {
        timeElement.textContent = now.toLocaleTimeString('en-US');
    }

    if (dateElement) {
        dateElement.textContent = now.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        });
    }

    updateGreeting(now);
}

function updateGreeting(now) {
    const greetingElement = document.getElementById('greeting-message');
    if (!greetingElement) {
        return;
    }

    const periodKey = determineTimePeriod(now);
    if (periodKey !== lastGreetingPeriod || greetingElement.textContent.trim() === '') {
        const greeting = getRandomGreeting(periodKey);
        greetingElement.textContent = greeting;
        lastGreetingPeriod = periodKey;
    }
}

function determineTimePeriod(now) {
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    if (totalMinutes >= 300 && totalMinutes <= 659) {
        return 'morning';
    }

    if (totalMinutes >= 660 && totalMinutes <= 839) {
        return 'noon';
    }

    if (totalMinutes >= 840 && totalMinutes <= 1079) {
        return 'afternoon';
    }

    if (totalMinutes >= 1080 && totalMinutes <= 1379) {
        return 'evening';
    }

    return 'lateNight';
}

function getRandomGreeting(periodKey) {
    const greetings = greetingsByPeriod[periodKey] || greetingsByPeriod.lateNight;
    const index = Math.floor(Math.random() * greetings.length);
    return greetings[index];
}

// Theme toggle function
function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
}

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
