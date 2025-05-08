// handles gemini responses and voice commands

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("chat-toggle");
  const chatBox = document.getElementById("chat-widget");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatMessages = document.getElementById("chat-messages");
  const voiceBtn = document.getElementById("voice-btn");


  // Sound feedback (same as your navigation implementation)
  const startSound = new Audio('assets/sounds/start.mp3');
  
  // 1. Chat-toggle animation (keep your existing UI logic)
  let greeted = false;

  if (toggleBtn && chatBox) {
    toggleBtn.addEventListener("click", () => {
      chatBox.classList.toggle("scale-0");
      chatBox.classList.toggle("opacity-0");

      // 👋 Show greeting only once on first open
      if (!greeted && !chatBox.classList.contains("scale-0")) {
        const greeting = "Hi! I'm your AgeWise Assistant. How can I help you today?";
        addMessage("🤖", greeting);
        speakResponse(greeting);
        greeted = true;
      }
    });
  }


  if (!chatForm || !chatInput || !chatMessages || !voiceBtn) return;

  // 2. Map of keywords → page (same pattern as your navigation)
  const navMap = {
    "reminders.html": [
      "go to reminders", "open reminders", "set reminder", "reminder section", "reminders",
      "set reminders", "setup reminders", "remind", "alert", "medicine"
    ],
    "resources.html": [
      "go to resources", "open resources", "show resources", "resources section", "resources"
    ],
    "tutorials.html": [
      "go to tutorials", "open tutorials", "learn", "tutorial section", "tutorials"
    ],
    "wellness.html": [
      "go to wellness", "open wellness", "yoga", "exercise", "meditation", 
      "health", "fitness", "wellness section", "wellness"
    ],
    "index.html": [
      "go home", "go to home", "open homepage", "back to home", "home page", "home"
    ],
    "login.html": [
      "login", "sign in", "open login", "login page", "sign in page"
    ],
    "community.html": [
      "go to community", "open community", "community section", "community", "Emotional Support"
    ]
  };

  // 3. System prompt
  const conversation = [
    {
      role: "user",
      parts: [{
        text: "You are AgeWise Assistant, a friendly AI that helps elderly users navigate the internet and answer questions clearly and simply. Speak in a warm, patient tone with short, clear sentences. Keep responses under 6 sentences. If the user asks for help with a specific page, provide a brief overview of that page's purpose and features. If the user asks for help with a specific task, provide step-by-step instructions."
      }]
    }
  ];





  // 4. Voice Recognition Implementation 
  // Voice button handler 
  voiceBtn.addEventListener('click', () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      addMessage("🤖", "Your browser doesn't support voice recognition.");
      return;
    }
    
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    
    // 🎧 Play start sound
    startSound.play();
    
    recognition.start();
    
    // Show listening indicator
    addMessage("🤖", "Listening... (Speak now)");
    voiceBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600 animate-pulse" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clip-rule="evenodd" />
      </svg>
    `;
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      chatInput.value = transcript;
      
      // Reset button state
      voiceBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clip-rule="evenodd" />
        </svg>
      `;
      
      // Submit the form with the recognized text
      setTimeout(() => chatForm.requestSubmit(), 300);
    };
    
    recognition.onerror = (event) => {
      console.error("Voice error:", event.error);
      addMessage("🤖", "Voice recognition error. Please try again.");
      
      // Reset button state
      voiceBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clip-rule="evenodd" />
        </svg>
      `;
      
      if (event.error === 'not-allowed') {
        showPermissionAlert();
      }
    };
    
    recognition.onend = () => {
      // Reset button state
      voiceBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clip-rule="evenodd" />
        </svg>
      `;
    };
  });

  function showPermissionAlert() {
    const alertBox = document.createElement("div");
    alertBox.className = "fixed bottom-20 left-6 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 w-80 z-50 rounded";
    alertBox.innerHTML = `
      <p class="font-medium">Microphone Access Required</p>
      <p class="text-sm mt-1">Please allow microphone access to use voice commands:</p>
      <ol class="list-decimal list-inside text-xs mt-2">
        <li>Click the lock icon in your address bar</li>
        <li>Find "Microphone" in the list</li>
        <li>Select "Allow"</li>
        <li>Refresh the page</li>
      </ol>
      <button onclick="this.parentElement.remove()" class="mt-3 bg-yellow-500 text-white px-3 py-1 rounded text-sm">
        I've enabled microphone access
      </button>
    `;
    document.body.appendChild(alertBox);
  }

  // Form submit handler (keep your existing logic)
  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userMsg = chatInput.value.trim();
    if (!userMsg) return;

    addMessage("👵", userMsg);
    chatInput.value = "";

    const lower = userMsg.toLowerCase();

    // Check for navigation intent first
    for (const [page, phrases] of Object.entries(navMap)) {
      if (phrases.some(p => lower.includes(p))) {
        addMessage("🤖", `Taking you to the ${page.replace(".html","")} page now…`);
        speakResponse(`Taking you to the ${page.replace(".html","")} page now…`);
        setTimeout(() => {
          window.location.href = page;
        }, 800);
        return;
      }
    }

    // Otherwise, send to Gemini backend
    conversation.push({ role: "user", parts: [{ text: userMsg }] });
    try {
      const res = await fetch("http://127.0.0.1:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMsg })
      });
      const data = await res.json();
      const reply = data.reply || "Sorry, I didn't understand that.";
      addMessage("🤖", reply);
      conversation.push({ role: "model", parts: [{ text: reply }] });
      
      // Speak the response
      speakResponse(reply);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      const errorMsg = "Oops! Could not reach the server.";
      addMessage("🤖", errorMsg);
      speakResponse(errorMsg);
    }
  });

  // ElevenLabs Text-to-Speech Function
  async function speakResponse(text) {
    try {
      // First cancel any current speech
      window.speechSynthesis.cancel();
      
      // Try ElevenLabs first
      const response = await fetch("http://127.0.0.1:3000/speak", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({text})
      });

      if (!response.ok) throw new Error('ElevenLabs API error');

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error('Error with ElevenLabs TTS:', error);
      // Fallback to Web Speech API
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const selectedVoice = voices.find(v => 
        v.name === 'Google UK English Female' || v.lang === 'en-CA'
      );
    
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.rate = 1.1;
      utterance.pitch = 1.1;
      utterance.volume = 1.2;
      window.speechSynthesis.speak(utterance);
    }
  }

  // Message helper
  function addMessage(sender, text) {
    const msg = document.createElement("div");
    msg.className = "message mb-2";
    msg.innerHTML = `
      <span class="font-bold">${sender}</span>: 
      <span class="text-gray-800">${text}</span>
    `;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});