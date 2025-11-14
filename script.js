const contentsDivs = document.querySelectorAll('.contents');
const placeholder = document.getElementById('placeholder');

let globalStack = null;
let dragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let targetX = 0;
let targetY = 0;

// -------------------------------
// CREATE GLOBAL STACK
// -------------------------------
function createStack(firstImg) {
  const stack = document.createElement('div');
  stack.classList.add('floating-stack');
  stack.style.position = 'fixed';
  stack.style.cursor = 'grab';

  // Position it randomly in the viewport
  const rect = firstImg.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;

  const maxX = window.innerWidth - w;
  const maxY = window.innerHeight - h;

  targetX = Math.random() * maxX;
  targetY = Math.random() * maxY;

  stack.style.left = `${targetX}px`;
  stack.style.top = `${targetY}px`;

  document.body.appendChild(stack);

  // -------------------------
  // DRAGGING (Optimized!)
  // -------------------------
  stack.addEventListener("mousedown", (e) => {
    dragging = true;
    stack.style.cursor = "grabbing";
    dragOffsetX = e.clientX - targetX;
    dragOffsetY = e.clientY - targetY;
  });

  document.addEventListener("mouseup", () => {
    dragging = false;
    if (stack) stack.style.cursor = "grab";
  });

  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;

    // Compute new target (we update visually via rAF for speed)
    targetX = e.clientX - dragOffsetX;
    targetY = e.clientY - dragOffsetY;

    // Keep inside viewport
    targetX = Math.max(0, Math.min(targetX, window.innerWidth - stack.offsetWidth));
    targetY = Math.max(0, Math.min(targetY, window.innerHeight - stack.offsetHeight));
  });

  // rAF loop — fast, smooth updates
  function update() {
    if (stack) {
      stack.style.left = `${targetX}px`;
      stack.style.top = `${targetY}px`;
    }
    requestAnimationFrame(update);
  }
  update();

  return stack;
}

// -------------------------------
// HANDLE CLICK ON CONTENT BLOCKS
// -------------------------------
contentsDivs.forEach(div => {
  let clickCount = 0;
  const imgs = Array.from(div.querySelectorAll('img'));

  div.addEventListener('mouseenter', () => {
    const title = div.querySelector('span');
    if (title) placeholder.textContent = title.textContent;
  });

  div.addEventListener('mouseleave', () => {
    placeholder.textContent = 'Hyper';
  });

  div.addEventListener('click', () => {
    if (imgs.length === 0) return;

    const imgEl = imgs[clickCount % imgs.length];
    clickCount++;

    // Create stack the first time
    if (!globalStack) {
      globalStack = createStack(imgEl);
    }

    // Clone new image
    const clone = imgEl.cloneNode();
    clone.classList.add("floating-image");

    // Layer directly on top
    clone.style.position = "absolute";
    clone.style.left = "0px";
    clone.style.top = "0px";
    clone.style.zIndex = globalStack.children.length;

    // Random slight rotation
    const rotation = (Math.random() * 12) - 6; // -6 to +6 degrees
    clone.style.transform = `rotate(${rotation}deg)`;

    globalStack.appendChild(clone);
  });
});
