// ========================================
// NEXUS CREATIVE - Main JavaScript v2
// ========================================

// ========================================
// Preloader
// ========================================
class Preloader {
    constructor() {
        this.preloader = document.getElementById('preloader');
        this.loaderLine = document.querySelector('.loader-line');
        this.loaderPercent = document.querySelector('.loader-percent');
        this.progress = 0;
        this.targetProgress = 0;
    }

    init() {
        this.simulateLoading();
    }

    simulateLoading() {
        const interval = setInterval(() => {
            this.targetProgress += Math.random() * 20;
            if (this.targetProgress >= 100) {
                this.targetProgress = 100;
                clearInterval(interval);
                setTimeout(() => this.hide(), 500);
            }
        }, 150);
        this.updateProgress();
    }

    updateProgress() {
        const update = () => {
            this.progress += (this.targetProgress - this.progress) * 0.1;
            this.loaderPercent.textContent = Math.round(this.progress);
            this.loaderLine.style.width = `${this.progress}%`;
            if (this.progress < 99.9) {
                requestAnimationFrame(update);
            }
        };
        update();
    }

    hide() {
        gsap.to(this.preloader, {
            opacity: 0,
            duration: 0.8,
            ease: 'power3.inOut',
            onComplete: () => {
                this.preloader.style.display = 'none';
                initAnimations();
            }
        });
    }
}

// ========================================
// Three.js 3D Grid Background
// ========================================
class HeroCanvas {
    constructor() {
        this.canvas = document.getElementById('hero-canvas');
        if (!this.canvas) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });

        this.particles = null;
        this.grid = null;
        this.mouse = { x: 0, y: 0 };
        this.time = 0;

        this.init();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.camera.position.z = 50;

        this.createGrid();
        this.createParticles();
        this.addEventListeners();
        this.animate();
    }

    createGrid() {
        const gridHelper = new THREE.GridHelper(200, 50, 0x00f5ff, 0x00f5ff);
        gridHelper.rotation.x = Math.PI / 2;
        gridHelper.position.z = -30;
        gridHelper.material.opacity = 0.1;
        gridHelper.material.transparent = true;
        this.scene.add(gridHelper);
        this.grid = gridHelper;
    }

    createParticles() {
        const particleCount = 2000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        const colorPalette = [
            new THREE.Color(0x00f5ff),
            new THREE.Color(0xff00ff),
            new THREE.Color(0xffff00),
        ];

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 150;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 150;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 100;

            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            sizes[i] = Math.random() * 2 + 0.5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                mouse: { value: new THREE.Vector2(0, 0) },
                pixelRatio: { value: this.renderer.getPixelRatio() }
            },
            vertexShader: `
                attribute float size;
                varying vec3 vColor;
                uniform float time;
                uniform vec2 mouse;
                uniform float pixelRatio;

                void main() {
                    vColor = color;
                    vec3 pos = position;
                    
                    pos.x += sin(time * 0.3 + position.y * 0.05) * 3.0;
                    pos.y += cos(time * 0.2 + position.x * 0.05) * 3.0;
                    pos.z += sin(time * 0.25 + position.x * 0.03 + position.y * 0.03) * 5.0;
                    
                    float dist = distance(pos.xy, mouse * 60.0);
                    pos.z += smoothstep(40.0, 0.0, dist) * 15.0;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_Position = projectionMatrix * mvPosition;
                    gl_PointSize = size * pixelRatio * (50.0 / -mvPosition.z);
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;
                    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
                    gl_FragColor = vec4(vColor, alpha * 0.8);
                }
            `,
            transparent: true,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);

        // Connection lines
        this.createConnections();
    }

    createConnections() {
        const lineGeometry = new THREE.BufferGeometry();
        const linePositions = [];
        
        for (let i = 0; i < 80; i++) {
            const x1 = (Math.random() - 0.5) * 100;
            const y1 = (Math.random() - 0.5) * 100;
            const z1 = (Math.random() - 0.5) * 50;
            const x2 = x1 + (Math.random() - 0.5) * 40;
            const y2 = y1 + (Math.random() - 0.5) * 40;
            const z2 = z1 + (Math.random() - 0.5) * 25;
            linePositions.push(x1, y1, z1, x2, y2, z2);
        }

        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x00f5ff,
            transparent: true,
            opacity: 0.08
        });

        this.lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        this.scene.add(this.lines);
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
        this.time += 0.01;

        if (this.particles) {
            this.particles.material.uniforms.time.value = this.time;
            this.particles.material.uniforms.mouse.value.set(this.mouse.x, this.mouse.y);
            this.particles.rotation.y = this.time * 0.03;
        }

        if (this.grid) {
            this.grid.position.z = -30 + Math.sin(this.time * 0.5) * 5;
            this.grid.rotation.z = this.mouse.x * 0.1;
        }

        if (this.lines) {
            this.lines.rotation.y = this.time * 0.02;
            this.lines.rotation.z = Math.sin(this.time * 0.3) * 0.05;
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// ========================================
// Custom Cursor - Enhanced
// ========================================
class CustomCursor {
    constructor() {
        this.cursor = document.querySelector('.cursor');
        this.cursorDot = document.querySelector('.cursor-dot');
        this.cursorCircle = document.querySelector('.cursor-circle');
        this.cursorText = document.querySelector('.cursor-text');
        this.spotlight = document.querySelector('.spotlight');

        if (!this.cursor) return;

        this.pos = { x: 0, y: 0 };
        this.mouse = { x: 0, y: 0 };
        this.currentText = 'EXPLORE';

        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            
            if (this.spotlight) {
                this.spotlight.style.background = `radial-gradient(circle at ${e.clientX}px ${e.clientY}px, rgba(0, 245, 255, 0.08), transparent 350px)`;
            }
        });

        // Hover effects with different cursor states
        const hoverElements = document.querySelectorAll('a, button, .magnetic');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hover');
                this.setCursorText('CLICK');
            });
            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hover');
                this.setCursorText('EXPLORE');
            });
        });

        // View cursor for projects/services
        const viewElements = document.querySelectorAll('[data-cursor="view"]');
        viewElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('view');
                this.setCursorText('VIEW');
            });
            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('view');
                this.setCursorText('EXPLORE');
            });
        });

        // Drag cursor for carousels
        const dragElements = document.querySelectorAll('[data-cursor="drag"]');
        dragElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('drag');
                this.setCursorText('DRAG');
            });
            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('drag');
                this.setCursorText('EXPLORE');
            });
        });

        this.animate();
    }

    setCursorText(text) {
        if (this.cursorText) {
            this.cursorText.textContent = text;
        }
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

// ========================================
// Magnetic Buttons
// ========================================
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
            x: x * 0.35,
            y: y * 0.35,
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

// ========================================
// Scroll Progress
// ========================================
class ScrollProgressBar {
    constructor() {
        this.progressBar = document.querySelector('.scroll-progress');
        if (!this.progressBar) return;
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.updateProgress());
    }

    updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollTop / docHeight;
        
        gsap.to(this.progressBar, {
            scaleX: progress,
            duration: 0.1,
            ease: 'none'
        });
    }
}

// ========================================
// Navigation
// ========================================
class Navigation {
    constructor() {
        this.nav = document.querySelector('.nav');
        this.lastScroll = 0;
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.onScroll());
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    gsap.to(window, {
                        scrollTo: { y: target, offsetY: 80 },
                        duration: 1.2,
                        ease: 'power3.inOut'
                    });
                }
            });
        });
    }

    onScroll() {
        const currentScroll = window.scrollY;

        if (currentScroll > this.lastScroll && currentScroll > 100) {
            this.nav.classList.add('hidden');
        } else {
            this.nav.classList.remove('hidden');
        }

        this.lastScroll = currentScroll;
    }
}

