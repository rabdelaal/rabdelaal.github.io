/**
 * Paper Playgrounds Implementation
 * Provides interactive demos for architecture papers.
 */

window.initPlayground = function (type, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    switch (type) {
        case 'ssr-omega':
            initSSROmegaPlayground(container);
            break;
        case 'vtrn':
            initVTRNPlayground(container);
            break;
        case 'sdrc':
            initSDRCPlayground(container);
            break;
        case 'ssr-architecture':
            initSSRArchitecturePlayground(container);
            break;
        case 'sys-fused':
            initSySFusedPlayground(container);
            break;
        case 'is-vtrn':
            initISVTRNPlayground(container);
            break;
        case 'gepard':
            initGEPARDPlayground(container);
            break;
        case 'cognitive-resonance':
            initCognitiveResonancePlayground(container);
            break;
    }
};

/**
 * SSR Architecture: The Three-Kernel System
 */
function initSSRArchitecturePlayground(container) {
    container.innerHTML = `
        <div class="paper-playground">
            <div class="playground-header">
                <h2>Three-Kernel System Visualizer</h2>
                <p>Monitor the interaction between Input, Reasoning, and Output kernels.</p>
            </div>
            <div class="playground-grid">
                <div class="playground-canvas" id="ssr-arch-canvas-container" style="background: radial-gradient(circle at center, rgba(102, 126, 234, 0.05) 0%, transparent 70%);">
                    <div id="ssr-arch-kernels" style="display: flex; gap: 40px; align-items: center; justify-content: center; width: 100%;">
                        <div class="kernel-box" id="kernel-input" style="width: 80px; height: 120px; border: 2px solid var(--border-subtle); border-radius: 12px; display: flex; flex-direction: column; align-items: center; padding: 10px; background: rgba(255,255,255,0.02);">
                            <span style="font-size: 0.7rem; color: var(--text-muted); margin-bottom: 10px;">INPUT</span>
                            <div class="data-stream" style="width: 4px; height: 60px; background: rgba(102, 126, 234, 0.2); position: relative; overflow: hidden;">
                                <div class="stream-fill" id="input-fill" style="position: absolute; bottom: 0; width: 100%; height: 0%; background: var(--accent-primary); transition: height 0.3s;"></div>
                            </div>
                        </div>
                        <svg width="40" height="20" viewBox="0 0 40 20"><path d="M0 10 L40 10 M30 0 L40 10 L30 20" stroke="var(--border-subtle)" fill="none" /></svg>
                        <div class="kernel-box" id="kernel-reasoning" style="width: 100px; height: 140px; border: 2px solid var(--accent-primary); border-radius: 12px; display: flex; flex-direction: column; align-items: center; padding: 10px; background: rgba(102, 126, 234, 0.05); box-shadow: 0 0 20px rgba(102, 126, 234, 0.1);">
                            <span style="font-size: 0.7rem; color: var(--accent-primary); margin-bottom: 10px;">REASONING</span>
                            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; width: 100%;">
                                ${Array(9).fill(0).map((_, i) => `<div class="node" id="reasoning-node-${i}" style="width: 100%; aspect-ratio: 1; background: rgba(255,255,255,0.1); border-radius: 2px;"></div>`).join('')}
                            </div>
                        </div>
                        <svg width="40" height="20" viewBox="0 0 40 20"><path d="M0 10 L40 10 M30 0 L40 10 L30 20" stroke="var(--border-subtle)" fill="none" /></svg>
                        <div class="kernel-box" id="kernel-output" style="width: 80px; height: 120px; border: 2px solid var(--border-subtle); border-radius: 12px; display: flex; flex-direction: column; align-items: center; padding: 10px; background: rgba(255,255,255,0.02);">
                            <span style="font-size: 0.7rem; color: var(--text-muted); margin-bottom: 10px;">OUTPUT</span>
                            <div id="output-text" style="font-family: var(--font-mono); font-size: 0.6rem; color: var(--accent-secondary); word-break: break-all;"></div>
                        </div>
                    </div>
                </div>
                <div class="playground-controls">
                    <div class="control-group">
                        <label>Kernal Throughput</label>
                        <input type="range" id="ssr-arch-speed" min="1" max="10" value="5">
                    </div>
                    <button id="ssr-arch-run" class="btn-playground">Start Kernel Loop</button>
                    <div class="playground-stats">
                        <div class="playground-stat">
                            <span class="stat-label">Inference Lag</span>
                            <span class="stat-value" id="ssr-arch-lag">0ms</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    let running = false;
    document.getElementById('ssr-arch-run').onclick = () => {
        if (running) return;
        running = true;
        const speed = 1000 / document.getElementById('ssr-arch-speed').value;
        const inputFill = document.getElementById('input-fill');
        const outputText = document.getElementById('output-text');
        const nodes = Array.from({ length: 9 }, (_, i) => document.getElementById(`reasoning-node-${i}`));

        function loop() {
            if (!running) return;

            // Phase 1: Input
            inputFill.style.height = '100%';
            setTimeout(() => {
                inputFill.style.height = '0%';
                // Phase 2: Reasoning
                nodes.forEach((n, i) => {
                    setTimeout(() => {
                        n.style.background = 'var(--accent-primary)';
                        n.style.boxShadow = '0 0 10px var(--accent-primary)';
                        setTimeout(() => {
                            n.style.background = 'rgba(255,255,255,0.1)';
                            n.style.boxShadow = 'none';
                        }, speed * 0.8);
                    }, i * (speed / 10));
                });

                setTimeout(() => {
                    // Phase 3: Output
                    const chars = "01ABCDEF";
                    outputText.textContent += chars[Math.floor(Math.random() * chars.length)];
                    if (outputText.textContent.length > 30) outputText.textContent = "";
                    document.getElementById('ssr-arch-lag').textContent = Math.round(15 + Math.random() * 5) + 'ms';
                    setTimeout(loop, speed / 2);
                }, speed);
            }, speed / 2);
        }
        loop();
    };
}

/**
 * SyS-Fused: Latency Hiding Demo
 */
function initSySFusedPlayground(container) {
    container.innerHTML = `
        <div class="paper-playground">
            <div class="playground-header">
                <h2>Speculative Latency Hiding</h2>
                <p>Watch how SyS-Fused executes speculation and computation in parallel to hide bottleneck delays.</p>
            </div>
            <div class="playground-grid">
                <div class="playground-canvas" id="sys-fused-canvas-container">
                    <canvas id="sys-fused-canvas"></canvas>
                </div>
                <div class="playground-controls">
                    <div class="control-group">
                        <label>Speculation Depth</label>
                        <input type="range" id="fused-depth" min="1" max="10" value="4">
                    </div>
                    <button id="fused-run" class="btn-playground">Benchmark Fusion</button>
                    <div class="playground-stats">
                        <div class="playground-stat">
                            <span class="stat-label">Fused Speedup</span>
                            <span class="stat-value" id="fused-stat">1.0x</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const canvas = document.getElementById('sys-fused-canvas');
    const ctx = canvas.getContext('2d');
    const container_el = document.getElementById('sys-fused-canvas-container');

    function resize() {
        canvas.width = container_el.clientWidth;
        canvas.height = container_el.clientHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    function draw(progress = 0, fused = false) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const yBase = 100;
        const blockW = 60;

        // Standard Execution
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.fillText('Sequential Path', 20, yBase - 20);
        ctx.fillRect(20, yBase, canvas.width - 40, 30);

        ctx.fillStyle = '#ef4444';
        ctx.fillRect(20, yBase, (canvas.width - 40) * progress, 30);

        // Fused Execution
        const yFused = 220;
        ctx.fillStyle = 'rgba(255,255,255,0.1)';
        ctx.fillText('SyS-Fused Path', 20, yFused - 20);
        ctx.fillRect(20, yFused, canvas.width - 40, 30);

        if (fused) {
            ctx.fillStyle = 'var(--accent-primary)';
            ctx.fillRect(20, yFused, (canvas.width - 40) * Math.min(1, progress * 1.8), 30);

            ctx.fillStyle = 'rgba(102, 126, 234, 0.3)';
            ctx.fillRect(20 + (canvas.width - 40) * progress, yFused, 40, 30);
            ctx.fillText('Speculation', 20 + (canvas.width - 40) * progress, yFused + 50);
        }
    }

    document.getElementById('fused-run').onclick = () => {
        let p = 0;
        const depth = document.getElementById('fused-depth').value;
        const interval = setInterval(() => {
            p += 0.01;
            draw(p, true);
            if (p >= 1) {
                clearInterval(interval);
                document.getElementById('fused-stat').textContent = (1.5 + depth * 0.1).toFixed(1) + 'x';
            }
        }, 30);
    };
    draw();
}

