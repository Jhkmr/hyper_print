const cells = document.querySelectorAll('.cell');
const videoContainer = document.getElementById('video-container');
const videoEl = document.getElementById('process-video');
const placeholder = document.getElementById('placeholder');
const fakeCursor = document.getElementById('fake-cursor');
const allContents = document.querySelectorAll('.contents');

document.addEventListener('mousemove', e => {
    fakeCursor.style.left = e.clientX + 'px';
    fakeCursor.style.top = e.clientY + 'px';
});

allContents.forEach(div => {
    div.addEventListener('mouseenter', () => { fakeCursor.style.display = 'block'; });
    div.addEventListener('mouseleave', () => { fakeCursor.style.display = 'none'; });
});

let activeCell = null;

cells.forEach(cell => {
    cell.addEventListener('mouseenter', () => {
        const title = cell.querySelector('span');
        if (title) placeholder.textContent = title.textContent;
    });

    cell.addEventListener('mouseleave', () => {
        placeholder.textContent = 'Video';
    });

    cell.addEventListener('click', e => {
        e.stopPropagation();

        if (activeCell === cell) {
            videoEl.paused ? videoEl.play() : videoEl.pause();
            return;
        }

        if (activeCell) activeCell.classList.remove('active');
        activeCell = cell;
        cell.classList.add('active');

        videoContainer.classList.remove('visible', 'vertical', 'horizontal');
        videoEl.src = cell.dataset.video;

        videoEl.addEventListener('loadedmetadata', () => {
            const isVertical = videoEl.videoHeight > videoEl.videoWidth;
            videoContainer.classList.add('visible', isVertical ? 'vertical' : 'horizontal');
            videoEl.play().catch(() => {});
        }, { once: true });
    });
});

document.addEventListener('click', e => {
    if (e.target.closest('#video-container') || e.target.closest('.cell')) return;
    closeVideo();
});

function closeVideo() {
    videoContainer.classList.remove('visible', 'vertical', 'horizontal');
    videoEl.pause();
    videoEl.src = '';
    if (activeCell) {
        activeCell.classList.remove('active');
        activeCell = null;
    }
}
