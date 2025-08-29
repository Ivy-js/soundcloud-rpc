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

  let lastTrackInfo = null;

  setInterval(() => {
    // Detect if playing by looking for pause button (when playing, pause button is shown)
    const playButton = document.querySelector(".playControl");
    const pauseButton = document.querySelector(".playControls__control.playing, [title*='Pause'], .sc-button-pause");
    const isPlaying = !!(pauseButton || (playButton && playButton.title && playButton.title.includes('Pause')));

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

    // Try to get duration and position from timeline with multiple selectors
    const timeElements = {
      duration: document.querySelector(".playbackTimeline__duration span") || 
                document.querySelector(".playbackTimeline__duration") ||
                document.querySelector("[class*='duration']") ||
                document.querySelector("[class*='total']"),
      position: document.querySelector(".playbackTimeline__timePassed span") || 
                document.querySelector(".playbackTimeline__timePassed") ||
                document.querySelector("[class*='timePassed']") ||
                document.querySelector("[class*='current']")
    };
    
    let duration = null;
    let position = null;
    
    if (timeElements.duration) {
      const durationText = timeElements.duration.textContent || timeElements.duration.innerText;
      duration = parseTimeToSeconds(durationText);
      console.log('[PRELOAD] Duration found:', durationText, '→', duration, 'seconds');
    }
    
    if (timeElements.position) {
      const positionText = timeElements.position.textContent || timeElements.position.innerText;
      position = parseTimeToSeconds(positionText);
      console.log('[PRELOAD] Position found:', positionText, '→', position, 'seconds');
    }
    
    // Fallback: try to get time from progress bar attributes or data
    if (!duration || !position) {
      const progressBar = document.querySelector(".playbackTimeline__progressWrapper, .playbackTimeline__progress");
      if (progressBar) {
        const progressData = progressBar.getAttribute('aria-valuenow');
        const maxData = progressBar.getAttribute('aria-valuemax');
        
        if (progressData && maxData) {
          position = position || parseInt(progressData);
          duration = duration || parseInt(maxData);
          console.log('[PRELOAD] Progress bar data:', { progressData, maxData, position, duration });
        }
      }
    }

    if (titleElement && artistElement && coverElement && trackLinkElement) {
      const title = titleElement.textContent.trim();
      const artist = artistElement.textContent.trim();
      const cover = coverElement.style.backgroundImage
        .replace('url("', "")
        .replace('")', "");
      const trackLink = trackLinkElement.href;

      const currentTrackInfo = {
        title,
        artist,
        cover,
        trackLink,
        isPlaying,
        duration,
        position
      };

      // Only send if something changed
      if (JSON.stringify(currentTrackInfo) !== JSON.stringify(lastTrackInfo)) {
        console.log('[PRELOAD] Sending track info:', currentTrackInfo);
        lastTrackInfo = currentTrackInfo;
        ipcRenderer.send("update-rpc", currentTrackInfo);
      }
    } else {
      console.warn("Un ou plusieurs éléments manquent dans le DOM");
    }
  }, 500);

  // Helper function to convert time string to seconds
  function parseTimeToSeconds(timeString) {
    if (!timeString || typeof timeString !== 'string') return null;
    
    // Clean the time string and extract just the time part
    const cleanTime = timeString.trim().replace(/[^\d:]/g, '');
    if (!cleanTime) return null;
    
    const parts = cleanTime.split(':').map(p => {
      const num = parseInt(p, 10);
      return isNaN(num) ? 0 : num;
    });
    
    if (parts.length === 2) {
      // MM:SS format
      return parts[0] * 60 + parts[1];
    } else if (parts.length === 3) {
      // HH:MM:SS format
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    
    return null;
  }
});
