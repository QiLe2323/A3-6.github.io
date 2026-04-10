// 滚轮交互动画标题模块脚本
class ScrollHeaderAnimation {
    constructor() {
        this.header = null;
        this.bg = null;
        this.title = null;
        this.subtitle = null;
        this.scrollDistance = 0;
        this.requestId = null;
        this.maxScrollDistance = 600;
        this.isInView = false;
        this.observer = null;
        
        this.init();
    }
    
    init() {
        // 获取元素
        this.header = document.querySelector('.scroll-header');
        this.bg = document.querySelector('.scroll-header-bg');
        this.title = document.querySelector('.scroll-header-title');
        this.subtitle = document.querySelector('.scroll-header-subtitle');
        
        if (!this.header || !this.bg) {
            console.warn('Scroll header elements not found');
            return;
        }
        
        // 设置 Intersection Observer
        this.setupIntersectionObserver();
        
        // 绑定事件
        this.bindEvents();
        
        // 初始化状态
        this.updateHeaderClipPath();
    }
    
    setupIntersectionObserver() {
        const headerContainer = document.querySelector('.scroll-header-container');
        if (!headerContainer) return;
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                this.isInView = entry.isIntersecting;
                
                // 如果离开视图，重置动画状态
                if (!this.isInView && this.scrollDistance > 0) {
                    this.reset();
                }
            });
        }, {
            threshold: [0, 0.1, 0.5, 1.0],
            rootMargin: '0px 0px -100px 0px'
        });
        
        this.observer.observe(headerContainer);
    }
    
    bindEvents() {
        // 滚轮事件 - 只在标题区域时处理
        window.addEventListener('wheel', this.scrollHandler.bind(this), { passive: true });
        
        // 触摸事件（移动端）
        let touchStartY = 0;
        let touchEndY = 0;
        
        window.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        window.addEventListener('touchmove', (e) => {
            touchEndY = e.touches[0].clientY;
            const deltaY = touchStartY - touchEndY;
            
            if (deltaY !== 0) {
                this.handleScroll(deltaY);
            }
            
            touchStartY = touchEndY;
        }, { passive: true });
        
        // 键盘事件
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                this.handleScroll(50);
            } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                this.handleScroll(-50);
            }
        });
    }
    
    scrollHandler(event) {
        // 只有在标题区域可见时才处理滚轮事件
        if (!this.isInView) return;
        
        // 计算动画进度
        const progress = this.scrollDistance / this.maxScrollDistance;
        
        // 如果动画接近完成，允许正常滚动
        if (progress > 0.9) {
            return;
        }
        
        // 在动画区域内，平滑处理滚轮事件
        const animationFactor = Math.max(0.1, 1 - progress);
        const adjustedDeltaY = event.deltaY * animationFactor;
        
        this.handleScroll(adjustedDeltaY);
        
        // 如果动画完成，允许正常滚动
        if (this.scrollDistance >= this.maxScrollDistance) {
            return;
        }
    }
    
    handleScroll(deltaY) {
        const previousDistance = this.scrollDistance;
        
        if (deltaY < 0) {
            // 向上滚动
            this.scrollDistance = Math.max(0, this.scrollDistance + deltaY);
        } else {
            // 向下滚动
            this.scrollDistance = Math.min(this.maxScrollDistance, this.scrollDistance + deltaY);
        }
        
        // 只有当距离发生变化时才更新动画
        if (previousDistance !== this.scrollDistance) {
            if (!this.requestId) {
                this.requestId = window.requestAnimationFrame(() => {
                    this.updateHeaderClipPath();
                    this.requestId = null;
                });
            }
        }
    }
    
    updateHeaderClipPath() {
        const scrollProgress = this.scrollDistance / this.maxScrollDistance;
        
        // 更新 clip-path
        const clipPathValue = `polygon(0 0, 100% 0%, 100% ${(this.scrollDistance <= this.maxScrollDistance) ? 100 - (scrollProgress * 60) : 75}%, 0 100%)`;
        this.header.style.clipPath = clipPathValue;
        
        // 更新背景缩放
        const scaleValue = 1 + (scrollProgress * 0.5);
        this.bg.style.transform = `scale(${scaleValue})`;
        
        // 更新文字透明度
        if (this.title) {
            if (scrollProgress > 0.3) {
                this.title.classList.add('fade-out');
            } else {
                this.title.classList.remove('fade-out');
            }
        }
        
        if (this.subtitle) {
            if (scrollProgress > 0.2) {
                this.subtitle.classList.add('fade-out');
            } else {
                this.subtitle.classList.remove('fade-out');
            }
        }
        
        // 添加视差效果
        if (this.bg) {
            const parallaxY = scrollProgress * 50;
            this.bg.style.transform = `scale(${scaleValue}) translateY(${parallaxY}px)`;
        }
        
        // 更新滚动提示的透明度
        const scrollHint = document.querySelector('.scroll-hint');
        if (scrollHint) {
            if (scrollProgress > 0.1) {
                scrollHint.style.opacity = Math.max(0, 1 - scrollProgress * 2);
            } else {
                scrollHint.style.opacity = 1;
            }
        }
        
        // 当动画完成时，平滑滚动到页面内容
        if (scrollProgress >= 1.0 && this.isInView) {
            this.smoothScrollToContent();
        }
    }
    
    // 重置动画状态
    reset() {
        this.scrollDistance = 0;
        this.updateHeaderClipPath();
    }
    
    // 平滑滚动到页面内容
    smoothScrollToContent() {
        const headerContainer = document.querySelector('.scroll-header-container');
        if (!headerContainer) return;
        
        const headerHeight = headerContainer.offsetHeight;
        const targetScrollTop = headerHeight;
        
        // 使用平滑滚动
        window.scrollTo({
            top: targetScrollTop,
            behavior: 'auto'
        });
    }
    
    // 销毁实例
    destroy() {
        window.removeEventListener('wheel', this.scrollHandler.bind(this));
        if (this.requestId) {
            window.cancelAnimationFrame(this.requestId);
        }
        if (this.observer) {
            this.observer.disconnect();
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    // 检查是否存在滚轮标题容器
    const scrollHeaderContainer = document.querySelector('.scroll-header-container');
    if (scrollHeaderContainer) {
        window.scrollHeaderAnimation = new ScrollHeaderAnimation();
    }
});

// 导出类（如果使用模块系统）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScrollHeaderAnimation;
} 