/**
 * is-vTRN: Inertial Search Visualizer
 */
function initISVTRNPlayground(container) {
    container.innerHTML = `
        <div class="paper-playground">
            <div class="playground-header">
                <h2>Infinite-Scale search Visualizer</h2>
                <p>Visualize how Inertial-Speculative search navigates huge search spaces with O(1) memory.</p>
            </div>
            <div class="playground-grid">
                <div class="playground-canvas" id="is-vtrn-canvas-container">
                    <canvas id="is-vtrn-canvas"></canvas>
                </div>
                <div class="playground-controls">
                    <div class="control-group">
                        <label>Momentum</label>
                        <input type="range" id="is-momentum" min="0" max="100" value="70">
                    </div>
                    <button id="is-run" class="btn-playground">Reset Search Particle</button>
                    <div class="playground-stats">
                        <div class="playground-stat">
                            <span class="stat-label">Convergence</span>
                            <span class="stat-value" id="is-stat">0%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const canvas = document.getElementById('is-vtrn-canvas');
    const ctx = canvas.getContext('2d');
    const container_el = document.getElementById('is-vtrn-canvas-container');

    function resize() { canvas.width = container_el.clientWidth; canvas.height = container_el.clientHeight; }
    window.addEventListener('resize', resize);
    resize();

    let x = 50, y = 50, vx = 2, vy = 1.5;
    const target = { x: canvas.width * 0.8, y: canvas.height * 0.8 };

    function animate() {
        ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Target
        ctx.beginPath(); ctx.arc(target.x, target.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'var(--accent-secondary)'; ctx.fill();

        const momentum = document.getElementById('is-momentum').value / 100;
        const ax = (target.x - x) * 0.001;
        const ay = (target.y - y) * 0.001;

        vx = vx * momentum + ax;
        vy = vy * momentum + ay;
        x += vx;
        y += vy;

        ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'var(--accent-primary)'; ctx.fill();
        ctx.shadowBlur = 10; ctx.shadowColor = 'var(--accent-primary)';

        const dist = Math.sqrt((target.x - x) ** 2 + (target.y - y) ** 2);
        document.getElementById('is-stat').textContent = Math.max(0, Math.round(100 - dist / 5)).toFixed(0) + '%';

        requestAnimationFrame(animate);
    }
    document.getElementById('is-run').onclick = () => { x = 50; y = 50; vx = 5; vy = 2; };
    animate();
}

/**
 * GEPARD: Genetic Evolution Visualizer
 */
function initGEPARDPlayground(container) {
    container.innerHTML = `
        <div class="paper-playground">
            <div class="playground-header">
                <h2>Genetic Policy Evolution</h2>
                <p>Observe policies evolving to solve a reward landscape.</p>
            </div>
            <div class="playground-grid">
                <div class="playground-canvas" id="gepard-canvas-container">
                    <canvas id="gepard-canvas"></canvas>
                </div>
                <div class="playground-controls">
                    <div class="control-group">
                        <label>Mutation Rate</label>
                        <input type="range" id="gepard-mutation" min="0" max="100" value="10">
                    </div>
                    <button id="gepard-run" class="btn-playground">Evolve Generation</button>
                    <div class="playground-stats">
                        <div class="playground-stat">
                            <span class="stat-label">Generation</span>
                            <span class="stat-value" id="gepard-gen">0</span>
                        </div>
                        <div class="playground-stat">
                            <span class="stat-label">Best Fitness</span>
                            <span class="stat-value" id="gepard-fit">0.00</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const canvas = document.getElementById('gepard-canvas');
    const ctx = canvas.getContext('2d');
    const container_el = document.getElementById('gepard-canvas-container');

    function resize() { canvas.width = container_el.clientWidth; canvas.height = container_el.clientHeight; }
    window.addEventListener('resize', resize);
    resize();

    let pop = Array(50).fill(0).map(() => ({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, fit: 0 }));
    let gen = 0;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Reward hill
        const gr = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, 200);
        gr.addColorStop(0, 'rgba(102, 126, 234, 0.2)');
        gr.addColorStop(1, 'transparent');
        ctx.fillStyle = gr; ctx.fillRect(0, 0, canvas.width, canvas.height);

        pop.forEach(p => {
            ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${0.2 + p.fit})`; ctx.fill();
        });
    }

    document.getElementById('gepard-run').onclick = () => {
        const mut = document.getElementById('gepard-mutation').value / 100;
        gen++;
        pop.forEach(p => {
            const dx = p.x - canvas.width / 2;
            const dy = p.y - canvas.height / 2;
            p.fit = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 300);
        });
        pop.sort((a, b) => b.fit - a.fit);
        const best = pop[0];
        document.getElementById('gepard-gen').textContent = gen;
        document.getElementById('gepard-fit').textContent = best.fit.toFixed(2);

        // Repopulate
        for (let i = 10; i < 50; i++) {
            const parent = pop[Math.floor(Math.random() * 5)];
            pop[i] = {
                x: parent.x + (Math.random() - 0.5) * 100 * mut,
                y: parent.y + (Math.random() - 0.5) * 100 * mut,
                fit: 0
            };
        }
        draw();
    };
    draw();
}

/**
 * Cognitive Resonance: Neural frequency synchronization
 */
function initCognitiveResonancePlayground(container) {
    container.innerHTML = `
        <div class="paper-playground">
            <div class="playground-header">
                <h2>Neural Resonance Mapper</h2>
                <p>Adjust system coherence to synchronize neural oscillators.</p>
            </div>
            <div class="playground-grid">
                <div class="playground-canvas" id="cogni-canvas-container">
                    <canvas id="cogni-canvas"></canvas>
                </div>
                <div class="playground-controls">
                    <div class="control-group">
                        <label>Coherence Factor</label>
                        <input type="range" id="cogni-coherence" min="0" max="100" value="20">
                    </div>
                    <div class="playground-stats">
                        <div class="playground-stat">
                            <span class="stat-label">Resonance Index</span>
                            <span class="stat-value" id="cogni-stat">0.00</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const canvas = document.getElementById('cogni-canvas');
    const ctx = canvas.getContext('2d');
    const container_el = document.getElementById('cogni-canvas-container');

    function resize() { canvas.width = container_el.clientWidth; canvas.height = container_el.clientHeight; }
    window.addEventListener('resize', resize);
    resize();

    let t = 0;
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const coh = document.getElementById('cogni-coherence').value / 100;

        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.strokeStyle = i === 0 ? 'var(--accent-primary)' : `rgba(255,255,255,${0.1 + i * 0.1})`;
            const phase = i * (1 - coh) * 2;
            for (let x = 0; x < canvas.width; x++) {
                const y = canvas.height / 2 + Math.sin(x * 0.02 + t + phase) * 50;
                if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        t += 0.05;
        document.getElementById('cogni-stat').textContent = coh.toFixed(2);
        requestAnimationFrame(draw);
    }
    draw();
}

