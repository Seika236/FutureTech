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
    this.state = {
      activeTabIndex: [...this.buttonElements].findIndex((buttonElement) =>
        buttonElement.classList.contains(this.stateClases.isActive),
      ),
    };
    this.limitTabsIndex = this.buttonElements.length - 1;
    this.bindEvents();
  }

  updateUI() {
    let { activeTabIndex } = this.state;

    this.buttonElements.forEach((buttonElement, index) => {
      let isActive = activeTabIndex === index;

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

    this.contentElements.forEach((contentElement, index) => {
      let isActive = activeTabIndex === index;

      contentElement.classList.toggle(this.stateClases.isActive, isActive);
    });
  }

  onButtonClick = (buttonIndex) => {
    this.state.activeTabIndex = buttonIndex;
    this.updateUI();
  };

  activateTab(newTabIndex) {
    this.state.activeTabIndex = newTabIndex;
    this.buttonElements[newTabIndex].focus();
    this.updateUI();
  }

  previousTab = () => {
    const newTabIndex =
      this.state.activeTabIndex === 0
        ? this.limitTabsIndex
        : this.state.activeTabIndex - 1;

    this.activateTab(newTabIndex);
  };
  nextTab = () => {
    const newTabIndex =
      this.state.activeTabIndex === this.limitTabsIndex
        ? 0
        : this.state.activeTabIndex + 1;

    this.activateTab(newTabIndex);
  };
  firstTab = () => {
    this.activateTab(0);
  };
  lastTab = () => {
    this.activateTab(this.limitTabsIndex);
  };

  onKeyDown = (event) => {
    let { code, metaKey } = event;

    const action = {
      ArrowLeft: this.previousTab,
      ArrowRight: this.nextTab,
      Home: this.firstTab,
      End: this.lastTab,
    }[code];

    const isMacHomeKey = metaKey && code === "ArrowLeft";
    const isMacEndKey = metaKey && code === "ArrowRight";

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

  bindEvents() {
    this.buttonElements.forEach((buttonElement, index) => {
      buttonElement.addEventListener("click", () => this.onButtonClick(index));
    });
    this.rootElement.addEventListener("keydown", this.onKeyDown);
  }
}

class TabsCollection {
  constructor() {
    this.init();
  }

  init() {
    document
      .querySelectorAll(rootSelector)
      .forEach((rootTab) => new Tabs(rootTab));
  }
}

// export default TabsCollection;
