import "./popup.css";
document.addEventListener("DOMContentLoaded", async () => {
  const inputField = document.getElementById(
    "popup-selectedText"
  ) as HTMLTextAreaElement;
  const outputField = document.getElementById(
    "popup-result"
  ) as HTMLTextAreaElement;
  const promptField = document.getElementById("Prompt") as HTMLTextAreaElement;

  const { selectedText } = await chrome.storage.local.get("selectedText");
  const text = selectedText || "";
  inputField.value = text;

  const { defaultPrompt } = await chrome.storage.local.get("defaultPrompt");
  const prompt = defaultPrompt || "Explain the word";
  promptField.value = prompt;

  const explainText = () => {
    outputField.value = "Loading...";
    chrome.runtime.sendMessage(
      {
        type: "explainText",
        text: inputField.value,
        prompt: promptField.value,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          outputField.value = "Error: " + chrome.runtime.lastError.message;
        } else if (response?.error) {
          outputField.value = "Error: " + response.error;
        } else {
          outputField.value = response?.result || "No response from AI.";
        }
      }
    );
  };
  document
    .getElementById("explanation-button")
    ?.addEventListener("click", explainText);
  if (inputField.value.trim()) {
    explainText();
  }
});
