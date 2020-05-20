chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (
    changeInfo &&
    changeInfo.title &&
    (changeInfo.title.includes("Trending") ||
      changeInfo.title.includes("Discover"))
  ) {
    chrome.tabs.sendMessage(tabId, { title: changeInfo.title }, response => {});
  }
});
