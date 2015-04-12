// Generated by CoffeeScript 1.8.0
(function() {
  var head, onYouTubeApiLoad, optionRequestListener, pendingRequest, script, searchRequestListener, searchYoutube, youTubeAPILoaded;

  head = document.getElementsByTagName('head')[0];

  script = document.createElement('script');

  script.type = 'text/javascript';

  script.src = 'https://apis.google.com/js/client.js?onload=onClientLoad';

  head.appendChild(script);

  youTubeAPILoaded = false;

  pendingRequest = null;

  window.onClientLoad = function() {
    return gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
  };

  onYouTubeApiLoad = function() {
    gapi.client.setApiKey('AIzaSyD-EBWXZnauyJ_NvUPyeNX5m8kJswEEe-I');
    youTubeAPILoaded = true;
    console.log("onYouTubeApiLoad");
    if (pendingRequest !== null) {
      return pendingRequest();
    }
  };

  searchYoutube = function(query, callback) {
    var request;
    if (!youTubeAPILoaded) {
      pendingRequest = function() {
        return searchYoutbe(query, callback);
      };
      return;
    }
    request = gapi.client.youtube.search.list({
      part: 'snippet',
      q: query
    });
    return request.execute(callback);
  };

  searchRequestListener = function(request, sender, sendResponse) {
    var onSearchResponse, title;
    if (request.event !== 'search') {
      return false;
    }
    title = request.title;
    console.log('On request of searching ' + title);
    onSearchResponse = function(response) {
      var itemList;
      itemList = response['items'];
      console.log(itemList);
      console.log(sendResponse);
      return sendResponse(itemList);
    };
    searchYoutube(title, onSearchResponse);
    return true;
  };

  optionRequestListener = function(request, sender, sendResponse) {
    if (request.event !== 'load') {
      return false;
    }
    return sendResponse(true);
  };

  chrome.runtime.onMessage.addListener(searchRequestListener);

  chrome.runtime.onMessage.addListener(optionRequestListener);

  chrome.browserAction.onClicked.addListener(function(tab) {
    return alert('icon clicked');
  });

}).call(this);