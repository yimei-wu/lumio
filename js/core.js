import gsap from "gsap";

export const handleMouseMove = (event) => {
  const mouse = {
    x: event.clientX,
    y: event.clientY,
    direction: event.clientX < screen.width / 2 ? -1 : 1, // -1 sinistra, 1 destra
  };

  const headRect = lumio.headTracker.getBoundingClientRect();
  const headCenterX = headRect.left + headRect.width / 2;
  const headCenterY = headRect.top + headRect.height / 2;

  let deltaX = mouse.x - headCenterX;
  let deltaY = mouse.y - headCenterY;

  if (lumio.direction == -1) {
    deltaX = -deltaX;
  }

  let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

  if (lumio.direction == mouse.direction) {
    gsap.set(lumio.head, {
      rotateZ: gsap.utils.clamp(-30, 50, angle),
    });
  } else {
    gsap.to(lumio.head, {
      rotateZ: 0,
    });
  }
};
