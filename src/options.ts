import "./styles.css";
document.getElementById("save")?.addEventListener("click", () => {
  const defaultPrompt = document.getElementById(
    "defaultPrompt"
  ) as HTMLTextAreaElement | null;
  const language = document.getElementById(
    "language"
  ) as HTMLSelectElement | null;
  const explanation = document.getElementById(
    "explanation"
  ) as HTMLSelectElement | null;

  const defaultPromptValue = defaultPrompt?.value || "";
  const languageValue = language?.value || "";
  const explanationValue = explanation?.value || "";

  if (!defaultPromptValue || !languageValue || !explanationValue) {
    alert("Some settings fields are missing.");
    return;
  }

  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
    chrome.storage.local.set(
      {
        defaultPrompt: defaultPromptValue,
        language: languageValue,
        explanation: explanationValue,
      },
      () => {
        alert("Settings saved successfully!");
      }
    );
  } else {
    alert("Run this as a Chrome extension.");
  }
});