/**
 * SSR Omega: Modular Reasoning Explorer
 */
function initSSROmegaPlayground(container) {
    container.innerHTML = `
        <div class="paper-playground">
            <div class="playground-header">
                <h2>Reasoning Module Explorer</h2>
                <p>Observe how SSR Omega activates specialized reasoning modules in parallel.</p>
            </div>
            <div class="playground-grid">
                <div class="playground-canvas" id="omega-canvas-container">
                    <canvas id="omega-canvas"></canvas>
                </div>
                <div class="playground-controls">
                    <div class="control-group">
                        <label>Input Complexity</label>
                        <input type="range" id="omega-complexity" min="1" max="100" value="50">
                    </div>
                    <div class="control-group">
                        <label>Reasoning Type</label>
                        <select id="omega-type" class="btn-playground" style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); width: 100%;">
                            <option value="logic">Logical Deduction</option>
                            <option value="math">Mathematical Proof</option>
                            <option value="ethics">Ethical Alignment</option>
                            <option value="code">System Synthesis</option>
                        </select>
                    </div>
                    <button id="omega-run" class="btn-playground">Execute Reasoning Trace</button>
                    <div class="playground-stats">
                        <div class="playground-stat">
                            <span class="stat-label">Active Modules</span>
                            <span class="stat-value" id="omega-stat-modules">0</span>
                        </div>
                        <div class="playground-stat">
                            <span class="stat-label">Consensus Score</span>
                            <span class="stat-value" id="omega-stat-consensus">0%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const canvas = document.getElementById('omega-canvas');
    const ctx = canvas.getContext('2d');
    const container_el = document.getElementById('omega-canvas-container');

    function resize() {
        canvas.width = container_el.clientWidth;
        canvas.height = container_el.clientHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const modules = [
        { name: 'Core', x: 0.5, y: 0.5, size: 20, active: true },
        { name: 'Logic', x: 0.3, y: 0.3, size: 15, active: false },
        { name: 'Math', x: 0.7, y: 0.3, size: 15, active: false },
        { name: 'Semantic', x: 0.3, y: 0.7, size: 15, active: false },
        { name: 'Ethics', x: 0.7, y: 0.7, size: 15, active: false },
        { name: 'Memory', x: 0.5, y: 0.2, size: 12, active: false },
        { name: 'Safety', x: 0.5, y: 0.8, size: 12, active: false }
    ];

    let particles = [];
    let isRunning = false;

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update particles
        particles = particles.filter(p => p.life > 0);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.01;
            ctx.beginPath();
            ctx.arc(p.x * canvas.width, p.y * canvas.height, 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(102, 126, 234, ${p.life})`;
            ctx.fill();
        });

        // Draw connections
        ctx.strokeStyle = 'rgba(102, 126, 234, 0.1)';
        ctx.lineWidth = 1;
        modules.forEach((m1, i) => {
            modules.slice(i + 1).forEach(m2 => {
                ctx.beginPath();
                ctx.moveTo(m1.x * canvas.width, m1.y * canvas.height);
                ctx.lineTo(m2.x * canvas.width, m2.y * canvas.height);
                ctx.stroke();
            });
        });

        // Draw modules
        modules.forEach(m => {
            const x = m.x * canvas.width;
            const y = m.y * canvas.height;

            ctx.beginPath();
            ctx.arc(x, y, m.size, 0, Math.PI * 2);
            ctx.fillStyle = m.active ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)';
            ctx.fill();

            if (m.active) {
                ctx.shadowBlur = 15;
                ctx.shadowColor = 'var(--accent-primary)';
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.shadowBlur = 0;
            } else {
                ctx.strokeStyle = 'rgba(255,255,255,0.1)';
                ctx.stroke();
            }

            ctx.fillStyle = 'white';
            ctx.font = '10px JetBrains Mono';
            ctx.textAlign = 'center';
            ctx.fillText(m.name, x, y + m.size + 15);
        });

        requestAnimationFrame(draw);
    }

    document.getElementById('omega-run').onclick = () => {
        if (isRunning) return;
        isRunning = true;

        const type = document.getElementById('omega-type').value;
        const complexity = document.getElementById('omega-complexity').value;

        // Simulated reasoning trace
        modules.forEach(m => m.active = false);
        modules[0].active = true; // Core always active

        let step = 0;
        const interval = setInterval(() => {
            step++;
            if (step === 1) {
                if (type === 'logic') modules[1].active = true;
                if (type === 'math') modules[2].active = true;
                if (type === 'ethics') modules[4].active = true;
                if (type === 'code') { modules[1].active = true; modules[2].active = true; }
            } else if (step === 2) {
                modules[3].active = true; // Semantic context
                modules[5].active = true; // Memory check
            } else if (step === 3) {
                modules[6].active = complexity > 70; // Safety audit for high complexity
            } else {
                clearInterval(interval);
                isRunning = false;
                document.getElementById('omega-stat-modules').textContent = modules.filter(m => m.active).length;
                document.getElementById('omega-stat-consensus').textContent = Math.round(90 + Math.random() * 9) + '%';
            }

            // Emit particles
            for (let i = 0; i < 20; i++) {
                particles.push({
                    x: 0.5, y: 0.5,
                    vx: (Math.random() - 0.5) * 0.02,
                    vy: (Math.random() - 0.5) * 0.02,
                    life: 1.0
                });
            }
        }, 600);
    };

    draw();
}

