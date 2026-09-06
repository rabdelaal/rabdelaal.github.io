/* Romain Abdel-Aal — site interactions
   1. JS flag (reveal styles only apply when JS runs)
   2. Scroll reveal (IntersectionObserver)
   3. Career timeline: build, navigate, search-filter, drag, modal deep-dive
*/

document.documentElement.classList.add('js');

/* ---------- 2. Reveal on scroll ---------- */
(function () {
    const els = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
        els.forEach(el => el.classList.add('revealed'));
        return;
    }
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
})();

/* ---------- 3. Timeline ---------- */
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('timeline-track');
    const viewport = document.getElementById('timeline-viewport');
    const readout = document.getElementById('timeline-readout');
    const searchInput = document.getElementById('timeline-search');
    const emptyMsg = document.getElementById('timeline-empty');
    const modalContainer = document.getElementById('modal-container');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    if (!track || !viewport || !readout) return;

    const projects = [
        {
            year: '2012',
            title: 'Genesis Node',
            role: 'Software Developer → Team Lead',
            brief: 'The starting point: the genesis of a career focused on leveraging technology to build innovative solutions.',
            tags: 'web mobile architecture leadership lifecycle',
            deepDive: '<h3>Core Competencies</h3><ul><li>Software Development Lifecycle</li><li>Team Leadership</li><li>Web &amp; Mobile Application Development</li><li>System Architecture</li></ul>'
        },
        {
            year: '2016',
            title: 'AdTech Predictive Engine',
            role: 'Solution Architect — RhythmOne',
            brief: 'Architected systems integrating user-behavior prediction into a high-throughput ad platform, with optimized real-time data pipelines.',
            tags: 'adtech prediction pipelines realtime algorithms api',
            deepDive: '<h3>Technical Details</h3><ul><li>Collaborated with data scientists on algorithm design.</li><li>Integrated partner APIs for real-time data ingestion.</li><li>Optimized ad formats from static images to dynamic HTML5.</li><li>Supported media traders managing high-spend campaigns.</li></ul>'
        },
        {
            year: '2017',
            title: 'Decentralized Systems',
            role: 'Cryptocurrency Consultant',
            brief: 'Pioneered early-stage crypto-finance applications: smart contract development and a private investment group focused on blockchain.',
            tags: 'solidity erc20 ethereum blockchain crypto remix binance trading',
            deepDive: '<h3>Technical Details</h3><ul><li>Developed Ethereum tokens (ERC-20) and smart contracts using Solidity.</li><li>Created automated earnings-sharing systems on the blockchain.</li><li>Consulted on trading strategies and portfolio management.</li><li>Environment: Remix IDE, Binance API, Discord.</li></ul>'
        },
        {
            year: '2020',
            title: 'Enterprise Architecture',
            role: 'CEO & Solution Architect — Xaartaz',
            brief: 'Designed and orchestrated end-to-end IT solutions for enterprise clients, focused on system optimization and complex API integrations.',
            tags: 'enterprise ceo xaartaz api integration architecture documentation',
            deepDive: '<h3>Key Responsibilities</h3><ul><li>Defined technical and functional architectures.</li><li>Led cross-functional teams and coordinated deliverables.</li><li>Translated business requirements into technical specifications.</li><li>Created comprehensive technical and functional documentation.</li></ul>'
        },
        {
            year: '2024',
            title: 'Project: AstralAGI',
            role: 'Autonomous AI Architect',
            brief: 'Built a specialized AI agent for generative astrology — a proof-of-concept for fine-tuning LLMs on niche, domain-specific knowledge.',
            tags: 'astralagi rag langchain python vectordb openai anthropic agent llm',
            deepDive: '<h3>Architectural Breakdown</h3><ul><li><strong>Core engine:</strong> hybrid RAG (Retrieval-Augmented Generation) system.</li><li><strong>Knowledge base:</strong> vector database populated with a custom corpus of astrological texts.</li><li><strong>Reasoning:</strong> proprietary prompt chaining and tree-of-thought techniques for multi-layered interpretations.</li><li><strong>Stack:</strong> OpenAI/Anthropic APIs, LangChain, Python, vector DBs.</li></ul>'
        },
        {
            year: '2025–26',
            title: 'The SSR Paradigm',
            role: 'Lead Research Architect',
            brief: 'Developing the SSR Omega architecture and vTRN sequence models — modular, parallel, latency-hiding neural systems.',
            tags: 'ssr vtrn research omega speculative modular papers',
            deepDive: '<h3>Current Research Focus</h3><ul><li><strong>vTRN:</strong> an O(n) complexity alternative to Transformers.</li><li><strong>SyS-Fused:</strong> speculative optimization techniques.</li><li><strong>Modular AI:</strong> breaking monolithic "black box" models into specialized experts.</li><li><strong>Strategic collaborations:</strong> working with organizations such as Microsoft and Amazon on large-scale implementations.</li></ul>'
        }
    ];

    let currentIndex = 0;
    let offset = 0;
    let dragging = false;
    let dragStartX = 0;
    let dragStartOffset = 0;
    let movedWhileDragging = false;

    function buildTimeline() {
        projects.forEach((p, i) => {
            const node = document.createElement('button');
            node.type = 'button';
            node.className = 'tl-node';
            node.dataset.index = i;
            node.innerHTML = `
                <span class="tl-commit">commit — ${String(i + 1).padStart(2, '0')}</span>
                <span class="tl-dot" aria-hidden="true"></span>
                <span class="tl-year">${p.year}</span>
                <span class="tl-title" style="display:block">${p.title}</span>
                <span class="tl-role" style="display:block">${p.role}</span>
            `;
            track.appendChild(node);
        });
    }

    function centerOn(index, instant = false) {
        const nodes = track.querySelectorAll('.tl-node');
        if (index < 0 || index >= nodes.length || !nodes[index]) return;
        if (instant) track.style.transition = 'none';
        const target = nodes[index];
        const viewportCenter = viewport.offsetWidth / 2;
        const nodeCenter = target.offsetLeft + target.offsetWidth / 2;
        const trackWidth = track.scrollWidth;
        let targetOffset = viewportCenter - nodeCenter;

        // Clamp so the track never leaves an empty gap on either side
        const minOffset = Math.min(0, viewport.offsetWidth - trackWidth);
        targetOffset = Math.max(minOffset, Math.min(0, targetOffset));

        offset = targetOffset;
        track.style.transform = `translateX(${offset}px)`;
        if (instant) requestAnimationFrame(() => { track.style.transition = ''; });

        nodes.forEach(n => n.classList.remove('active'));
        target.classList.add('active');
        currentIndex = index;
        renderReadout(projects[index]);
    }

    function renderReadout(p) {
        readout.innerHTML = `
            <h4>system.log — ${p.year} · ${p.title}</h4>
            <p>${p.brief}</p>
            <button type="button" class="btn" id="deep-dive-btn">Deep dive »</button>
        `;
        document.getElementById('deep-dive-btn').addEventListener('click', () => showModal(p));
    }

    function showModal(p) {
        modalTitle.textContent = p.title;
        modalBody.innerHTML = p.deepDive;
        modalContainer.classList.add('visible');
        modalContainer.setAttribute('aria-hidden', 'false');
        document.getElementById('modal-close').focus();
    }

    function closeModal() {
        modalContainer.classList.remove('visible');
        modalContainer.setAttribute('aria-hidden', 'true');
    }

    /* --- Search filter --- */
    function applyFilter() {
        const q = (searchInput.value || '').trim().toLowerCase();
        const nodes = track.querySelectorAll('.tl-node');
        let firstMatch = -1;
        nodes.forEach((node, i) => {
            const p = projects[i];
            const haystack = `${p.year} ${p.title} ${p.role} ${p.brief} ${p.tags}`.toLowerCase();
            const match = !q || haystack.includes(q);
            node.classList.toggle('hidden-by-filter', !match);
            if (match && firstMatch === -1) firstMatch = i;
        });
        emptyMsg.style.display = firstMatch === -1 ? 'block' : 'none';
        track.style.visibility = firstMatch === -1 ? 'hidden' : 'visible';
        if (firstMatch !== -1) centerOn(firstMatch);
    }

    /* --- Drag to explore --- */
    viewport.addEventListener('pointerdown', (e) => {
        if (e.target.closest('.tl-node')) { movedWhileDragging = false; }
        dragging = true;
        movedWhileDragging = false;
        dragStartX = e.clientX;
        dragStartOffset = offset;
        viewport.classList.add('dragging');
        track.classList.add('dragging');
        viewport.setPointerCapture(e.pointerId);
    });

    viewport.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        const dx = e.clientX - dragStartX;
        if (Math.abs(dx) > 6) movedWhileDragging = true;
        const minOffset = Math.min(0, viewport.offsetWidth - track.scrollWidth);
        offset = Math.max(minOffset, Math.min(0, dragStartOffset + dx));
        track.style.transform = `translateX(${offset}px)`;
    });

    function endDrag() {
        if (!dragging) return;
        dragging = false;
        viewport.classList.remove('dragging');
        track.classList.remove('dragging');
        if (movedWhileDragging) {
            // Snap to the node closest to the viewport center
            const nodes = track.querySelectorAll('.tl-node:not(.hidden-by-filter)');
            let best = 0, bestDist = Infinity;
            nodes.forEach(n => {
                const center = n.offsetLeft + n.offsetWidth / 2 + offset;
                const dist = Math.abs(center - viewport.offsetWidth / 2);
                if (dist < bestDist) { bestDist = dist; best = parseInt(n.dataset.index, 10); }
            });
            centerOn(best);
        }
    }
    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);

    track.addEventListener('click', (e) => {
        const node = e.target.closest('.tl-node');
        if (node && !movedWhileDragging) centerOn(parseInt(node.dataset.index, 10));
    });

    viewport.addEventListener('wheel', (e) => {
        // Horizontal intent (shift+wheel or trackpads) navigates the timeline
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            e.preventDefault();
            centerOn(currentIndex + (e.deltaX > 0 ? 1 : -1));
        }
    }, { passive: false });

    /* --- Controls --- */
    document.getElementById('timeline-prev').addEventListener('click', () => centerOn(currentIndex - 1));
    document.getElementById('timeline-next').addEventListener('click', () => centerOn(currentIndex + 1));
    searchInput.addEventListener('input', applyFilter);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
        if (modalContainer.classList.contains('visible')) return;
        if (e.key === 'ArrowRight' && isVisible(viewport)) centerOn(currentIndex + 1);
        if (e.key === 'ArrowLeft' && isVisible(viewport)) centerOn(currentIndex - 1);
    });

    function isVisible(el) {
        const r = el.getBoundingClientRect();
        return r.top < window.innerHeight && r.bottom > 0;
    }

    document.getElementById('modal-close').addEventListener('click', closeModal);
    modalContainer.addEventListener('click', (e) => { if (e.target === modalContainer) closeModal(); });

    window.addEventListener('resize', () => centerOn(currentIndex, true));

    // Init
    buildTimeline();
    applyFilter();
    centerOn(0);
});