// ========================================
// Hero Animations
// ========================================
function initHeroAnimations() {
    const tl = gsap.timeline({ delay: 0.3 });

    tl.to('.hero-subtitle', {
        opacity: 1,
        duration: 1,
        ease: 'power3.out'
    });

    tl.to('.hero-title .word', {
        y: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power4.out'
    }, '-=0.6');

    tl.to('.hero-description', {
        opacity: 1,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.6');

    tl.to('.hero-cta', {
        opacity: 1,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.6');

    tl.to('.hero-scroll', {
        opacity: 1,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.6');

    tl.to('.hero-stats', {
        opacity: 1,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.6');

    // Animate stat numbers
    document.querySelectorAll('.stat-number').forEach(stat => {
        const target = parseInt(stat.dataset.target);
        gsap.to(stat, {
            textContent: target,
            duration: 2.5,
            ease: 'power2.out',
            snap: { textContent: 1 },
            scrollTrigger: {
                trigger: stat,
                start: 'top 85%'
            }
        });
    });
}

// ========================================
// About Section Animations
// ========================================
function initAboutAnimations() {
    gsap.from('.about .section-header', {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
            trigger: '.about',
            start: 'top 75%'
        }
    });

    gsap.utils.toArray('.reveal-text').forEach(text => {
        gsap.from(text, {
            opacity: 0,
            y: 40,
            duration: 1,
            scrollTrigger: {
                trigger: text,
                start: 'top 85%'
            }
        });
    });

    // Skill bars
    gsap.utils.toArray('.skill-progress').forEach(bar => {
        gsap.to(bar, {
            width: `${bar.dataset.progress}%`,
            duration: 1.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: bar,
                start: 'top 90%'
            }
        });
    });

    // Visual frame
    gsap.from('.visual-frame', {
        scale: 0.85,
        opacity: 0,
        rotation: -5,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.about-right',
            start: 'top 75%'
        }
    });

    // Year counter
    const yearCounter = document.querySelector('.v-number');
    if (yearCounter) {
        const target = parseInt(yearCounter.dataset.target);
        gsap.to(yearCounter, {
            textContent: target,
            duration: 2,
            ease: 'power2.out',
            snap: { textContent: 1 },
            scrollTrigger: {
                trigger: yearCounter,
                start: 'top 80%'
            }
        });
    }

    // Tagline
    gsap.from('.tagline-text', {
        opacity: 0,
        y: 30,
        duration: 1,
        scrollTrigger: {
            trigger: '.about-tagline',
            start: 'top 85%'
        }
    });
}

// ========================================
// Services Section - GAME-STYLE 3D Animation
// ========================================
class ServicesCanvas {
    constructor() {
        this.canvas = document.getElementById('services-canvas');
        if (!this.canvas) return;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });

        this.objects = [];
        this.particles = null;
        this.rings = [];
        this.trails = [];
        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };
        this.prevMouse = { x: 0, y: 0 };
        this.mouseVelocity = { x: 0, y: 0 };
        this.mouseTrail = [];
        this.time = 0;
        this.isVisible = true;
        
        // Mouse interaction settings
        this.attractionRadius = 15;
        this.repulsionRadius = 8;
        this.mouseInfluence = 0;
        
        // Vertical flow settings - follows cursor height smoothly
        this.flowY = 0;
        this.targetFlowY = 0;
        this.sectionTop = 0;
        this.sectionHeight = 0;
        this.scrollOffsetY = 0;  // Scroll-based offset
        this.cameraTargetY = 0;  // Camera Y target position
        
        // ★★★ CLICK EXPLOSION SETTINGS ★★★
        this.explosionActive = false;
        this.explosionForce = 0;
        this.explosionOrigin = { x: 0, y: 0 };
        this.cameraShake = { x: 0, y: 0 };
        this.shockwaves = [];
        this.colorFlash = 0;

        this.init();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.camera.position.z = 50;  // Further back to see more

        // Create all elements
        this.createParticleField();
        this.createFloatingGeometry();
        this.createNeonRings();
        this.createEnergyLines();
        this.createDataStream();
        this.createMouseTrailLine();

        // Event listeners
        window.addEventListener('resize', () => this.onResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('scroll', () => this.onScroll());
        
        // ★★★ CLICK EVENT - Explosive Reaction ★★★
        // Listen on document level for ALL clicks in services area
        document.addEventListener('click', (e) => {
            const section = document.getElementById('services');
            if (!section) return;
            const rect = section.getBoundingClientRect();
            // Check if click is within services section (regardless of visibility)
            if (e.clientY >= rect.top && e.clientY <= rect.bottom &&
                e.clientX >= rect.left && e.clientX <= rect.right) {
                console.log('💥 CLICK in services! Y:', e.clientY, 'rect:', rect.top, '-', rect.bottom);
                this.isVisible = true;  // Force visible for explosion
                this.onExplosiveClick(e);
            }
        });
        
        // Also capture mousedown for more responsive feel
        document.addEventListener('mousedown', (e) => {
            const section = document.getElementById('services');
            if (!section) return;
            const rect = section.getBoundingClientRect();
            if (e.clientY >= rect.top && e.clientY <= rect.bottom &&
                e.clientX >= rect.left && e.clientX <= rect.right) {
                this.isVisible = true;  // Force visible for explosion
                this.onExplosiveClick(e);
            }
        });

        // Get section position
        this.updateSectionBounds();
        
        // Visibility observer for performance
        this.setupVisibilityObserver();

        this.animate();
    }

    // PARTICLE FIELD - Gentle flowing particles with story
    createParticleField() {
        const particleCount = 1800;  // Slightly less for cleaner look
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const velocities = new Float32Array(particleCount * 3);
        const phases = new Float32Array(particleCount);  // Individual animation phase

        // ★ More subtle, harmonious color palette
        const colorPalette = [
            new THREE.Color(0x00f5ff), // Cyan (primary)
            new THREE.Color(0x0088cc), // Deep cyan
            new THREE.Color(0x00aa88), // Teal
            new THREE.Color(0x6666ff), // Soft purple
        ];

        for (let i = 0; i < particleCount; i++) {
            // Spread particles across FULL section height
            positions[i * 3] = (Math.random() - 0.5) * 150;
            positions[i * 3 + 1] = 80 - Math.random() * 350;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 80 - 10;

            // ★ Slower, more organic velocities
            velocities[i * 3] = (Math.random() - 0.5) * 0.008;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.005 - 0.003;  // Slight downward drift
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.006;

            // ★ Individual phase for breathing effect
            phases[i] = Math.random() * Math.PI * 2;

            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            // ★ More varied sizes for depth
            sizes[i] = Math.random() * 2.5 + 0.5;
        }
        
        geometry.phases = phases;

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.velocities = velocities;

        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                pixelRatio: { value: this.renderer.getPixelRatio() }
            },
            vertexShader: `
                attribute float size;
                varying vec3 vColor;
                uniform float time;
                uniform float pixelRatio;

                void main() {
                    vColor = color;
                    vec3 pos = position;
                    
                    // Pulsing effect
                    float pulse = sin(time + length(position) * 0.1) * 0.5 + 0.5;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                    gl_Position = projectionMatrix * mvPosition;
                    gl_PointSize = size * pixelRatio * (50.0 / -mvPosition.z) * (0.8 + pulse * 0.6);
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                void main() {
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;
                    
                    float glow = 1.0 - smoothstep(0.0, 0.5, dist);
                    vec3 finalColor = vColor * glow * 2.5;
                    gl_FragColor = vec4(finalColor, glow);
                }
            `,
            transparent: true,
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    // FLOATING GEOMETRY - Organic, breathing objects with story
    createFloatingGeometry() {
        // ★ Fewer, more meaningful geometries
        const geometries = [
            new THREE.IcosahedronGeometry(2, 0),
            new THREE.OctahedronGeometry(2.5, 0),
            new THREE.TetrahedronGeometry(2, 0),
            new THREE.DodecahedronGeometry(1.8, 0),
        ];

        // ★ Subtle, harmonious colors
        const colors = [0x00f5ff, 0x0088cc, 0x00aa88, 0x4466ff];

        // ★ Fewer objects for cleaner composition
        for (let i = 0; i < 25; i++) {
            const geo = geometries[Math.floor(Math.random() * geometries.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];

            const material = new THREE.MeshBasicMaterial({
                color: color,
                wireframe: true,
                transparent: true,
                opacity: 0.5  // ★ More subtle
            });

            const mesh = new THREE.Mesh(geo.clone(), material);

            // Position spread across section
            mesh.position.set(
                (Math.random() - 0.5) * 100,
                50 - Math.random() * 250,
                (Math.random() - 0.5) * 40 - 10
            );

            // ★ Slower, more organic rotation - like breathing
            mesh.userData = {
                rotationSpeed: {
                    x: (Math.random() - 0.5) * 0.005,  // Much slower
                    y: (Math.random() - 0.5) * 0.008,
                    z: (Math.random() - 0.5) * 0.003
                },
                floatSpeed: Math.random() * 0.5 + 0.3,  // Slower float
                floatAmplitude: Math.random() * 2 + 1,  // Gentler movement
                originalY: mesh.position.y,
                originalScale: 0.8 + Math.random() * 0.4,
                phase: Math.random() * Math.PI * 2,
                breathSpeed: 0.3 + Math.random() * 0.2,  // ★ Breathing animation
                baseOpacity: 0.4 + Math.random() * 0.2
            };

            this.objects.push(mesh);
            this.scene.add(mesh);
        }
    }

    // NEON RINGS - Gentle pulsing circles, like heartbeat
    createNeonRings() {
        // ★ Harmonious color palette
        const ringColors = [0x00f5ff, 0x0088cc, 0x00aa88];

        // ★ Fewer rings for cleaner look
        for (let i = 0; i < 8; i++) {
            const radius = 12 + Math.random() * 20;
            const geometry = new THREE.RingGeometry(radius - 0.1, radius, 64);
            const material = new THREE.MeshBasicMaterial({
                color: ringColors[i % ringColors.length],
                transparent: true,
                opacity: 0.15,  // ★ More subtle
                side: THREE.DoubleSide
            });

            const ring = new THREE.Mesh(geometry, material);
            ring.position.x = (Math.random() - 0.5) * 50;
            ring.position.y = 50 - i * 35;  // Spread across section
            ring.position.z = -30 - Math.random() * 15;
            ring.rotation.x = Math.random() * Math.PI;
            ring.rotation.y = Math.random() * Math.PI;
            
            // ★ Slower, more organic motion
            ring.userData = {
                rotationSpeed: 0.001 * (i % 2 === 0 ? 1 : -1),  // Much slower
                pulseSpeed: 0.3 + (i % 3) * 0.1,  // Slower pulse
                baseOpacity: 0.12 + Math.random() * 0.08,
                originalY: ring.position.y,
                phase: Math.random() * Math.PI * 2,
                breathCycle: 3 + Math.random() * 2  // ★ Breathing cycle duration
            };

            this.rings.push(ring);
            this.scene.add(ring);
        }
    }

    // ★★★ ENERGY LINES - Beautiful flowing waves like aurora ★★★
    createEnergyLines() {
        const lineCount = 25;  // Elegant number of lines
        
        for (let i = 0; i < lineCount; i++) {
            // ★★★ Create smooth wave line with many points ★★★
            const pointCount = 100;  // More points = smoother curves
            const points = [];
            
            const startX = (Math.random() - 0.5) * 120;
            const startY = 100 + Math.random() * 50;
            const startZ = (Math.random() - 0.5) * 40 - 20;
            
            // Wave parameters - each line has unique wave pattern
            const waveAmplitude = 3 + Math.random() * 8;  // Wave height
            const waveFrequency = 0.05 + Math.random() * 0.1;  // Wave frequency
            const secondaryWave = 1 + Math.random() * 3;  // Secondary ripple
            const secondaryFreq = 0.15 + Math.random() * 0.2;
            
            for (let j = 0; j < pointCount; j++) {
                const t = j / pointCount;
                
                // ★★★ Beautiful multi-layer wave effect ★★★
                const primaryWave = Math.sin(j * waveFrequency) * waveAmplitude;
                const secondary = Math.sin(j * secondaryFreq) * secondaryWave;
                const microWave = Math.sin(j * 0.3) * 0.5;  // Subtle micro-ripple
                
                points.push(new THREE.Vector3(
                    startX + primaryWave + secondary + microWave,
                    startY - j * 3.5,  // Flowing downward
                    startZ + Math.cos(j * 0.08) * 2  // Gentle Z movement
                ));
            }
            
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            
            // ★★★ Beautiful gradient colors ★★★
            const colorPalette = [
                { h: 0.52, s: 1.0, l: 0.5 },  // Cyan
                { h: 0.55, s: 0.9, l: 0.45 }, // Teal
                { h: 0.58, s: 0.8, l: 0.4 },  // Blue-green
                { h: 0.62, s: 0.7, l: 0.5 },  // Blue
                { h: 0.85, s: 0.6, l: 0.5 },  // Magenta hint
            ];
            const colorChoice = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            const color = new THREE.Color().setHSL(colorChoice.h, colorChoice.s, colorChoice.l);
            
            const material = new THREE.LineBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.3,
                blending: THREE.AdditiveBlending  // Glowing effect
            });
            
            const line = new THREE.Line(geometry, material);
            
            // ★★★ Store wave parameters for animation ★★★
            line.userData = {
                startX: startX,
                startY: startY,
                startZ: startZ,
                waveAmplitude: waveAmplitude,
                waveFrequency: waveFrequency,
                secondaryWave: secondaryWave,
                secondaryFreq: secondaryFreq,
                speed: 0.3 + Math.random() * 0.5,  // Animation speed
                phase: Math.random() * Math.PI * 2,  // Phase offset
                baseOpacity: 0.2 + Math.random() * 0.15,
                pointCount: pointCount
            };
            
            this.trails.push(line);
            this.scene.add(line);
        }
    }

    // MOUSE TRAIL LINE - Glowing trail following cursor
    createMouseTrailLine() {
        const trailLength = 100;
        const trailGeometry = new THREE.BufferGeometry();
        const trailPositions = new Float32Array(trailLength * 3);
        const trailColors = new Float32Array(trailLength * 3);
        
        for (let i = 0; i < trailLength; i++) {
            trailPositions[i * 3] = 0;
            trailPositions[i * 3 + 1] = 0;
            trailPositions[i * 3 + 2] = 5;
            
            const t = i / trailLength;
            trailColors[i * 3] = 0;
            trailColors[i * 3 + 1] = 0.96 * (1 - t);
            trailColors[i * 3 + 2] = 1 * (1 - t);
        }
        
        trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
        trailGeometry.setAttribute('color', new THREE.BufferAttribute(trailColors, 3));
        
        const trailMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            linewidth: 2
        });
        
        this.mouseTrailLine = new THREE.Line(trailGeometry, trailMaterial);
        this.mouseTrailPositions = [];
        for (let i = 0; i < trailLength; i++) {
            this.mouseTrailPositions.push({ x: 0, y: 0, z: 5 });
        }
        this.scene.add(this.mouseTrailLine);
    }

    // DATA STREAM - Matrix-like falling data
    createDataStream() {
        const streamCount = 100;  // More streams
        const streamGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(streamCount * 6);
        const colors = new Float32Array(streamCount * 6);

        const streamColors = [0x00f5ff, 0xff00ff, 0xffff00, 0x00ff88];

        for (let i = 0; i < streamCount; i++) {
            const x = (Math.random() - 0.5) * 140;
            const z = (Math.random() - 0.5) * 50 - 15;
            // Spread Y across full section (1~4 services)
            const y = 100 - Math.random() * 400;  // +100 to -300
            const length = Math.random() * 15 + 8;

            positions[i * 6] = x;
            positions[i * 6 + 1] = y;
            positions[i * 6 + 2] = z;
            positions[i * 6 + 3] = x;
            positions[i * 6 + 4] = y - length;
            positions[i * 6 + 5] = z;

            // Random gradient color
            const c = new THREE.Color(streamColors[Math.floor(Math.random() * streamColors.length)]);
            colors[i * 6] = c.r;
            colors[i * 6 + 1] = c.g;
            colors[i * 6 + 2] = c.b;
            colors[i * 6 + 3] = c.r * 0.2;
            colors[i * 6 + 4] = c.g * 0.2;
            colors[i * 6 + 5] = c.b * 0.2;
        }

        streamGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        streamGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const streamMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending
        });

        this.dataStream = new THREE.LineSegments(streamGeometry, streamMaterial);
        this.scene.add(this.dataStream);
    }

    setupVisibilityObserver() {
        // ★★★ GRADIENT FADE TRANSITION ★★★
        // Use multiple thresholds for smoother fade
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const ratio = entry.intersectionRatio;
                
                if (entry.isIntersecting) {
                    this.isVisible = true;
                    this.canvas.classList.remove('fade-out');
                    this.canvas.classList.add('visible');
                    
                    // Adjust opacity based on how much is visible
                    this.targetOpacity = Math.min(1, ratio * 2);
                } else {
                    // Gradual fade out
                    this.canvas.classList.add('fade-out');
                    this.canvas.classList.remove('visible');
                    
                    // Keep rendering during fade out
                    setTimeout(() => {
                        if (!entry.isIntersecting) {
                            this.isVisible = false;
                        }
                    }, 2500); // Match CSS transition duration
                }
            });
        }, { 
            threshold: [0, 0.1, 0.2, 0.3, 0.5, 0.7, 1],  // Multiple thresholds
            rootMargin: '50px 0px 50px 0px'
        });

        const section = document.getElementById('services');
        if (section) observer.observe(section);
        
        // Initialize opacity
        this.targetOpacity = 0;
        this.currentOpacity = 0;
    }

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.updateSectionBounds();
    }
    
    updateSectionBounds() {
        const section = document.getElementById('services');
        if (section) {
            const rect = section.getBoundingClientRect();
            this.sectionTop = window.scrollY + rect.top;
            this.sectionHeight = rect.height;
        }
    }
    
    // ★★★ EXPLOSIVE CLICK HANDLER ★★★
    onExplosiveClick(e) {
        // Prevent multiple triggers
        if (this.explosionActive && this.explosionForce > 0.5) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const clickX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const clickY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Set explosion origin in world coordinates
        this.explosionOrigin.x = clickX * 60;
        this.explosionOrigin.y = clickY * 50 + this.cameraTargetY;
        
        // Activate explosion
        this.explosionActive = true;
        this.explosionForce = 1.5;  // Stronger!
        this.colorFlash = 1.0;
        
        // Intense camera shake
        this.cameraShake.x = (Math.random() - 0.5) * 20;
        this.cameraShake.y = (Math.random() - 0.5) * 20;
        
        // ★★★ PARTICLES EXPLODE OUTWARD ★★★
        if (this.particles) {
            const positions = this.particles.geometry.attributes.position.array;
            const velocities = this.particles.geometry.velocities;
            const colors = this.particles.geometry.attributes.color.array;
            
            for (let i = 0; i < positions.length; i += 3) {
                const dx = positions[i] - this.explosionOrigin.x;
                const dy = positions[i + 1] - this.explosionOrigin.y;
                const dz = positions[i + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 1;
                
                // MASSIVE explosive force - particles FLY away
                const force = Math.min(80 / dist, 8);
                velocities[i] += (dx / dist) * force * 3;
                velocities[i + 1] += (dy / dist) * force * 3;
                velocities[i + 2] += (Math.random() - 0.5) * force * 2;
                
                // Flash colors bright
                colors[i] = Math.min(1, colors[i] + 0.5);
                colors[i + 1] = Math.min(1, colors[i + 1] + 0.5);
                colors[i + 2] = Math.min(1, colors[i + 2] + 0.5);
            }
            this.particles.geometry.attributes.color.needsUpdate = true;
        }
        
        // ★★★ 3D OBJECTS FLY AWAY VIOLENTLY ★★★
        this.objects.forEach(obj => {
            const dx = obj.position.x - this.explosionOrigin.x;
            const dy = obj.position.y - this.explosionOrigin.y;
            const dz = obj.position.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) + 1;
            
            // Store original position for return
            if (!obj.userData.originalPos) {
                obj.userData.originalPos = obj.position.clone();
            }
            
            // VIOLENT explosive velocity - objects SCATTER (but controlled)
            const explosionPower = 25;  // Reduced for better visibility
            obj.userData.explosionVelocity = {
                x: (dx / dist) * explosionPower + (Math.random() - 0.5) * 10,
                y: (dy / dist) * explosionPower + (Math.random() - 0.5) * 10,
                z: (Math.random() - 0.5) * 15
            };
            
            // WILD spinning
            obj.userData.explosionSpin = {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2,
                z: (Math.random() - 0.5) * 2
            };
            
            // Scale up DRAMATICALLY
            obj.userData.explosionScaleFactor = 2.5 + Math.random();
            
            // Change color flash
            if (obj.material) {
                obj.userData.originalColor = obj.material.color.getHex();
                obj.material.color.setHex(0xffffff);  // Flash white
            }
        });
        
        // ★★★ DATA STREAMS SCATTER ★★★
        if (this.dataStream) {
            const positions = this.dataStream.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                // Scatter lines horizontally
                positions[i] += (Math.random() - 0.5) * 30;
            }
            this.dataStream.geometry.attributes.position.needsUpdate = true;
        }
        
        // ★★★ RINGS EXPLODE ★★★
        this.rings.forEach((ring, i) => {
            ring.userData.explosionScale = 3 + Math.random() * 2;
            ring.userData.explosionRotation = (Math.random() - 0.5) * 3;
        });
        
        // Create shockwave effect
        this.createShockwave(this.explosionOrigin.x, this.explosionOrigin.y);
        
        console.log('💥💥💥 MASSIVE EXPLOSION at', this.explosionOrigin.x.toFixed(1), this.explosionOrigin.y.toFixed(1));
    }
    
    // Create expanding shockwave ring
    createShockwave(x, y) {
        const geometry = new THREE.RingGeometry(0.5, 1, 64);
        const material = new THREE.MeshBasicMaterial({
            color: Math.random() > 0.5 ? 0x00f5ff : 0xff00ff,
            transparent: true,
            opacity: 1,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });
        
        const shockwave = new THREE.Mesh(geometry, material);
        shockwave.position.set(x, y, 5);
        shockwave.userData = {
            scale: 1,
            opacity: 1,
            speed: 3 + Math.random() * 2
        };
        
        this.scene.add(shockwave);
        this.shockwaves.push(shockwave);
        
        // Create multiple shockwaves with delay effect
        setTimeout(() => {
            const geo2 = new THREE.RingGeometry(0.5, 1.5, 64);
            const mat2 = new THREE.MeshBasicMaterial({
                color: 0xffff00,
                transparent: true,
                opacity: 0.8,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending
            });
            const sw2 = new THREE.Mesh(geo2, mat2);
            sw2.position.set(x, y, 4);
            sw2.userData = { scale: 1, opacity: 0.8, speed: 2.5 };
            this.scene.add(sw2);
            this.shockwaves.push(sw2);
        }, 50);
        
        setTimeout(() => {
            const geo3 = new THREE.RingGeometry(0.3, 0.8, 64);
            const mat3 = new THREE.MeshBasicMaterial({
                color: 0x00ff88,
                transparent: true,
                opacity: 0.6,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending
            });
            const sw3 = new THREE.Mesh(geo3, mat3);
            sw3.position.set(x, y, 6);
            sw3.userData = { scale: 1, opacity: 0.6, speed: 4 };
            this.scene.add(sw3);
            this.shockwaves.push(sw3);
        }, 100);
    }

    onScroll() {
        this.updateSectionBounds();
        
        // Calculate scroll offset within section
        const section = document.getElementById('services');
        if (section) {
            const rect = section.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Calculate how much we've scrolled through the services section
            // scrolledAmount: 0 at top of section, increases as we scroll down
            const scrolledAmount = Math.max(0, -rect.top);
            const sectionScrollRange = Math.max(1, rect.height - viewportHeight);
            
            const scrollProgress = Math.min(1, scrolledAmount / sectionScrollRange);
            
            // ★★★ KEY: Move scene Y based on scroll ★★★
            // From +50 (service 1 at top) to -150 (service 4 at bottom)
            this.scrollOffsetY = 50 - scrollProgress * 200;
        }
    }

    onMouseMove(e) {
        // Store previous mouse position
        this.prevMouse.x = this.targetMouse.x;
        this.prevMouse.y = this.targetMouse.y;
        
        // Update target mouse position
        this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        
        // Calculate flow position based on cursor Y within section
        // Maps cursor position to flow from top (service 1) to bottom (service 4)
        const section = document.getElementById('services');
        if (section) {
            const rect = section.getBoundingClientRect();
            const relativeY = e.clientY - rect.top;
            const normalizedY = Math.max(0, Math.min(1, relativeY / rect.height));
            
            // ★★★ KEY: flowY moves based on mouse Y position ★★★
            // From +50 (mouse at top/service 1) to -150 (mouse at bottom/service 4)
            this.targetFlowY = 50 - normalizedY * 200;
        }
        
        // Calculate mouse velocity
        this.mouseVelocity.x = this.targetMouse.x - this.prevMouse.x;
        this.mouseVelocity.y = this.targetMouse.y - this.prevMouse.y;
        
        // Update mouse influence based on velocity
        const speed = Math.sqrt(this.mouseVelocity.x ** 2 + this.mouseVelocity.y ** 2);
        this.mouseInfluence = Math.min(speed * 50, 1);
        
        // Add to mouse trail
        this.mouseTrail.push({
            x: this.targetMouse.x * 30,
            y: this.targetMouse.y * 20,
            z: 0,
            life: 1,
            vx: this.mouseVelocity.x * 100,
            vy: this.mouseVelocity.y * 100
        });
        
        // Limit trail length
        if (this.mouseTrail.length > 50) {
            this.mouseTrail.shift();
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Keep rendering if explosion is active, even when not visible
        if (!this.isVisible && !this.explosionActive) return;

        this.time += 0.01;

        // Smooth mouse following with easing
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.08;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.08;
        
        // Smooth vertical flow following cursor height + scroll
        this.flowY += (this.targetFlowY - this.flowY) * 0.05;
        
        // ★★★ MOVE CAMERA based on flowY (cursor position) ★★★
        // Camera moves down as cursor moves from service 1 to service 4
        // flowY ranges from +50 (top) to -150 (bottom)
        this.cameraTargetY = this.flowY;
        
        // Mouse world position for interactions
        const mouseWorldX = this.mouse.x * 40;
        const mouseWorldY = this.mouse.y * 30;
        
        // ★★★ SPIRIT CHARACTER INTERACTION ★★★
        let spiritWorldX = 0;
        let spiritWorldY = 0;
        let spiritActive = false;
        let spiritBoosting = false;
        
        if (window.spiritCharacter && window.spiritCharacter.isInServices) {
            spiritActive = true;
            spiritBoosting = window.spiritCharacter.isBoosting;
            
            // Convert character screen position to world coordinates
            const section = document.getElementById('services');
            if (section) {
                const rect = section.getBoundingClientRect();
                const relX = (window.spiritCharacter.x - rect.left) / rect.width;
                const relY = (window.spiritCharacter.y - rect.top) / rect.height;
                spiritWorldX = (relX - 0.5) * 100;
                spiritWorldY = (0.5 - relY) * 80 + this.flowY;
            }
            
            // ★★★ Make character EXCITED when surrounded by objects! ★★★
            const characterEl = document.getElementById('hero-character');
            if (characterEl) {
                characterEl.classList.add('excited', 'in-services');
            }
        } else {
            // Remove excited state when not in services
            const characterEl = document.getElementById('hero-character');
            if (characterEl) {
                characterEl.classList.remove('excited', 'in-services');
            }
        }

        // ★★★ Animate particles - GENTLE FLOW like dust in sunlight ★★★
        if (this.particles) {
            this.particles.material.uniforms.time.value = this.time;
            
            // Gentle overall flow
            this.particles.position.y += (this.flowY - this.particles.position.y) * 0.01;
            
            const positions = this.particles.geometry.attributes.position.array;
            const colors = this.particles.geometry.attributes.color.array;
            const velocities = this.particles.geometry.velocities;
            const phases = this.particles.geometry.phases;

            for (let i = 0; i < positions.length; i += 3) {
                const idx = i / 3;
                const px = positions[i];
                const py = positions[i + 1];
                const pz = positions[i + 2];
                
                // ★ GENTLE mouse interaction - subtle push, not flee
                const dx = px - mouseWorldX;
                const dy = py - mouseWorldY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < this.attractionRadius) {
                    const force = (1 - dist / this.attractionRadius) * 0.15;  // Reduced force
                    
                    // ★ Gentle swirl instead of repulsion
                    const angle = Math.atan2(dy, dx) + Math.PI / 3;
                    velocities[i] += Math.cos(angle) * force * 0.08;
                    velocities[i + 1] += Math.sin(angle) * force * 0.08;
                }
                
                // ★★★ SPIRIT CHARACTER - CALM, SLOW orbit ★★★
                if (spiritActive) {
                    const sdx = px - spiritWorldX;
                    const sdy = py - spiritWorldY;
                    const sDist = Math.sqrt(sdx * sdx + sdy * sdy);
                    
                    const spiritRadius = spiritBoosting ? 30 : 20;
                    
                    if (sDist < spiritRadius) {
                        const spiritForce = (1 - sDist / spiritRadius) * (spiritBoosting ? 0.2 : 0.1);
                        
                        // ★ 아주 천천히 도는 작은 궤도
                        const orbitAngle = Math.atan2(sdy, sdx) + Math.PI / 2 + this.time * 0.3;
                        velocities[i] += Math.cos(orbitAngle) * spiritForce * 0.05;
                        velocities[i + 1] += Math.sin(orbitAngle) * spiritForce * 0.05;
                        
                        // ★ 부드러운 끌림
                        velocities[i] -= sdx * 0.002 * spiritForce;
                        velocities[i + 1] -= sdy * 0.002 * spiritForce;
                    }
                }
                
                // ★ Apply velocity with STRONG damping for organic feel
                positions[i] += velocities[i];
                positions[i + 1] += velocities[i + 1];
                positions[i + 2] += velocities[i + 2];
                
                // ★ Strong damping for organic, floating feel
                velocities[i] *= 0.92;
                velocities[i + 1] *= 0.92;
                velocities[i + 2] *= 0.92;
                
                // ★ Very subtle random drift - like dust in air
                velocities[i] += (Math.random() - 0.5) * 0.005;
                velocities[i + 1] += (Math.random() - 0.5) * 0.003 - 0.001;  // Slight downward drift
                
                // ★ Gentle breathing effect using phase
                if (phases && phases[idx]) {
                    const breathOffset = Math.sin(this.time * 0.5 + phases[idx]) * 0.002;
                    velocities[i + 1] += breathOffset;
                }

                // Soft boundary (particles fade at edges)
                if (positions[i] > 75) velocities[i] -= 0.01;
                if (positions[i] < -75) velocities[i] += 0.01;
                if (positions[i + 1] > 50) velocities[i + 1] -= 0.01;
                if (positions[i + 1] < -250) velocities[i + 1] += 0.01;
                if (Math.abs(positions[i + 2]) > 40) velocities[i + 2] *= 0.9;
            }
            
            this.particles.geometry.attributes.position.needsUpdate = true;
            this.particles.geometry.attributes.color.needsUpdate = true;
            
            // Rotate particle system based on mouse velocity
            this.particles.rotation.y += this.mouseVelocity.x * 0.5;
            this.particles.rotation.x += this.mouseVelocity.y * 0.3;
        }

        // ★★★ Animate floating objects - ORGANIC, BREATHING MOTION ★★★
        this.objects.forEach((obj, index) => {
            const data = obj.userData;
            const delay = index * 0.001; // 각 오브젝트별 지연값
            
            // ★ SLOW, organic rotation - like breathing
            obj.rotation.x += data.rotationSpeed.x;
            obj.rotation.y += data.rotationSpeed.y;
            obj.rotation.z += data.rotationSpeed.z;

            // ★ BREATHING SCALE - gentle expansion and contraction
            const breathPhase = this.time * data.breathSpeed + data.phase;
            const breathScale = data.originalScale * (1 + Math.sin(breathPhase) * 0.1);
            
            // ★ GENTLE floating motion
            const floatOffset = Math.sin(this.time * data.floatSpeed + data.phase) * 
                data.floatAmplitude;

            // ★ Subtle mouse influence (not too reactive)
            const flowOffset = (index - this.objects.length / 2) * 10;
            let targetY = data.originalY + floatOffset;
            let targetX = obj.position.x + (mouseWorldX - obj.position.x) * 0.005; // Very gentle pull
            
            // ★ OPACITY PULSE - like a heartbeat
            const opacityPulse = data.baseOpacity + Math.sin(breathPhase * 0.5) * 0.15;
            
            // ★★★ SPIRIT CHARACTER INTERACTION - 강렬하게 쫙 따라붙어 원형 포위 ★★★
            if (spiritActive) {
                // ★★★ 모든 도형이 강렬하게 따라옴 ★★★
                const numFollowers = Math.min(this.objects.length, 16);
                const followingObjects = index < numFollowers;
                
                if (followingObjects) {
                    // ★★★ 2중 원 궤도 ★★★
                    const layer = Math.floor(index / 8);
                    const indexInLayer = index % 8;
                    
                    // 원 반경
                    const baseRadius = 30 + layer * 18;
                    const orbitRadius = spiritBoosting ? baseRadius * 1.3 : baseRadius;
                    
                    // 회전 속도
                    const orbitSpeed = spiritBoosting ? 1.0 : 0.6;
                    const direction = layer === 0 ? 1 : -1;
                    
                    // 원형 궤도 각도
                    const orbitAngle = this.time * orbitSpeed * direction + (indexInLayer * Math.PI / 4);
                    
                    // 목표 위치
                    const orbitX = spiritWorldX + Math.cos(orbitAngle) * orbitRadius;
                    const orbitY = spiritWorldY + Math.sin(orbitAngle) * orbitRadius;
                    
                    // ★★★ 매우 강렬한 자석 효과 - 즉시 따라붙음 ★★★
                    const magnetSpeed = spiritBoosting ? 0.7 : 0.5; // 엄청 빠름!
                    targetX = obj.position.x + (orbitX - obj.position.x) * magnetSpeed;
                    targetY = obj.position.y + (orbitY - obj.position.y) * magnetSpeed;
                    
                    // ★ 빠른 자체 회전
                    obj.rotation.x += data.rotationSpeed.x * 4;
                    obj.rotation.y += data.rotationSpeed.y * 5;
                    obj.rotation.z += orbitSpeed * direction * 0.8;
                    
                    // ★ 강렬한 글로우
                    obj.material.opacity = 1.0;
                    obj.material.emissiveIntensity = spiritBoosting ? 0.8 : 0.5;
                    
                    // ★ 크게 확대
                    obj.scale.setScalar(breathScale * (spiritBoosting ? 1.8 : 1.5));
                } else {
                    obj.material.opacity = opacityPulse;
                    obj.scale.setScalar(breathScale);
                }
            } else {
                obj.material.opacity = opacityPulse;
                obj.scale.setScalar(breathScale);
            }
            
            obj.position.x += (targetX - obj.position.x) * (0.02 + delay);
            obj.position.y += (targetY - obj.position.y) * (0.03 + delay * 0.5);
            
            // Scale pulse based on mouse proximity (if not affected by spirit)
            if (!spiritActive || Math.sqrt((obj.position.x - spiritWorldX) ** 2 + (obj.position.y - spiritWorldY) ** 2) > 30) {
                const distToMouse = Math.sqrt(
                    (obj.position.x - mouseWorldX) ** 2 + 
                    (obj.position.y - mouseWorldY) ** 2
                );
                const scaleFactor = distToMouse < 20 ? 1 + (1 - distToMouse / 20) * 0.5 : 1;
                obj.scale.setScalar(scaleFactor);
                
                // Opacity change based on distance
                obj.material.opacity = 0.6 + (1 - Math.min(distToMouse / 30, 1)) * 0.4;
            }
        });

        // ★★★ Animate rings - GENTLE BREATHING PULSE like heartbeat ★★★
        this.rings.forEach((ring, i) => {
            const data = ring.userData;
            
            // ★ Very slow, organic rotation
            ring.rotation.z += data.rotationSpeed;
            
            // ★ BREATHING OPACITY - like a gentle heartbeat
            const breathPhase = this.time / data.breathCycle + data.phase;
            const breathOpacity = data.baseOpacity + Math.sin(breathPhase * Math.PI * 2) * 0.08;
            
            // ★ Gentle tilt following mouse (subtle)
            const tiltAmount = 0.05;
            ring.rotation.x += (this.mouse.y * tiltAmount - ring.rotation.x) * 0.02;
            ring.rotation.y += (this.mouse.x * tiltAmount - ring.rotation.y) * 0.02;
            
            // ★ Rings stay in their layer, gentle flow
            const targetY = data.originalY + Math.sin(this.time * 0.2 + i) * 3;
            ring.position.y += (targetY - ring.position.y) * 0.01;
            
            // ★★★ SPIRIT INTERACTION - CALM, subtle response ★★★
            if (spiritActive) {
                const distToSpirit = Math.sqrt(
                    (ring.position.x - spiritWorldX) ** 2 + 
                    (ring.position.y - spiritWorldY) ** 2
                );
                
                if (distToSpirit < 40) {
                    const influence = (1 - distToSpirit / 40) * (spiritBoosting ? 0.5 : 0.3);
                    
                    // ★ 약간만 밝아짐
                    ring.material.opacity = breathOpacity + influence * 0.08;
                    
                    // ★ 아주 미세한 회전 증가
                    ring.rotation.z += data.rotationSpeed * (1 + influence * 0.5);
                } else {
                    ring.material.opacity = breathOpacity;
                }
            } else {
                ring.material.opacity = breathOpacity;
            }
            
            // Scale rings based on mouse
            const scale = 1 + this.mouseInfluence * 0.1;
            ring.scale.setScalar(scale);
        });

        // Animate data stream - FOLLOW MOUSE + VERTICAL FLOW
        if (this.dataStream) {
            // Data stream follows flowY
            this.dataStream.position.y += (this.flowY - this.dataStream.position.y) * 0.03;
            
            const positions = this.dataStream.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 6) {
                // Horizontal movement toward mouse
                const flowX = (mouseWorldX - positions[i]) * 0.01;
                positions[i] += flowX;
                positions[i + 3] += flowX;
                
                // Vertical falling with mouse influence
                const fallSpeed = 0.3 + this.mouseInfluence * 0.5;
                positions[i + 1] -= fallSpeed;
                positions[i + 4] -= fallSpeed;

                // Reset when out of view (relative to flow position)
                if (positions[i + 4] < -40) {
                    const newY = 40;
                    const length = Math.abs(positions[i + 1] - positions[i + 4]);
                    positions[i + 1] = newY;
                    positions[i + 4] = newY - length;
                    // Reset X to random position
                    const newX = (Math.random() - 0.5) * 100;
                    positions[i] = newX;
                    positions[i + 3] = newX;
                }
            }
            this.dataStream.geometry.attributes.position.needsUpdate = true;
        }
        
        // Animate mouse trail
        this.mouseTrail.forEach((point, i) => {
            point.life -= 0.02;
            point.x += point.vx * 0.01;
            point.y += point.vy * 0.01;
            point.vx *= 0.95;
            point.vy *= 0.95;
        });
        this.mouseTrail = this.mouseTrail.filter(p => p.life > 0);
        
        // Update mouse trail line - follows flowY
        if (this.mouseTrailLine && this.mouseTrailPositions) {
            // Shift all positions
            for (let i = this.mouseTrailPositions.length - 1; i > 0; i--) {
                this.mouseTrailPositions[i].x = this.mouseTrailPositions[i - 1].x;
                this.mouseTrailPositions[i].y = this.mouseTrailPositions[i - 1].y;
            }
            
            // Add new position at front (includes flowY offset)
            this.mouseTrailPositions[0].x = mouseWorldX;
            this.mouseTrailPositions[0].y = mouseWorldY + this.flowY;
            
            // Update geometry
            const positions = this.mouseTrailLine.geometry.attributes.position.array;
            for (let i = 0; i < this.mouseTrailPositions.length; i++) {
                positions[i * 3] = this.mouseTrailPositions[i].x;
                positions[i * 3 + 1] = this.mouseTrailPositions[i].y;
                positions[i * 3 + 2] = 5;
            }
            this.mouseTrailLine.geometry.attributes.position.needsUpdate = true;
        }

        // ★★★ EXPLOSION EFFECTS UPDATE ★★★
        if (this.explosionActive) {
            // Decay explosion force
            this.explosionForce *= 0.92;
            this.colorFlash *= 0.9;
            
            // Camera shake decay
            this.cameraShake.x *= 0.85;
            this.cameraShake.y *= 0.85;
            
            // Apply explosion velocity to objects - VIOLENT MOVEMENT
            this.objects.forEach(obj => {
                if (obj.userData.explosionVelocity) {
                    // Move objects FAST
                    obj.position.x += obj.userData.explosionVelocity.x * this.explosionForce * 0.5;
                    obj.position.y += obj.userData.explosionVelocity.y * this.explosionForce * 0.5;
                    obj.position.z += obj.userData.explosionVelocity.z * this.explosionForce * 0.5;
                    
                    // Slow decay - keep moving longer
                    obj.userData.explosionVelocity.x *= 0.92;
                    obj.userData.explosionVelocity.y *= 0.92;
                    obj.userData.explosionVelocity.z *= 0.92;
                }
                
                if (obj.userData.explosionSpin) {
                    // WILD rotation
                    obj.rotation.x += obj.userData.explosionSpin.x * this.explosionForce;
                    obj.rotation.y += obj.userData.explosionSpin.y * this.explosionForce;
                    obj.rotation.z += obj.userData.explosionSpin.z * this.explosionForce;
                    
                    obj.userData.explosionSpin.x *= 0.94;
                    obj.userData.explosionSpin.y *= 0.94;
                    obj.userData.explosionSpin.z *= 0.94;
                }
                
                // Scale effect - objects briefly expand
                if (obj.userData.explosionScaleFactor) {
                    const targetScale = 1 + (obj.userData.explosionScaleFactor - 1) * this.explosionForce;
                    obj.scale.setScalar(targetScale);
                    
                    // Bright glow and color transition during explosion
                    if (obj.material) {
                        obj.material.opacity = Math.min(1, 0.8 + this.explosionForce * 0.5);
                        
                        // Gradually restore original color
                        if (obj.userData.originalColor && this.explosionForce < 0.5) {
                            const t = 1 - (this.explosionForce * 2);  // 0 to 1 as explosion fades
                            const originalColor = new THREE.Color(obj.userData.originalColor);
                            const white = new THREE.Color(0xffffff);
                            obj.material.color.lerpColors(white, originalColor, t);
                        }
                    }
                }
            });
            
            // Rings explosion effect
            this.rings.forEach(ring => {
                if (ring.userData.explosionScale) {
                    const targetScale = 1 + (ring.userData.explosionScale - 1) * this.explosionForce;
                    ring.scale.setScalar(targetScale);
                    ring.rotation.z += ring.userData.explosionRotation * this.explosionForce;
                }
            });
            
            // End explosion when force is minimal
            if (this.explosionForce < 0.01) {
                this.explosionActive = false;
                this.objects.forEach(obj => {
                    obj.userData.explosionVelocity = null;
                    obj.userData.explosionSpin = null;
                    obj.userData.explosionScaleFactor = null;
                    obj.scale.setScalar(1);  // Reset scale
                    
                    // Restore original color
                    if (obj.material && obj.userData.originalColor) {
                        obj.material.color.setHex(obj.userData.originalColor);
                    }
                });
                this.rings.forEach(ring => {
                    ring.userData.explosionScale = null;
                    ring.userData.explosionRotation = null;
                    ring.scale.setScalar(1);  // Reset scale
                });
            }
        }
        
        // ★★★ CONTINUOUS DATA STREAM EXPLOSION EFFECT ★★★
        if (this.explosionActive && this.dataStream) {
            const positions = this.dataStream.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 6) {
                // Scatter lines outward from explosion
                const dx = positions[i] - this.explosionOrigin.x;
                const dist = Math.abs(dx) + 1;
                positions[i] += (dx / dist) * this.explosionForce * 5;
                positions[i + 3] += (dx / dist) * this.explosionForce * 5;
            }
            this.dataStream.geometry.attributes.position.needsUpdate = true;
        }
        
        // ★★★ ENERGY LINES - Beautiful flowing wave animation ★★★
        this.trails.forEach((line, lineIndex) => {
            const data = line.userData;
            if (!data.pointCount) return;
            
            const positions = line.geometry.attributes.position.array;
            const time = this.time * data.speed + data.phase;
            
            for (let j = 0; j < data.pointCount; j++) {
                const t = j / data.pointCount;
                
                // ★★★ Multi-layer wave animation - flowing like silk ★★★
                const primaryWave = Math.sin(j * data.waveFrequency + time * 2) * data.waveAmplitude;
                const secondaryWave = Math.sin(j * data.secondaryFreq + time * 3) * data.secondaryWave;
                const microWave = Math.sin(j * 0.3 + time * 4) * 0.5;
                
                // Vertical flow animation - gentle drift
                const flowOffset = Math.sin(time + j * 0.05) * 2;
                
                // Update positions with wave effect
                positions[j * 3] = data.startX + primaryWave + secondaryWave + microWave;
                positions[j * 3 + 1] = data.startY - j * 3.5 + flowOffset;
                positions[j * 3 + 2] = data.startZ + Math.cos(j * 0.08 + time) * 3;
            }
            
            line.geometry.attributes.position.needsUpdate = true;
            
            // ★★★ Pulsing opacity - like breathing ★★★
            const opacityPulse = data.baseOpacity + Math.sin(time * 0.5) * 0.1;
            line.material.opacity = opacityPulse;
            
            // ★★★ Mouse interaction - lines bend toward cursor ★★★
            const mouseInfluence = this.mouseInfluence * 0.5;
            if (mouseInfluence > 0.1) {
                for (let j = 0; j < data.pointCount; j++) {
                    const distFromCenter = j / data.pointCount - 0.5;
                    positions[j * 3] += (this.mouse.x * 20 - positions[j * 3]) * mouseInfluence * 0.02 * (1 - Math.abs(distFromCenter));
                }
                line.geometry.attributes.position.needsUpdate = true;
            }
        });
        
        // ★★★ SHOCKWAVE ANIMATION ★★★
        this.shockwaves = this.shockwaves.filter(sw => {
            sw.userData.scale += sw.userData.speed;
            sw.userData.opacity -= 0.03;
            
            sw.scale.setScalar(sw.userData.scale);
            sw.material.opacity = Math.max(0, sw.userData.opacity);
            
            if (sw.userData.opacity <= 0) {
                this.scene.remove(sw);
                sw.geometry.dispose();
                sw.material.dispose();
                return false;
            }
            return true;
        });

        // ★★★ Camera follows cursor Y position (service 1→4) + SHAKE ★★★
        const cameraTargetX = this.mouse.x * 5 + this.cameraShake.x;
        this.camera.position.x += (cameraTargetX - this.camera.position.x) * 0.03;
        
        // Camera Y position follows mouse/scroll through services + shake
        const cameraTargetYWithShake = this.cameraTargetY + this.cameraShake.y;
        this.camera.position.y += (cameraTargetYWithShake - this.camera.position.y) * 0.04;
        
        // Camera slight zoom based on mouse influence + explosion zoom out
        const explosionZoom = this.explosionActive ? this.explosionForce * 10 : 0;
        const targetZ = 50 - this.mouseInfluence * 5 + explosionZoom;
        this.camera.position.z += (targetZ - this.camera.position.z) * 0.05;
        
        // Look at target also follows the Y position
        this.camera.lookAt(
            this.mouse.x * 3 + this.cameraShake.x * 0.5, 
            this.cameraTargetY * 0.5 + this.cameraShake.y * 0.5, 
            -10
        );

        this.renderer.render(this.scene, this.camera);
    }
}

