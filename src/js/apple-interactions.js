/**
 * Apple-style Interactions and Animations
 * Following Apple Human Interface Guidelines
 */

class AppleInteractions {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigationEffects();
        this.setupScrollAnimations();
        this.setupButtonInteractions();
        this.setupParallaxEffects();
        this.setupLazyLoading();
        this.setupAccessibility();
        this.setupPerformanceOptimizations();
    }

    /**
     * Apple-style navigation with blur effect
     */
    setupNavigationEffects() {
        const nav = document.querySelector('.apple-nav');
        if (!nav) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateNavigation = () => {
            const currentScrollY = window.scrollY;
            const scrolled = currentScrollY > 50;

            nav.style.background = scrolled 
                ? 'rgba(255, 255, 255, 0.85)' 
                : 'rgba(255, 255, 255, 0.8)';
            
            nav.style.backdropFilter = scrolled 
                ? 'blur(20px)' 
                : 'blur(10px)';

            nav.style.borderBottomColor = scrolled 
                ? 'rgba(0, 0, 0, 0.1)' 
                : 'rgba(0, 0, 0, 0.05)';

            lastScrollY = currentScrollY;
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateNavigation);
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /**
     * Apple-style scroll animations with stagger
     */
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -10% 0px'
        };

        const animateElement = (element, delay = 0) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0) scale(1)';
            }, delay);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Stagger animation for multiple elements
                    const delay = index * 100; // 100ms delay between elements
                    animateElement(entry.target, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Apply to all animated elements
        const animatedElements = document.querySelectorAll(`
            .feature-card, 
            .solution-card, 
            .case-card, 
            .hero-content > *
        `);

        animatedElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px) scale(0.98)';
            element.style.transition = `
                opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)
            `;
            observer.observe(element);
        });

        // Hero section special animation
        const heroElements = document.querySelectorAll('.hero-content > *');
        heroElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 150}ms`;
            element.classList.add('hero-fade-in');
        });
    }

    /**
     * Apple-style button interactions
     */
    setupButtonInteractions() {
        const buttons = document.querySelectorAll('.apple-button');

        buttons.forEach(button => {
            // Mouse down effect
            button.addEventListener('mousedown', (e) => {
                button.style.transform = 'scale(0.96)';
                button.style.transition = 'transform 0.1s ease-out';
            });

            // Mouse up effect
            button.addEventListener('mouseup', (e) => {
                button.style.transform = 'scale(1)';
                button.style.transition = 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            });

            // Mouse leave effect
            button.addEventListener('mouseleave', (e) => {
                button.style.transform = 'scale(1)';
                button.style.transition = 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            });

            // Apple-style ripple effect for primary buttons
            if (button.classList.contains('button-primary')) {
                button.addEventListener('click', (e) => {
                    const ripple = document.createElement('span');
                    const rect = button.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    const x = e.clientX - rect.left - size / 2;
                    const y = e.clientY - rect.top - size / 2;

                    ripple.style.width = ripple.style.height = size + 'px';
                    ripple.style.left = x + 'px';
                    ripple.style.top = y + 'px';
                    ripple.classList.add('apple-ripple');

                    button.appendChild(ripple);

                    setTimeout(() => {
                        ripple.remove();
                    }, 600);
                });
            }
        });
    }

    /**
     * Subtle parallax effects for Apple-style depth
     */
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.solution-image img, .case-image img');
        let ticking = false;

        const updateParallax = () => {
            const scrolled = window.pageYOffset;

            parallaxElements.forEach((element, index) => {
                const rect = element.getBoundingClientRect();
                const speed = 0.5 + (index % 3) * 0.1; // Vary speed slightly
                
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const yPos = -(scrolled * speed);
                    element.style.transform = `translateY(${yPos}px) scale(1.05)`;
                }
            });

            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
    }

    /**
     * Apple-style lazy loading with blur-up effect
     */
    setupLazyLoading() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        // Apple-style image loading with smooth transition
                        img.style.opacity = '0';
                        img.style.transition = 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.6s ease-out';
                        
                        const handleImageLoad = () => {
                            img.style.opacity = '1';
                            // Remove any existing filter while preserving CSS filters
                            const computedFilter = window.getComputedStyle(img).filter;
                            if (computedFilter && computedFilter !== 'none') {
                                img.style.filter = computedFilter.replace('blur(8px)', '');
                            }
                        };
                        
                        if (img.complete) {
                            handleImageLoad();
                        } else {
                            img.addEventListener('load', handleImageLoad);
                        }
                        
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.1
            });

            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    /**
     * Enhanced accessibility following Apple guidelines
     */
    setupAccessibility() {
        // Keyboard navigation
        const focusableElements = document.querySelectorAll(`
            a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])
        `);

        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.style.outline = '2px solid var(--system-blue)';
                element.style.outlineOffset = '2px';
            });

            element.addEventListener('blur', () => {
                element.style.outline = 'none';
            });
        });

        // Reduced motion support
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (prefersReducedMotion.matches) {
            document.documentElement.style.setProperty('--duration-standard', '0.01ms');
            document.documentElement.style.setProperty('--duration-short', '0.01ms');
        }

        // High contrast support
        const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
        if (prefersHighContrast.matches) {
            document.documentElement.classList.add('high-contrast');
        }

        // Screen reader announcements
        this.setupScreenReaderAnnouncements();
    }

    setupScreenReaderAnnouncements() {
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.style.position = 'absolute';
        announcer.style.left = '-10000px';
        announcer.style.width = '1px';
        announcer.style.height = '1px';
        announcer.style.overflow = 'hidden';
        document.body.appendChild(announcer);

        // Announce section changes
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const title = entry.target.querySelector('h2');
                    if (title) {
                        announcer.textContent = `正在查看: ${title.textContent}`;
                    }
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('section').forEach(section => {
            sectionObserver.observe(section);
        });
    }

    /**
     * Performance optimizations following Apple standards
     */
    setupPerformanceOptimizations() {
        // Preload critical resources
        this.preloadCriticalResources();

        // Optimize scroll performance
        this.optimizeScrollPerformance();

        // Memory management
        this.setupMemoryManagement();
    }

    preloadCriticalResources() {
        const criticalImages = [
            'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=600',
            'https://images.pexels.com/photos/159866/books-book-pages-read-literature-159866.jpeg?auto=compress&cs=tinysrgb&w=600'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    optimizeScrollPerformance() {
        // Use passive event listeners for scroll events
        const scrollElements = document.querySelectorAll('[data-scroll]');
        
        scrollElements.forEach(element => {
            element.addEventListener('scroll', this.handleScroll, { passive: true });
        });

        // Throttle resize events
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.handleResize();
            }, 100);
        });
    }

    setupMemoryManagement() {
        // Clean up observers when page unloads
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
    }

    handleScroll() {
        // Optimized scroll handler
    }

    handleResize() {
        // Optimized resize handler
        this.recalculateAnimations();
    }

    recalculateAnimations() {
        // Recalculate animation parameters on resize
        const cards = document.querySelectorAll('.feature-card, .solution-card, .case-card');
        cards.forEach(card => {
            card.style.transform = 'none';
            // Force reflow
            card.offsetHeight;
            // Reapply animations if needed
        });
    }

    cleanup() {
        // Remove event listeners and observers to prevent memory leaks
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
        
        if (this.imageObserver) {
            this.imageObserver.disconnect();
        }
    }
}

// CSS for animations
const appleStyles = document.createElement('style');
appleStyles.textContent = `
    @keyframes hero-fade-in {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .hero-fade-in {
        animation: hero-fade-in 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
    }

    .apple-ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: apple-ripple-animation 0.6s linear;
        pointer-events: none;
    }

    @keyframes apple-ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    .high-contrast {
        --system-blue: #0080FF;
        --label-secondary: #000000;
        --system-gray-5: #CCCCCC;
    }

    @media (prefers-reduced-motion: reduce) {
        * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
        }
        
        .hero-fade-in {
            animation: none;
            opacity: 1;
            transform: none;
        }
    }

    /* Performance optimizations */
    .feature-card,
    .solution-card,
    .case-card {
        will-change: transform, opacity;
    }

    .feature-card:hover,
    .solution-card:hover,
    .case-card:hover {
        will-change: auto;
    }
`;

document.head.appendChild(appleStyles);

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new AppleInteractions();
    });
} else {
    new AppleInteractions();
}