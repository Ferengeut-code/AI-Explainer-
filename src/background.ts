function createContextMenu() {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "explainWord",
      title: "AI Explainer",
      contexts: ["selection"],
    });
  });
}

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  await chrome.storage.local.set({ selectedText: info.selectionText });
  chrome.action.openPopup();
});
chrome.runtime.onInstalled.addListener(createContextMenu);
chrome.runtime.onStartup.addListener(createContextMenu);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "explainText") {
    (async () => {
      const { text, prompt } = request;
      const {
        apiKey,
        language = "English",
        explanation = "short",
      } = await chrome.storage.local.get(["apiKey", "language", "explanation"]);

      if (!apiKey) {
        sendResponse({ error: "API key is not set." });
        return;
      }
      chrome.storage.local.get("apiKey", console.log);

      const fullPrompt = `${prompt} (Language: ${language}, Depth: ${explanation}) : ${text}`;
      console.log("Sending prompt to OpenAI:", fullPrompt);
      console.log("API Key exists:", !!apiKey);

      try {
        const response = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: "gpt-3.5-turbo",
              messages: [{ role: "user", content: fullPrompt }],
            }),
          }
        );

        const data = await response.json();
        console.log("OpenAI API response:", data);
        setTimeout(() => {
          if (data.choices && data.choices.length > 0) {
            console.log("OpenAI response:", data);
            sendResponse({ result: data.choices?.[0]?.message?.content });
          } else {
            sendResponse({ error: "No response from API." });
          }
        }, 0);
      } catch (err) {
        const error = err as Error;
        setTimeout(() => {
          sendResponse({ error: error.message || "An error occurred." });
        }, 0);
      }
    })();
    return true;
  }
});
