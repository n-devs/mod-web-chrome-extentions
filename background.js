const config = {
  scripts: [
    {
      domain: "www.up-manga.com",
      removeEl: [],
      func: function () {
        const data = {
          removeEl: [
            'div[class="center_upmangaza"]',
            'div[class="center_upmanga"]',
            'div[class="center_upmangaza2"]',
            'div[class="center_upmanga2"]',
            'div[class="center_upmangaza3"]',
            'div[class="center_upmanga3"]',
            'div[id="sticky-bottom"]',
            'div[id="sticky-bottom2"]',
            'div[id="sticky-bottom3"]',
          ],
          hideEl: [],
        };

        if (data.removeEl.length > 0) {
          data.removeEl.forEach((element) => {
            if (document.querySelectorAll(element).length > 0) {
              document.querySelectorAll(element).forEach((el) => {
                el.parentNode.removeChild(el);
              });
            } else {
              document.body.style.display = "block";
            }
          });
        }

        if (data.hideEl.length > 0) {
          data.hideEl.forEach((element) => {
            if (document.querySelectorAll(element).length > 0) {
              document.querySelectorAll(element).forEach((el) => {
                el.style.display = "block";
              });
            } else {
              document.body.style.display = "block";
            }
          });
        } else {
        }
      },
    },
  ],
};

function start() {
  chrome.webNavigation.onCompleted.addListener(function (details) {
    // This function will be triggered when a page finishes loading

    chrome.tabs.get(details.tabId, function (tab) {
      const url = tab.url;
      console.log("Page loaded: ", url);
      const domain = tab.url.split("/")[2];

      const scripts = config.scripts.filter((script) => {
        // Check if the script should be executed on this domain
        if (script.domain === domain) {
          return script;
        }
      });

      if (scripts.length > 0) {
        chrome.scripting
          .executeScript({
            target: { tabId: details.tabId },
            func: function () {
              document.body.style.display = "none";
            },
          })
          .then(() => {
            chrome.scripting
              .executeScript({
                target: { tabId: details.tabId },
                func: scripts[0].func,
              })
              .then(() => {
                console.log("Script executed successfully.");
              });
          });
      }

      // Store the URL in localStorage or any other storage mechanism (if required)
      chrome.storage.local.get({ urls: [] }, function (result) {
        const updatedUrls = result.urls;
        updatedUrls.push(url);
        chrome.storage.local.set({ urls: updatedUrls });
      });
    });
  });
}

start();
