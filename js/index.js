import "../style.css";
import { Textbox } from "./textbox";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Loader } from "./loader";

gsap.registerPlugin(ScrollToPlugin);

document.addEventListener("DOMContentLoaded", () => {
  const loader = new Loader();
  loader.hide();

  const textbox = new Textbox({
    text: "Lumio, a wandering little spirit, was born from the heart of a delicate white flower under the blue light of the full moon.\nHe loves travelling and discovering the world around him.",
    onClose: () => {
      loader.show(() => {
        window.location.href = "play.html";
      });
    },
  });

  const startButton = document.querySelector("button#start");
  startButton.onclick = () => {
    textbox.open();
  };
});
