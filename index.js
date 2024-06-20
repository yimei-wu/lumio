import "./index.css";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import Splitting from "splitting";

import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

document.addEventListener("DOMContentLoaded", () => {
  const startButton = document.querySelector("button#start");
  startButton.addEventListener("click", () => {
    openDialog();
  });
});

const openDialog = () => {
  Splitting({ target: ".typewriter", by: "chars" });
  const dialog = document.querySelector("#dialog");
  const tl = gsap.timeline();

  tl.set(dialog, {
    display: "flex",
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

  tl.to(
    "body",
    {
      duration: 0.5,
      opacity: 0,
      onComplete: () => {
        window.location.href = "/game.html";
      },
    },
    "+=3"
  );
};
