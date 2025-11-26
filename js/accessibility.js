(function() {
    const STORAGE_KEY = 'vision_mode_enabled';
    const DISMISS_KEY = 'vision_mode_dismissed_session';

    function createBanner() {
        const banner = document.createElement('div');
        banner.className = 'accessibility-banner';
        banner.setAttribute('role', 'region');
        banner.setAttribute('aria-label', 'Comfort view mode options');

        const text = document.createElement('div');
        text.className = 'accessibility-banner__text';
        text.innerHTML = '<strong>Comfort View</strong> Would you like to switch to an easier-to-read browsing experience?';

        const actions = document.createElement('div');
        actions.className = 'accessibility-banner__actions';

        const enableBtn = document.createElement('button');
        enableBtn.type = 'button';
        enableBtn.className = 'accessibility-banner__button';
        enableBtn.dataset.role = 'vision-enter';
        enableBtn.textContent = 'Try comfort view';
        enableBtn.addEventListener('click', enableVisionMode);

        const disableBtn = document.createElement('button');
        disableBtn.type = 'button';
        disableBtn.dataset.role = 'vision-leave';
        disableBtn.className = 'accessibility-banner__button accessibility-banner__button--secondary';
        disableBtn.textContent = 'Return to standard view';
        disableBtn.addEventListener('click', disableVisionMode);

        const dismissBtn = document.createElement('button');
        dismissBtn.type = 'button';
        dismissBtn.className = 'accessibility-banner__button accessibility-banner__button--secondary';
        dismissBtn.textContent = 'Maybe later';
        dismissBtn.addEventListener('click', () => {
            if (document.body.classList.contains('vision-mode-active')) {
                disableVisionMode();
            }
            sessionStorage.setItem(DISMISS_KEY, 'true');
            banner.remove();
            document.body.classList.remove('has-accessibility-banner');
        });

        actions.appendChild(enableBtn);
        actions.appendChild(disableBtn);
        actions.appendChild(dismissBtn);

        banner.appendChild(text);
        banner.appendChild(actions);
        return banner;
    }

    function enableVisionMode() {
        document.body.classList.add('vision-mode-active');
        localStorage.setItem(STORAGE_KEY, 'true');
        updateButtonsState(true);
    }

    function disableVisionMode() {
        document.body.classList.remove('vision-mode-active');
        localStorage.setItem(STORAGE_KEY, 'false');
        updateButtonsState(false);
    }

    function updateButtonsState(isEnabled) {
        const banner = document.querySelector('.accessibility-banner');
        if (!banner) return;
        const enableBtn = banner.querySelector('[data-role="vision-enter"]');
        const disableBtn = banner.querySelector('[data-role="vision-leave"]');

        if (enableBtn) {
            enableBtn.disabled = isEnabled;
            enableBtn.textContent = isEnabled ? 'Comfort view on' : 'Try comfort view';
            enableBtn.setAttribute('aria-pressed', isEnabled ? 'true' : 'false');
        }
        if (disableBtn) {
            disableBtn.disabled = !isEnabled;
            disableBtn.textContent = 'Return to standard view';
        }
    }

    function restoreVisionPreference() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'true') {
            document.body.classList.add('vision-mode-active');
            return true;
        }
        return false;
    }

    function initBanner() {
        const alreadyDismissed = sessionStorage.getItem(DISMISS_KEY) === 'true';
        const banner = createBanner();
        document.body.insertBefore(banner, document.body.firstChild);
        document.body.classList.add('has-accessibility-banner');

        const enabled = restoreVisionPreference();
        updateButtonsState(enabled);

        if (alreadyDismissed && !enabled) {
            banner.remove();
            document.body.classList.remove('has-accessibility-banner');
        }
    }

    document.addEventListener('DOMContentLoaded', initBanner);
})();