function initServicesAnimations() {
    // Initialize 3D canvas
    new ServicesCanvas();

    gsap.from('.services .section-header', {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
            trigger: '.services',
            start: 'top 75%'
        }
    });

    gsap.utils.toArray('.service-card').forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            y: 80,
            rotateY: -15,
            duration: 1,
            delay: i * 0.15,
            scrollTrigger: {
                trigger: card,
                start: 'top 85%'
            }
        });
    });

    // Floating orbs
    gsap.to('.orb-1', {
        x: 80,
        y: 40,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });

    gsap.to('.orb-2', {
        x: -80,
        y: -40,
        duration: 10,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
}

// ========================================
// Works Section - Horizontal Scroll
// ========================================
function initWorksSection() {
    const gallery = document.querySelector('.works-gallery');
    const items = document.querySelectorAll('.work-item');
    
    if (!gallery || items.length === 0) return;

    const totalWidth = Array.from(items).reduce((acc, item) => {
        return acc + item.offsetWidth + 40;
    }, 0) - window.innerWidth + 100;

    gsap.to(gallery, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
            trigger: '.works',
            start: 'top top',
            end: () => `+=${totalWidth}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            onUpdate: (self) => {
                const currentIndex = Math.floor(self.progress * items.length) + 1;
                const counter = document.querySelector('.works-counter .current');
                if (counter) {
                    counter.textContent = String(Math.min(currentIndex, items.length)).padStart(2, '0');
                }
            }
        }
    });
}

// ========================================
// Process Section Animations
// ========================================
function initProcessAnimations() {
    gsap.from('.process .section-header', {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
            trigger: '.process',
            start: 'top 75%'
        }
    });

    // Timeline progress
    gsap.to('.timeline-progress', {
        width: '100%',
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.process-timeline',
            start: 'top 70%'
        }
    });

    // Steps
    gsap.utils.toArray('.process-step').forEach((step, i) => {
        gsap.from(step, {
            opacity: 0,
            y: 60,
            duration: 0.8,
            delay: i * 0.2,
            scrollTrigger: {
                trigger: step,
                start: 'top 85%'
            }
        });
    });
    
    // ★★★ PROCESS CARD CLICK - GEOMETRIC TRANSFORMATIONS ★★★
    initProcessCardClicks();
}

// ★★★ PROCESS CARD CLICK ANIMATIONS ★★★
function initProcessCardClicks() {
    const processSteps = document.querySelectorAll('.process-step');
    console.log('🎯 Process cards found:', processSteps.length);
    
    processSteps.forEach((step, index) => {
        console.log('📦 Adding click listener to step', index + 1);
        step.addEventListener('click', (e) => {
            console.log('🖱️ Card clicked:', index + 1);
            // 이미 애니메이션 중이면 무시
            if (step.classList.contains('clicked')) return;
            
            // 클릭 효과 클래스 추가
            step.classList.add('clicked');
            
            // 기하학적 파티클 생성
            createGeometricParticles(step, index);
            
            // 사운드 효과 (옵션)
            playClickSound(index);
            
            // 애니메이션 종료 후 클래스 제거
            setTimeout(() => {
                step.classList.remove('clicked');
            }, 1200);
        });
    });
}

// 기하학적 파티클 생성
function createGeometricParticles(container, stepIndex) {
    const colors = ['#00f5ff', '#ff00ff', '#00ff88', '#ffff00'];
    const shapes = ['◆', '◇', '△', '▽', '○', '□', '⬡', '✦'];
    const particleCount = 12;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('span');
        particle.className = 'geometric-particle';
        particle.textContent = shapes[Math.floor(Math.random() * shapes.length)];
        
        // 랜덤 방향
        const angle = (i / particleCount) * Math.PI * 2;
        const distance = 80 + Math.random() * 60;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        const rot = Math.random() * 720 - 360;
        
        particle.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            font-size: ${12 + Math.random() * 16}px;
            color: ${colors[stepIndex % colors.length]};
            pointer-events: none;
            z-index: 100;
            --tx: ${tx}px;
            --ty: ${ty}px;
            --rot: ${rot}deg;
            text-shadow: 0 0 10px ${colors[stepIndex % colors.length]};
        `;
        
        container.appendChild(particle);
        
        // 파티클 제거
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
}

// 클릭 사운드 효과 (웹 오디오 API)
function playClickSound(index) {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        // 각 스텝별 다른 음
        const frequencies = [440, 523, 659, 784]; // A4, C5, E5, G5
        oscillator.frequency.value = frequencies[index % 4];
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
        // 오디오 컨텍스트 지원 안 됨
    }
}

// ========================================
// Testimonials Slider
// ========================================
class TestimonialsSlider {
    constructor() {
        this.cards = document.querySelectorAll('.testimonial-card');
        this.dots = document.querySelectorAll('.testimonials-dots .dot');
        this.prevBtn = document.querySelector('.testimonials-nav .test-nav-btn.prev');
        this.nextBtn = document.querySelector('.testimonials-nav .test-nav-btn.next');
        this.currentIndex = 0;

        if (this.cards.length === 0) return;
        this.init();
    }

    init() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }

        this.dots.forEach((dot, i) => {
            dot.addEventListener('click', () => this.goTo(i));
        });

        // Auto-play
        setInterval(() => this.next(), 6000);
    }

    prev() {
        this.currentIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
        this.update();
    }

    next() {
        this.currentIndex = (this.currentIndex + 1) % this.cards.length;
        this.update();
    }

    goTo(index) {
        this.currentIndex = index;
        this.update();
    }

    update() {
        this.cards.forEach((card, i) => {
            card.classList.remove('active', 'prev');
            if (i === this.currentIndex) {
                card.classList.add('active');
            } else if (i === (this.currentIndex - 1 + this.cards.length) % this.cards.length) {
                card.classList.add('prev');
            }
        });

        this.dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === this.currentIndex);
        });
    }
}

