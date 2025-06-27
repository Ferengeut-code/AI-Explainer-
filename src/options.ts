import "./styles.css";

const defaultPrompt = document.getElementById(
  "defaultPrompt"
) as HTMLTextAreaElement;
const language = document.getElementById("language") as HTMLSelectElement;
const explanation = document.getElementById("explanation") as HTMLSelectElement;
const apiKeyInput = document.getElementById("apiKey") as HTMLInputElement;

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(
    ["defaultPrompt", "language", "explanation"],
    (result) => {
      defaultPrompt.value = result.defaultPrompt || "Explain the word ";
      language.value = result.language || "";
      explanation.value = result.explanation || "";
      apiKeyInput.value = result.apiKey || "";
    }
  );
});

document.getElementById("save")?.addEventListener("click", () => {
  const defaultPromptValue = defaultPrompt?.value || "";
  const languageValue = language?.value || "";
  const explanationValue = explanation?.value || "";
  const apiKeyValue = apiKeyInput?.value || "";

  if (
    !defaultPromptValue ||
    !languageValue ||
    !explanationValue ||
    !apiKeyValue
  ) {
    alert("Some settings fields are missing.");
    return;
  }

  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
    chrome.storage.local.set(
      {
        defaultPrompt: defaultPromptValue,
        language: languageValue,
        explanation: explanationValue,
        apiKey: apiKeyValue,
      },
      () => {
        alert("Settings saved successfully!");
      }
    );
  } else {
    alert("Run this as a Chrome extension.");
  }
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local") {
    if (changes.defaultPrompt) {
      defaultPrompt.value = changes.defaultPrompt.newValue;
    }
    if (changes.language) {
      language.value = changes.language.newValue;
    }
    if (changes.explanation) {
      explanation.value = changes.explanation.newValue;
    }
    if (changes.apiKey) {
      apiKeyInput.value = changes.apiKey.newValue;
    }
  }
});
