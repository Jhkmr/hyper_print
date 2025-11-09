const contentsDivs = document.querySelectorAll('.contents');
const placeholder = document.getElementById('placeholder');

const floatingImages = [];
let mouseX = 0;
let mouseY = 0;

// Track mouse position globally
document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // Move all floating images to follow the mouse
  floatingImages.forEach(img => {
    img.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });
});

contentsDivs.forEach(div => {
  let clickCount = 0;
  const images = Array.from(div.querySelectorAll('img'));

  div.addEventListener('mouseenter', () => {
  const titleEl = div.querySelector('span');
  if (!titleEl) return;
  placeholder.textContent = titleEl.textContent;
  });

  div.addEventListener('mouseleave', () => {
    placeholder.textContent = 'Hyper';
  });
  div.addEventListener('click', () => {
    if (images.length === 0) return;

    // Pick the next image for this div
    const imgEl = images[clickCount % images.length];
    clickCount++;

    // Clone it so original stays in place
    const clone = imgEl.cloneNode();
    clone.classList.add('floating-image');
    clone.style.zIndex = 100 + floatingImages.length; // stack order
    document.body.appendChild(clone);

    // Position it immediately at current mouse location
    clone.style.transform = `translate(${mouseX}px, ${mouseY}px)`;

    // Keep track of floating images
    floatingImages.push(clone);
  });
});
