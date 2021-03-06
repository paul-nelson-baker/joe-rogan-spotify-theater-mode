// https://stackoverflow.com/a/16726669/1478636
// https://stackoverflow.com/a/9862207/1478636

(function() {
  'use strict';

  /*
  FIXME:
    Need to figure out how to load from a separate file we can take
    advantage of syntax highlighting/vscode hints if we do.
  */
  // const theaterModePath = chrome.runtime.getURL('theater-mode.css');
  // const theaterModeCSS = function() {
  //   var output;
  //   fetch(theaterModePath)
  //     .then(response => response.text())
  //     .then(text => output = text)
  //   return output;
  // }();
  // console.log('loaded ext css', theaterModeCSS);
  const theaterModeCSS = `
  nav.Root__nav-bar, div.Root__main-view {
    filter: brightness(10%);
  }
  
  @media only screen and (max-width: 960px) {
    .VideoPlayer video, .VideoPlayer--landscape {
      width: 100vw !important;
    }

    div[data-testid="video-player"] {
      top: 125px !important;
      bottom: initial !important;
      left: 0px !important;
      z-index: 100;
    }
  }

  @media only screen and (min-width: 961px) and (max-width: 1280px) {
    .VideoPlayer video, .VideoPlayer--landscape {
      width: 100vw !important;
    }

    div[data-testid="video-player"] {
      top: 0px !important;
      bottom: initial !important;
      left: 0px !important;
      z-index: 100;
    }
  }

  @media only screen and (min-width: 1281px) {
    .VideoPlayer video, .VideoPlayer--landscape {
      width: 100vw !important;
      max-height: 85vh;
    }

    div[data-testid="video-player"] {
      top: 0px !important;
      bottom: initial !important;
      left: 0px !important;
      z-index: 100;
    }
  }
  `;

  const $jq = jQuery.noConflict();
  const theaterModeID = 'jr-theater-mode';
  const theaterModeElement = $jq(`<style id='${theaterModeID}'>${theaterModeCSS}</style>`);
  console.log('Generated CSS element', theaterModeElement);

  const checkIsJRE = () => {
    const jreLink = $jq('.now-playing a').filter((_, item) => { return $jq(item).text() === "The Joe Rogan Experience"; });
    console.log(jreLink);
    return jreLink.length > 0;
  };

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (!mutation.addedNodes) {
        return;
      }

      const videoTag = 'video';
      for (let i = 0; i < mutation.addedNodes.length; i++) {
        const node = mutation.addedNodes[i];
        if (node.nodeName.toLowerCase() === videoTag) {
          $jq(videoTag).on('play', () => {
            if (!checkIsJRE()) {
              console.log('not on JRE video, leaving things as-is to preserve current functionality');
              return;
            }
            console.log('injecting theater css');
            $jq('head').append(theaterModeElement);
          });
          $jq(videoTag).on('pause', () => {
            console.log('removing theater css');
            theaterModeElement.remove();
          });
          console.log('Found the video element, we can stop watching the DOM because we\'ve tied the play/pause events to it.');
          observer.disconnect();
        }
      }
    })
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false,
  });
})();