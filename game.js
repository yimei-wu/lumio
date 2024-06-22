import "./game.css";
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
  width: 9904,
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
  initBridgePuzzle();
  // openBridgePuzzle();
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

  // Fermo Lumio se il ponte è rotto
  const lumioAbsoluteX =
    window.scrollX + parseFloat(window.getComputedStyle(lumio.el).left);

  if (lumioAbsoluteX >= 4150.0) {
    console.log("Lumio è caduto!");
    openBridgePuzzle();
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

const openBridgePuzzle = () => {
  lenis.stop();

  Splitting({ target: ".typewriter", by: "chars" });

  const bridgePuzzle = document.getElementById("stone-puzzle");
  const dialog = document.querySelector("#dialog");
  const tl = gsap.timeline();

  tl.set(dialog, {
    display: "flex",
    position: "fixed",
    bottom: 0,
    right: 0,
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

  tl.set(bridgePuzzle, {
    display: "block",
  });
  tl.from(bridgePuzzle, {
    opacity: 0,
    // duration: 0.5,
    s, // questa s è un errore di digitazione, ma stranamente fa funzionare tutto
  });

  tl.to(bridgePuzzle, {
    opacity: 1,
    duration: 0.5,
  });
};

const initBridgePuzzle = () => {
  // get all the holes html nodes
  const holes = document.querySelectorAll(".hole");
  // get all the pieces html nodes
  const images = Array.from(document.querySelectorAll(".image"));
  let winCount = 0;
  const next = document.getElementById("next");
  /* 
 for each piece:
 - add an event listener that ADDS the .dragging class when the drag STARTS
 - add an event listener that REMOVES the .dragging class when the drag ENDS 
*/
  images.forEach((image) => {
    image.addEventListener("dragstart", (e) => {
      image.classList.add("dragging");
    });

    image.addEventListener("dragend", (e) => {
      image.classList.remove("dragging");
    });
  });

  holes.forEach((hole) => {
    /*
  for each hole:
  - add an event listener that ADDS the .hovered class when there is something dragging over it
  - add an event listener that REMOVES the .hovered class when the overing dragging objects is leaving
  */

    hole.addEventListener("dragover", (e) => {
      e.preventDefault();
      hole.classList.add("hovered");
    });

    hole.addEventListener("dragleave", (e) => {
      e.preventDefault();
      hole.classList.remove("hovered");
    });

    /* 
  - add an event listener for when a dragging element is dropped on it:
  */
    hole.addEventListener("drop", (e) => {
      e.preventDefault();
      // get the ID of the image that is being dragging
      const draggedImageId = document.querySelector(".dragging").id;
      // get the ALLOWED ID from the attribute of the hole where i am hovering on
      const acceptedPieceId = e.target.getAttribute("accepted-piece-id");

      // compare the two ids
      if (draggedImageId === acceptedPieceId) {
        // if they are the same, it means that the dragging piece has the id that is allowed in the hole

        // compose a string which is the id for the hidden piece in the hole
        const droppedPieceId = "dropped-" + draggedImageId;
        // get the hidden piece in the hole by the newly created id
        const pieceToShow = document.getElementById(droppedPieceId);
        // remove the hidden class from the piece in the hole
        pieceToShow.classList.remove("hidden");
        // add .dropped class to the piece in the hole to make it visible
        pieceToShow.classList.add("dropped");
        // remove the .dragged piece from the left sidebar
        document.getElementById(draggedImageId).style.display = "none";

        winCount++;

        console.log(winCount);

        if (winCount === 3) {
          const popUp = document.getElementById("pop");
          popUp.style.display = "flex";
        }
      }

      // remove the .hovered class from the hole
      hole.classList.remove("hovered");
    });
  });

  next.addEventListener("click", () => {
    window.location.href = "/riddle.html";
  });
};

document.addEventListener("DOMContentLoaded", init);
