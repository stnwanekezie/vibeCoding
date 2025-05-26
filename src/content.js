let isProcessing = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "explain") {
      handleExplanationRequest(request)
        .then((response) => sendResponse({ success: true, data: response }))
        .catch((error) => sendResponse({ success: false, error: error.message }));
      return true; // Keep the message channel open for async response
    }
  });

async function handleExplanationRequest(request) {
  if (isProcessing) {
    console.log("⏳ Already processing a request...");
    return;
  }

  try {
    isProcessing = true;
    
    // Create or get the explanation container
    let container = document.getElementById('chatgpt-explanation');
    if (!container) {
      container = createExplanationContainer();
    }

    container.innerHTML = '⏳ Getting explanation...';
    
    const response = await fetchExplanation(request.text, request.apiKey);
    container.innerHTML = formatExplanation(response);
    
  } catch (error) {
    console.error("❌ Error getting explanation:", error);
    showError(error.message);
  } finally {
    isProcessing = false;
  }
}

function createExplanationContainer() {
  const container = document.createElement('div');
  container.id = 'chatgpt-explanation';
  container.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    max-width: 400px;
    padding: 15px;
    background: white;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    z-index: 10000;
  `;
  document.body.appendChild(container);
  return container;
}

async function fetchExplanation(text, apiKey) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: `Please explain this text: ${text}`
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

function formatExplanation(text) {
  return `<div style="font-family: system-ui; font-size: 14px; line-height: 1.5">
    <h3 style="margin: 0 0 10px 0">Explainer</h3>
    <p style="margin: 0">${text}</p>
  </div>`;
}

function showError(message) {
  const container = document.getElementById('chatgpt-explanation') 
    || createExplanationContainer();
  
  container.innerHTML = `
    <div style="color: red; font-family: system-ui; font-size: 14px">
      ❌ Error: ${message}
    </div>
  `;
}