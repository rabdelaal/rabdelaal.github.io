// Lazy-load hero video source when user interacts to reduce initial load
(function(){
    const vid = document.getElementById('intro-video');
    if(!vid) return;
    const src = vid.querySelector('source');
    const realSrc = src ? src.getAttribute('src') : null;
    if(!realSrc) return;
    // Remove source to avoid eager load on some browsers
    src.removeAttribute('src');
    vid.load();

    function attachAndPlay(){
        if(src.getAttribute('src')) return;
        src.setAttribute('src', realSrc);
        vid.load();
        // do not auto-play but allow user to start
        document.removeEventListener('click', attachAndPlay);
        document.removeEventListener('keydown', attachAndPlay);
    }

    document.addEventListener('click', attachAndPlay, {once:true});
    document.addEventListener('keydown', attachAndPlay, {once:true});
    vid.addEventListener('play', () => { if(!src.getAttribute('src')) attachAndPlay(); });
})();
