// function init() {
//   const lenis = new Lenis({
//     content: document.querySelector(".bg-px-section"),
//     // infinite: true,
//     duration: 1,
//     easing: (a) => Math.min(1, 1.001 - Math.pow(2, -10 * a)),
//     orientation: "horizontal",
//     gestureOrientation: "both",
//   });

//   function raf(time) {
//     lenis.raf(time);
//     requestAnimationFrame(raf);
//   }

//   requestAnimationFrame(raf);

//   lenis.on("scroll", (e) => {
//     const layers = document.querySelectorAll(".bg-px-layer");
//     const scrollPosition = window.scrollX;

//     layers.forEach((layer, index) => {
//       const speedFactor = ((index % 3) + 1) * 0.2;
//       const offset = scrollPosition * speedFactor;
//       layer.style.backgroundPosition = `${offset}px center`;
//     });
//   });
// }

// document.addEventListener("DOMContentLoaded", () => {
//   init();
// });

function init() {
  const lenis = new Lenis({
    content: document.querySelector(".bg-px-container"),
    duration: 1,
    easing: (a) => Math.min(1, 1.001 - Math.pow(2, -10 * a)),
    orientation: "horizontal",
    gestureOrientation: "both",
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  lenis.on("scroll", (e) => {
    const layers = document.querySelectorAll(".bg-px-layer");
    const scrollPercentage = e.progress; // Usa la percentuale di scroll fornita da Lenis

    layers.forEach((layer, index) => {
      // Calcola un fattore di velocità basato sulla percentuale di scroll
      const speedFactor = (index + 1) * 0.05; // Aumenta o diminuisce questo valore per regolare la velocità
      const offset = scrollPercentage * speedFactor;
      layer.style.backgroundPosition = `${offset}px center`;
    });
  });
  console.log(lenis);
}

document.addEventListener("DOMContentLoaded", () => {
  init();
});
