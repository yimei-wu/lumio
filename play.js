import "./play.css";
import gsap from "gsap";
import Lenis from "lenis";
import { debounce } from "lodash";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import Splitting from "splitting";

const lenis = new Lenis({
  orientation: "horizontal",
  gestureOrientation: "both",
  wheelMultiplier: 0.5,
});

const bgSizes = {
  width: 7428,
  height: 1392,
};

const screen = {
  width: window.innerWidth,
  height: window.innerHeight,
};

let startTime = null;

const lumio = {
  el: document.querySelector("#lumio"),
  img: document.querySelector("#lumio #body"),
  head: document.querySelector("#lumio #head"),
  headTracker: document.querySelector("#lumio #head-tracker"),
  animate: false,
  direction: 1,
  frames: 3, // lumio-1.png, lumio-2.png, lumio-3.png
  speed: 500, // mezzo secondo
};

const init = () => {
  handleResize();
  initLakePuzzle();
  requestAnimationFrame(animate);
  document.addEventListener("click", handleClick);
  document.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("resize", handleResize);
  lenis.on("scroll", handleScroll);
  scrollStartStopHandler(window, 100, handleScrollStart, handleScrollStop);
};

const handleClick = (event) => {
  const mouseX = event.clientX;
  const targetX = (mouseX / screen.width) * 100;
  const lumioX = parseFloat(lumio.el.style.left) || 50;
  const direction = targetX > lumioX ? 1 : -1;
  const distance = Math.abs(targetX - lumioX);

  // distance goes from 0 to 100, duration goes from 0.5 to 5
  const duration = gsap.utils.mapRange(0, 100, 0.5, 5, distance);

  if (direction == 1) {
    lumio.direction = 1;
    lumio.el.style.setProperty("--scale", "1");
  } else {
    lumio.direction = -1;
    lumio.el.style.setProperty("--scale", "-1");
  }

  // Disattiva lo scroll durante l'animazione
  lenis.stop();

  gsap.to(lumio.el, {
    left: `${targetX}%`,
    "--x": 0,
    duration: duration,
    ease: "linear",
    onUpdate: () => {
      lumio.animate = true;
    },
    onComplete: () => {
      lumio.animate = false;
      lumio.img.dataset.frame = 1;
      lumio.img.src = `/lumio/lumio-headless-1.png`;
      lenis.start();
    },
  });
};

const handleResize = () => {
  // Aggiorno le dimensioni dello schermo
  screen.width = window.innerWidth;
  screen.height = window.innerHeight;

  // Imposto la larghezza del body usando le proporzioni dell'immagine di sfondo
  const proportionalWidth = (bgSizes.width * screen.height) / bgSizes.height;
  document.body.style.width = `${proportionalWidth}px`;

  // Imposto la larghezza degli sfondi
  const REPEAT = 3;
  const bgImages = document.querySelectorAll(".bg-repeat");
  bgImages.forEach((bgImage) => {
    bgImage.style.width = `${proportionalWidth * REPEAT}px`;
    bgImage.style.backgroundSize = `${100 / REPEAT}% 100%`;
  });
};

const handleScroll = () => {
  // Giro Lumio in base alla direzione dello scroll

  if (lenis.direction == -1) {
    lumio.direction = -1;
    lumio.el.style.setProperty("--scale", "-1");
  } else {
    lumio.direction = 1;
    lumio.el.style.setProperty("--scale", "1");
  }

  // Imposto l'effetto parallax
  const distance = window.scrollX;
  const bgImages = document.querySelectorAll(".bg-repeat");

  bgImages.forEach((bgImage) => {
    const speed = bgImage.dataset.parallaxSpeed;
    const parallax = distance * speed * 0.05;
    bgImage.style.transform = `translateX(${parallax}px)`;
  });
};

const handleScrollStart = () => {
  // Attivo l'animazione di Lumio
  lumio.animate = true;
};

const handleScrollStop = () => {
  // Disattivo l'animazione di Lumio
  lumio.animate = false;
  lumio.img.dataset.frame = 1;
  lumio.img.src = `/lumio/lumio-headless-1.png`;
};

