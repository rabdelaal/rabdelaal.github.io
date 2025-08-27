document.addEventListener('DOMContentLoaded', () => {
    const search = document.getElementById('timeline-search');
    const prevBtn = document.getElementById('timeline-prev');
    const nextBtn = document.getElementById('timeline-next');
    const wrapper = document.getElementById('timeline-wrapper');

    function filterNodes(q){
        const nodes = document.querySelectorAll('.timeline-node');
        nodes.forEach(n => {
            const text = n.textContent.toLowerCase();
            const show = !q || text.includes(q.toLowerCase());
            n.style.display = show ? '' : 'none';
        });
    }

    search && search.addEventListener('input', (e) => filterNodes(e.target.value));

    prevBtn && prevBtn.addEventListener('click', () => {
        // simulate left arrow
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    });
    nextBtn && nextBtn.addEventListener('click', () => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    });
});
