document.addEventListener('DOMContentLoaded', () => {
    // Get references to the search input, button, and containers
    const searchInput = document.getElementById('youtube-search-input');
    const searchButton = document.getElementById('youtube-search-button');
    const resultsContainer = document.getElementById('youtube-results-container');
    const defaultTutorials = document.getElementById('default-tutorials');

    // Add event listeners for button click and Enter key press in the input
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (event) => {
      // Check if the pressed key is Enter
      if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default form submission if input is in a form
        handleSearch();
      }
    });

    /**
     * Handles the YouTube search functionality.
     * Fetches search results from the backend and displays them,
     * or shows default tutorials if the search query is empty.
     */
    async function handleSearch() {
      const query = searchInput.value.trim(); // Get and trim the search query

      if (query) {
        // If there's a query, hide default tutorials and show a loading message
        defaultTutorials.classList.add('hidden');
        resultsContainer.innerHTML = '<p class="text-gray-500 italic col-span-full">Searching YouTube...</p>';

        try {
          // Send the search query to the backend
          const response = await fetch('http://localhost:3000/search-youtube', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
          });

          // Check if the response is successful (status code 2xx)
          if (!response.ok) {
            // Attempt to read error details from the response body
            let errorDetails = `HTTP error! status: ${response.status}`;
            try {
                const errorJson = await response.json();
                if (errorJson.error) {
                    errorDetails += ` - ${errorJson.error}`;
                }
                if (errorJson.details) {
                    errorDetails += ` (${errorJson.details})`;
                }
            } catch (e) {
                // Ignore if response body is not JSON
                console.error("Failed to parse error response body:", e);
            }
            console.error('Error searching YouTube:', errorDetails);
            resultsContainer.innerHTML = `<p class="text-red-500 col-span-full">Error fetching YouTube videos: ${errorDetails}</p>`;
            return;
          }

          const data = await response.json();
          // Display the search results
          displaySearchResults(data.videos);

        } catch (error) {
          // This catch block handles network errors or issues before the server responds
          console.error('Error searching YouTube:', error);
          resultsContainer.innerHTML = '<p class="text-red-500 col-span-full">Failed to connect to the search service. Please ensure the server is running and try again.</p>';
        }
      } else {
        // If the query is empty, show default tutorials and clear search results
        defaultTutorials.classList.remove('hidden');
        resultsContainer.innerHTML = '';
      }
    }

    /**
     * Displays the YouTube search results in the results container.
     * @param {Array<Object>} videos - An array of video objects from the YouTube API.
     */
    function displaySearchResults(videos) {
      resultsContainer.innerHTML = ''; // Clear previous results
      if (videos && videos.length > 0) {
        // Iterate through the videos and create HTML for each
        videos.forEach(video => {
          const videoId = video.id.videoId;
          // Use the correct YouTube embed URL format
          const embedUrl = `https://www.youtube.com/embed/${videoId}`; // Correct format
          const title = video.snippet.title;
          const description = video.snippet.description;

          // Create a div for each video result
          const videoDiv = document.createElement('div');
          videoDiv.classList.add('bg-white', 'rounded-lg', 'shadow-md', 'overflow-hidden'); // Add Tailwind classes for styling
          videoDiv.innerHTML = `
            <iframe class="w-full h-48 md:h-56 lg:h-64 aspect-video" src="${embedUrl}" title="${title}" frameborder="0" allowfullscreen></iframe>
            <div class="p-4">
              <h2 class="text-lg font-semibold">${title}</h2>
            </div>
          `;
          resultsContainer.appendChild(videoDiv); // Add the video div to the results container
        });
      } else {
        // Display a message if no videos are found
        resultsContainer.innerHTML = '<p class="text-gray-500 italic col-span-full">No relevant videos found.</p>';
      }
    }


    // Add this function to connect the voice recognition to search
    function recordVoiceForSearch() {
        const voiceStatus = document.getElementById("voice-search-status");
        const searchInput = document.getElementById("youtube-search-input");
    
        // Reuse the existing recordVoice function but modify its behavior
        window.recordVoice = function() {
        if (!('webkitSpeechRecognition' in window)) {
            voiceStatus.textContent = "Voice search not supported";
            voiceStatus.classList.remove('hidden');
            return;
        }
  
        voiceStatus.textContent = "Listening...";
        voiceStatus.classList.remove('hidden');
  
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
      
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            searchInput.value = transcript;
            voiceStatus.textContent = `Searching for: "${transcript}"`;
            handleSearch(); // Trigger the search automatically
        };
  
        recognition.onerror = function(event) {
            voiceStatus.textContent = "Error occurred in recognition";
        };
  
        recognition.start();
        };
  
        // Call the modified function
        window.recordVoice();
    }
  
    // Make the function globally available
    window.recordVoiceForSearch = recordVoiceForSearch;


  });
