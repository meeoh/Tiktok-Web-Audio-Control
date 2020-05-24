const URL = window.location.toString().toLowerCase();
let percentage = 10;
let adjustRate = 5;
let hasTrendingRan = false;

function toArray(obj) {
  var array = [];
  if (!obj) return array;
  // iterate backwards ensuring that length is an UInt32
  for (var i = obj.length >>> 0; i--; ) {
    array[i] = obj[i];
  }
  return array;
}

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

function clickFunction() {
  setTimeout(() => {
    const vid = document.getElementsByClassName("video-player horizontal")[0];
    generateInjectedHTML(vid);
  }, 0);
}

function trending() {
  hasTrendingRan = true;
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (!mutation.addedNodes) return;

      for (var i = 0; i < mutation.addedNodes.length; i++) {
        // do things to your newly added nodes here
        var node = mutation.addedNodes[i];
        if (toArray(node.classList).indexOf("video-feed-item") > -1) {
          node.addEventListener("click", () => clickFunction(node));
        }
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false
  });
}

function attachListenerToClickables(className) {
  const clickables = toArray(document.getElementsByClassName(className));
  clickables.forEach(video => {
    video.addEventListener("click", clickFunction);
  });
}

chrome.storage.sync.get("adjustRate", function(result) {
  if (result && result.adjustRate) {
    adjustRate = parseInt(result.adjustRate, 10);
  }
  // On individual video page
  if (URL.includes("/video/")) {
    window.onload = function() {
      const video = document.getElementsByTagName("video")[0];
      console.log(video);
      generateInjectedHTML(video);
    };
  } else if (URL.includes("@")) {
    window.onload = function() {
      attachListenerToClickables("video-feed-item");
    };
  } else if (URL.includes("trending")) {
    trending();
  } else if (URL.includes("discover")) {
    attachListenerToClickables("video-card");
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.title.includes("Trending") && !hasTrendingRan) {
    trending();
  } else {
    attachListenerToClickables("video-card");
  }
});
