// ============ Theme Manager ============

document.documentElement.classList.toggle(
    'dark',
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
);

// ============ Custom Cursor ============

(function initCustomCursor() {
    // Cache DOM elements
    const outerCursor = document.querySelector('.cursor--outer');
    const innerCursor = document.querySelector('.cursor--inner');

    // Get sizes from CSS for accurate positioning
    const outerSize = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--outer-size'));
    const outerOffset = outerSize / 2;

    /**
     * Update cursor position
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    function updatePosition(x, y) {
        outerCursor.style.left = `${x - outerOffset}px`;
        outerCursor.style.top = `${y - outerOffset}px`;
        innerCursor.style.left = `${x}px`;
        innerCursor.style.top = `${y}px`;
    }

    /**
     * Show/hide cursor elements
     * @param {boolean} visible - Whether cursor should be visible
     */
    function setCursorVisibility(visible) {
        const method = visible ? 'add' : 'remove';
        outerCursor.classList[method]('visible');
        innerCursor.classList[method]('visible');
    }

    // Mouse Events
    document.addEventListener('mousemove', (e) => {
        updatePosition(e.clientX, e.clientY);
        setCursorVisibility(true);
        outerCursor.style.transition = "0.1s";
    });

    document.addEventListener('mouseleave', () => {
        setCursorVisibility(false);
    });

    document.addEventListener('click', () => {
        outerCursor.classList.add('clicking');

        // Remove class after animation completes
        outerCursor.addEventListener('animationend', () => {
            outerCursor.classList.remove('clicking');
        }, { once: true });
    });

    // Touch Events (for mobile support)
    document.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        updatePosition(touch.clientX, touch.clientY);
        setCursorVisibility(true);
    });

    document.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        updatePosition(touch.clientX, touch.clientY);
    });

    document.addEventListener('touchend', () => {
        setCursorVisibility(false);
    });
})();

(function () {
    'use strict';

    // ============ Theme Manager ============
    const ThemeManager = {
        toggle: null,

        init() {
            this.toggle = document.getElementById('theme-toggle');

            // Sync toggle button state with current theme
            this.updateState(document.documentElement.classList.contains('dark'));

            // React to system preference changes
            window.matchMedia('(prefers-color-scheme: dark)')
                .addEventListener('change', e => {
                    if (!localStorage.theme) this.setDark(e.matches);
                });

            this.toggle?.addEventListener('click', () => this.toggleTheme());
        },

        toggleTheme() {
            const isDark = !document.documentElement.classList.contains('dark');
            localStorage.theme = isDark ? 'dark' : 'light';
            this.setDark(isDark);
        },

        setDark(isDark) {
            document.documentElement.classList.toggle('dark', isDark);
            this.updateState(isDark);
        },

        updateState(isDark) {
            this.toggle?.setAttribute('aria-checked', isDark);
        }
    };

    // ============ Mobile Nav ============
    const MobileNav = {
        init() {
            this.btn = document.getElementById('mobile-nav-btn');
            this.nav = document.getElementById('mobile-nav');
            this.openIcon = document.getElementById('nav-open-icon');
            this.closeIcon = document.getElementById('nav-close-icon');

            if (!this.btn || !this.nav) return;

            this.btn.addEventListener('click', () => this.toggle());
        },

        toggle() {
            const isOpen = !this.nav.classList.contains('hidden');

            this.nav.classList.toggle('hidden');
            this.openIcon?.classList.toggle('hidden');
            this.closeIcon?.classList.toggle('hidden');

            this.btn.setAttribute('aria-expanded', String(!isOpen));
        }
    };

    // ============ Initialize ============
    function init() {
        ThemeManager.init();
        MobileNav.init();
    }

    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', init)
        : init();

    // Expose for external access
    window.ThemeManager = ThemeManager;

})();