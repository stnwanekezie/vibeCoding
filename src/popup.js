let conversationHistory = [];

// Handle enter key in textarea
document.getElementById("user-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    document.getElementById("send-button").click();
  }
});

document.getElementById("send-button").addEventListener("click", handleMessage);
document.getElementById("clear-chat").addEventListener("click", clearChat);

async function handleMessage() {
  const userInput = document.getElementById("user-input").value.trim();
  if (!userInput) return;

  const chatLog = document.getElementById("chat-log");
  
  appendMessage("user", userInput);
  document.getElementById("user-input").value = "";

  try {
    const { openaiApiKey } = await chrome.storage.local.get("openaiApiKey");
    if (!openaiApiKey) {
      throw new Error("OpenAI API key not found. Please set it in options.");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiApiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [...conversationHistory]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;
    
    appendMessage("assistant", reply);
    await saveConversation();
    
  } catch (error) {
    appendMessage("error", error.message);
  }
}

function appendMessage(role, content) {
  const chatLog = document.getElementById("chat-log");
  const messageDiv = document.createElement("div");
  
  if (role === "error") {
    messageDiv.className = "error-message";
    messageDiv.innerHTML = `❌ Error: ${content}`;
  } else {
    messageDiv.className = role === "user" ? "user-message" : "gpt-message";
    messageDiv.innerHTML = `<strong>${role === "user" ? "You" : "ChatGPT"}:</strong> ${content}`;
    conversationHistory.push({ role, content });
  }
  
  chatLog.appendChild(messageDiv);
  chatLog.scrollTop = chatLog.scrollHeight;
}

async function clearChat() {
  const chatLog = document.getElementById("chat-log");
  chatLog.innerHTML = "";
  conversationHistory = [];
  await chrome.storage.local.remove("conversationHistory");
}

async function saveConversation() {
  await chrome.storage.local.set({ conversationHistory });
}

// Load conversation history when popup opens
document.addEventListener("DOMContentLoaded", async () => {
  const { conversationHistory: history } = await chrome.storage.local.get("conversationHistory");
  if (history) {
    conversationHistory = history;
    history.forEach(msg => {
      appendMessage(msg.role, msg.content);
    });
  }
});