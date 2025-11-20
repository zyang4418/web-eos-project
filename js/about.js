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

$(async function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
        currentTheme = savedTheme;
    }

    applyTheme(currentTheme);
    initParticles();
    initMobileMenu();
    await initGitHubProfiles();
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

async function initGitHubProfiles() {
    const cards = document.querySelectorAll('[data-github-username]');
    if (!cards.length) {
        return;
    }

    await Promise.all(Array.from(cards).map(async (card) => {
        const username = card.getAttribute('data-github-username');
        if (!username) {
            return;
        }

        await populateGitHubCard(card, username);
    }));
}

async function populateGitHubCard(card, username) {
    const elements = {
        avatar: card.querySelector('[data-role="avatar"]'),
        name: card.querySelector('[data-role="name"]'),
        username: card.querySelector('[data-role="username"]'),
        bio: card.querySelector('[data-role="bio"]'),
        publicRepos: card.querySelector('[data-role="public-repos"]'),
        followers: card.querySelector('[data-role="followers"]'),
        reposList: card.querySelector('[data-role="repos"]'),
        meta: card.querySelector('[data-role="meta"]')
    };

    const userEndpoint = `https://api.github.com/users/${encodeURIComponent(username)}`;
    const reposEndpoint = `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`;

    try {
        const [userResponse, reposResponse] = await Promise.all([
            fetch(userEndpoint),
            fetch(reposEndpoint)
        ]);

        if (!userResponse.ok) {
            throw new Error(`Failed to load profile (${userResponse.status})`);
        }

        if (!reposResponse.ok) {
            throw new Error(`Failed to load repositories (${reposResponse.status})`);
        }

        const userData = await userResponse.json();
        const reposData = await reposResponse.json();

        const displayName = userData.name || userData.login || username;

        if (elements.avatar) {
            elements.avatar.src = userData.avatar_url || '';
            elements.avatar.alt = `${displayName}'s avatar`;
        }

        if (elements.name) {
            elements.name.textContent = displayName;
        }

        if (elements.username) {
            elements.username.href = userData.html_url || `https://github.com/${username}`;
            elements.username.textContent = `@${userData.login || username}`;
        }

        if (elements.bio) {
            elements.bio.textContent = userData.bio || 'This developer has not added a bio yet.';
        }

        if (elements.publicRepos) {
            elements.publicRepos.textContent = typeof userData.public_repos === 'number' ? userData.public_repos.toLocaleString() : '–';
        }

        if (elements.followers) {
            elements.followers.textContent = typeof userData.followers === 'number' ? userData.followers.toLocaleString() : '–';
        }

        if (elements.meta) {
            elements.meta.innerHTML = '';
            if (userData.location) {
                const location = document.createElement('div');
                location.textContent = `📍 ${userData.location}`;
                elements.meta.appendChild(location);
            }
            if (userData.company) {
                const company = document.createElement('div');
                company.textContent = `🏢 ${userData.company}`;
                elements.meta.appendChild(company);
            }
            if (userData.blog) {
                const blog = document.createElement('div');
                const blogLink = document.createElement('a');
                blogLink.href = userData.blog.startsWith('http') ? userData.blog : `https://${userData.blog}`;
                blogLink.textContent = userData.blog;
                blogLink.className = 'text-teal-300 hover:text-teal-200';
                blogLink.target = '_blank';
                blogLink.rel = 'noopener';
                blog.appendChild(blogLink);
                elements.meta.appendChild(blog);
            }
        }

        if (elements.reposList && Array.isArray(reposData)) {
            const topRepos = reposData
                .filter((repo) => !repo.fork)
                .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
                .slice(0, 5);

            elements.reposList.innerHTML = '';

            if (topRepos.length === 0) {
                const noRepo = document.createElement('li');
                noRepo.textContent = 'No public repositories yet.';
                noRepo.className = 'text-white/60';
                elements.reposList.appendChild(noRepo);
            } else {
                topRepos.forEach((repo) => {
                    const item = document.createElement('li');
                    item.innerHTML = `
                        <a href="${repo.html_url}" target="_blank" rel="noopener" class="text-white hover:text-teal-200">${repo.name}</a>
                        <span class="text-white/60">★ ${repo.stargazers_count || 0}</span>
                    `;
                    elements.reposList.appendChild(item);
                });
            }
        }
    } catch (error) {
        if (elements.name) {
            elements.name.textContent = 'Profile unavailable';
        }
        if (elements.bio) {
            elements.bio.textContent = 'Unable to load GitHub data at the moment. Please try again later.';
        }
        console.error('Failed to load GitHub profile:', error);
    }
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