// ========================================
// Contact Section
// ========================================
function initContactAnimations() {
    gsap.from('.contact .section-header', {
        opacity: 0,
        y: 50,
        duration: 1,
        scrollTrigger: {
            trigger: '.contact',
            start: 'top 75%'
        }
    });

    gsap.from('.contact-heading', {
        opacity: 0,
        y: 40,
        duration: 1,
        scrollTrigger: {
            trigger: '.contact-info',
            start: 'top 80%'
        }
    });

    gsap.from('.contact-desc', {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.2,
        scrollTrigger: {
            trigger: '.contact-info',
            start: 'top 80%'
        }
    });

    gsap.from('.form-group', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
            trigger: '.contact-form',
            start: 'top 85%'
        }
    });

    // Social links float
    gsap.utils.toArray('.social-link').forEach((link, i) => {
        gsap.to(link, {
            y: -8,
            duration: 1.5 + i * 0.2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    });
}

// ========================================
// Form Handling
// ========================================
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        if (!this.form) return;
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.onSubmit(e));
    }

    onSubmit(e) {
        e.preventDefault();

        const btn = this.form.querySelector('.btn-submit');
        
        // Loading state
        btn.classList.add('loading');
        btn.disabled = true;

        setTimeout(() => {
            btn.classList.remove('loading');
            btn.classList.add('success');
            
            this.createConfetti();

            setTimeout(() => {
                btn.classList.remove('success');
                btn.disabled = false;
                this.form.reset();
            }, 3000);
        }, 2000);
    }

    createConfetti() {
        const colors = ['#00f5ff', '#ff00ff', '#ffff00', '#00ff00'];
        const btn = this.form.querySelector('.btn-submit');
        const rect = btn.getBoundingClientRect();

        for (let i = 0; i < 80; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: ${Math.random() * 10 + 5}px;
                height: ${Math.random() * 10 + 5}px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top}px;
                pointer-events: none;
                z-index: 9999;
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            `;
            document.body.appendChild(confetti);

            gsap.to(confetti, {
                x: (Math.random() - 0.5) * 500,
                y: (Math.random() - 0.5) * 500,
                rotation: Math.random() * 720,
                opacity: 0,
                duration: 1.5 + Math.random(),
                ease: 'power3.out',
                onComplete: () => confetti.remove()
            });
        }
    }
}

// ========================================
// ★★★ PLEXUS NETWORK - About Section Background ★★★
// ========================================
class PlexusNetwork {
    constructor() {
        this.canvas = document.getElementById('about-plexus-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.nodes = [];
        this.mouse = { x: -1000, y: -1000, radius: 200 };
        this.scrollProgress = 0;
        this.isVisible = false;
        this.time = 0;
        
        // Configuration - ENHANCED for visibility
        this.config = {
            nodeCount: 180,           // More nodes
            connectionDistance: 180,   // Longer connections
            nodeSpeed: 0.4,           // Faster movement
            mouseAttractionForce: 0.12,
            glowIntensity: 1.5,       // Brighter glow
            pulseSpeed: 0.025,
            colors: {
                primary: { r: 0, g: 245, b: 255 },    // Cyan
                secondary: { r: 255, g: 0, b: 255 },   // Magenta
                accent: { r: 0, g: 255, b: 136 }       // Green
            }
        };
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createNodes();
        this.addEventListeners();
        this.setupScrollTrigger();
        this.animate();
    }
    
    resize() {
        const section = document.getElementById('about');
        if (!section) return;
        
        this.canvas.width = section.offsetWidth;
        this.canvas.height = section.offsetHeight;
        
        // Recreate nodes on resize
        if (this.nodes.length > 0) {
            this.createNodes();
        }
    }
    
    createNodes() {
        this.nodes = [];
        const { nodeCount } = this.config;
        
        for (let i = 0; i < nodeCount; i++) {
            const colorType = Math.random();
            let color;
            if (colorType < 0.6) {
                color = this.config.colors.primary;
            } else if (colorType < 0.85) {
                color = this.config.colors.secondary;
            } else {
                color = this.config.colors.accent;
            }
            
            this.nodes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                originX: 0,
                originY: 0,
                vx: (Math.random() - 0.5) * this.config.nodeSpeed,
                vy: (Math.random() - 0.5) * this.config.nodeSpeed,
                radius: Math.random() * 3 + 1,
                color: color,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: 0.02 + Math.random() * 0.03,
                glowRadius: Math.random() * 15 + 5
            });
        }
        
        // Store origin positions
        this.nodes.forEach(node => {
            node.originX = node.x;
            node.originY = node.y;
        });
    }
    
    addEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        // Mouse tracking for the about section
        const section = document.getElementById('about');
        if (section) {
            section.addEventListener('mousemove', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mouse.x = e.clientX - rect.left;
                this.mouse.y = e.clientY - rect.top;
            });
            
            section.addEventListener('mouseleave', () => {
                this.mouse.x = -1000;
                this.mouse.y = -1000;
            });
        }
    }
    
    setupScrollTrigger() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
        
        const section = document.getElementById('about');
        if (!section) return;
        
        // Visibility trigger
        ScrollTrigger.create({
            trigger: section,
            start: 'top 80%',
            end: 'bottom 20%',
            onEnter: () => { this.isVisible = true; },
            onLeave: () => { this.isVisible = false; },
            onEnterBack: () => { this.isVisible = true; },
            onLeaveBack: () => { this.isVisible = false; }
        });
        
        // Scroll progress for effects
        ScrollTrigger.create({
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            onUpdate: (self) => {
                this.scrollProgress = self.progress;
            }
        });
    }
    
    drawNode(node) {
        const { ctx } = this;
        const { r, g, b } = node.color;
        
        // Pulse effect
        const pulse = Math.sin(node.pulse) * 0.3 + 0.7;
        const glowPulse = Math.sin(node.pulse * 0.5) * 0.5 + 0.5;
        
        // Glow effect
        const gradient = ctx.createRadialGradient(
            node.x, node.y, 0,
            node.x, node.y, node.glowRadius * pulse
        );
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${0.8 * pulse})`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${0.2 * glowPulse})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.glowRadius * pulse, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Core node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 1)`;
        ctx.fill();
        
        // Inner glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${0.8 * pulse})`;
        ctx.fill();
    }
    
    drawConnection(node1, node2, distance) {
        const { ctx, config } = this;
        const opacity = 1 - (distance / config.connectionDistance);
        
        // Mix colors for connection
        const r = (node1.color.r + node2.color.r) / 2;
        const g = (node1.color.g + node2.color.g) / 2;
        const b = (node1.color.b + node2.color.b) / 2;
        
        // Animated line effect
        const pulse = Math.sin(this.time * 2 + distance * 0.01) * 0.3 + 0.7;
        
        ctx.beginPath();
        ctx.moveTo(node1.x, node1.y);
        ctx.lineTo(node2.x, node2.y);
        
        // Gradient line
        const gradient = ctx.createLinearGradient(node1.x, node1.y, node2.x, node2.y);
        gradient.addColorStop(0, `rgba(${node1.color.r}, ${node1.color.g}, ${node1.color.b}, ${opacity * pulse * 0.6})`);
        gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${opacity * pulse * 0.8})`);
        gradient.addColorStop(1, `rgba(${node2.color.r}, ${node2.color.g}, ${node2.color.b}, ${opacity * pulse * 0.6})`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = opacity * 2;
        ctx.stroke();
    }
    
    updateNodes() {
        const { config, mouse } = this;
        
        this.nodes.forEach(node => {
            // Update pulse
            node.pulse += node.pulseSpeed;
            
            // Basic movement
            node.x += node.vx;
            node.y += node.vy;
            
            // Bounce off edges
            if (node.x < 0 || node.x > this.canvas.width) node.vx *= -1;
            if (node.y < 0 || node.y > this.canvas.height) node.vy *= -1;
            
            // Keep within bounds
            node.x = Math.max(0, Math.min(this.canvas.width, node.x));
            node.y = Math.max(0, Math.min(this.canvas.height, node.y));
            
            // Mouse interaction - attraction
            const dx = mouse.x - node.x;
            const dy = mouse.y - node.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < mouse.radius && dist > 0) {
                const force = (mouse.radius - dist) / mouse.radius;
                node.x += dx * force * config.mouseAttractionForce;
                node.y += dy * force * config.mouseAttractionForce;
            }
            
            // Scroll-based movement - expand network on scroll
            const scrollEffect = this.scrollProgress * 0.5;
            const centerX = this.canvas.width / 2;
            const centerY = this.canvas.height / 2;
            const nodeOffsetX = (node.originX - centerX) * scrollEffect * 0.3;
            const nodeOffsetY = (node.originY - centerY) * scrollEffect * 0.3;
            
            node.x += nodeOffsetX * 0.01;
            node.y += nodeOffsetY * 0.01;
        });
    }
    
    animate() {
        if (!this.isVisible) {
            requestAnimationFrame(() => this.animate());
            return;
        }
        
        this.time += 0.016;
        
        // Clear with fade effect
        this.ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Clear completely for cleaner look
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update nodes
        this.updateNodes();
        
        // Draw connections first (behind nodes)
        for (let i = 0; i < this.nodes.length; i++) {
            for (let j = i + 1; j < this.nodes.length; j++) {
                const dx = this.nodes[i].x - this.nodes[j].x;
                const dy = this.nodes[i].y - this.nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.connectionDistance) {
                    this.drawConnection(this.nodes[i], this.nodes[j], distance);
                }
            }
        }
        
        // Draw nodes
        this.nodes.forEach(node => this.drawNode(node));
        
        // Draw mouse glow effect
        if (this.mouse.x > 0 && this.mouse.y > 0) {
            const gradient = this.ctx.createRadialGradient(
                this.mouse.x, this.mouse.y, 0,
                this.mouse.x, this.mouse.y, this.mouse.radius
            );
            gradient.addColorStop(0, 'rgba(0, 245, 255, 0.15)');
            gradient.addColorStop(0.5, 'rgba(255, 0, 255, 0.05)');
            gradient.addColorStop(1, 'rgba(0, 245, 255, 0)');
            
            this.ctx.beginPath();
            this.ctx.arc(this.mouse.x, this.mouse.y, this.mouse.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// ========================================
// ★★★ FLOATING GEOMETRIC SHAPES - Works Section Background ★★★
// ========================================
class FloatingGeometry {
    constructor() {
        this.canvas = document.getElementById('works-geometric-canvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.shapes = [];
        this.mouse = { x: -1000, y: -1000 };
        this.scrollProgress = 0;
        this.isVisible = false;
        this.time = 0;
        
        // Configuration
        this.config = {
            shapeCount: 25,
            colors: [
                { r: 102, g: 126, b: 234, a: 0.6 },   // Purple
                { r: 240, g: 147, b: 251, a: 0.5 },   // Pink
                { r: 79, g: 172, b: 254, a: 0.6 },    // Blue
                { r: 250, g: 112, b: 154, a: 0.5 },   // Coral
                { r: 168, g: 237, b: 234, a: 0.4 }    // Teal
            ]
        };
        
        this.init();
    }
    
    init() {
        this.resize();
        this.createShapes();
        this.addEventListeners();
        this.setupScrollTrigger();
        this.animate();
    }
    
    resize() {
        const section = document.getElementById('works');
        if (!section) return;
        
        this.canvas.width = section.offsetWidth;
        this.canvas.height = section.offsetHeight;
        
        if (this.shapes.length > 0) {
            this.createShapes();
        }
    }
    
    createShapes() {
        this.shapes = [];
        const { shapeCount, colors } = this.config;
        const types = ['triangle', 'square', 'pentagon', 'hexagon', 'circle', 'ring'];
        
        for (let i = 0; i < shapeCount; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            this.shapes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 60 + 30,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                type: types[Math.floor(Math.random() * types.length)],
                color: color,
                pulse: Math.random() * Math.PI * 2,
                pulseSpeed: 0.01 + Math.random() * 0.02,
                glowIntensity: Math.random() * 0.5 + 0.5
            });
        }
    }
    
    addEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        const section = document.getElementById('works');
        if (section) {
            section.addEventListener('mousemove', (e) => {
                const rect = this.canvas.getBoundingClientRect();
                this.mouse.x = e.clientX - rect.left;
                this.mouse.y = e.clientY - rect.top;
            });
            
            section.addEventListener('mouseleave', () => {
                this.mouse.x = -1000;
                this.mouse.y = -1000;
            });
        }
    }
    
    setupScrollTrigger() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
        
        const section = document.getElementById('works');
        if (!section) return;
        
        ScrollTrigger.create({
            trigger: section,
            start: 'top 80%',
            end: 'bottom 20%',
            onEnter: () => { this.isVisible = true; },
            onLeave: () => { this.isVisible = false; },
            onEnterBack: () => { this.isVisible = true; },
            onLeaveBack: () => { this.isVisible = false; }
        });
        
        ScrollTrigger.create({
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            onUpdate: (self) => {
                this.scrollProgress = self.progress;
            }
        });
    }
    
    drawShape(shape) {
        const { ctx } = this;
        const { r, g, b, a } = shape.color;
        const pulse = Math.sin(shape.pulse) * 0.2 + 0.8;
        const size = shape.size * pulse;
        
        ctx.save();
        ctx.translate(shape.x, shape.y);
        ctx.rotate(shape.rotation);
        
        // Glow effect
        ctx.shadowColor = `rgba(${r}, ${g}, ${b}, ${shape.glowIntensity})`;
        ctx.shadowBlur = 30 * pulse;
        
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a * pulse})`;
        ctx.lineWidth = 2;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a * 0.1 * pulse})`;
        
        ctx.beginPath();
        
        switch (shape.type) {
            case 'triangle':
                this.drawPolygon(ctx, 3, size);
                break;
            case 'square':
                this.drawPolygon(ctx, 4, size);
                break;
            case 'pentagon':
                this.drawPolygon(ctx, 5, size);
                break;
            case 'hexagon':
                this.drawPolygon(ctx, 6, size);
                break;
            case 'circle':
                ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
                break;
            case 'ring':
                ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
                ctx.moveTo(size / 3, 0);
                ctx.arc(0, 0, size / 3, 0, Math.PI * 2);
                break;
        }
        
        ctx.fill();
        ctx.stroke();
        
        // Inner lines for complexity
        if (shape.type !== 'circle' && shape.type !== 'ring') {
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a * 0.3 * pulse})`;
            ctx.lineWidth = 1;
            this.drawInnerLines(ctx, shape.type, size);
        }
        
        ctx.restore();
    }
    
    drawPolygon(ctx, sides, size) {
        const angle = (Math.PI * 2) / sides;
        ctx.moveTo(size / 2, 0);
        for (let i = 1; i <= sides; i++) {
            ctx.lineTo(
                Math.cos(angle * i) * size / 2,
                Math.sin(angle * i) * size / 2
            );
        }
        ctx.closePath();
    }
    
    drawInnerLines(ctx, type, size) {
        const sides = type === 'triangle' ? 3 : type === 'square' ? 4 : type === 'pentagon' ? 5 : 6;
        const angle = (Math.PI * 2) / sides;
        
        // Draw lines from center to vertices
        for (let i = 0; i < sides; i++) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(
                Math.cos(angle * i) * size / 2,
                Math.sin(angle * i) * size / 2
            );
            ctx.stroke();
        }
    }
    
    updateShapes() {
        this.shapes.forEach(shape => {
            shape.pulse += shape.pulseSpeed;
            shape.rotation += shape.rotationSpeed;
            
            // Movement
            shape.x += shape.vx;
            shape.y += shape.vy;
            
            // Bounce off edges with padding
            const padding = shape.size;
            if (shape.x < padding || shape.x > this.canvas.width - padding) shape.vx *= -1;
            if (shape.y < padding || shape.y > this.canvas.height - padding) shape.vy *= -1;
            
            // Mouse interaction - gentle push
            const dx = this.mouse.x - shape.x;
            const dy = this.mouse.y - shape.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 200 && dist > 0) {
                const force = (200 - dist) / 200 * 0.5;
                shape.x -= dx * force * 0.02;
                shape.y -= dy * force * 0.02;
                shape.rotationSpeed += force * 0.01;
            }
            
            // Dampen rotation speed
            shape.rotationSpeed *= 0.99;
            
            // Scroll effect - parallax
            const parallaxFactor = (shape.size / 100) * 0.5;
            shape.y += (this.scrollProgress - 0.5) * parallaxFactor;
        });
    }
    
    animate() {
        if (!this.isVisible) {
            requestAnimationFrame(() => this.animate());
            return;
        }
        
        this.time += 0.016;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw shapes
        this.updateShapes();
        
        // Sort by size for depth effect (smaller behind)
        const sortedShapes = [...this.shapes].sort((a, b) => a.size - b.size);
        sortedShapes.forEach(shape => this.drawShape(shape));
        
        // Mouse glow effect
        if (this.mouse.x > 0 && this.mouse.y > 0) {
            const gradient = this.ctx.createRadialGradient(
                this.mouse.x, this.mouse.y, 0,
                this.mouse.x, this.mouse.y, 150
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
            gradient.addColorStop(0.5, 'rgba(102, 126, 234, 0.05)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            this.ctx.beginPath();
            this.ctx.arc(this.mouse.x, this.mouse.y, 150, 0, Math.PI * 2);
            this.ctx.fillStyle = gradient;
            this.ctx.fill();
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// ========================================
// About Canvas (Network Animation) - Small frame
// ========================================
class AboutCanvas {
    constructor() {
        this.canvas = document.getElementById('about-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };

        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.addEventListeners();
        this.animate();
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.offsetWidth;
        this.canvas.height = parent.offsetHeight;
    }

    createParticles() {
        const count = 40;
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                color: `hsl(${180 + Math.random() * 40}, 100%, 50%)`
            });
        }
    }

    addEventListeners() {
        window.addEventListener('resize', () => this.resize());
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((p, i) => {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0 || p.x > this.canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.speedY *= -1;

            // Mouse interaction
            const dx = this.mouse.x - p.x;
            const dy = this.mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                p.x -= dx * 0.02;
                p.y -= dy * 0.02;
            }

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();

            // Connections
            this.particles.forEach((p2, j) => {
                if (i !== j) {
                    const d = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (d < 80) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(p.x, p.y);
                        this.ctx.lineTo(p2.x, p2.y);
                        this.ctx.strokeStyle = `rgba(0, 245, 255, ${1 - d / 80})`;
                        this.ctx.lineWidth = 0.5;
                        this.ctx.stroke();
                    }
                }
            });
        });

        requestAnimationFrame(() => this.animate());
    }
}

