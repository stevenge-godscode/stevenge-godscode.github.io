class ImageViewer {
    constructor() {
        this.currentIndex = 0;
        this.images = [];
        this.isOpen = false;
        this.init();
    }

    init() {
        this.createViewer();
        this.bindEvents();
        this.collectImages();
    }

    createViewer() {
        const viewer = document.createElement('div');
        viewer.className = 'image-viewer';
        viewer.innerHTML = `
            <div class="image-viewer-backdrop"></div>
            <div class="image-viewer-container">
                <button class="image-viewer-close" aria-label="关闭">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
                <button class="image-viewer-prev" aria-label="上一张">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <button class="image-viewer-next" aria-label="下一张">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18l6-6-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
                <div class="image-viewer-content">
                    <img class="image-viewer-image" alt="">
                    <div class="image-viewer-info">
                        <span class="image-viewer-counter"></span>
                        <span class="image-viewer-title"></span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(viewer);
        this.viewer = viewer;
        this.backdrop = viewer.querySelector('.image-viewer-backdrop');
        this.container = viewer.querySelector('.image-viewer-container');
        this.image = viewer.querySelector('.image-viewer-image');
        this.closeBtn = viewer.querySelector('.image-viewer-close');
        this.prevBtn = viewer.querySelector('.image-viewer-prev');
        this.nextBtn = viewer.querySelector('.image-viewer-next');
        this.counter = viewer.querySelector('.image-viewer-counter');
        this.title = viewer.querySelector('.image-viewer-title');
    }

    bindEvents() {
        this.closeBtn.addEventListener('click', () => this.close());
        this.backdrop.addEventListener('click', () => this.close());
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());

        document.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;
            
            switch (e.key) {
                case 'Escape':
                    this.close();
                    break;
                case 'ArrowLeft':
                    this.prev();
                    break;
                case 'ArrowRight':
                    this.next();
                    break;
            }
        });

        this.image.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    collectImages() {
        const clickableImages = document.querySelectorAll('img[src*="src/assets/images"]:not([src*="logo"]):not([src*="icon"])');
        this.images = Array.from(clickableImages).map(img => {
            // 如果是-small.png结尾，替换为-full.png
            let fullSrc = img.src;
            if (img.src.endsWith('-small.png')) {
                fullSrc = img.src.replace('-small.png', '-full.png');
            }
            
            return {
                src: fullSrc,
                thumbnailSrc: img.src,
                alt: img.alt,
                element: img
            };
        });

        clickableImages.forEach((img, index) => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => this.open(index));
        });
    }

    open(index = 0) {
        if (this.images.length === 0) return;
        
        this.currentIndex = Math.max(0, Math.min(index, this.images.length - 1));
        this.isOpen = true;
        
        this.updateImage();
        this.viewer.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        requestAnimationFrame(() => {
            this.container.classList.add('visible');
        });
    }

    close() {
        this.isOpen = false;
        this.container.classList.remove('visible');
        
        setTimeout(() => {
            this.viewer.classList.remove('active');
            document.body.style.overflow = '';
        }, 300);
    }

    prev() {
        if (this.images.length <= 1) return;
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateImage();
    }

    next() {
        if (this.images.length <= 1) return;
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateImage();
    }

    updateImage() {
        const currentImage = this.images[this.currentIndex];
        if (!currentImage) return;

        this.image.src = currentImage.src;
        this.image.alt = currentImage.alt;
        this.title.textContent = currentImage.alt;
        this.counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;

        const hasPrev = this.images.length > 1;
        const hasNext = this.images.length > 1;
        
        this.prevBtn.style.display = hasPrev ? 'flex' : 'none';
        this.nextBtn.style.display = hasNext ? 'flex' : 'none';
    }

    refresh() {
        this.collectImages();
    }
}

window.ImageViewer = ImageViewer;

document.addEventListener('DOMContentLoaded', () => {
    window.imageViewer = new ImageViewer();
});