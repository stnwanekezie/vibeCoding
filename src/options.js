document.addEventListener('DOMContentLoaded', async () => {
    const { openaiApiKey } = await chrome.storage.local.get('openaiApiKey');
    if (openaiApiKey) {
        document.getElementById('apiKey').value = openaiApiKey;
    }
});

document.getElementById('save').addEventListener('click', async () => {
    const apiKey = document.getElementById('apiKey').value.trim();
    const status = document.getElementById('status');

    if (!apiKey) {
        showStatus('Please enter an API key', false);
        return;
    }

    try {
        await chrome.storage.local.set({ openaiApiKey: apiKey });
        showStatus('API key saved successfully!', true);
    } catch (error) {
        showStatus('Error saving API key: ' + error.message, false);
    }
});

function showStatus(message, success) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = 'status ' + (success ? 'success' : 'error');
    status.style.display = 'block';
    setTimeout(() => {
        status.style.display = 'none';
    }, 3000);
}