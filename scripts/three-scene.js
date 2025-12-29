/**
 * Three.js Particle Constellation Scene
 * Premium AAA-quality 3D background with interactive particles
 */

class ParticleScene {
    constructor() {
        this.container = document.getElementById('three-container');
        if (!this.container) return;

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetMouseX = 0;
        this.targetMouseY = 0;

        // Check for reduced motion preference
        this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        this.init();
        this.createParticles();
        this.createConnections();
        this.addEventListeners();
        this.animate();
    }

    init() {
        // Scene
        this.scene = new THREE.Scene();

        // Camera
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
        this.camera.position.z = 50;

        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        // Clock for animations
        this.clock = new THREE.Clock();
    }

    createParticles() {
        const particleCount = this.reducedMotion ? 50 : 150;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);

        // Color palette (matching our CSS variables)
        const colorPalette = [
            new THREE.Color(0x667eea), // Primary purple
            new THREE.Color(0x764ba2), // Secondary purple
            new THREE.Color(0xf093fb), // Pink
            new THREE.Color(0xf5576c), // Coral
            new THREE.Color(0x4facfe), // Blue
        ];

        for (let i = 0; i < particleCount; i++) {
            // Random positions in a sphere
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = 30 + Math.random() * 40;

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = radius * Math.cos(phi) - 20;

            // Random color from palette
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            // Random sizes
            sizes[i] = Math.random() * 3 + 1;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        // Custom shader material for glowing particles
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
            },
            vertexShader: `
                attribute float size;
                attribute vec3 color;
                varying vec3 vColor;
                uniform float uTime;
                uniform float uPixelRatio;
                
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    
                    // Subtle floating animation
                    float floatY = sin(uTime * 0.5 + position.x * 0.1) * 0.5;
                    float floatX = cos(uTime * 0.3 + position.y * 0.1) * 0.5;
                    mvPosition.y += floatY;
                    mvPosition.x += floatX;
                    
                    gl_PointSize = size * uPixelRatio * (30.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                
                void main() {
                    // Create soft circular gradient
                    float dist = length(gl_PointCoord - vec2(0.5));
                    if (dist > 0.5) discard;
                    
                    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
                    alpha *= 0.8;
                    
                    // Glow effect
                    vec3 glow = vColor * 1.5;
                    gl_FragColor = vec4(glow, alpha);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);

        // Store original positions for animation
        this.originalPositions = positions.slice();
    }

    createConnections() {
        // Create subtle connection lines between nearby particles
        const positions = this.particles.geometry.attributes.position.array;
        const lineGeometry = new THREE.BufferGeometry();
        const linePositions = [];
        const lineColors = [];

        const maxDistance = 15;
        const particleCount = positions.length / 3;

        for (let i = 0; i < particleCount; i++) {
            for (let j = i + 1; j < particleCount; j++) {
                const dx = positions[i * 3] - positions[j * 3];
                const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
                const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (distance < maxDistance) {
                    linePositions.push(
                        positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
                        positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
                    );

                    // Gradient color based on distance
                    const alpha = 1 - (distance / maxDistance);
                    lineColors.push(0.4, 0.5, 0.9, 0.4, 0.5, 0.9);
                }
            }
        }

        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

        const lineMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.15,
            blending: THREE.AdditiveBlending
        });

        this.connections = new THREE.LineSegments(lineGeometry, lineMaterial);
        this.scene.add(this.connections);
    }

    addEventListeners() {
        window.addEventListener('resize', () => this.onResize());

        if (!this.reducedMotion) {
            document.addEventListener('mousemove', (e) => {
                this.targetMouseX = (e.clientX / this.width - 0.5) * 2;
                this.targetMouseY = (e.clientY / this.height - 0.5) * 2;
            });
        }

        // Pause when not visible
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.paused = true;
            } else {
                this.paused = false;
                this.clock.start();
            }
        });
    }

    onResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
    }

    animate() {
        if (this.paused) {
            requestAnimationFrame(() => this.animate());
            return;
        }

        const elapsedTime = this.clock.getElapsedTime();

        // Update shader time
        if (this.particles.material.uniforms) {
            this.particles.material.uniforms.uTime.value = elapsedTime;
        }

        // Smooth mouse following
        this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
        this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

        // Rotate scene based on mouse
        this.scene.rotation.y = this.mouseX * 0.3;
        this.scene.rotation.x = this.mouseY * 0.2;

        // Subtle auto-rotation
        this.particles.rotation.y = elapsedTime * 0.02;
        this.connections.rotation.y = elapsedTime * 0.02;

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.animate());
    }

    destroy() {
        this.renderer.dispose();
        this.container.removeChild(this.renderer.domElement);
    }
}

// Initialize scene when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if Three.js is available
    if (typeof THREE !== 'undefined') {
        new ParticleScene();
    }
});

// Also support dynamic loading
if (document.readyState === 'complete' && typeof THREE !== 'undefined') {
    new ParticleScene();
}
