// ========================================
// Service Page JavaScript
// ========================================

// Custom Cursor
class CustomCursor {
    constructor() {
        this.cursor = document.querySelector('.cursor');
        this.cursorDot = document.querySelector('.cursor-dot');
        this.cursorCircle = document.querySelector('.cursor-circle');
        this.cursorText = document.querySelector('.cursor-text');

        if (!this.cursor) return;

        this.pos = { x: 0, y: 0 };
        this.mouse = { x: 0, y: 0 };

        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        const hoverElements = document.querySelectorAll('a, button, .magnetic');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hover');
                if (this.cursorText) this.cursorText.textContent = 'CLICK';
            });
            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hover');
                if (this.cursorText) this.cursorText.textContent = 'EXPLORE';
            });
        });

        this.animate();
    }

    animate() {
        this.pos.x += (this.mouse.x - this.pos.x) * 0.15;
        this.pos.y += (this.mouse.y - this.pos.y) * 0.15;

        if (this.cursorDot) {
            this.cursorDot.style.left = `${this.mouse.x}px`;
            this.cursorDot.style.top = `${this.mouse.y}px`;
        }

        if (this.cursorCircle) {
            this.cursorCircle.style.left = `${this.pos.x}px`;
            this.cursorCircle.style.top = `${this.pos.y}px`;
        }

        if (this.cursorText) {
            this.cursorText.style.left = `${this.pos.x}px`;
            this.cursorText.style.top = `${this.pos.y}px`;
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Magnetic Buttons
class MagneticButtons {
    constructor() {
        this.buttons = document.querySelectorAll('.magnetic');
        this.init();
    }

    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => this.onMouseMove(e, btn));
            btn.addEventListener('mouseleave', (e) => this.onMouseLeave(e, btn));
        });
    }

    onMouseMove(e, btn) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(btn, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.3,
            ease: 'power2.out'
        });
    }

    onMouseLeave(e, btn) {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)'
        });
    }
}

