import { getRandomId } from "./randomId";
import gsap from "gsap";

export class Popup {
  constructor({ text, onClose }) {
    this.text = text;
    this.timeline = gsap.timeline();
    this.element = null;

    // Genero un ID casuale per l'elemento
    this.id = getRandomId("popup-");

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

  get selector() {
    return `#${this.id}`;
  }

  create() {
    // Separo le righe del testo in un array
    const lines = this.text.split("\n");

    // Creo l'elemento HTML
    this.element = document.createElement("div");
    this.element.id = this.id;
    this.element.classList.add("pop-up");
    this.element.style.display = "none";
    this.element.innerHTML = `
        <div>
        ${lines
          .map((line, index) =>
            index === 0 ? `<p>${line}</p>` : `<p class="mt-3">${line}</p>`
          )
          .join("")}
        </div>
        <button id="next">next</button>
      `;

    // Aggiungo l'elemento al body come primo child
    document.body.prepend(this.element);
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
  }

  close() {
    console.log("Closing textbox");
    this.timeline.set(this.element, {
      display: "none",
    });
  }
}
