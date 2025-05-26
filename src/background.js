chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "explainText",
    title: "Explain with ChatGPT",
    contexts: ["selection"]
  });
});

// Keep track of which tabs have the content script
const initializedTabs = new Set();

// Listen for tab updates to reinject content script if needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url?.startsWith('http')) {
    initializedTabs.delete(tabId);
  }
});

async function ensureContentScriptInjected(tabId) {
  if (initializedTabs.has(tabId)) {
    return;
  }

  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ['content.js']
    });
    initializedTabs.add(tabId);
  } catch (error) {
    console.error('Failed to inject content script:', error);
    throw error;
  }
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "explainText") {
    try {
      // Get API key from storage
      const data = await chrome.storage.local.get("openaiApiKey");
      
      if (!data.openaiApiKey) {
        throw new Error("OpenAI API key not found. Please set up your API key in the extension options.");
      }

      // Ensure content script is injected
      await ensureContentScriptInjected(tab.id);

      // Wait a moment for the content script to initialize
      await new Promise(resolve => setTimeout(resolve, 100));

      // Try sending message to content script
      const response = await chrome.tabs.sendMessage(tab.id, {
        action: "explain",
        text: info.selectionText,
        apiKey: data.openaiApiKey
      });

      if (response?.success) {
        console.log("✅ Explanation received:", response.data);
      } else {
        console.error("❌ Error from content script:", response?.error || "Unknown error");
      }

    } catch (error) {
      console.error("❌ Error:", error.message);
      chrome.action.setBadgeText({ text: "!" });
      chrome.action.setBadgeBackgroundColor({ color: "#FF0000" });
    }
  }
});
