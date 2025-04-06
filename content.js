async function getSettings() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(["accessKey", "query", "collections", "topics", "username"], (data) => {
      resolve(data);
    });
  });
}

function buildUnsplashURL({ accessKey, query, collections, topics, username }) {
  const base = `https://api.unsplash.com/photos/random`;
  const params = new URLSearchParams();

  params.set("client_id", accessKey);
  if (query) params.set("query", query);
  if (collections) params.set("collections", collections);
  if (topics) params.set("topics", topics);
  if (username) params.set("username", username);
  params.set("orientation", "landscape");

  return `${base}?${params.toString()}`;
}

async function getRandomImage(settings) {
  const url = buildUnsplashURL(settings);
  const response = await fetch(url);
  const data = await response.json();
  return data.urls?.regular;
}

async function replaceAdImage() {
  const settings = await getSettings();
  if (!settings.accessKey) {
    console.warn("Access Key not set.");
    return;
  }

  const iframe = document.querySelector('iframe[class*="ad-banner"]');
  if (iframe) {
    try {
      const newImage = await getRandomImage(settings);
      if (newImage) {
        const img = document.createElement("img");
        img.src = newImage;
        img.alt = "Replaced Ad";
        img.style.width = iframe.style.width || "100%";
        img.style.height = iframe.style.height || "auto";
        iframe.parentNode.replaceChild(img, iframe);
      }
    } catch (err) {
      console.error("Failed to fetch image from Unsplash:", err);
    }
  } else {
    console.warn("Ad iframe with class 'ad-banner' not found.");
  }
}
setTimeout(replaceAdImage, 2000);