// ========================================
// Contact Canvas Background
// ========================================
class ContactCanvas {
    constructor() {
        this.canvas = document.getElementById('contact-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.time = 0;

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    resize() {
        this.canvas.width = this.canvas.parentElement.offsetWidth;
        this.canvas.height = this.canvas.parentElement.offsetHeight;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.time += 0.008;

        for (let i = 0; i < 12; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, (this.canvas.height / 12) * i);

            for (let x = 0; x < this.canvas.width; x += 5) {
                const y = (this.canvas.height / 12) * i + 
                    Math.sin((x * 0.008) + this.time + i * 0.5) * 25;
                this.ctx.lineTo(x, y);
            }

            this.ctx.strokeStyle = `rgba(0, 245, 255, ${0.04 - i * 0.003})`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }

        requestAnimationFrame(() => this.animate());
    }
}

// ========================================
// ★★★ THREE.JS 3D SERVICE CUBES - PROFESSIONAL GAME-LIKE ★★★
// ========================================
class ServiceCube3D {
    constructor(container) {
        try {
            this.container = container;
            this.canvas = container.querySelector('.service-cube-canvas');
            this.serviceType = container.dataset.service;
            this.accentColor = container.dataset.color;
            this.link = container.dataset.link;
        
        // Three.js components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.cube = null;
        this.edges = null;
        this.particles = [];
        this.glowMesh = null;
        
        // Rotation state
        this.isDragging = false;
        this.previousMousePosition = { x: 0, y: 0 };
        this.rotationVelocity = { x: 0, y: 0 };
        this.targetRotation = { x: Math.PI * 0.1, y: Math.PI * 0.25 };
        this.currentRotation = { x: Math.PI * 0.1, y: Math.PI * 0.25 };
        
        // Animation state
        this.time = 0;
        this.isHovered = false;
        
        // Service data for cube faces
        this.serviceData = this.getServiceData();
        
        this.init();
        } catch (error) {
            console.error('ServiceCube3D error:', error);
        }
    }
    
