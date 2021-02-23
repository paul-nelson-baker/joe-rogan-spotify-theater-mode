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
  .VideoPlayer video, .VideoPlayer--landscape {
    width: 100vw !important;
  }
  
  div[data-testid="video-player"] {
    top: 125px !important;
    bottom: initial !important;
    left: 0px !important;
    z-index: 100;
  }
  
  nav.Root__nav-bar, div.Root__main-view {
    filter: brightness(10%);
  }`;

  const $jq = jQuery.noConflict();
  const theaterModeID = 'jr-theater-mode';
  const theaterModeElement = $jq(`<style id='${theaterModeID}'>${theaterModeCSS}</style>`);
  console.log('Generated CSS element', theaterModeElement);

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