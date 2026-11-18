// theme.js - include in <head> (with defer NOT set) so the theme applies before the page paints.
(function () {
    var root = document.documentElement;
    var THEME_KEY = 'site-theme';
    var ACCENT_KEY = 'site-accent';

    function read(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
    function write(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }

    // 1. Apply saved choice, otherwise follow the visitor's OS setting
    var theme = read(THEME_KEY) ||
        (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    root.setAttribute('data-theme', theme);

    var accent = read(ACCENT_KEY);
    if (accent && accent !== 'red') root.setAttribute('data-accent', accent);

    // 2. Wire up the controls once the page has loaded
    document.addEventListener('DOMContentLoaded', function () {
        var toggle = document.getElementById('theme-toggle');
        var picker = document.getElementById('accent-picker');

        function paintToggle() {
            if (toggle) {
                var isLight = root.getAttribute('data-theme') === 'light';
                toggle.textContent = isLight ? '☾ Dark' : '☀ Light';
                toggle.setAttribute('aria-pressed', String(isLight));
            }
        }

        if (toggle) {
            toggle.addEventListener('click', function () {
                var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
                root.setAttribute('data-theme', next);
                write(THEME_KEY, next);
                paintToggle();
            });
        }

        if (picker) {
            picker.value = root.getAttribute('data-accent') || 'red';
            picker.addEventListener('change', function () {
                if (picker.value === 'red') root.removeAttribute('data-accent');
                else root.setAttribute('data-accent', picker.value);
                write(ACCENT_KEY, picker.value);
            });
        }

        paintToggle();
    });
})();
