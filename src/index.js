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
    const vid =
      document.getElementsByClassName("video-player horizontal")[0] ||
      document.getElementsByTagName("video")[0];
    generateInjectedHTML(vid);
  }, 0);
}

// function trending() {
//   hasTrendingRan = true;
//   var observer = new MutationObserver(function (mutations) {
//     attachListenerToClickables("video-feed-item");
//   });

//   observer.observe(document.body, {
//     childList: true,
//     subtree: true,
//     attributes: false,
//     characterData: false,
//   });
// }

function attachListenerToClickables(className) {
  const clickables = toArray(document.getElementsByClassName(className));
  clickables.forEach((video) => {
    video.addEventListener("click", clickFunction);
  });
}

// pass in a comparison function that takes in a node, and returns true if
// we should add music controls to that node. If comparison function is null
// query for className after mutations are done and add to all candidates
function setupObserver(className, comaprisonFunction = null) {
  var observer = new MutationObserver(function (mutations) {
    if (comaprisonFunction && comaprisonFunction instanceof Function) {
      mutations.forEach(function (mutation) {
        if (!mutation.addedNodes) return;
        for (var i = 0; i < mutation.addedNodes.length; i++) {
          var node = mutation.addedNodes[i];
          if (comaprisonFunction(node)) {
            const video = document.getElementsByTagName(className)[0];
            generateInjectedHTML(video);
          }
        }
      });
    } else {
      attachListenerToClickables(className);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false,
  });
}

chrome.storage.sync.get("adjustRate", function (result) {
  if (result && result.adjustRate) {
    adjustRate = parseInt(result.adjustRate, 10);
  }
  if (URL.includes("/video/")) {
    // On individual video page
    setupObserver("video", (node) => {
      const classList = toArray(node.classList);
      return classList.indexOf("video-card-big") > -1;
    });
  } else if (URL.includes("@")) {
    // On someones profile page
    setupObserver("video-feed-item");
  } else if (URL.includes("foryou")) {
    // trending needs some work since url changes
    // trending();
  } else if (URL.includes("discover")) {
    setupObserver("video-card");
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.title.includes("Trending") && !hasTrendingRan) {
    // trending();
  } else {
    attachListenerToClickables("video-card");
  }
});