// Service Page Canvas
class ServiceCanvas {
    constructor() {
        this.canvas = document.getElementById('service-canvas');
        if (!this.canvas) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });

        this.particles = null;
        this.mouse = { x: 0, y: 0 };
        this.time = 0;

        // Detect theme color
        this.themeColor = this.getThemeColor();

        this.init();
    }

    getThemeColor() {
        const hero = document.querySelector('.service-hero');
        if (hero.classList.contains('interactive-theme')) return 0xff00ff;
        if (hero.classList.contains('yellow-theme')) return 0xffff00;
        if (hero.classList.contains('green-theme')) return 0x00ff88;
        return 0x00f5ff;
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.camera.position.z = 30;

        this.createGrid();
        this.createParticles();
        this.addEventListeners();
        this.animate();
    }

    createGrid() {
        const gridSize = 100;
        const gridDivisions = 30;
        const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, this.themeColor, this.themeColor);
        gridHelper.rotation.x = Math.PI / 2;
        gridHelper.position.z = -20;
        gridHelper.material.opacity = 0.08;
        gridHelper.material.transparent = true;
        this.scene.add(gridHelper);
        this.grid = gridHelper;
    }

    createParticles() {
        const particleCount = 800;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const color = new THREE.Color(this.themeColor);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 80;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 40;

            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.15,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);

        // Create floating shapes
        this.createFloatingShapes();
    }

    createFloatingShapes() {
        const shapeMaterial = new THREE.MeshBasicMaterial({
            color: this.themeColor,
            wireframe: true,
            transparent: true,
            opacity: 0.15
        });

        // Icosahedron
        const icosaGeo = new THREE.IcosahedronGeometry(5, 1);
        this.icosa = new THREE.Mesh(icosaGeo, shapeMaterial);
        this.icosa.position.set(-20, 10, -10);
        this.scene.add(this.icosa);

        // Octahedron
        const octaGeo = new THREE.OctahedronGeometry(4);
        this.octa = new THREE.Mesh(octaGeo, shapeMaterial.clone());
        this.octa.position.set(25, -8, -5);
        this.scene.add(this.octa);

        // Torus
        const torusGeo = new THREE.TorusGeometry(3, 1, 16, 50);
        this.torus = new THREE.Mesh(torusGeo, shapeMaterial.clone());
        this.torus.position.set(-15, -15, -8);
        this.scene.add(this.torus);
    }

    addEventListeners() {
        window.addEventListener('resize', () => this.onResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseMove(e) {
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.time += 0.005;

        if (this.particles) {
            this.particles.rotation.y = this.time * 0.1;
            this.particles.rotation.x = Math.sin(this.time) * 0.05;
        }

        if (this.grid) {
            this.grid.rotation.z = Math.sin(this.time * 0.5) * 0.03;
        }

        if (this.icosa) {
            this.icosa.rotation.x += 0.005;
            this.icosa.rotation.y += 0.008;
            this.icosa.position.y = 10 + Math.sin(this.time * 2) * 3;
        }

        if (this.octa) {
            this.octa.rotation.x += 0.008;
            this.octa.rotation.z += 0.005;
            this.octa.position.y = -8 + Math.cos(this.time * 1.5) * 4;
        }

        if (this.torus) {
            this.torus.rotation.x += 0.01;
            this.torus.rotation.y += 0.005;
        }

        // Camera follows mouse
        this.camera.position.x += (this.mouse.x * 5 - this.camera.position.x) * 0.03;
        this.camera.position.y += (this.mouse.y * 3 - this.camera.position.y) * 0.03;
        this.camera.lookAt(0, 0, 0);

        this.renderer.render(this.scene, this.camera);
    }
}

// Page Animations
class PageAnimations {
    constructor() {
        this.init();
    }

    init() {
        // Hero animations
        gsap.from('.service-breadcrumb', {
            opacity: 0,
            y: -20,
            duration: 1,
            delay: 0.3
        });

        gsap.from('.service-title .title-main', {
            opacity: 0,
            y: 50,
            duration: 1,
            delay: 0.5
        });

        gsap.from('.service-title .title-sub', {
            opacity: 0,
            y: 50,
            duration: 1,
            delay: 0.7
        });

        gsap.from('.service-tagline', {
            opacity: 0,
            y: 30,
            duration: 1,
            delay: 0.9
        });

        gsap.from('.service-description', {
            opacity: 0,
            y: 30,
            duration: 1,
            delay: 1.1
        });

        gsap.from('.scroll-indicator', {
            opacity: 0,
            y: 20,
            duration: 1,
            delay: 1.3
        });

        // Detail items
        const detailItems = document.querySelectorAll('.detail-item');
        detailItems.forEach((item, i) => {
            gsap.from(item, {
                opacity: 0,
                y: 60,
                duration: 0.8,
                delay: i * 0.15,
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%'
                }
            });
        });

        // Tech items
        gsap.from('.tech-item', {
            opacity: 0,
            scale: 0.8,
            duration: 0.5,
            stagger: 0.1,
            scrollTrigger: {
                trigger: '.tech-stack',
                start: 'top 80%'
            }
        });

        // CTA
        gsap.from('.cta-content', {
            opacity: 0,
            y: 50,
            duration: 1,
            scrollTrigger: {
                trigger: '.service-cta',
                start: 'top 75%'
            }
        });

        // Other services
        gsap.from('.other-item', {
            opacity: 0,
            x: -30,
            duration: 0.6,
            stagger: 0.1,
            scrollTrigger: {
                trigger: '.other-services',
                start: 'top 80%'
            }
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new CustomCursor();
    new MagneticButtons();
    new ServiceCanvas();
    
    // Wait for GSAP to load
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        new PageAnimations();
    } else {
        // Fallback: simple fade in
        document.body.style.opacity = 1;
    }
});

// Register ScrollTrigger plugin if GSAP is available
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

