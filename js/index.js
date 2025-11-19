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
let calcDisplay = '0';
let calcHistory = [];
let lastGreetingPeriod = null;
let calendarDate = new Date();

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

$(function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
        currentTheme = savedTheme;
    }

    initializeApp();
    applyTheme(currentTheme);
    restoreCalcHistory();
});

function initializeApp() {
    initParticles();
    initTypedText();
    initMobileMenu();
    initCalculator();
    initCalendar();
    updateDateTime();

    setInterval(updateDateTime, 1000);

    $('.reveal').hide();
    setTimeout(() => {
        $('.reveal').each(function(index) {
            $(this).delay(index * 150).fadeIn(400);
        });
    }, 400);
}

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

    $(window).on('resize', () => {
        resizeCanvas();
    });

    init();
    draw();
}

function initTypedText() {
    const phrases = [
        'Hello, World!',
        'Web EOS Project',
        'Client-Side Development',
        'Interactive Web Authoring',
    ];
    const $target = $('#typed-text');
    let currentPhrase = 0;
    let currentIndex = 0;
    let typingForward = true;

    function updateText() {
        const fullText = phrases[currentPhrase];
        const visibleText = fullText.substring(0, currentIndex);
        $target.text(visibleText + (typingForward ? '|' : ''));
    }

    function typeLoop() {
        const fullText = phrases[currentPhrase];

        if (typingForward) {
            if (currentIndex < fullText.length) {
                currentIndex += 1;
            } else {
                typingForward = false;
                setTimeout(typeLoop, 900);
                updateText();
                return;
            }
        } else {
            if (currentIndex > 0) {
                currentIndex -= 1;
            } else {
                typingForward = true;
                currentPhrase = (currentPhrase + 1) % phrases.length;
            }
        }

        updateText();
        setTimeout(typeLoop, typingForward ? 90 : 45);
    }

    updateText();
    setTimeout(typeLoop, 200);
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

function initCalculator() {
    calcDisplay = '0';
    updateCalcDisplay();
    $('.calc-button').button();
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
    const $display = $('#calc-display');
    if ($display.length) {
        $display.val(calcDisplay);
    }
}

function updateCalcHistory() {
    const $history = $('#calc-history');
    if ($history.length) {
        $history.text(calcHistory.length > 0 ? calcHistory[0] : 'None');
    }
}

document.addEventListener('keydown', function(e) {
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

window.addEventListener('beforeunload', function() {
    if (calcHistory.length > 0) {
        localStorage.setItem('calcHistory', JSON.stringify(calcHistory));
    }
});

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

function initCalendar() {
    const $month = $('#calendar-month');
    const $year = $('#calendar-year');
    const $days = $('#calendar-days');

    if (!$month.length || !$year.length || !$days.length) {
        return;
    }

    renderCalendar();

    $('#calendar-prev').on('click', () => changeMonth(-1));
    $('#calendar-next').on('click', () => changeMonth(1));
}

function changeMonth(offset) {
    calendarDate.setMonth(calendarDate.getMonth() + offset);
    renderCalendar();
}

function renderCalendar() {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const startDayIndex = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    $('#calendar-month').text(monthNames[month]);
    $('#calendar-year').text(year);

    const days = [];

    for (let i = startDayIndex; i > 0; i -= 1) {
        days.push({ day: daysInPrevMonth - i + 1, muted: true });
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
        days.push({ day, muted: false });
    }

    let nextMonthDay = 1;
    while (days.length % 7 !== 0) {
        days.push({ day: nextMonthDay, muted: true });
        nextMonthDay += 1;
    }

    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

    const dayCells = days.map((item) => {
        const classes = ['calendar__day'];

        if (item.muted) {
            classes.push('calendar__day--muted');
        }

        if (isCurrentMonth && !item.muted && item.day === today.getDate()) {
            classes.push('calendar__day--today');
        }

        return `<div class="${classes.join(' ')}">${item.day}</div>`;
    });

    $('#calendar-days').html(dayCells.join(''));
}

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
