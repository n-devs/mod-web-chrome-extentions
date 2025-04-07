
function update() {
  chrome.storage.local.get(
    {
      config: {
        version: "1.0.0",
        scripts: [],
      },
    },
    function (result) {
      fetch("https://raw.githubusercontent.com/n-devs/mod-web-chrome-extentions/refs/heads/main/scripts/update.json").then((response) => {
        const config = response.json();
        const defaultConfig = result.config;

        if (config.version !== defaultConfig.version) {
          console.log("Update available");
          chrome.storage.local.set({ config: config });
          start(config);
        } else {
          start(result.config);
        }
      });
    }
  );
}


function start(config) {
  chrome.webNavigation.onCompleted.addListener(function (details) {
    // This function will be triggered when a page finishes loading
    chrome.tabs.get(details.tabId, function (tab) {
      console.log("Tab details: ", details);

      // Get the URL of the active tab
      console.log("Tab ID: ", details.tabId);
      console.log("tab: ", tab);

      const url = tab.url;
      console.log("Page loaded: ", url);
      const domain = tab.url.split("/")[2];
     const scripts = config.scripts.filter((script) => {
        // Check if the script should be executed on this domain
        if (script.domain === domain) {
          console.log("Executing script: ", script.name);
         return script
        }
      });

      if(scripts.length > 0) {
       
        chrome.scripting
        .executeScript({
          target: { tabId: details.tabId },
          func: require(`${scripts[0].path}`),
        })
        .then(() => console.log("injected a function"));
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


update()