const rootSelector = "[data-js-tabs]";

class Tabs {
  selectors = {
    root: rootSelector,
    button: "[data-js-tabs-button]",
    content: "[data-js-tabs-content]",
  };

  stateClases = {
    isActive: "is-active",
  };

  stateAttributes = {
    ariaSelected: "aria-selected",
    tabIndex: "tabindex",
  };

  constructor(rootElement) {
    this.rootElement = rootElement;
    this.buttonElements = rootElement.querySelectorAll(this.selectors.button);
    this.contentElements = rootElement.querySelectorAll(this.selectors.content);
    this.state = this.getProxiState({
      activeTabIndex: [...this.buttonElements].findIndex((button) => {
        button.classList.contains(this.stateClases.isActive);
      }),
    });
    this.limitTab = this.buttonElements.length - 1;
    this.bindEvent();
  }

  getProxiState(initialState) {
    return new Proxy(initialState, {
      get: (target, prop) => {
        return target[prop];
      },
      set: (target, prop, value) => {
        target[prop] = value;

        this.updateUI();

        return true;
      },
    });
  }

  updateUI() {
    const newIndex = this.state.activeTabIndex;

    this.buttonElements.forEach((buttonElement, index) => {
      const isActive = newIndex === index;

      buttonElement.classList.toggle(this.stateClases.isActive, isActive);
      buttonElement.setAttribute(
        this.stateAttributes.ariaSelected,
        isActive.toString(),
      );
      buttonElement.setAttribute(
        this.stateAttributes.tabIndex,
        isActive ? "-1" : "0",
      );
    });

    this.contentElements.forEach((content, index) => {
      const isActive = newIndex === index;

      content.classList.toggle(this.stateClases.isActive, isActive);
    });
  }

  onClickButton(index) {
    this.state.activeTabIndex = index;
  }

  setFocus() {
    this.buttonElements[this.state.activeTabIndex].focus();
  }

  previousTab = () => {
    this.state.activeTabIndex =
      this.state.activeTabIndex === 0
        ? this.limitTab
        : this.state.activeTabIndex - 1;
    this.setFocus();
  };

  nextTab = () => {
    this.state.activeTabIndex =
      this.state.activeTabIndex === this.limitTab
        ? 0
        : this.state.activeTabIndex + 1;
    this.setFocus();
  };

  firstTab = () => {
    this.state.activeTabIndex = 0;
    this.setFocus();
  };

  lastTab = () => {
    this.state.activeTabIndex = this.limitTab;
    this.setFocus();
  };

  onKeyDown = (event) => {
    const { code, metaKey } = event;

    const action = {
      ArrowLeft: this.previousTab,
      ArrowRight: this.nextTab,
      Home: this.firstTab,
      End: this.lastTab,
    }[code];

    const isMacHomeKey = code === "ArrowLeft" && metaKey;
    const isMacEndKey = code === "ArrowRight" && metaKey;

    if (isMacHomeKey) {
      this.firstTab();
      return;
    }

    if (isMacEndKey) {
      this.lastTab();
      return;
    }

    action?.();
  };

  bindEvent() {
    this.buttonElements.forEach((button, index) => {
      button.addEventListener("click", () => this.onClickButton(index));
    });
    this.rootElement.addEventListener("keydown", this.onKeyDown);
  }
}

class TabsCollection {
  constructor() {
    this.tabElements = document.querySelectorAll(rootSelector);
    this.init();
  }

  init() {
    this.tabElements.forEach((tab) => {
      new Tabs(tab);
    });
  }
}

export default TabsCollection;
