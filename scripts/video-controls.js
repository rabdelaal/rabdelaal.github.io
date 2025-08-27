document.addEventListener('DOMContentLoaded', () => {
    const vid = document.getElementById('intro-video');
    if(!vid) return;

    const muteBtn = document.getElementById('mute-btn');
    const subsBtn = document.getElementById('subtitles-btn');
    const pipBtn = document.getElementById('pip-btn');

    muteBtn && muteBtn.addEventListener('click', () => {
        vid.muted = !vid.muted;
        muteBtn.textContent = vid.muted ? '🔇' : '🔈';
    });

    subsBtn && subsBtn.addEventListener('click', () => {
        const tracks = vid.querySelectorAll('track[kind="subtitles"]');
        if(!tracks || tracks.length===0) return;
        // toggle the first text track
        const t = tracks[0].track;
        t.mode = (t.mode === 'showing') ? 'disabled' : 'showing';
        subsBtn.style.opacity = t.mode === 'showing' ? '1' : '.5';
    });

    pipBtn && pipBtn.addEventListener('click', async () => {
        if('pictureInPictureEnabled' in document){
            try{
                if(document.pictureInPictureElement){
                    await document.exitPictureInPicture();
                } else {
                    await vid.requestPictureInPicture();
                }
            }catch(e){ console.warn('PiP failed', e); }
        }
    });

    // Keyboard shortcuts: M mute, P peeP, C subtitles
    window.addEventListener('keydown', (e) => {
        if(e.key.toLowerCase() === 'm') { vid.muted = !vid.muted; muteBtn && (muteBtn.textContent = vid.muted ? '🔇' : '🔈'); }
        if(e.key.toLowerCase() === 'c') { subsBtn && subsBtn.click(); }
        if(e.key.toLowerCase() === 'p') { pipBtn && pipBtn.click(); }
    });
});
