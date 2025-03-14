const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  const isDark = localStorage.getItem("dark-mode") === "true";

  if (isDark) {
    document.body.classList.add("dark");
  }

  ipcRenderer.on("toggle-dark-mode", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("dark-mode", document.body.classList.contains("dark"));
  });

  setInterval(() => {
    let lastState = false;
    const playButton = document.querySelector(
      ".playControl sc-ir playControls__control playControls__play"
    );

    
    if (playButton) {
      const isPlaying = playButton.classList.contains("playing");
      if (isPlaying !== lastState) {
        lastState = isPlaying;
      }
    }

    const titleElement = document.querySelector(
      '.playbackSoundBadge__titleLink span[aria-hidden="true"]'
    );
    const artistElement = document.querySelector(
      ".playbackSoundBadge__lightLink"
    );
    const coverElement = document.querySelector(
      ".playControls__soundBadge .image__full"
    );
    const trackLinkElement = document.querySelector(
      ".playControls__soundBadge a"
    );

    if (titleElement && artistElement && coverElement && trackLinkElement) {
      const title = titleElement.textContent.trim();
      const artist = artistElement.textContent.trim();
      const cover = coverElement.style.backgroundImage
        .replace('url("', "")
        .replace('")', "");
      const trackLink = trackLinkElement.href;

      ipcRenderer.send("update-rpc", { title, artist, cover, trackLink, lastState });
    } else {
      console.warn("Un ou plusieurs éléments manquent dans le DOM");
    }
  }, 500);
});
