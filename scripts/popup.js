document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.local.get(["izl_enabled", "izl_screen_name"], function(items) {
    document.getElementById("izl-screen-name").value = items.izl_screen_name;
    document.getElementById("izl-enable").checked    = items.izl_enabled == true;
  });

  document.getElementById("izl-submit").addEventListener('click', function() {
    var isEnabled  = document.getElementById("izl-enable").checked;
    var screenName = document.getElementById("izl-screen-name").value
    if (screenName == '') {
      screenName = 'Anonymous';
    }
    chrome.storage.local.set({
      "izl_enabled"    : isEnabled,
      "izl_screen_name": screenName,
   });
  });

});
