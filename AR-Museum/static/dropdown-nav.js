// 下拉导航栏增强脚本
document.addEventListener('DOMContentLoaded', function() {
    
    // 获取所有下拉菜单
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // 为每个下拉菜单添加增强效果
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        const items = menu.querySelectorAll('.dropdown-item');
        
        // 鼠标悬停时显示下拉菜单
        dropdown.addEventListener('mouseenter', function() {
            if (window.innerWidth > 991.98) { // 只在桌面端启用
                menu.classList.add('show');
                toggle.setAttribute('aria-expanded', 'true');
            }
        });
        
        // 鼠标离开时隐藏下拉菜单
        dropdown.addEventListener('mouseleave', function() {
            if (window.innerWidth > 991.98) { // 只在桌面端启用
                menu.classList.remove('show');
                toggle.setAttribute('aria-expanded', 'false');
            }
        });
        
        // 为下拉菜单项添加点击动画
        items.forEach(item => {
            item.addEventListener('click', function(e) {
                // 添加点击波纹效果
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
    
    // 添加键盘导航支持
    document.addEventListener('keydown', function(e) {
        const activeDropdown = document.querySelector('.dropdown.show');
        if (activeDropdown && (e.key === 'Escape' || e.key === 'Esc')) {
            const menu = activeDropdown.querySelector('.dropdown-menu');
            const toggle = activeDropdown.querySelector('.dropdown-toggle');
            menu.classList.remove('show');
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
    
    // 响应式处理
    function handleResize() {
        if (window.innerWidth <= 991.98) {
            // 移动端：移除悬停事件，使用点击事件
            dropdowns.forEach(dropdown => {
                const menu = dropdown.querySelector('.dropdown-menu');
                const toggle = dropdown.querySelector('.dropdown-toggle');
                
                // 移除悬停事件
                dropdown.removeEventListener('mouseenter', showDropdown);
                dropdown.removeEventListener('mouseleave', hideDropdown);
                
                // 添加点击事件
                toggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                    
                    // 关闭其他打开的下拉菜单
                    dropdowns.forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            const otherMenu = otherDropdown.querySelector('.dropdown-menu');
                            const otherToggle = otherDropdown.querySelector('.dropdown-toggle');
                            otherMenu.classList.remove('show');
                            otherToggle.setAttribute('aria-expanded', 'false');
                        }
                    });
                    
                    // 切换当前下拉菜单
                    if (isExpanded) {
                        menu.classList.remove('show');
                        toggle.setAttribute('aria-expanded', 'false');
                    } else {
                        menu.classList.add('show');
                        toggle.setAttribute('aria-expanded', 'true');
                    }
                });
            });
        } else {
            // 桌面端：使用悬停事件
            dropdowns.forEach(dropdown => {
                const menu = dropdown.querySelector('.dropdown-menu');
                const toggle = dropdown.querySelector('.dropdown-toggle');
                
                dropdown.addEventListener('mouseenter', showDropdown);
                dropdown.addEventListener('mouseleave', hideDropdown);
                
                function showDropdown() {
                    menu.classList.add('show');
                    toggle.setAttribute('aria-expanded', 'true');
                }
                
                function hideDropdown() {
                    menu.classList.remove('show');
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }
    
    // 初始化响应式处理
    handleResize();
    
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize);
    
    // 添加波纹动画CSS
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
        
        /* 增强的下拉菜单动画 */
        .navbar .dropdown-menu {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .navbar .dropdown-menu.show {
            animation: dropdownSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @keyframes dropdownSlideIn {
            from {
                opacity: 0;
                transform: translateY(-10px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        
        /* 导航链接悬停效果 */
        .navbar .nav-link {
            position: relative;
            transition: all 0.3s ease;
        }
        
        .navbar .nav-link::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 50%;
            width: 0;
            height: 2px;
            background: linear-gradient(90deg, #4a90e2, #7bb3f0);
            transition: all 0.3s ease;
            transform: translateX(-50%);
        }
        
        .navbar .nav-link:hover::after {
            width: 100%;
        }
        
        /* 下拉箭头动画 */
        .navbar .dropdown-toggle::after {
            transition: transform 0.3s ease;
        }
        
        .navbar .dropdown.show .dropdown-toggle::after {
            transform: rotate(180deg);
        }
    `;
    document.head.appendChild(style);
}); 