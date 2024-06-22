import gsap from "gsap";

const DURATION = 1.4;
const EASE = "power4.out";

export class Loader {
  constructor() {
    this.element = document.getElementById("loader");
  }

  show(onComplete = null) {
    gsap.set(this.element, {
      display: "block",
      opacity: 0,
    });

    gsap.to(this.element, {
      duration: DURATION,
      opacity: 1,
      ease: EASE,
      onComplete: () => {
        onComplete && onComplete();
      },
    });
  }

  hide(onComplete = null) {
    gsap.to(this.element, {
      duration: DURATION,
      opacity: 0,
      ease: EASE,
      onComplete: () => {
        gsap.set(this.element, {
          display: "none",
        });
        onComplete && onComplete();
      },
    });
  }
}
