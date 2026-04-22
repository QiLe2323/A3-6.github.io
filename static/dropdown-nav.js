// 下拉导航栏增强脚本
document.addEventListener('DOMContentLoaded', function() {
    const dropdowns = Array.from(document.querySelectorAll('.navbar .dropdown'));
    const DESKTOP_BREAKPOINT = 991.98;
    const HIDE_DELAY = 320;

    const state = new WeakMap();

    function getState(dropdown) {
        if (!state.has(dropdown)) {
            state.set(dropdown, { hideTimer: null });
        }
        return state.get(dropdown);
    }

    function getParts(dropdown) {
        return {
            toggle: dropdown.querySelector('.dropdown-toggle'),
            menu: dropdown.querySelector('.dropdown-menu')
        };
    }

    function clearHideTimer(dropdown) {
        const current = getState(dropdown);
        if (current.hideTimer) {
            clearTimeout(current.hideTimer);
            current.hideTimer = null;
        }
    }

    function openDropdown(dropdown) {
        const { toggle, menu } = getParts(dropdown);
        if (!toggle || !menu) return;

        clearHideTimer(dropdown);
        dropdown.classList.add('show');
        menu.classList.add('show');
        toggle.setAttribute('aria-expanded', 'true');
    }

    function closeDropdown(dropdown) {
        const { toggle, menu } = getParts(dropdown);
        if (!toggle || !menu) return;

        clearHideTimer(dropdown);
        dropdown.classList.remove('show');
        menu.classList.remove('show');
        toggle.setAttribute('aria-expanded', 'false');
    }

    function scheduleClose(dropdown) {
        clearHideTimer(dropdown);
        const current = getState(dropdown);
        current.hideTimer = setTimeout(() => {
            closeDropdown(dropdown);
        }, HIDE_DELAY);
    }

    function closeOtherDropdowns(activeDropdown) {
        dropdowns.forEach(dropdown => {
            if (dropdown !== activeDropdown) {
                closeDropdown(dropdown);
            }
        });
    }

    function isDesktop() {
        return window.innerWidth > DESKTOP_BREAKPOINT;
    }

    dropdowns.forEach(dropdown => {
        const { toggle, menu } = getParts(dropdown);
        if (!toggle || !menu) return;

        dropdown.addEventListener('mouseenter', function() {
            if (!isDesktop()) return;
            closeOtherDropdowns(dropdown);
            openDropdown(dropdown);
        });

        dropdown.addEventListener('mouseleave', function() {
            if (!isDesktop()) return;
            scheduleClose(dropdown);
        });

        menu.addEventListener('mouseenter', function() {
            if (!isDesktop()) return;
            clearHideTimer(dropdown);
            openDropdown(dropdown);
        });

        menu.addEventListener('mouseleave', function() {
            if (!isDesktop()) return;
            scheduleClose(dropdown);
        });

        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const isOpen = dropdown.classList.contains('show');
            closeOtherDropdowns(dropdown);

            if (isOpen) {
                closeDropdown(dropdown);
            } else {
                openDropdown(dropdown);
            }
        });
    });

    document.addEventListener('click', function(e) {
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(e.target)) {
                closeDropdown(dropdown);
            }
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key !== 'Escape' && e.key !== 'Esc') return;

        dropdowns.forEach(dropdown => {
            if (dropdown.classList.contains('show')) {
                closeDropdown(dropdown);
            }
        });
    });

    window.addEventListener('resize', function() {
        dropdowns.forEach(dropdown => {
            clearHideTimer(dropdown);
            closeDropdown(dropdown);
        });
    });

    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }

        .dropdown-item .ripple {
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);

    dropdowns.forEach(dropdown => {
        const menu = dropdown.querySelector('.dropdown-menu');
        if (!menu) return;

        const items = menu.querySelectorAll('.dropdown-item');
        items.forEach(item => {
            item.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                ripple.classList.add('ripple');
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(74, 144, 226, 0.3)';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple 0.6s linear';
                ripple.style.left = (e.clientX - item.getBoundingClientRect().left) + 'px';
                ripple.style.top = (e.clientY - item.getBoundingClientRect().top) + 'px';
                ripple.style.width = ripple.style.height = '20px';

                item.style.position = 'relative';
                item.style.overflow = 'hidden';
                item.appendChild(ripple);

                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    });
});
