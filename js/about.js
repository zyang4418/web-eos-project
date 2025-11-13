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

// Initialize page behaviour
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
        currentTheme = savedTheme;
    }

    applyTheme(currentTheme);
    initParticles();
    initMobileMenu();
    initGitHubProfiles();
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

            if (userData.company) {
                const companyLine = document.createElement('div');
                companyLine.textContent = `🏢 ${userData.company}`;
                elements.meta.appendChild(companyLine);
            }

            if (userData.location) {
                const locationLine = document.createElement('div');
                locationLine.textContent = `📍 ${userData.location}`;
                elements.meta.appendChild(locationLine);
            }

            if (userData.blog) {
                const blogUrl = userData.blog.startsWith('http') ? userData.blog : `https://${userData.blog}`;
                const blogLine = document.createElement('div');
                const blogAnchor = document.createElement('a');
                blogAnchor.href = blogUrl;
                blogAnchor.target = '_blank';
                blogAnchor.rel = 'noopener';
                blogAnchor.className = 'text-teal-200 hover:text-teal-100';
                blogAnchor.textContent = blogUrl;
                blogLine.textContent = '🔗 ';
                blogLine.appendChild(blogAnchor);
                elements.meta.appendChild(blogLine);
            }

            elements.meta.style.display = elements.meta.childElementCount ? '' : 'none';
        }

        if (elements.reposList) {
            const topRepos = Array.isArray(reposData)
                ? reposData
                    .filter((repo) => !repo.fork)
                    .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
                    .slice(0, 3)
                : [];

            elements.reposList.innerHTML = '';

            if (!topRepos.length) {
                const emptyItem = document.createElement('li');
                emptyItem.className = 'text-white/60';
                emptyItem.textContent = 'No highlighted repositories available yet.';
                elements.reposList.appendChild(emptyItem);
            } else {
                topRepos.forEach((repo) => {
                    const listItem = document.createElement('li');
                    listItem.className = 'flex flex-col gap-1 rounded-2xl bg-white/5 px-4 py-3';

                    const repoLink = document.createElement('a');
                    repoLink.href = repo.html_url;
                    repoLink.target = '_blank';
                    repoLink.rel = 'noopener';
                    repoLink.className = 'text-teal-200 hover:text-teal-100 font-medium transition';
                    repoLink.textContent = repo.name;

                    const repoMeta = document.createElement('div');
                    repoMeta.className = 'text-xs text-white/70 flex flex-wrap gap-3';

                    const stars = document.createElement('span');
                    stars.textContent = `⭐ ${repo.stargazers_count}`;
                    repoMeta.appendChild(stars);

                    if (repo.language) {
                        const language = document.createElement('span');
                        language.textContent = repo.language;
                        repoMeta.appendChild(language);
                    }

                    const updated = document.createElement('span');
                    const updatedDate = repo.pushed_at ? new Date(repo.pushed_at) : null;
                    if (updatedDate) {
                        updated.textContent = `Updated ${updatedDate.toLocaleDateString()}`;
                        repoMeta.appendChild(updated);
                    }

                    listItem.appendChild(repoLink);
                    listItem.appendChild(repoMeta);
                    elements.reposList.appendChild(listItem);
                });
            }
        }
    } catch (error) {
        if (elements.bio) {
            elements.bio.textContent = 'Unable to load GitHub profile details at this time.';
        }

        if (elements.reposList) {
            elements.reposList.innerHTML = '';
            const errorItem = document.createElement('li');
            errorItem.className = 'text-white/60';
            errorItem.textContent = 'Unable to fetch repository information.';
            elements.reposList.appendChild(errorItem);
        }

        if (elements.meta) {
            elements.meta.innerHTML = '';
            elements.meta.style.display = 'none';
        }
    }
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
