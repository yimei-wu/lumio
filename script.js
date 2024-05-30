const lenis = new Lenis({
  easing: (a) => Math.min(1, 1.001 - Math.pow(2, -10 * a)),
  orientation: "horizontal",
  gestureOrientation: "both",
  syncTouch: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

lenis.on("scroll", (e) => {
  const layers = document.querySelectorAll(".bg-px-layer");
  const scrollPosition = window.scrollX;

  layers.forEach((layer, index) => {
    const speedFactor = ((index % 3) + 1) * 0.2;
    const offset = scrollPosition * speedFactor;
    layer.style.backgroundPosition = `${offset}px center`;
  });
});

// window.addEventListener("scroll", function () {

// });
