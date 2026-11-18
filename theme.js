// theme.js - include in <head> (with defer NOT set) so the theme applies before the page paints.
(function () {
    var root = document.documentElement;
    var THEME_KEY = 'site-theme';
    var ACCENT_KEY = 'site-accent';
    var DEFAULT_THEME = 'dark';
    var DEFAULT_ACCENT = 'purple';   // matches the :root defaults in styles.css (no attribute needed)

    function read(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
    function write(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }

    // 1. Apply saved choice, otherwise use the default (dark + purple for everyone)
    var theme = read(THEME_KEY) || DEFAULT_THEME;
    root.setAttribute('data-theme', theme);

    var accent = read(ACCENT_KEY);
    if (accent && accent !== DEFAULT_ACCENT) root.setAttribute('data-accent', accent);

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
            picker.value = root.getAttribute('data-accent') || DEFAULT_ACCENT;
            picker.addEventListener('change', function () {
                if (picker.value === DEFAULT_ACCENT) root.removeAttribute('data-accent');
                else root.setAttribute('data-accent', picker.value);
                write(ACCENT_KEY, picker.value);
            });
        }

        paintToggle();
    });
})();