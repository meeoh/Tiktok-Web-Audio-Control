// Saves options to chrome.storage
function save_options() {
  var rate = document.getElementById("adjustRate").value;
  var defaultLevel = document.getElementById("defaultLevel").value;

  chrome.storage.sync.set(
    {
      adjustRate: rate,
      defaultLevel: parseInt(defaultLevel, 10) || 10,
    },
    function () {
      // Update status to let user know options were saved.
      var status = document.getElementById("status");
      status.textContent = "Options saved.";
      setTimeout(function () {
        status.textContent = "";
      }, 750);
    }
  );
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get(
    {
      adjustRate: "5",
      defaultLevel: "10",
    },
    function (items) {
      document.getElementById("adjustRate").value = items.adjustRate;
      document.getElementById("defaultLevel").value = items.defaultLevel;
    }
  );
}
document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_options);
