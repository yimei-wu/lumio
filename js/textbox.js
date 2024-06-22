import { getRandomId } from "./randomId";
import "splitting/dist/splitting.css";
import "splitting/dist/splitting-cells.css";
import Splitting from "splitting";
import gsap from "gsap";

export class Textbox {
  constructor({ text, onClose }) {
    this.text = text;
    this.timeline = gsap.timeline();

    // Genero un ID casuale per l'elemento
    this.id = getRandomId("textbox-");

    // Creo l'elemento
    this.create();

    // Cliccando sul testo, skippo l'animazione
    this.element.onclick = () => {
      this.timeline.time(this.timeline.duration());
      this.element.onclick = null;
    };

    const button = this.element.querySelector("button");
    button.onclick = onClose;
  }

  create() {
    // Separo le righe del testo in un array
    const lines = this.text.split("\n");

    // Creo l'elemento HTML
    this.element = document.createElement("section");
    this.element.id = this.id;
    this.element.style.display = "none";
    this.element.innerHTML = `
      <div>
      ${lines
        .map((line, index) =>
          index === 0 ? `<p>${line}</p>` : `<p class="mt-3">${line}</p>`
        )
        .join("")}
      </div> 
      <button class="mt-6">Next…</button>
      `;

    // Aggiungo l'elemento al body come primo child
    document.body.prepend(this.element);

    // Applico Splitting.js all'elemento
    Splitting({ target: `#${this.id} div`, by: "chars" });
  }

  open() {
    this.timeline.set(this.element, {
      display: "flex",
      opacity: 0,
    });

    this.timeline.to(this.element, {
      duration: 0.5,
      opacity: 1,
    });

    this.timeline.from(`#${this.id} .char`, {
      duration: 0.5,
      opacity: 0,
      stagger: 0.05,
      ease: "power4.out",
    });

    this.timeline.from(`#${this.id} button`, {
      duration: 0.5,
      opacity: 0,
      ease: "power4.out",
    });
  }
}
