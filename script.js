const contentsDivs = document.querySelectorAll('.contents');
const placeholder = document.getElementById('placeholder');

let globalStack = null;

// dragging the image stack

function makeDraggable(container, movingScan) {
  let state = { distX: 0, distY: 0 };

  function onDown(e) {
    e.preventDefault();
    const evt = e.type === 'touchstart' ? e.changedTouches[0] : e;

    state.distX = Math.abs(movingScan.offsetLeft - evt.clientX);
    state.distY = Math.abs(movingScan.offsetTop - evt.clientY);

    movingScan.style.pointerEvents = "none";
  }

  function onUp() {
    movingScan.style.pointerEvents = "initial";
  }

  function onMove(e) {
    if (movingScan.style.pointerEvents !== "none") return;

    const evt = e.type === 'touchmove' ? e.changedTouches[0] : e;

    let newX = evt.clientX - state.distX;
    let newY = evt.clientY - state.distY;

    // keep inside viewport
    newX = Math.max(0, Math.min(newX, window.innerWidth - movingScan.offsetWidth));
    newY = Math.max(0, Math.min(newY, window.innerHeight - movingScan.offsetHeight));

    movingScan.style.left = `${newX}px`;
    movingScan.style.top = `${newY}px`;
  }

  // mouse
  movingScan.addEventListener("mousedown", onDown);
  container.addEventListener("mousemove", onMove);
  container.addEventListener("mouseup", onUp);

  // touch
  movingScan.addEventListener("touchstart", onDown);
  container.addEventListener("touchmove", onMove);
  container.addEventListener("touchend", onUp);
}

// creates a container for stacked images that can be dragged

function createStack(firstImg) {
  const stack = document.createElement('div');
  stack.classList.add('floating-stack');
  stack.style.position = 'fixed';
  stack.style.cursor = 'grab';

  const rect = firstImg.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;

  const maxX = window.innerWidth - w;
  const maxY = window.innerHeight - h;

  const startX = Math.random() * maxX;
  const startY = Math.random() * maxY;

  stack.style.left = `${startX}px`;
  stack.style.top = `${startY}px`;

  document.body.appendChild(stack);

  makeDraggable(document.body, stack);

  return stack;
}

// select images & replace "hyper"

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

    const imgEl = imgs.shift(); 
    if (!imgEl) return;   

    if (!globalStack) {
      globalStack = createStack(imgEl);
    }

    const clone = imgEl.cloneNode();
    clone.classList.add("floating-image");

    clone.style.position = "absolute";
    clone.style.left = "0px";
    clone.style.top = "0px";
    clone.style.zIndex = globalStack.children.length;

    const rotation = (Math.random() * 12) - 6;
    clone.style.transform = `rotate(${rotation}deg)`;

    globalStack.appendChild(clone);
  });
});
