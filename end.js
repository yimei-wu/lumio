import "./style.css";
import gsap from "gsap";
import { Textbox } from "./js/textbox";

const textbox = new Textbox({
  text: " Lumio's adventure has only just begun,\nthe next chapter awaits...",
  onClose: () => {
    loader.show(() => {
      gsap.set(textbox.element, { display: "none" });
    });
  },
});

textbox.open();
