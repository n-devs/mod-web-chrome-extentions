document.addEventListener('DOMContentLoaded', function () {
    chrome.storage.local.get({urls: []}, function(result) {

        
        
      const urlsList = result.urls;
      const urlsContainer = document.getElementById('urls');
  
      if (urlsList.length > 0) {
        urlsList.forEach(url => {
          const li = document.createElement('li');
          li.textContent = url;
        //   console.log("Loaded URLs: ", url);
          urlsContainer.appendChild(li);
        });
      } else {
        const li = document.createElement('li');
        li.textContent = "No URLs collected yet.";
        urlsContainer.appendChild(li);
      }
    });
  });