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
let calcDisplay = '0';
let calcHistory = [];
let lastGreetingPeriod = null;
let calendarDate = new Date();

const technologyDetails = {
    html5: {
        title: 'HTML5',
        content: `
            <div class="tech-modal__media"><img src="./images/HTML5.png" alt="HTML5 logo" class="tech-modal__image"></div>
            <p>This project uses modern HTML5 structure to define semantic page layout across files like index.html, about.html, and contact.html. Elements such as &lt;header&gt;, &lt;section&gt;, &lt;nav&gt;, and &lt;canvas&gt; help describe meaningful content rather than using generic &lt;div&gt; blocks. For instance, the particle animation background is rendered via a dynamically injected &lt;canvas&gt; element created in JavaScript.</p>
            <p>HTML5 also supports interactive components that work together with JavaScript logic. Forms on contact.html include semantic input fields such as &lt;input type="email"&gt;, ensuring browser-native validation behaviors before custom validation is applied. This structural foundation allows JavaScript and CSS to enhance interaction rather than defining layout alone.</p>
        `,
    },
    css: {
        title: 'CSS',
        content: `
            <div class="tech-modal__media"><img src="./images/CSS.png" alt="CSS logo" class="tech-modal__image"></div>
            <p>This project uses extensive custom CSS styles across files like index.css, about.css, and contact.css, defining typography, layout, animations, and themes. The design centers around CSS variables in :root, enabling a centralized palette (--primary-blue, --tech-blue, etc.) that ensures consistent branding across pages. These variables also support theme switching, where alternate colors activate when the .dark-theme class is applied to the &lt;body&gt; element.</p>
            <p>The styling makes heavy use of glassmorphism, gradients, shadows, and blur effects. For example, navigation bars use translucent backgrounds with backdrop-filter: blur(10px) and fading borders to create a layered UI style. Interactive elements like .calc-button include hover transformations and shadows to provide tactile feedback, enhancing perception and usability.</p>
            <p>CSS here also handles layout responsiveness without external frameworks. Menus like .mobile-menu rely on max-height, opacity, and transform transitions rather than display: none, enabling smooth animations between states. The project uses grid layout in the calendar (display: grid; grid-template-columns: repeat(7, 1fr)) to create a clean and uniform structure. These techniques demonstrate modern CSS capabilities without dependency on Bootstrap or Tailwind.</p>
        `,
    },
    lighthouse: {
        title: 'Google Lighthouse',
        content: `
            <div class="tech-modal__media"><img src="./images/Google_Lighthouse.png" alt="Google Lighthouse logo" class="tech-modal__image"></div>
            <p>The project demonstrates a number of development practices that align with Lighthouse evaluation criteria. For example, CSS variables consolidate theme colors and prevent repetitive declarations, improving maintainability and reducing stylesheet size. Animated UI components use GPU-friendly transforms (transform rather than top/left) to maintain smooth rendering performance, as seen in the floating elements and button hover animations.</p>
            <p>Lighthouse also evaluates accessibility, and this project contains multiple attributes designed to meet accessibility requirements. The particle background canvas is injected with aria-hidden="true", ensuring assistive technologies ignore visual-only elements. Form validation provides real-time feedback with descriptive error messages ("Please enter your email address.") rather than generic errors, improving usability for keyboard and screen-reader users.</p>
            <p>The project also aligns with Lighthouse’s performance and best-practice guidelines by storing data in localStorage—such as theme preferences and calculator history—allowing UI state to persist across reloads without server requests. Combined with lightweight HTML structure and client-side routing through multiple static pages, the site avoids unnecessary rendering cost or network overhead.</p>
        `,
    },
    javascript: {
        title: 'JavaScript',
        content: `
            <p>JavaScript is the core engine powering interactivity across all three pages. It executes once the DOM is ready via $(function() {...}), then initializes modules such as particle background rendering, mobile navigation, calculators, typed text animation, and contact form validation. Functions like initParticles(), initMobileMenu(), and initCalculator() are defined and executed during startup to modularize logic and keep the code organized.</p>
            <p>JavaScript also manages dynamic UI rendering and animations independent of CSS frameworks. For example, the particle engine creates &lt;canvas&gt; elements through DOM manipulation and continuously draws frames using requestAnimationFrame(draw), simulating motion with randomized vectors and opacity values. These updates rely on mathematical calculations rather than CSS transitions, demonstrating full programmatic rendering.</p>
            <p>State management and persistent data storage are implemented entirely on the client. The calculator stores previous results in calcHistory, syncing values to localStorage on page unload and restoring them when revisiting the site. Theme selection also persists using localStorage.setItem('theme', ...), meaning user choices persist across reloads. Input handling supports both UI clicks and keyboard events through document.addEventListener('keydown', ...), enabling accessibility and efficient interaction.</p>
        `,
    },
    storage: {
        title: 'Cookies and localStorage',
        content: `
            <p>This project uses localStorage extensively to persist user preferences and data across sessions. For example, the selected theme (light or dark) is stored with localStorage.setItem('theme', ...) and later retrieved on startup to reapply the interface without user interaction. This allows consistent appearance across page reloads and different visits.</p>
            <p>In addition, the calculator component stores recent calculation history in localStorage using JSON serialization. When the user performs calculations, results are pushed into calcHistory and saved automatically before page unload. Upon returning to the site, restoreCalcHistory() retrieves stored data and restores it to the UI, ensuring continuity of interaction.</p>
            <p>The project does not use Cookies, and this choice is meaningful from a technical standpoint. Cookies are typically used for server-driven session management and get transmitted with HTTP requests, whereas this project is purely client-side and does not require backend communication. localStorage is more suitable because it stores larger amounts of data (typically ~5MB), persists indefinitely, and is not attached to HTTP headers—making it efficient for preferences like UI themes and computed results. The architecture reflects a fully client-side SPA-style design.</p>
        `,
    },
    hci: {
        title: 'HCI (Human–Computer Interaction)',
        content: `
            <p>This project demonstrates multiple principles of Human–Computer Interaction by designing interfaces that are visually responsive and give immediate feedback to users. For example, form fields provide real-time validation messages such as "Please enter your name." and apply clear visual states—red for errors, green for success—through classes like .has-error and .is-valid. Validation icons (⚠️ vs ✅) further reinforce cognitive clarity by pairing text and symbolic cues.</p>
            <p>The project also reduces cognitive load by enabling intuitive interactions across input methods. The calculator supports both button clicks and keyboard input via document.addEventListener('keydown', ...), letting users choose whichever is more efficient. The theme toggle offers an animated rotation hover effect, which communicates clickability through motion rather than static styling. Animated reveal effects (fadeIn, staggered timing) guide users' attention without overwhelming them.</p>
            <p>Responsiveness and accessibility are also part of HCI design here. The mobile menu uses smooth transitions instead of abrupt show/hide behavior, helping users understand spatial changes in layout. Purely decorative elements like the particle background canvas are marked aria-hidden="true" so screen readers ignore them—preventing noise and improving UX for visually impaired users. The combination of readable typography, contrast-aware dark mode, and spacing-focused structure creates a user experience that balances aesthetics with clarity.</p>
        `,
    },
    jquery: {
        title: 'jQuery',
        content: `
            <div class="tech-modal__media"><img src="./images/JQuery.png" alt="jQuery logo" class="tech-modal__image"></div>
            <p>jQuery serves as the primary engine for DOM traversal, event registration, and UI initialization across the entire project. All three main scripts begin with $(function() { ... }), ensuring logic runs only after the DOM is fully loaded. This includes setup tasks such as loading saved themes, initializing the particle system, binding navigation button events, and, on the contact page, wiring up form validation behavior.</p>
            <p>The project uses jQuery to manipulate elements dynamically rather than relying on static HTML. For example, the particle system creates and appends a &lt;canvas&gt; element using const canvas = $('&lt;canvas ...&gt;').appendTo(...), then uses jQuery’s object wrapper for event binding like $(window).on('resize', resizeCanvas). Similarly, the mobile menu toggles visibility by conditionally adding and removing classes like .open and .hidden, relying on jQuery’s .on('click', ...) and class utilities rather than native listeners.</p>
            <p>jQuery is also used to enhance components visually and behaviorally. In the calculator page, buttons are initialized with .button(), invoking jQuery UI's widget layer to apply styling and interactions. Meanwhile, sequential fade-in animations are implemented via chained transitions using .delay().fadeIn(400), illustrating how jQuery simplifies asynchronous UI sequencing. The combination of jQuery with small amounts of native JavaScript provides both convenience and performance where needed.</p>
        `,
    },
    'jquery-ui': {
        title: 'jQuery UI',
        content: `
            <div class="tech-modal__media"><img src="./images/JQuery_UI.png" alt="jQuery UI logo" class="tech-modal__image"></div>
            <p>The project applies jQuery UI primarily to enhance interactive components with richer visuals and behaviors on top of the existing jQuery DOM logic. For example, calculator buttons are initialized using .button(), which transforms ordinary &lt;button&gt; elements into styled, theme-aware UI widgets that respond to hover, focus, and active states more consistently across browsers. This provides a polished tactile feel without manually writing custom CSS for button states.</p>
            <p>In addition to styling, jQuery UI also supplements animation sequencing. Certain elements are revealed with chained animations using methods like .fadeIn() along with .delay(), allowing sequential entrance effects that guide the user’s attention. While these effects could be achieved with CSS transitions, jQuery UI abstracts timing, easing, and event callbacks into a simpler API, reducing implementation complexity while maintaining fine-grained control.</p>
            <p>Unlike other projects that use jQuery UI's full widget library (tabs, accordions, dialogs), this project selectively uses smaller features rather than full UI components. This design choice keeps the interface lightweight while still benefiting from UI enhancements where interaction quality matters most (e.g., calculator input surfaces). This reflects an intentional trade-off: leveraging jQuery UI for polish without over-engineering the interface.</p>
        `,
    },
    'jquery-validation': {
        title: 'jQuery Validation',
        content: `
            <p>This project does not use the jQuery Validation plugin. Instead, it implements a fully custom validation system in the contact form using manual logic written in JavaScript. Each field is validated through explicit checks—for example, verifying that the name field is not empty and that the email field matches a regular expression. When validation fails, the script dynamically inserts styled message elements below the input, providing immediate feedback without relying on external libraries.</p>
            <p>The system also applies visual states directly via CSS class toggling rather than relying on built-in plugin behaviors. Fields switch between .has-error and .is-valid, and each state includes carefully designed color schemes, animated borders, and icons that appear beside the input. This results in a more polished and custom aesthetic than many default validation plugins, aligning with the project's design-focused UI approach.</p>
            <p>Although plugins like jQuery Validation could have simplified rule configuration and provided built-in patterns, the hand-crafted system offers advantages: complete control over animation timing, styling, DOM structure, and behavior logic. It reflects a deliberate trade-off prioritizing visual refinement and branding consistency over generalized rule-based validation, making the form not only functional but also a stylistic part of the website experience.</p>
        `,
    },
};

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
    initTechCards();
    updateDateTime();

    setInterval(updateDateTime, 1000);

    $('.reveal').hide();
    setTimeout(() => {
        $('.reveal').each(function(index) {
            $(this).delay(index * 150).fadeIn(400);
        });
    }, 400);
}

function initTechCards() {
    const $modal = $('#tech-modal');
    const $body = $('body');

    $('.info-card').each(function() {
        const $card = $(this);
        const techKey = $card.data('tech');
        if (!techKey) return;

        $card.attr('tabindex', '0');
        $card.on('click', () => openTechModal(techKey));
        $card.on('keypress', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openTechModal(techKey);
            }
        });
    });

    $('#tech-modal-close').on('click', closeTechModal);
    $modal.on('click', (event) => {
        if (event.target === $modal[0]) {
            closeTechModal();
        }
    });

    $(document).on('keydown', (event) => {
        if (event.key === 'Escape' && $modal.hasClass('tech-modal--visible')) {
            closeTechModal();
        }
    });

    function openTechModal(key) {
        const detail = technologyDetails[key];
        if (!detail) return;

        $('#tech-modal-title').text(detail.title);
        $('#tech-modal-body').html(detail.content);
        $modal.addClass('tech-modal--visible');
        $body.addClass('modal-open');
        $('#tech-modal-body').scrollTop(0);
    }

    function closeTechModal() {
        $modal.removeClass('tech-modal--visible');
        $body.removeClass('modal-open');
    }
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
