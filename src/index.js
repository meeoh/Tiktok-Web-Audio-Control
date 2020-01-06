const video = document.getElementsByTagName("video")[0];

const userInfo = document.getElementsByClassName("user-info")[0];

const wrapperDiv = document.createElement("div");
const percentageSpan = document.createElement("span");
let percentage = 10;
video.volume = percentage / 100;
percentageSpan.textContent = `${percentage}%`;

let increaseButton = document.createElement("button");
increaseButton.innerHTML = "+";
increaseButton.addEventListener("click", () => {
  if (percentage == 100) return;
  percentage += 5;
  percentageSpan.textContent = `${percentage}%`;
  video.volume = percentage / 100;
});

let decreaseButton = document.createElement("button");
decreaseButton.innerHTML = "-";
decreaseButton.addEventListener("click", () => {
  if (percentage == 0) return;
  percentage -= 5;
  percentageSpan.textContent = `${percentage}%`;
  video.volume = percentage / 100;
});

const volumeLabel = document.createElement("span");
volumeLabel.innerHTML = "VOLUME: ";

wrapperDiv.append(volumeLabel, decreaseButton, percentageSpan, increaseButton);
userInfo.after(wrapperDiv);