/**
 * vTRN: Complexity Stress Test
 */
function initVTRNPlayground(container) {
    container.innerHTML = `
        <div class="paper-playground">
            <div class="playground-header">
                <h2>Complexity Stress Test</h2>
                <p>Compare vTRN's linear O(n) scaling against standard Transformer O(n²) complexity.</p>
            </div>
            <div class="playground-grid">
                <div class="playground-canvas" id="vtrn-canvas-container">
                    <canvas id="vtrn-canvas"></canvas>
                </div>
                <div class="playground-controls">
                    <div class="control-group">
                        <label>Sequence Length (Tokens)</label>
                        <input type="range" id="vtrn-tokens" min="512" max="32768" step="512" value="8192">
                        <span id="vtrn-token-value" style="font-size: 0.8rem; color: var(--accent-primary);">8192</span>
                    </div>
                    <button id="vtrn-run" class="btn-playground">Run Benchmark Simulation</button>
                    <div class="playground-stats">
                        <div class="playground-stat">
                            <span class="stat-label">vTRN Latency</span>
                            <span class="stat-value" id="vtrn-stat-vtrn">0ms</span>
                        </div>
                        <div class="playground-stat">
                            <span class="stat-label">Transformer Latency</span>
                            <span class="stat-value" id="vtrn-stat-trans" style="color: #ef4444;">0ms</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const canvas = document.getElementById('vtrn-canvas');
    const ctx = canvas.getContext('2d');
    const container_el = document.getElementById('vtrn-canvas-container');

    function resize() {
        canvas.width = container_el.clientWidth;
        canvas.height = container_el.clientHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const slider = document.getElementById('vtrn-tokens');
    const tokenVal = document.getElementById('vtrn-token-value');
    slider.oninput = () => tokenVal.textContent = slider.value;

    function drawGraph(n) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const padding = 40;
        const w = canvas.width - padding * 2;
        const h = canvas.height - padding * 2;

        // Axes
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, padding + h);
        ctx.lineTo(padding + w, padding + h);
        ctx.stroke();

        // O(n) - vTRN (Linear)
        ctx.strokeStyle = 'var(--accent-primary)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(padding, padding + h);
        ctx.lineTo(padding + w * (n / 32768), padding + h - (h * 0.3 * (n / 32768)));
        ctx.stroke();

        // O(n^2) - Transformer (Quadratic)
        ctx.strokeStyle = '#ef4444';
        const progress = n / 32768;
        ctx.beginPath();
        ctx.moveTo(padding, padding + h);
        for (let i = 0; i <= progress; i += 0.01) {
            const x = padding + w * i;
            const y = padding + h - (h * 0.9 * (i * i));
            ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.fillStyle = 'white';
        ctx.font = '10px JetBrains Mono';
        ctx.fillText('vTRN O(n)', padding + w * progress, padding + h - (h * 0.3 * progress) - 10);
        ctx.fillText('Transformer O(n²)', padding + w * progress, padding + h - (h * 0.9 * progress * progress) - 10);
    }

    document.getElementById('vtrn-run').onclick = () => {
        const n = parseInt(slider.value);
        drawGraph(n);

        const vtrnMs = Math.round(n * 0.01);
        const transMs = Math.round((n * n) * 0.00001);

        let counter = 0;
        const interval = setInterval(() => {
            counter += 10;
            if (counter <= vtrnMs) document.getElementById('vtrn-stat-vtrn').textContent = counter + 'ms';
            if (counter <= transMs) document.getElementById('vtrn-stat-trans').textContent = counter + 'ms';
            if (counter > vtrnMs && counter > transMs) clearInterval(interval);
        }, 10);
    };

    drawGraph(8192);
}

/**
 * SDRC: Compression Quality Slider
 */
function initSDRCPlayground(container) {
    container.innerHTML = `
        <div class="paper-playground">
            <div class="playground-header">
                <h2>Compression Quality Simulator</h2>
                <p>Adjust the compression ratio to see its impact on knowledge retention and speed.</p>
            </div>
            <div class="playground-grid">
                <div class="playground-canvas" id="sdrc-canvas-container">
                    <div id="sdrc-visual" style="width: 80%; text-align: left; font-family: var(--font-mono); font-size: 0.8rem; line-height: 1.2;">
                        <div style="color: var(--accent-primary); margin-bottom: 5px;">> INITIALIZING QUANTIZATION MAP...</div>
                        <div id="sdrc-blocks" style="display: grid; grid-template-columns: repeat(20, 1fr); gap: 2px;"></div>
                    </div>
                </div>
                <div class="playground-controls">
                    <div class="control-group">
                        <label>Compression Ratio</label>
                        <input type="range" id="sdrc-ratio" min="2" max="16" step="1" value="4">
                        <span id="sdrc-ratio-value" style="font-size: 0.8rem; color: var(--accent-primary);">4x</span>
                    </div>
                    <div class="playground-stats">
                        <div class="playground-stat">
                            <span class="stat-label">Memory Saved</span>
                            <span class="stat-value" id="sdrc-stat-memory">75%</span>
                        </div>
                        <div class="playground-stat">
                            <span class="stat-label">Retention</span>
                            <span class="stat-value" id="sdrc-stat-retention">99.2%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const ratioSlider = document.getElementById('sdrc-ratio');
    const ratioVal = document.getElementById('sdrc-ratio-value');
    const blocks = document.getElementById('sdrc-blocks');

    function update() {
        const r = parseInt(ratioSlider.value);
        ratioVal.textContent = r + 'x';

        const memory = Math.round((1 - 1 / r) * 100);
        const retention = (100 - (r * 0.1)).toFixed(1);

        document.getElementById('sdrc-stat-memory').textContent = memory + '%';
        document.getElementById('sdrc-stat-retention').textContent = retention + '%';

        blocks.innerHTML = '';
        for (let i = 0; i < 200; i++) {
            const block = document.createElement('div');
            block.style.height = '10px';
            block.style.background = Math.random() < (1 / r) ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)';
            block.style.borderRadius = '2px';
            blocks.appendChild(block);
        }
    }

    ratioSlider.oninput = update;
    update();
}
