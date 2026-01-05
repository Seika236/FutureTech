import pixToRem from "./utils/pxToRem.js";

const rootSelector = "[data-js-expandable-content]";

class expandableContent {
  selectors = {
    root: rootSelector,
    button: "[data-js-expandable-content-button]",
  };

  stateClasses = {
    isExpanded: "is-expanded",
  };

  animationParams = {
    duration: 500,
    easing: "ease",
  };

  constructor(rootElement) {
    this.rootElement = rootElement;
    this.buttonElement = this.rootElement.querySelector(this.selectors.button);
    this.bindEvents();
  }

  expand = () => {
    const { scrollHeight, offsetHeight } = this.rootElement;

    this.rootElement.classList.add(this.stateClasses.isExpanded);
    this.rootElement.animate(
      [
        { maxHeight: `${pixToRem(offsetHeight)}rem` },
        { maxHeight: `${pixToRem(scrollHeight)}rem` },
      ],
      this.animationParams,
    );
  };

  onButtonClick = () => {
    this.expand();
  };

  bindEvents() {
    this.buttonElement.addEventListener("click", this.onButtonClick);
  }
}

class expandableContentCollection {
  constructor() {
    this.expandableElements = document.querySelectorAll(rootSelector);
    this.init();
  }

  init() {
    this.expandableElements.forEach((element) => {
      new expandableContent(element);
    });
  }
}

export default expandableContentCollection;