    getServiceData() {
        const data = {
            '3d-web': {
                title: '3D WEB',
                subtitle: 'EXPERIENCE',
                desc: 'Three.js · WebGL',
                icon: '⬡',
                tags: ['Three.js', 'WebGL', 'Physics'],
                backText: 'INTERACTIVE\n3D WORLDS',
                sideTexts: ['REAL-TIME', 'RENDERING', 'IMMERSIVE', 'VISUAL']
            },
            'interactive': {
                title: 'INTERACTIVE',
                subtitle: 'CAMPAIGN',
                desc: '참여형 캠페인 설계',
                icon: '◎',
                tags: ['Viral', 'Gamification', 'Social'],
                backText: 'ENGAGE\n& CONVERT',
                sideTexts: ['VIRAL', 'GAMING', 'SOCIAL', 'BRAND']
            },
            'motion': {
                title: 'MOTION',
                subtitle: 'ANIMATION',
                desc: 'GSAP · Lottie',
                icon: '▸▸',
                tags: ['GSAP', 'Lottie', 'Scroll'],
                backText: 'BRING\nMOTION',
                sideTexts: ['SMOOTH', 'DYNAMIC', 'SCROLL', 'MICRO']
            },
            'ar-vr': {
                title: 'AR / VR',
                subtitle: 'EXPERIENCE',
                desc: 'WebXR 공간 경험',
                icon: '◉',
                tags: ['WebXR', 'AR', 'VR'],
                backText: 'VIRTUAL\nREALITY',
                sideTexts: ['SPATIAL', 'MIXED', 'VIRTUAL', 'AUGMENT']
            }
        };
        return data[this.serviceType] || data['3d-web'];
    }
    
