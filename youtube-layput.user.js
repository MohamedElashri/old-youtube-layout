// ==UserScript==
// @name         YouTube Old Layout
// @version      1.0.0
// @author       melashri
// @namespace    https://github.com/MohamedElashri/old-youtube-layout
// @description  Restore pre-2024 youtube layout.
// @match        *://*.youtube.com/*
// @match        *://*.youtu.be/*
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      MIT
// @downloadURL  https://github.com/MohamedElashri/old-youtube-layout/raw/main/youtube-layput.user.js
// @updateURL    https://github.com/MohamedElashri/old-youtube-layout/raw/main/youtube-layput.user.js
// ==/UserScript==

(function () {
    'use strict';

    // Revert YouTube UI changes by modifying experiment flags
    ytcfg.set('EXPERIMENT_FLAGS', {
        ...ytcfg.get('EXPERIMENT_FLAGS'),
        "kevlar_watch_comments_panel_button": false,
        "kevlar_watch_comments_ep_disable_theater": true,
        "kevlar_watch_grid": false,
        "kevlar_watch_grid_hide_chips": false,
        "kevlar_watch_grid_reduced_top_margin_rich_grid": false,
        "optimal_reading_width_comments_ep": false,
        "small_avatars_for_comments": false,
        "small_avatars_for_comments_ep": false,
        "swatcheroo_direct_use_rich_grid": false,
        "web_watch_compact_comments": false,
        "web_watch_compact_comments_header": false,
        "swatcheroo_rich_grid_delay": 0,
        "wn_grid_max_item_width": 0,
        "wn_grid_min_item_width": 0,
    });

    // Modify page elements periodically
    let timeoutId = null;
    function modifyPageElements() {
        if (timeoutId) return;

        if (window.location.href.includes("youtube.com/watch")) {
            const startTime = performance.now();

            modifySidebarVideos();
            adjustVideoPlayerElements();

            const endTime = performance.now();
            console.log(`Total execution time: ${(endTime - startTime).toFixed(2)}ms`);
        }

        timeoutId = setTimeout(() => {
            timeoutId = null;
        }, 50);
    }

    // Format sidebar video elements
    function modifySidebarVideos() {
        const thumbnailDivs = document.querySelectorAll('ytd-rich-grid-media #thumbnail');
        thumbnailDivs.forEach(div => {
            div.style.cssText = `width: 168px; position: absolute;`;
        });

        const detailsDivs = document.querySelectorAll('#details');
        detailsDivs.forEach(div => {
            div.style.cssText = "padding-left:176px; margin-top:-12px; min-height: 101px;";
        });

        const metadataLineDivs = document.querySelectorAll("div#metadata-line");
        metadataLineDivs.forEach(div => {
            div.style.cssText = "font-size: 1.2rem; line-height: 1.2rem;";
        });

        const contentsDivs = document.querySelectorAll('div#contents.ytd-rich-grid-row');
        contentsDivs.forEach(div => {
            div.style.cssText = "margin: 0px;";
        });

        const richItemDivs = document.querySelectorAll("div#contents.ytd-rich-grid-row > ytd-rich-item-renderer");
        richItemDivs.forEach(div => {
            div.style.cssText = "margin-left: 0px; margin-right 0px; margin-bottom: 13px;";
            const avatarLink = div.querySelector("a#avatar-link");
            if (avatarLink) avatarLink.remove();
        });

        const videoTitleElements = document.querySelectorAll("a#video-title-link yt-formatted-string#video-title");
        videoTitleElements.forEach(element => {
            element.style.fontSize = "1.4rem";
            element.style.lineHeight = "2rem";
        });

        const channelNameDivs = document.querySelectorAll("#items.style-scope.ytd-watch-next-secondary-results-renderer ytd-channel-name#channel-name div#container");
        channelNameDivs.forEach(div => {
            div.style.fontSize = "1.2rem";
            div.style.lineHeight = "1.9rem";
        });

        const sponsoredThumbnails = document.querySelectorAll('div[id="fulfilled-layout"][class*="ytd-ad-slot-renderer"]');
        sponsoredThumbnails.forEach(thumbnail => {
            thumbnail.parentNode.removeChild(thumbnail);
        });

        const secondaryDivs = document.querySelectorAll("div#secondary");
        secondaryDivs.forEach(div => {
            div.style.cssText = "padding-top: 0px;";
        });
    }

    // Resize video player elements
    function adjustVideoPlayerElements() {
        const container = document.getElementById("player");
        if (!container) return;

        if (container.offsetWidth === 0) {
            console.log("Skipping resize due to zero-width container.");
            return;
        }

        const containerWidth = container.offsetWidth + "px";
        const containerHeight = container.offsetHeight + "px";

        const videoStream = document.querySelector(".video-stream.html5-main-video");
        if (videoStream) {
            videoStream.style.width = containerWidth;
            videoStream.style.height = containerHeight;
        }

        const ivVideoContent = document.querySelector(".ytp-iv-video-content");
        if (ivVideoContent) {
            ivVideoContent.style.width = containerWidth;
            ivVideoContent.style.height = '100%';
        }

        const bottomWidth = (container.offsetWidth - 24) + "px";
        const chromeBottom = document.querySelector(".ytp-chrome-bottom");
        if (chromeBottom) {
            chromeBottom.style.width = bottomWidth;
            chromeBottom.style.left = '12px';
        }

        const chapterHoverBar = document.querySelector(".ytp-chapter-hover-container");
        if (chapterHoverBar) {
            chapterHoverBar.style.width = bottomWidth;
        }
    }

    // Monitor for changes and adjust elements as needed
    const observer = new MutationObserver(modifyPageElements);
    observer.observe(document.body, { childList: true, subtree: true });
})();
