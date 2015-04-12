// Generated by CoffeeScript 1.8.0
(function() {
  var displayNotice, doSearching, getSourceWebsite, getVideoTitle, moreDisplayed, notice_template, pageLoad, parseYouTubeItem, showMoreVideo, video_item_template, web_dict, youtube_prefix, youtube_seach_prefix;

  web_dict = {
    'http://v.youku.com/': 'YOUKU'
  };

  youtube_prefix = 'https://www.youtube.com/watch?v=';

  youtube_seach_prefix = 'https://www.youtube.com/results?search_query=';

  notice_template = "<div class=\"woy-notice\">\n  <div class=\"message\">\n    Similar video found on Youtube!\n    <div class=\"close\">Close</div>\n  </div>\n  <ul class=\"video-list\">\n  </ul>\n  <div class=\"more-video\">more...</div>\n</div>";

  video_item_template = "<li>\n  <a class=\"link\" href=#\"\" target=\"_blank\">\n    <img class=\"thumbnail\" />\n    <div class=\"text\">\n      <div class=\"title\"></div>\n      <div class=\"description\"></div>\n    </div>\n  </a>\n</li>";

  getSourceWebsite = function() {
    var prefix, url;
    url = window.location.href;
    for (prefix in web_dict) {
      if (url.indexOf(prefix) === 0) {
        return web_dict[prefix];
      }
    }
  };

  getVideoTitle = function() {
    var website;
    website = getSourceWebsite();
    if (website === null) {
      return;
    }
    switch (website) {
      case 'YOUKU':
        return $('h1.title').html();
    }
  };

  parseYouTubeItem = function(item) {
    var ex, parsed;
    try {
      parsed = {
        title: item['snippet']['title'],
        description: item['snippet']['description'],
        url: youtube_prefix + item['id']['videoId'],
        thumbnail: item['snippet']['thumbnails']['default']['url']
      };
    } catch (_error) {
      ex = _error;
    }
    return parsed;
  };

  moreDisplayed = false;

  showMoreVideo = function(keyword) {
    return function() {
      if (!moreDisplayed) {
        console.log("show more video");
        $('.woy-notice').addClass('more');
        console.log($('.woy-notice').find('.more-video'));
        $('.woy-notice').find('.more-video').html("Search on YouTube");
        moreDisplayed = true;
      } else {
        window.open(youtube_seach_prefix + keyword);
      }
      return false;
    };
  };

  displayNotice = function(data, keyword) {
    var $notice, $video, item, video, _i, _len;
    $('div.woy-notice').remove();
    $notice = $(notice_template);
    $notice.find('.more-video').click(showMoreVideo(keyword));
    $notice.find('.close').click(function() {
      return $notice.hide(500);
    });
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      item = data[_i];
      video = parseYouTubeItem(item);
      if (!video) {
        continue;
      }
      $video = $(video_item_template);
      $video.find('.title').html(video.title);
      $video.find('.description').html(video.description);
      $video.find('.link').attr('href', video.url);
      console.log(video.thumbnail);
      $video.find('.thumbnail').attr('src', video.thumbnail);
      $notice.find('.video-list').append($video);
    }
    return $('body').prepend($notice);
  };

  pageLoad = function() {
    var handle, request;
    request = {
      event: 'load'
    };
    handle = function(option) {
      if (option) {
        return doSearching();
      }
    };
    console.log("send load request");
    return chrome.runtime.sendMessage(request, handle);
  };

  doSearching = function() {
    var sendData, title, videoSearchResponse;
    title = getVideoTitle();
    console.log('Send title: ' + title);
    sendData = {
      event: 'search',
      title: title
    };
    videoSearchResponse = function(data) {
      console.log(JSON.stringify(data));
      if (data.length > 0) {
        return displayNotice(data, title);
      }
    };
    return chrome.runtime.sendMessage(sendData, videoSearchResponse);
  };

  $(document).ready(pageLoad);

}).call(this);
