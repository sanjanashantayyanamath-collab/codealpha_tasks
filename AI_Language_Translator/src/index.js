async function translateText() {
  const inputText = document.getElementById('inputText').value.trim();
  const targetLang = document.getElementById('targetLanguage').value;
  const outputTextElement = document.getElementById('outputText');

  if (!inputText) {
    alert("Please enter text to translate.");
    return;
  }

  outputTextElement.value = "Translating...";

  try {
    // Using the MyMemory Free Translation API
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(inputText)}&langpair=en|${targetLang}`
    );
    const data = await response.json();

    // Display translated text
    if (data.responseData.translatedText) {
      outputTextElement.value = data.responseData.translatedText;
    } else {
      outputTextElement.value = "Translation failed. Try again.";
    }

  } catch (error) {
    outputTextElement.value = "Error: Could not connect to API.";
    console.error(error);
  }
}

function copyText() {
  const text = document.getElementById('outputText').value;
  navigator.clipboard.writeText(text)
    .then(() => alert("Translated text copied to clipboard!"))
    .catch(err => console.error("Failed to copy: ", err));
}

function speakText() {
  const textToSpeak = document.getElementById('outputText').value.trim();
  const targetLang = document.getElementById('targetLanguage').value;

  if (!textToSpeak || textToSpeak.startsWith("Translating")) {
    alert("Please wait for translation or enter text.");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  utterance.lang = targetLang || 'en-US';
  window.speechSynthesis.speak(utterance);
}