    init() {
        // Setup Three.js
        this.scene = new THREE.Scene();
        
        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;
        
        this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        this.camera.position.z = 4;
        
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Create cube with textures
        this.createCube();
        this.createEdgeGlow();
        this.createFloatingParticles();
        this.createAmbientEffects();
        
        // Event listeners
        this.setupEventListeners();
        
        // Start animation
        this.animate();
    }
    
    createCube() {
        const size = 1.5;
        const geometry = new THREE.BoxGeometry(size, size, size);
        
        // Create materials for each face with canvas textures
        const materials = [
            this.createFaceMaterial('right'),   // +X
            this.createFaceMaterial('left'),    // -X
            this.createFaceMaterial('top'),     // +Y
            this.createFaceMaterial('bottom'),  // -Y
            this.createFaceMaterial('front'),   // +Z
            this.createFaceMaterial('back')     // -Z
        ];
        
        this.cube = new THREE.Mesh(geometry, materials);
        this.cube.rotation.x = this.currentRotation.x;
        this.cube.rotation.y = this.currentRotation.y;
        this.scene.add(this.cube);
        
        // Add wireframe overlay
        const wireframeGeo = new THREE.BoxGeometry(size * 1.01, size * 1.01, size * 1.01);
        const wireframeMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color(this.accentColor),
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        this.wireframe = new THREE.Mesh(wireframeGeo, wireframeMat);
        this.cube.add(this.wireframe);
    }
    