const handleMouseMove = (event) => {
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

const animate = (time) => {
  if (!startTime) {
    startTime = time;
  }

  const runtime = time - startTime;
  const relativeProgress = runtime / lumio.speed;

  // Cambio frame dell'animazione di Lumio
  if (lumio.animate) {
    const frame =
      Math.floor((relativeProgress * lumio.frames) % lumio.frames) + 1;
    lumio.img.dataset.frame = frame;
    lumio.img.src = `/lumio/lumio-headless-${frame}.png`;
  }

  // Fermo Lumio quando raggiunge il lago
  const lumioAbsoluteX =
    window.scrollX + parseFloat(window.getComputedStyle(lumio.el).left);

  if (lumioAbsoluteX >= 1200.0) {
    console.log("Lumio è al lago!");
    openLakePuzzle();
  }

  lenis.raf(time);
  requestAnimationFrame(animate);
};

const scrollStartStopHandler = (element, wait = 150, onStart, onStop) => {
  const handleOnStart = debounce(
    () => {
      onStart && onStart();
    },
    wait,
    { leading: true, trailing: false }
  );

  const handleOnStop = debounce(() => {
    onStop && onStop();
  }, wait);

  element.addEventListener("scroll", handleOnStart);
  element.addEventListener("scroll", handleOnStop);

  const destroy = () => {
    element.removeEventListener("scroll", handleOnStart);
    element.removeEventListener("scroll", handleOnStop);
  };

  return {
    destroy: destroy,
  };
};

const openLakePuzzle = () => {
  lenis.stop();

  Splitting({ target: ".typewriter", by: "chars" });

  const lakePuzzle = document.getElementById("pillar-game");
  const dialog = document.querySelector("#dialog");
  const tl = gsap.timeline();

  tl.set(dialog, {
    display: "flex",
    position: "fixed",
    opacity: 0,
  });

  tl.to(dialog, {
    duration: 0.5,
    opacity: 1,
  });

  tl.from(".typewriter .char", {
    duration: 0.5,
    opacity: 0,
    stagger: 0.05,
    ease: "power4.out",
  });
  tl.to(".typewriter .char", {
    // duration: 0.5,
    opacity: 1,
    // stagger: 0.05,
    // ease: "power4.out",
  });

  tl.to(
    "body",
    {
      duration: 0.5,
      opacity: 1,
    },
    "+=3"
  );

  tl.set(lakePuzzle, {
    display: "flex",
  });
  //   tl.from(lakePuzzle, {
  //     opacity: 0,
  //     // duration: 0.5,
  //   });

  tl.to(lakePuzzle, {
    opacity: 1,
    duration: 0.5,
  });
};

const initLakePuzzle = () => {
  const pillars = document.querySelectorAll(".pillar");

  const pillarOne = document.getElementById("pillar1");
  const pillarTwo = document.getElementById("pillar2");
  const pillarThree = document.getElementById("pillar3");

  const handleClick = () => {
    pillars.forEach((pillar) => {
      pillar.addEventListener("click", (e) => {
        e.preventDefault();
        // CLICK ON THE FIRST PILLAR
        if (pillar === pillarOne) {
          if (
            pillarOne.classList.contains("pillar") &&
            pillarTwo.classList.contains("pillar") &&
            pillarThree.classList.contains("bright-pillar")
          ) {
            pillarTwo.classList.replace("pillar", "bright-pillar");
          } else if (
            pillarOne.classList.contains("bright-pillar") &&
            pillarTwo.classList.contains("pillar") &&
            pillarThree.classList.contains("pillar")
          ) {
            pillarOne.classList.replace("bright-pillar", "pillar");
            pillarTwo.classList.replace("pillar", "bright-pillar");
            pillarThree.classList.replace("pillar", "bright-pillar");
          } else if (
            pillarOne.classList.contains("pillar") &&
            pillarTwo.classList.contains("bright-pillar") &&
            pillarThree.classList.contains("pillar")
          ) {
            pillarOne.classList.replace("pillar", "bright-pillar");
            pillarTwo.classList.replace("bright-pillar", "pillar");
          } else if (
            pillarOne.classList.contains("bright-pillar") &&
            pillarTwo.classList.contains("pillar") &&
            pillarThree.classList.contains("bright-pillar")
          ) {
            pillarOne.classList.replace("bright-pillar", "pillar");
          } else if (
            pillarOne.classList.contains("pillar") &&
            pillarTwo.classList.contains("bright-pillar") &&
            pillarThree.classList.contains("bright-pillar")
          ) {
            pillarOne.classList.replace("pillar", "bright-pillar");
            pillarThree.classList.replace("bright-pillar", "pillar");
          } else if (
            pillarOne.classList.contains("bright-pillar") &&
            pillarTwo.classList.contains("bright-pillar") &&
            pillarThree.classList.contains("pillar")
          ) {
            pillarOne.classList.replace("bright-pillar", "pillar");
            pillarTwo.classList.replace("bright-pillar", "pillar");
            pillarThree.classList.replace("pillar", "bright-pillar");
          } else {
            pillarOne.classList.replace("pillar", "bright-pillar");
          }
        }
        // CLICK ON THE MIDDLE PILLAR
        else if (pillar === pillarTwo) {
          if (
            pillarOne.classList.contains("bright-pillar") &&
            pillarTwo.classList.contains("pillar") &&
            pillarThree.classList.contains("pillar")
          ) {
            pillarTwo.classList.replace("pillar", "bright-pillar");
          } else if (
            pillarOne.classList.contains("bright-pillar") &&
            pillarTwo.classList.contains("pillar") &&
            pillarThree.classList.contains("bright-pillar")
          ) {
            pillarOne.classList.replace("bright-pillar", "pillar");
            pillarTwo.classList.replace("pillar", "bright-pillar");
            pillarThree.classList.replace("bright-pillar", "pillar");
          } else if (
            pillarOne.classList.contains("pillar") &&
            pillarTwo.classList.contains("pillar") &&
            pillarThree.classList.contains("bright-pillar")
          ) {
            pillarOne.classList.replace("pillar", "bright-pillar");
          } else if (
            pillarOne.classList.contains("pillar") &&
            pillarTwo.classList.contains("bright-pillar") &&
            pillarThree.classList.contains("bright-pillar")
          ) {
            pillarTwo.classList.replace("bright-pillar", "pillar");
            pillarThree.classList.replace("bright-pillar", "pillar");
          } else if (
            pillarOne.classList.contains("bright-pillar") &&
            pillarTwo.classList.contains("bright-pillar") &&
            pillarThree.classList.contains("pillar")
          ) {
            pillarTwo.classList.replace("bright-pillar", "pillar");
          } else if (
            pillarOne.classList.contains("pillar") &&
            pillarTwo.classList.contains("bright-pillar") &&
            pillarThree.classList.contains("pillar")
          ) {
            pillarOne.classList.replace("pillar", "bright-pillar");
            pillarTwo.classList.replace("bright-pillar", "pillar");
            pillarThree.classList.replace("pillar", "bright-pillar");
          } else {
            pillarOne.classList.replace("pillar", "bright-pillar");
            pillarThree.classList.replace("pillar", "bright-pillar");
          }
        }
        // CLICK ON THE LAST PILLAR
        else if (pillar === pillarThree) {
          if (
            pillarOne.classList.contains("bright-pillar") &&
            pillarTwo.classList.contains("pillar") &&
            pillarThree.classList.contains("pillar")
          ) {
            pillarThree.classList.replace("pillar", "bright-pillar");
          } else if (
            (pillarOne.classList.contains("bright-pillar") &&
              pillarTwo.classList.contains("pillar") &&
              pillarThree.classList.contains("bright-pillar")) ||
            (pillarOne.classList.contains("pillar") &&
              pillarTwo.classList.contains("pillar") &&
              pillarThree.classList.contains("bright-pillar"))
          ) {
            pillarTwo.classList.replace("pillar", "bright-pillar");
            pillarThree.classList.replace("bright-pillar", "pillar");
          } else if (
            pillarOne.classList.contains("pillar") &&
            pillarTwo.classList.contains("bright-pillar") &&
            pillarThree.classList.contains("bright-pillar")
          ) {
            pillarOne.classList.replace("pillar", "bright-pillar");
            //   pillarThree.classList.replace("bright-pillar", "pillar");
          } else if (
            pillarOne.classList.contains("bright-pillar") &&
            pillarTwo.classList.contains("bright-pillar") &&
            pillarThree.classList.contains("pillar")
          ) {
            pillarOne.classList.replace("bright-pillar", "pillar");
            pillarTwo.classList.replace("bright-pillar", "pillar");
          } else if (
            pillarOne.classList.contains("pillar") &&
            pillarTwo.classList.contains("bright-pillar") &&
            pillarThree.classList.contains("pillar")
          ) {
            pillarTwo.classList.replace("bright-pillar", "pillar");
            pillarThree.classList.replace("pillar", "bright-pillar");
          } else {
            pillarThree.classList.replace("pillar", "bright-pillar");
          }
        }
        // checkPillars();
      });
    });
    // checkPillars();
  };

  pillarOne.addEventListener("click", handleClick);
  pillarTwo.addEventListener("click", handleClick);
  pillarThree.addEventListener("click", handleClick);

  function checkPillars() {
    console.log("check pillars is working!");
    if (
      pillarOne.classList.contains("bright-pillar") &&
      pillarTwo.classList.contains("brigth-pillar") &&
      pillarThree.classList.contains("brigth-pillar")
    ) {
      const popUp = document.getElementById("win");
      popUp.style.display = "flex";
      console.log("all three ON");
    }
  }

  next.addEventListener("click", () => {
    window.location.href = "/.html";
  });
};

document.addEventListener("DOMContentLoaded", init);
