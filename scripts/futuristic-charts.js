// Render animated futuristic SVG charts into <div data-fchart> placeholders
document.addEventListener('DOMContentLoaded', () => {
    const placeholders = document.querySelectorAll('[data-fchart]');
    placeholders.forEach((el, idx) => {
        const w = Math.min(window.innerWidth - 80, 760);
        const h = 240;
        const ns = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(ns, 'svg');
        svg.setAttribute('width', w);
        svg.setAttribute('height', h);
        svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
        svg.style.display = 'block';
        svg.style.margin = '8px 0 18px 0';
        svg.style.borderRadius = '8px';
        svg.style.overflow = 'visible';

        // Background grid
        for(let i=0;i<6;i++){
            const g = document.createElementNS(ns,'rect');
            g.setAttribute('x',0);
            g.setAttribute('y', i*(h/6));
            g.setAttribute('width', w);
            g.setAttribute('height', 1);
            g.setAttribute('fill', i%2===0 ? 'rgba(0,255,255,0.03)' : 'rgba(191,0,255,0.02)');
            svg.appendChild(g);
        }

        // Animated wave path
        const path = document.createElementNS(ns,'path');
        path.setAttribute('fill','none');
        path.setAttribute('stroke','url(#grad'+idx+')');
        path.setAttribute('stroke-width','3');
        path.setAttribute('stroke-linecap','round');
        path.setAttribute('d','');
        path.setAttribute('opacity','0.95');

        const defs = document.createElementNS(ns,'defs');
        const grad = document.createElementNS(ns,'linearGradient');
        grad.setAttribute('id','grad'+idx);
        grad.setAttribute('x1','0%'); grad.setAttribute('x2','100%');
        const stop1 = document.createElementNS(ns,'stop'); stop1.setAttribute('offset','0%'); stop1.setAttribute('stop-color','#00fff0'); stop1.setAttribute('stop-opacity','0.95');
        const stop2 = document.createElementNS(ns,'stop'); stop2.setAttribute('offset','100%'); stop2.setAttribute('stop-color','#bf00ff'); stop2.setAttribute('stop-opacity','0.95');
        grad.appendChild(stop1); grad.appendChild(stop2); defs.appendChild(grad);
        svg.appendChild(defs);
        svg.appendChild(path);

        el.appendChild(svg);

        // animate via JS
        let t = 0;
        function frame(){
            const points = 8;
            const amp = h*0.32;
            const baseY = h/2;
            let d = `M 0 ${baseY}`;
            for(let i=1;i<=points;i++){
                const x = (i/points)*w;
                const y = baseY + Math.sin((i*0.7) + t*0.02) * amp * Math.sin(t*0.005 + i);
                d += ` L ${x} ${y}`;
            }
            path.setAttribute('d', d);
            t++;
            requestAnimationFrame(frame);
        }
        requestAnimationFrame(frame);
    });
});
