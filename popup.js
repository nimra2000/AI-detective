document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const checkButton = document.getElementById('check-text');
  const resultContainer = document.getElementById('result-container');
  const loadingIndicator = document.getElementById('loading');
  const aiScoreElement = document.getElementById('ai-score');
  const aiMeterElement = document.getElementById('ai-meter');
  const additionalInfoElement = document.getElementById('additional-info');

  const API_KEY = "19f33c8c-39a3-47bf-8ffd-9b59219bf06c";

  // Function to get selected text with retry
  function getSelectedText(retryCount = 0) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (!tabs[0]) {
        alert('Could not find active tab. Please try again.');
        return;
      }

      // Try to inject content script if needed
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['content.js']
      }).then(() => {
        // After injection, try to get selected text
        chrome.tabs.sendMessage(tabs[0].id, { action: "getSelectedText" }, function(response) {
          if (chrome.runtime.lastError) {
            if (retryCount < 2) {
              // Retry after a short delay
              setTimeout(() => getSelectedText(retryCount + 1), 500);
            } else {
              console.error('Error:', chrome.runtime.lastError);
              alert('Error: Could not communicate with the webpage. Please refresh the page and try again.');
            }
            return;
          }

          const selectedText = response?.selectedText;
          if (selectedText && selectedText.length > 0) {
            // Show loading indicator
            loadingIndicator.style.display = 'block';
            resultContainer.style.display = 'none';
            
            // Call ZeroGPT API
            checkTextWithZeroGPT(selectedText, API_KEY);
          } else {
            alert('No text selected. Please highlight some text on the webpage first.');
          }
        });
      }).catch(error => {
        console.error('Script injection error:', error);
        alert('Error: Could not access the webpage. Please refresh and try again.');
      });
    });
  }

  // Check highlighted text
  checkButton.addEventListener('click', getSelectedText);

  // Function to check text with ZeroGPT API
  function checkTextWithZeroGPT(text, apiKey) {
    // ZeroGPT API endpoint
    const apiUrl = 'https://api.zerogpt.com/api/detect/detectText';
    
    const myHeaders = new Headers();
    myHeaders.append("ApiKey", apiKey);
    myHeaders.append("Content-Type", "application/json");
    
    fetch(apiUrl, {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({ input_text: text })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('API request failed with status ' + response.status);
      }
      return response.text();
    })
    .then(data => {
      // Process and display results
      displayResults(data);
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error checking text: ' + error.message);
      loadingIndicator.style.display = 'none';
    });
  }

  // Function to display results
  function displayResults(data) {
    // Hide loading indicator
    loadingIndicator.style.display = 'none';
    
    // Show result container
    resultContainer.style.display = 'block';
    
    // Parse the data if it's a string
    let resultData = data;
    if (typeof data === 'string') {
      try {
        resultData = JSON.parse(data);
      } catch (e) {
        console.error('Error parsing JSON response:', e);
        alert('Error parsing API response');
        return;
      }
    }
    
    // Check if the response has the expected structure
    if (!resultData.success || !resultData.data) {
      console.error('Unexpected API response format:', resultData);
      additionalInfoElement.innerHTML = '<p>Error: Unexpected API response format</p>';
      return;
    }
    
    // Extract the AI probability from the fakePercentage field
    const aiProbability = Math.round(resultData.data.fakePercentage || 0);
    
    // Update the score display
    aiScoreElement.textContent = aiProbability;
    
    // Update the meter fill
    aiMeterElement.style.width = `${aiProbability}%`;
    
    // Set color based on probability
    if (aiProbability < 30) {
      aiMeterElement.style.backgroundColor = '#4caf50'; // Green
    } else if (aiProbability < 70) {
      aiMeterElement.style.backgroundColor = '#ff9800'; // Orange
    } else {
      aiMeterElement.style.backgroundColor = '#f44336'; // Red
    }
    
    // Display additional information from the response
    let additionalInfo = '';
    
    // Add word statistics
    if (resultData.data.textWords !== undefined) {
      additionalInfo += `<p><strong>Total Words:</strong> ${resultData.data.textWords}</p>`;
    }
    
    if (resultData.data.aiWords !== undefined) {
      additionalInfo += `<p><strong>AI-Generated Words:</strong> ${resultData.data.aiWords}</p>`;
    }
    
    // Add any feedback from the API
    if (resultData.data.feedback) {
      additionalInfo += `<p><strong>Feedback:</strong> ${resultData.data.feedback}</p>`;
    }
    
    additionalInfoElement.innerHTML = additionalInfo;
  }
});