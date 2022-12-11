mouse = { x: -200, y: -200 };
let cursor = {
    domElement: document.querySelector('.cursor'),
    pos: { x: 0, y: 0 },
    speed: .1, // between 1 and 0
    isHovering: false
}

function getAngle(diffX, diffY) {
    return Math.atan2(diffY, diffX) * 180 / Math.PI;
  }

const updatePosition = () => {
    const diffX = Math.round(mouse.x - cursor.pos.x - cursor.domElement.offsetWidth/2);
    const diffY = Math.round(mouse.y - cursor.pos.y - cursor.domElement.offsetWidth/2);
    
    cursor.pos.x += diffX * cursor.speed;
    cursor.pos.y += diffY * cursor.speed;
    
    cursor.domElement.style.transform = `translate3d(${cursor.pos.x}px, ${cursor.pos.y}px, 0)`;
};

const updateCoordinates = e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

window.addEventListener('mousemove', updateCoordinates);

function loop() {
    updatePosition();
    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);