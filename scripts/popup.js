document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.local.get(["izl_enabled", "izl_screen_name"], function(items) {
    document.getElementById("izl-screen-name").value = items.izl_screen_name;
    document.getElementById("izl-enable").checked    = items.izl_enabled == true;
    console.log("DOMContentLoaded");
  });

  document.getElementById("izl-submit").addEventListener('click', function() {
    var isEnabled  = document.getElementById("izl-enable").checked;
    var screenName = document.getElementById("izl-screen-name").value;

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        izleminate: true,
        screen_name: screenName
      });
    });

    if (screenName == '') {
      screenName = 'Anonymous';
    }
    chrome.storage.local.set({
      "izl_enabled"    : isEnabled,
      "izl_screen_name": screenName,
   });
  });

});