    createFaceMaterial(face) {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, 512, 512);
        gradient.addColorStop(0, '#0a0a0a');
        gradient.addColorStop(1, '#1a1a1a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);
        
        // Border glow
        ctx.strokeStyle = this.accentColor;
        ctx.lineWidth = 4;
        ctx.shadowColor = this.accentColor;
        ctx.shadowBlur = 20;
        ctx.strokeRect(10, 10, 492, 492);
        
        // Content based on face
        ctx.shadowBlur = 0;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        if (face === 'front') {
            // Main face - Title and description
            ctx.fillStyle = this.accentColor;
            ctx.font = 'bold 60px Orbitron, sans-serif';
            ctx.fillText(this.serviceData.title, 256, 180);
            
            ctx.font = 'bold 40px Orbitron, sans-serif';
            ctx.fillText(this.serviceData.subtitle, 256, 240);
            
            ctx.fillStyle = '#888888';
            ctx.font = '24px Inter, sans-serif';
            ctx.fillText(this.serviceData.desc, 256, 320);
            
            // Tags
            const tagY = 400;
            ctx.font = '18px Orbitron, sans-serif';
            this.serviceData.tags.forEach((tag, i) => {
                ctx.fillStyle = this.accentColor;
                ctx.fillText(`#${tag}`, 100 + i * 150, tagY);
            });
            
            // VIEW button
            ctx.fillStyle = this.accentColor;
            ctx.font = 'bold 28px Orbitron, sans-serif';
            ctx.fillText('VIEW →', 256, 470);
            
        } else if (face === 'back') {
            // Back face - Large text
            ctx.fillStyle = this.accentColor;
            ctx.font = 'bold 55px Orbitron, sans-serif';
            const lines = this.serviceData.backText.split('\n');
            lines.forEach((line, i) => {
                ctx.fillText(line, 256, 230 + i * 70);
            });
            
            // Icon
            ctx.font = '120px sans-serif';
            ctx.fillText(this.serviceData.icon, 256, 420);
            
        } else if (face === 'top' || face === 'bottom') {
            // Top/Bottom - Index number
            ctx.fillStyle = this.accentColor;
            ctx.font = 'bold 200px Orbitron, sans-serif';
            const index = ['3d-web', 'interactive', 'motion', 'ar-vr'].indexOf(this.serviceType) + 1;
            ctx.fillText(`0${index}`, 256, 280);
            
            ctx.font = 'bold 30px Orbitron, sans-serif';
            ctx.fillText(this.serviceData.title, 256, 420);
            
        } else {
            // Side faces - Keywords
            ctx.fillStyle = this.accentColor;
            ctx.font = 'bold 45px Orbitron, sans-serif';
            const sideIndex = face === 'right' ? 0 : face === 'left' ? 1 : 0;
            const texts = this.serviceData.sideTexts.slice(sideIndex * 2, sideIndex * 2 + 2);
            texts.forEach((text, i) => {
                ctx.fillText(text, 256, 200 + i * 120);
            });
            
            // Decorative lines
            ctx.strokeStyle = this.accentColor;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(100, 350);
            ctx.lineTo(412, 350);
            ctx.stroke();
        }
        
        // Corner decorations
        this.drawCornerDecorations(ctx);
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        
        return new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 0.95
        });
    }
    
    drawCornerDecorations(ctx) {
        ctx.strokeStyle = this.accentColor;
        ctx.lineWidth = 2;
        
        // Top-left corner
        ctx.beginPath();
        ctx.moveTo(20, 50);
        ctx.lineTo(20, 20);
        ctx.lineTo(50, 20);
        ctx.stroke();
        
        // Top-right corner
        ctx.beginPath();
        ctx.moveTo(462, 20);
        ctx.lineTo(492, 20);
        ctx.lineTo(492, 50);
        ctx.stroke();
        
        // Bottom-left corner
        ctx.beginPath();
        ctx.moveTo(20, 462);
        ctx.lineTo(20, 492);
        ctx.lineTo(50, 492);
        ctx.stroke();
        
        // Bottom-right corner
        ctx.beginPath();
        ctx.moveTo(462, 492);
        ctx.lineTo(492, 492);
        ctx.lineTo(492, 462);
        ctx.stroke();
    }
    
    createEdgeGlow() {
        const edges = new THREE.EdgesGeometry(this.cube.geometry);
        const lineMaterial = new THREE.LineBasicMaterial({
            color: new THREE.Color(this.accentColor),
            transparent: true,
            opacity: 0.8
        });
        this.edges = new THREE.LineSegments(edges, lineMaterial);
        this.cube.add(this.edges);
    }
    
    createFloatingParticles() {
        const particleCount = 30;
        const particleGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 4;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: new THREE.Color(this.accentColor),
            size: 0.05,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        
        this.particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(this.particleSystem);
    }
    
    createAmbientEffects() {
        // Ambient light rings
        const ringGeometry = new THREE.RingGeometry(1.8, 1.85, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color(this.accentColor),
            transparent: true,
            opacity: 0.2,
            side: THREE.DoubleSide
        });
        
        this.ring1 = new THREE.Mesh(ringGeometry, ringMaterial);
        this.ring1.rotation.x = Math.PI / 2;
        this.scene.add(this.ring1);
        
        this.ring2 = new THREE.Mesh(ringGeometry.clone(), ringMaterial.clone());
        this.ring2.rotation.y = Math.PI / 2;
        this.scene.add(this.ring2);
    }
    
    setupEventListeners() {
        // ★★★ MOUSE TRACKING - 마우스 위치 저장 ★★★
        this.mousePosition = { x: 0, y: 0 };
        this.targetRotation = { x: 0, y: 0 };
        
        // Mouse events
        this.container.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.container.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.container.addEventListener('mouseup', () => this.onMouseUp());
        this.container.addEventListener('mouseleave', () => this.onMouseUp());
        this.container.addEventListener('mouseenter', () => this.isHovered = true);
        this.container.addEventListener('mouseleave', () => {
            this.isHovered = false;
            this.mousePosition = { x: 0, y: 0 }; // 리셋
        });
        
        // ★★★ 마우스 위치에 따른 회전 추적 (드래그 없이) ★★★
        this.container.addEventListener('mousemove', (e) => {
            if (this.isDragging) return; // 드래그 중이면 무시
            const rect = this.container.getBoundingClientRect();
            // -1 ~ 1 사이 값으로 정규화
            this.mousePosition.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            this.mousePosition.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        });
        
        // Touch events
        this.container.addEventListener('touchstart', (e) => this.onTouchStart(e));
        this.container.addEventListener('touchmove', (e) => this.onTouchMove(e));
        this.container.addEventListener('touchend', () => this.onMouseUp());
        
        // Click to navigate
        this.container.addEventListener('click', (e) => {
            if (Math.abs(this.rotationVelocity.x) < 0.01 && Math.abs(this.rotationVelocity.y) < 0.01) {
                // Only navigate if not dragging
                if (!this.wasDragging) {
                    window.location.href = this.link;
                }
            }
            this.wasDragging = false;
        });
        
        // Resize
        window.addEventListener('resize', () => this.onResize());
    }
    
    onMouseDown(e) {
        this.isDragging = true;
        this.wasDragging = false;
        this.previousMousePosition = {
            x: e.clientX,
            y: e.clientY
        };
    }
    
    onMouseMove(e) {
        if (!this.isDragging) return;
        
        const deltaX = e.clientX - this.previousMousePosition.x;
        const deltaY = e.clientY - this.previousMousePosition.y;
        
        if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
            this.wasDragging = true;
        }
        
        // Apply rotation based on drag
        this.rotationVelocity.y += deltaX * 0.005;
        this.rotationVelocity.x += deltaY * 0.005;
        
        this.previousMousePosition = {
            x: e.clientX,
            y: e.clientY
        };
    }
    
    onMouseUp() {
        this.isDragging = false;
    }
    
    onTouchStart(e) {
        this.isDragging = true;
        this.wasDragging = false;
        this.previousMousePosition = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    }
    
    onTouchMove(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        
        const deltaX = e.touches[0].clientX - this.previousMousePosition.x;
        const deltaY = e.touches[0].clientY - this.previousMousePosition.y;
        
        if (Math.abs(deltaX) > 2 || Math.abs(deltaY) > 2) {
            this.wasDragging = true;
        }
        
        this.rotationVelocity.y += deltaX * 0.005;
        this.rotationVelocity.x += deltaY * 0.005;
        
        this.previousMousePosition = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY
        };
    }
    
    onResize() {
        const width = this.container.offsetWidth;
        const height = this.container.offsetHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.time += 0.016;
        
        // Apply rotation with physics-like damping
        if (!this.isDragging) {
            // Apply friction
            this.rotationVelocity.x *= 0.95;
            this.rotationVelocity.y *= 0.95;
            
            // ★★★ 마우스 위치에 따른 자동 회전 (hover 중일 때) ★★★
            if (this.isHovered && this.mousePosition) {
                // 마우스 위치에 따라 목표 회전 계산
                this.targetRotation.x = this.mousePosition.y * 0.5; // 상하 마우스 → X 회전
                this.targetRotation.y = this.mousePosition.x * 0.8; // 좌우 마우스 → Y 회전
                
                // 부드럽게 목표 회전으로 이동
                this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.08;
                this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.08;
            } else {
                // Add gentle auto-rotation when idle
                if (Math.abs(this.rotationVelocity.x) < 0.001 && Math.abs(this.rotationVelocity.y) < 0.001) {
                    this.rotationVelocity.y = 0.003;
                }
                // Update cube rotation from velocity
                this.currentRotation.x += this.rotationVelocity.x;
                this.currentRotation.y += this.rotationVelocity.y;
            }
        } else {
            // 드래그 중일 때는 velocity 기반
            this.currentRotation.x += this.rotationVelocity.x;
            this.currentRotation.y += this.rotationVelocity.y;
        }
        
        this.cube.rotation.x = this.currentRotation.x;
        this.cube.rotation.y = this.currentRotation.y;
        
        // Animate wireframe
        if (this.wireframe) {
            this.wireframe.material.opacity = 0.2 + Math.sin(this.time * 2) * 0.1;
            if (this.isHovered) {
                this.wireframe.material.opacity += 0.2;
            }
        }
        
        // Animate edge glow
        if (this.edges) {
            this.edges.material.opacity = 0.5 + Math.sin(this.time * 3) * 0.3;
        }
        
        // Animate particles
        if (this.particleSystem) {
            this.particleSystem.rotation.y += 0.002;
            this.particleSystem.rotation.x += 0.001;
            
            // Pulse size on hover
            const targetSize = this.isHovered ? 0.08 : 0.05;
            this.particleSystem.material.size += (targetSize - this.particleSystem.material.size) * 0.1;
        }
        
        // Animate rings
        if (this.ring1) {
            this.ring1.rotation.z += 0.005;
            this.ring1.material.opacity = this.isHovered ? 0.4 : 0.2;
        }
        if (this.ring2) {
            this.ring2.rotation.z -= 0.003;
            this.ring2.material.opacity = this.isHovered ? 0.4 : 0.2;
        }
        
        // Camera slight movement on hover
        const targetZ = this.isHovered ? 3.5 : 4;
        this.camera.position.z += (targetZ - this.camera.position.z) * 0.1;
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize all 3D service cubes
function initServiceCubes() {
    const containers = document.querySelectorAll('.service-cube-container');
    containers.forEach(container => {
        new ServiceCube3D(container);
    });
}

// ========================================
// ★★★ HERO CHARACTER CONTROLLER ★★★
// ========================================
// Global character position for interaction with other elements
window.spiritCharacter = {
    x: 0,
    y: 0,
    velocityX: 0,
    velocityY: 0,
    isInServices: false,
    isBoosting: false
};

class HeroCharacter {
    constructor() {
        this.character = document.getElementById('hero-character');
        this.hint = document.getElementById('character-hint');
        
        if (!this.character) return;
        
        // Get boundary sections
        this.heroSection = document.getElementById('hero');
        this.processSection = document.getElementById('process');
        
        // ========================================
        // ★★★ 위치 변수 (완전 분리) ★★★
        // ========================================
        // x: 화면 가로 위치 (픽셀)
        // screenY: 화면 세로 위치 (픽셀) - 화면 내에서만 이동
        // pageY: 페이지 절대 위치 = scrollY + screenY (렌더링용)
        this.x = window.innerWidth * 0.15;
        this.screenY = window.innerHeight * 0.3;  // 화면 내 Y 위치
        this.pageY = this.screenY;  // 초기값
        
        // ========================================
        // ★★★ 이동 설정 ★★★
        // ========================================
        this.speed = 15;          // 기본 속도 (픽셀)
        this.boostSpeed = 30;     // 부스트 속도
        this.currentSpeed = this.speed;
        this.friction = 0.85;     // 마찰 (낮을수록 가벼운 느낌)
        this.velocityX = 0;
        this.velocityY = 0;
        
        // Boundaries (will be calculated dynamically)
        this.minX = 50;
        this.maxX = window.innerWidth - 50;
        this.minY = 0;
        this.maxY = window.innerHeight;
        
        // Key states
        this.keys = {
            up: false,
            down: false,
            left: false,
            right: false,
            boost: false
        };
        
        // Movement direction for trail effect
        this.movingDirection = null;
        
        // Particle trail
        this.particles = [];
        this.maxParticles = 30;
        
        // Active state
        this.isActive = true;
        
        this.init();
    }
    
    init() {
        // Keyboard events
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));
        window.addEventListener('scroll', () => this.onScroll());
        window.addEventListener('resize', () => this.onResize());
        
        // Create particle container
        this.createParticleContainer();
        
        // Initial boundary calculation
        this.calculateBoundaries();
        
        // Start animation loop
        this.animate();
        
        // Initial position
        this.updatePosition();
        
        console.log('🎮 Spirit Character initialized! Use ← ↑ ↓ → to move, SPACE to boost');
        console.log('📍 Move freely from Hero to Process section!');
    }
    
    createParticleContainer() {
        this.particleContainer = document.createElement('div');
        this.particleContainer.className = 'character-particles global-particles';
        this.particleContainer.style.cssText = `
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 9998;
            overflow: hidden;
        `;
        document.body.appendChild(this.particleContainer);
    }
    
    calculateBoundaries() {
        // Horizontal boundaries (viewport)
        this.minX = 50;
        this.maxX = window.innerWidth - 50;
        
        // Vertical boundaries (scroll position + viewport)
        const scrollY = window.scrollY;
        
        // Top: start of hero section
        if (this.heroSection) {
            this.absoluteMinY = this.heroSection.offsetTop;
        } else {
            this.absoluteMinY = 0;
        }
        
        // Bottom: end of process section
        if (this.processSection) {
            this.absoluteMaxY = this.processSection.offsetTop + this.processSection.offsetHeight;
        } else {
            this.absoluteMaxY = document.body.scrollHeight;
        }
        
        // Current viewport boundaries (considering scroll)
        this.minY = Math.max(50, this.absoluteMinY - scrollY);
        this.maxY = Math.min(window.innerHeight - 50, this.absoluteMaxY - scrollY);
    }
    
    onScroll() {
        // ========================================
        // ★★★ 마우스 스크롤 시 캐릭터 동작 ★★★
        // ========================================
        // 캐릭터는 position: fixed → 화면에 고정
        // 스크롤해도 캐릭터는 화면에 계속 보임
        // pageY만 업데이트 (scrollY + screenY)
        this.pageY = window.scrollY + this.screenY;
        
        // 활성 섹션 (hero ~ process) 범위 체크
        const heroSection = document.getElementById('hero');
        const processSection = document.getElementById('process');
        
        if (heroSection && processSection) {
            const minY = heroSection.offsetTop;
            const maxY = processSection.offsetTop + processSection.offsetHeight;
            
            // 활성 영역 밖이면 투명하게
            if (this.pageY < minY || this.pageY > maxY) {
                this.character.style.opacity = '0.3';
            } else {
                this.character.style.opacity = '1';
            }
        }
    }
    
    onResize() {
        this.calculateBoundaries();
        // 가로 경계 체크
        this.x = Math.max(this.minX, Math.min(this.maxX, this.x));
    }
    
    checkActiveState() {
        const scrollY = window.scrollY;
        
        // Check if we're between hero and process sections
        if (scrollY >= this.absoluteMinY - window.innerHeight && 
            scrollY <= this.absoluteMaxY) {
            this.isActive = true;
            this.character.style.display = 'block';
            if (this.hint) this.hint.style.display = 'block';
        } else {
            this.isActive = false;
            this.character.style.display = 'none';
            if (this.hint) this.hint.style.display = 'none';
        }
    }
    
    onKeyDown(e) {
        // ★★★ 화살표 키/스페이스바는 항상 기본 동작 방지 (브라우저 스크롤 방지) ★★★
        const preventKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'w', 'W', 'a', 'A', 's', 'S', 'd', 'D'];
        if (preventKeys.includes(e.key)) {
            e.preventDefault();
        }
        
        // Only work when active
        if (!this.isActive) return;
        
        switch(e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                this.keys.up = true;
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                this.keys.down = true;
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                this.keys.left = true;
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                this.keys.right = true;
                break;
            case ' ':
                this.keys.boost = true;
                this.character.classList.add('boosting');
                break;
        }
    }
    
    onKeyUp(e) {
        switch(e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                this.keys.up = false;
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                this.keys.down = false;
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                this.keys.left = false;
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                this.keys.right = false;
                break;
            case ' ':
                this.keys.boost = false;
                this.character.classList.remove('boosting');
                break;
        }
    }
    
    createParticle() {
        const particle = document.createElement('div');
        
        // Position at character's current pixel position
        const particleX = this.x;
        const particleY = this.y;
        
        const size = Math.random() * 8 + 3;
        const colors = ['#00f5ff', '#00d4dd', '#00aacc', '#00ffff'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Random offset for spread effect
        const offsetX = (Math.random() - 0.5) * 30;
        const offsetY = (Math.random() - 0.5) * 30;
        
        particle.style.cssText = `
            position: fixed;
            left: ${particleX + offsetX}px;
            top: ${particleY + offsetY}px;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            box-shadow: 0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px ${color};
            pointer-events: none;
            transform: translate(-50%, -50%);
            animation: particleFadeGlobal 1s ease-out forwards;
            z-index: 9997;
        `;
        
        this.particleContainer.appendChild(particle);
        this.particles.push(particle);
        
        // Remove old particles
        if (this.particles.length > this.maxParticles) {
            const oldParticle = this.particles.shift();
            if (oldParticle.parentNode) {
                oldParticle.parentNode.removeChild(oldParticle);
            }
        }
        
        // Auto remove after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
            const index = this.particles.indexOf(particle);
            if (index > -1) {
                this.particles.splice(index, 1);
            }
        }, 800);
    }
    
    updateMovement() {
        if (!this.isActive) return;
        
        this.currentSpeed = this.keys.boost ? this.boostSpeed : this.speed;
        
        // Apply acceleration based on keys (pixel-based) - FASTER response
        if (this.keys.up) {
            this.velocityY -= this.currentSpeed * 0.5;  // Increased acceleration
        }
        if (this.keys.down) {
            this.velocityY += this.currentSpeed * 0.5;  // Increased acceleration
        }
        if (this.keys.left) {
            this.velocityX -= this.currentSpeed * 0.5;  // Increased acceleration
        }
        if (this.keys.right) {
            this.velocityX += this.currentSpeed * 0.5;  // Increased acceleration
        }
        
        // Apply friction
        this.velocityX *= this.friction;
        this.velocityY *= this.friction;
        
        // Limit velocity (pixel-based) - HIGHER max speed
        const maxVelocity = this.keys.boost ? 40 : 20;
        this.velocityX = Math.max(-maxVelocity, Math.min(maxVelocity, this.velocityX));
        this.velocityY = Math.max(-maxVelocity, Math.min(maxVelocity, this.velocityY));
        
        // ========================================
        // ★★★ 캐릭터 이동 (스크롤과 완전 분리) ★★★
        // ========================================
        // 캐릭터는 화면 내에서만 이동
        // 스크롤은 마우스로만 제어
        // 캐릭터 이동 시 스크롤 변경 없음!
        
        this.x += this.velocityX;
        this.screenY += this.velocityY;  // 화면상 Y 위치
        
        const screenHeight = window.innerHeight;
        const screenWidth = window.innerWidth;
        
        // ========================================
        // ★★★ 가로 경계 체크 ★★★
        // ========================================
        if (this.x < 50) {
            this.x = 50;
            this.velocityX *= -0.5;
        }
        if (this.x > screenWidth - 50) {
            this.x = screenWidth - 50;
            this.velocityX *= -0.5;
        }
        
        // ========================================
        // ★★★ 세로 경계 체크 (화면 내에서만) ★★★
        // ========================================
        if (this.screenY < 60) {
            this.screenY = 60;
            this.velocityY *= -0.5;
        }
        if (this.screenY > screenHeight - 60) {
            this.screenY = screenHeight - 60;
            this.velocityY *= -0.5;
        }
        
        // pageY 동기화 (스크롤 위치 + 화면 위치)
        this.pageY = window.scrollY + this.screenY;
        
        // Update movement direction classes
        this.character.classList.remove('moving-up', 'moving-down', 'moving-left', 'moving-right');
        
        const threshold = 1.0;  // Pixel threshold
        if (Math.abs(this.velocityX) > threshold || Math.abs(this.velocityY) > threshold) {
            // Create particles when moving
            if (Math.random() > 0.4) {
                this.createParticle();
            }
            
            if (Math.abs(this.velocityY) > Math.abs(this.velocityX)) {
                if (this.velocityY < -threshold) {
                    this.character.classList.add('moving-up');
                } else if (this.velocityY > threshold) {
                    this.character.classList.add('moving-down');
                }
            } else {
                if (this.velocityX < -threshold) {
                    this.character.classList.add('moving-left');
                } else if (this.velocityX > threshold) {
                    this.character.classList.add('moving-right');
                }
            }
        }
    }
    
    updatePosition() {
        // ========================================
        // ★★★ 캐릭터 위치 렌더링 (position: fixed) ★★★
        // ========================================
        // 캐릭터는 화면에 고정, 스크롤과 무관
        this.character.style.left = `${this.x}px`;
        this.character.style.top = `${this.screenY}px`;  // 화면 내 Y 위치
        
        // 글로벌 상태 업데이트 (Services 섹션 상호작용용)
        window.spiritCharacter.x = this.x;
        window.spiritCharacter.y = this.pageY;  // 페이지 절대 위치
        window.spiritCharacter.screenY = this.screenY;  // 화면 내 위치
        window.spiritCharacter.velocityX = this.velocityX;
        window.spiritCharacter.velocityY = this.velocityY;
        window.spiritCharacter.isBoosting = this.keys.boost;
        
        // Services 섹션과 겹치는지 확인
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
            const rect = servicesSection.getBoundingClientRect();
            
            // 캐릭터의 화면상 위치 (screenY 직접 사용)
            const isInY = rect.top - 100 < this.screenY && rect.bottom + 100 > this.screenY;
            const isInX = this.x > 0 && this.x < window.innerWidth;
            
            window.spiritCharacter.isInServices = isInY && isInX;
        }
    }
    
    animate() {
        this.updateMovement();
        this.updatePosition();
        requestAnimationFrame(() => this.animate());
    }
}

// Add particle fade animation to document
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particleFade {
        0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.2);
        }
    }
`;
document.head.appendChild(particleStyle);

// ========================================
// Initialize All
// ========================================
function initAnimations() {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    initHeroAnimations();
    initAboutAnimations();
    initServicesAnimations();
    initWorksSection();
    initProcessAnimations();
    initContactAnimations();
    initServiceCubes();  // ★ Initialize 3D cubes

    new TestimonialsSlider();
    new ContactForm();
    new PlexusNetwork();      // ★ About section background animation
    new FloatingGeometry();   // ★ Works section background animation
    new AboutCanvas();
    new ContactCanvas();
}

// ========================================
// DOM Ready
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const preloader = new Preloader();
    preloader.init();

    new HeroCanvas();
    new CustomCursor();
    new MagneticButtons();
    new ScrollProgressBar();
    new Navigation();
    new HeroCharacter();  // ★ Interactive character
});

// ★★★ PROCESS CARD CLICKS - 페이지 로드 완료 후 확실하게 초기화 ★★★
window.addEventListener('load', () => {
    console.log('🚀 Window loaded - initializing process cards...');
    setTimeout(() => {
        initProcessCardClicks();
    }, 1000);
});

// ★★★ 추가 백업: 스크롤 시에도 초기화 시도 ★★★
let processCardsInitialized = false;
window.addEventListener('scroll', () => {
    if (!processCardsInitialized) {
        const processSection = document.getElementById('process');
        if (processSection) {
            const rect = processSection.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                console.log('📜 Process section visible - initializing...');
                initProcessCardClicks();
                processCardsInitialized = true;
            }
        }
    }
}, { passive: true });
