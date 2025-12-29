document.addEventListener('DOMContentLoaded', () => {
    const projects = [
        {
            year: '2012',
            title: 'Genesis Node',
            role: 'Romain Abdel-Aal',
            img: '/images/profileimage.webp',
            brief: 'The starting point. This represents the genesis of a career focused on leveraging technology to build innovative solutions.',
            deepDive: '<h3>Core Competencies</h3><ul><li>Software Development Lifecycle</li><li>Team Leadership</li><li>Web & Mobile Application Development</li><li>System Architecture</li></ul>'
        },
        {
            year: '2016',
            title: 'AdTech Predictive Engine',
            role: 'Solution Architect',
            icon: '📡',
            brief: 'At RythmOne, I architected systems to integrate user behavior prediction algorithms into a high-throughput ad platform. This involved optimizing real-time data pipelines.',
            deepDive: '<h3>Technical Details</h3><ul><li>Collaborated with Data Scientists on algorithm design.</li><li>Integrated partner APIs for real-time data ingestion.</li><li>Optimized advertising formats from static images to dynamic HTML5.</li><li>Provided technical support for media traders managing high-spend campaigns.</li></ul>'
        },
        {
            year: '2017',
            title: 'Decentralized Systems',
            role: 'Cryptocurrency Consultant',
            icon: '🔗',
            brief: 'Pioneered early-stage crypto-finance applications. This phase involved smart contract development and managing a private investment group focused on blockchain technology.',
            deepDive: '<h3>Technical Details</h3><ul><li>Developed Ethereum tokens (ERC-20) and smart contracts using Solidity.</li><li>Created automated earnings-sharing systems on the blockchain.</li><li>Provided technical consulting on trading strategies and portfolio management.</li><li>Environment: Remix IDE, Binance API, Discord.</li></ul>'
        },
        {
            year: '2020',
            title: 'Enterprise Architecture',
            role: 'CEO & Solution Architect',
            icon: '🏢',
            brief: 'As founder of Xaartaz, I designed and orchestrated end-to-end IT solutions for enterprise clients, focusing on system optimization and complex API integrations.',
            deepDive: '<h3>Key Responsibilities</h3><ul><li>Defined technical and functional architectures.</li><li>Led cross-functional teams and coordinated project deliverables.</li><li>Managed client relationships and translated business requirements into technical specifications.</li><li>Created comprehensive technical and functional documentation.</li></ul>'
        },
        {
            year: '2024',
            title: 'Project: AstralAGI',
            role: 'Autonomous AI Architect',
            icon: '✨',
            brief: 'Creator of a specialized AI agent for generative astrology. This project serves as a proof-of-concept for fine-tuning LLMs on niche, domain-specific knowledge.',
            deepDive: '<h3>Architectural Breakdown</h3><ul><li>**Core Engine:** Hybrid RAG (Retrieval-Augmented Generation) system.</li><li>**Knowledge Base:** Vector database populated with a custom corpus of astrological texts.</li><li>**Reasoning:** Proprietary prompt chaining and tree-of-thought techniques for multi-layered interpretations.</li><li>**Stack:** OpenAI/Anthropic APIs, LangChain, Python, VectorDBs.</li></ul>'
        },
        {
            year: '2025-2026',
            title: 'The SSR Paradigm',
            role: 'Lead Research Architect',
            icon: '⚡',
            brief: 'Developing the SSR Omega Architecture and vTRN sequence models. Focusing on modular, parallel, and latency-hiding neural systems.',
            deepDive: '<h3>Current Research Focus</h3><ul><li>**vTRN:** O(n) complexity alternative to Transformers.</li><li>**SyS-Fused:** Speculative optimization techniques.</li><li>**Modular AI:** Breaking monolithic "black box" models into specialized experts.</li><li>**Strategic Collaborations:** Partnering with organizations like Microsoft and Amazon to test large-scale implementations.</li></ul>'
        }
    ];

    const wrapper = document.getElementById('timeline-wrapper');
    const agiGuide = document.getElementById('agi-guide');
    const modalContainer = document.getElementById('modal-container');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    let currentNodeIndex = 0;
    let timelinePosition = 0;
    let isDragging = false;
    let startX, scrollLeft;

    function buildTimeline() {
        projects.forEach((p, index) => {
            const nodeEl = document.createElement('div');
            nodeEl.className = 'timeline-node';
            nodeEl.dataset.index = index;

            const coreContent = p.img ? `<img src="${p.img}" alt="Profile Picture">` : p.icon;

            nodeEl.innerHTML = `
                <div class="node-core">${coreContent}</div>
                <div class="node-date">${p.year}</div>
                <div class="node-title">${p.title}</div>
                <div class="node-role">${p.role}</div>
            `;
            wrapper.appendChild(nodeEl);
        });
    }

    function navigateToNode(index) {
        if (index < 0 || index >= projects.length) return;
        currentNodeIndex = index;
        const nodes = document.querySelectorAll('.timeline-node');
        const targetNode = nodes[index];

        const containerCenter = window.innerWidth / 2;
        const nodeCenter = targetNode.offsetLeft + targetNode.offsetWidth / 2;

        timelinePosition = containerCenter - nodeCenter;
        wrapper.style.transform = `translateX(${timelinePosition}px)`;

        nodes.forEach(n => n.classList.remove('active'));
        targetNode.classList.add('active');

        updateAgiGuide(index);
    }

    function updateAgiGuide(index) {
        const project = projects[index];
        agiGuide.innerHTML = `
            <h4>SYSTEM.LOG: Node ${project.year}</h4>
            <p>${project.brief}</p>
            <button id="deep-dive-btn" data-index="${index}">DEEP DIVE »</button>
        `;
        document.getElementById('deep-dive-btn').onclick = () => showModal(index);
    }

    function showModal(index) {
        const project = projects[index];
        modalTitle.textContent = project.title;
        modalBody.innerHTML = project.deepDive;
        modalContainer.classList.add('visible');
    }

    // Event Listeners
    wrapper.addEventListener('click', e => {
        const node = e.target.closest('.timeline-node');
        if (node) navigateToNode(parseInt(node.dataset.index));
    });

    window.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') navigateToNode(currentNodeIndex + 1);
        if (e.key === 'ArrowLeft') navigateToNode(currentNodeIndex - 1);
        if (e.key === 'Escape') modalContainer.classList.remove('visible');
    });

    document.getElementById('modal-close').onclick = () => modalContainer.classList.remove('visible');

    const container = document.getElementById('timeline-container');
    container.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - wrapper.offsetLeft;
        scrollLeft = wrapper.style.transform ? parseFloat(wrapper.style.transform.replace('translateX(', '')) : 0;
        container.style.cursor = 'grabbing';
    });
    container.addEventListener('mouseleave', () => { isDragging = false; container.style.cursor = 'grab'; });
    container.addEventListener('mouseup', () => { isDragging = false; container.style.cursor = 'grab'; });
    container.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        // Find closest node to the center
        // Simple implementation for now, full drag is complex
    });

    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (e.deltaY > 0) navigateToNode(currentNodeIndex + 1);
        else navigateToNode(currentNodeIndex - 1);
    });

    // Init
    buildTimeline();
    navigateToNode(0);
});
