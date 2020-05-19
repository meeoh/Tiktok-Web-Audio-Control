const URL = window.location.toString();
let percentage = 10;
let adjustRate = 5;

function increaseButtonHTML(video, percentageSpan) {
  let increaseButton = document.createElement("button");
  increaseButton.innerHTML = "+";
  increaseButton.addEventListener("click", () => {
    if (percentage == 100) return;
    percentage += adjustRate;
    percentageSpan.textContent = `${percentage}%`;
    video.volume = percentage / 100;
  });
  return increaseButton;
}

function decreaseButtonHTML(video, percentageSpan) {
  let decreaseButton = document.createElement("button");
  decreaseButton.innerHTML = "-";
  decreaseButton.addEventListener("click", () => {
    if (percentage == 0) return;
    percentage -= adjustRate;
    percentageSpan.textContent = `${percentage}%`;
    video.volume = percentage / 100;
  });
  return decreaseButton;
}

function generateInjectedHTML(video) {
  video.volume = percentage / 100;
  const userInfo = document.getElementsByClassName("user-info")[0];
  const percentageSpan = document.createElement("span");
  percentageSpan.textContent = `${percentage}%`;
  const increaseButton = increaseButtonHTML(video, percentageSpan);
  const decreaseButton = decreaseButtonHTML(video, percentageSpan);
  const wrapperDiv = document.createElement("div");
  const volumeLabel = document.createElement("span");
  volumeLabel.innerHTML = "VOLUME: ";
  wrapperDiv.append(
    volumeLabel,
    decreaseButton,
    percentageSpan,
    increaseButton
  );
  userInfo.after(wrapperDiv);
}

chrome.storage.sync.get("adjustRate", function(result) {
  if (result && result.adjustRate) {
    adjustRate = parseInt(result.adjustRate, 10);
  }
  // On individual video page
  if (URL.includes("/video/")) {
    const video = document.getElementsByTagName("video")[0];
    generateInjectedHTML(video);
  } else {
    const clickFunction = () => {
      setTimeout(() => {
        const vid = document.getElementsByClassName("horizontal")[0];
        generateInjectedHTML(vid);
      }, 0);
    };
    window.onload = function() {
      const clickables = document.getElementsByClassName(
        "video-feed-item-wrapper"
      );
      for (var i = 0; i < clickables.length; i++) {
        const video = clickables[i];
        video.addEventListener("click", clickFunction);
      }
    };
  }
});
