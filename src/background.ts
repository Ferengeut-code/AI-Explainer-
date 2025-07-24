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
    handleExplainText(request.text, request.prompt)
      .then((result) => sendResponse({ result }))
      .catch((err) => sendResponse({ error: err.message }));
    return true;
  }
});

async function handleExplainText(
  text: string,
  prompt: string
): Promise<string> {
  const {
    apiKey,
    language = "English",
    explanation = "short",
  } = await chrome.storage.local.get(["apiKey", "language", "explanation"]);

  if (!apiKey) {
    throw new Error("API key is not set.");
  }

  const fullPrompt = `${prompt} (Language: ${language}, Depth: ${explanation}): ${text}`;
  console.log("Sending prompt to OpenAI:", fullPrompt);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: fullPrompt }],
    }),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message || "OpenAI API returned an error.");
  }

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("No explanation returned from OpenAI.");
  }

  return content;
}
