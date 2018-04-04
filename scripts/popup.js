document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.local.get(["izl_enabled", "izl_screen_name"], function(items) {
    document.getElementById("izl-screen-name").value = items.izl_screen_name;
    document.getElementById("izl-enable").checked    = items.izl_enabled == true;
    console.log("DOMContentLoaded");
  });

  document.getElementById("izl-submit").addEventListener('click', function() {
    var screenName = document.getElementById("izl-screen-name").value;

    if (screenName == '') {
      screenName = 'Anonymous';
    }

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var room_id     = Math.random().toString(36).substring(2);
      var current_url = new URL(tabs[0].url);
      current_url.searchParams.set("izl_room", room_id);

      document.getElementById("izl-url").value = current_url.toString();
      chrome.tabs.sendMessage(tabs[0].id, {
        izleminate: true,
        screen_name: screenName,
        room_name: room_id
      });
    });

    chrome.storage.local.set({
      "izl_screen_name": screenName,
   });
  });

});
