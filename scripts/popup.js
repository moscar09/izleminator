document.addEventListener('DOMContentLoaded', function() {
    var version = chrome.runtime.getManifest().version;
    version += IS_DEV ? "-dev" : "";
    document.getElementById("version").innerHTML = version;

    chrome.storage.local.get(["izl_screen_name"], function(items) {
        document.getElementById("izl-screen-name").value = items.izl_screen_name;
    });

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var current_url  = new URL(tabs[0].url);
        var current_room = current_url.searchParams.get("izl_room");

        if(current_room != undefined) {
            document.getElementById("izl-url").value = current_url.toString();
        }

        document.getElementById("izl-submit").addEventListener('click', function() {
            var screenName = document.getElementById("izl-screen-name").value;

            if (screenName == '') {
                screenName = 'Anonymous';
            }

            var room_id     = Math.random().toString(36).substring(2);
            current_url.searchParams.set("izl_room", room_id);

            document.getElementById("izl-url").value = current_url.toString();
            chrome.tabs.sendMessage(tabs[0].id, {
                izleminate: true,
                screen_name: screenName,
                room_name: room_id,
                new_url: current_url.toString(),
            });

            chrome.storage.local.set({
                "izl_screen_name": screenName,
            });

        });

    });
});