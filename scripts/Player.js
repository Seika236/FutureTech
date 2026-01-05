const rootElement = "[data-js-video-player]";

class Player {
  selectors = {
    root: rootElement,
    panelElement: "[data-js-video-panel]",
    playButton: "[data-js-video-player-play-button]",
    videoPlayer: "[data-js-video-player-video]",
  };

  stateClasses = {
    isActive: "is-active",
  };

  constructor(rootElement) {
    this.rootElement = rootElement;
    this.panelElement = this.rootElement.querySelector(
      this.selectors.panelElement,
    );
    this.videoPlayerElement = this.rootElement.querySelector(
      this.selectors.videoPlayer,
    );
    this.playButtonElement = this.rootElement.querySelector(
      this.selectors.playButton,
    );
    this.bindEvents();
  }

  onButtonClick = () => {
    this.videoPlayerElement.play();
    this.videoPlayerElement.controls = true;
    this.panelElement.classList.remove(this.stateClasses.isActive);
  };

  onVideoPause = (event) => {
    this.videoPlayerElement.controls = false;
    this.panelElement.classList.add(this.stateClasses.isActive);
  };

  bindEvents() {
    this.playButtonElement.addEventListener("click", this.onButtonClick);
    this.videoPlayerElement.addEventListener("pause", this.onVideoPause);
  }
}

class PlayerCollection {
  constructor() {
    this.playerElements = document.querySelectorAll(rootElement);
    this.init();
  }

  init() {
    this.playerElements.forEach((playerElement) => {
      new Player(playerElement);
    });
  }
}

export default PlayerCollection;
