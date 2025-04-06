document.getElementById("save").addEventListener("click", () => {
  const settings = {
    accessKey: document.getElementById("accessKey").value,
    query: document.getElementById("query").value,
    collections: document.getElementById("collections").value,
    topics: document.getElementById("topics").value,
    username: document.getElementById("username").value,
  };

  chrome.storage.sync.set(settings, () => {
    document.getElementById("status").textContent = "Saved!";
    setTimeout(() => {
      document.getElementById("status").textContent = "";
    }, 2000);
  });
});

window.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get(["accessKey", "query", "collections", "topics", "username"], (data) => {
    document.getElementById("accessKey").value = data.accessKey || "";
    document.getElementById("query").value = data.query || "";
    document.getElementById("collections").value = data.collections || "";
    document.getElementById("topics").value = data.topics || "";
    document.getElementById("username").value = data.username || "";
  });
});