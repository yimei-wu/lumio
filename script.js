window.addEventListener("scroll", function () {
  const layers = document.querySelectorAll(".bg-px-layer");
  const scrollPosition = window.scrollX;

  layers.forEach((layer, index) => {
    const speedFactor = ((index % 3) + 1) * 0.2;
    const offset = scrollPosition * speedFactor;
    layer.style.backgroundPosition = `${offset}px center`;
  });
});
