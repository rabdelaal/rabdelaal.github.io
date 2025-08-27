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
        // Attach subtitles based on browser language preference
        try {
            const langs = (navigator.languages || [navigator.language || 'en']).map(l=>l.split('-')[0]);
            const added = new Set();
            for(const lang of langs){
                const path = `videos/hero.${lang}.vtt`;
                // quick existence check using fetch with HEAD (non-blocking, best-effort)
                fetch(path, {method: 'HEAD'}).then(res=>{
                    if(res.ok && !added.has(lang)){
                        const track = document.createElement('track');
                        track.kind = 'subtitles';
                        track.srclang = lang;
                        track.label = lang.toUpperCase();
                        track.src = path;
                        if(!vid.querySelector('track')) track.default = true;
                        vid.appendChild(track);
                        added.add(lang);
                    }
                }).catch(()=>{});
            }
        } catch(e){}
        vid.load();
        // do not auto-play but allow user to start
        document.removeEventListener('click', attachAndPlay);
        document.removeEventListener('keydown', attachAndPlay);
    }

    document.addEventListener('click', attachAndPlay, {once:true});
    document.addEventListener('keydown', attachAndPlay, {once:true});
    vid.addEventListener('play', () => { if(!src.getAttribute('src')) attachAndPlay(); });
})();
