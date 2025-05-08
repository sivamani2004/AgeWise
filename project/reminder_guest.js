// reminder_guest.js

// Helper to safely parse localStorage
function loadRemindersFromStorage() {
  try {
    return JSON.parse(localStorage.getItem('reminders')) || [];
  } catch {
    return [];
  }
}

// In‑memory copy (kept in sync)
let reminders = loadRemindersFromStorage();

// Persist helper
function saveRemindersToStorage() {
  localStorage.setItem('reminders', JSON.stringify(reminders));
}

// Add a new reminder
function addReminder() {
  const input = document.getElementById('reminder-text');
  const text  = input.value.trim();
  if (!text) return;

  reminders.push({ id: Date.now(), text, status: 'Pending' });
  saveRemindersToStorage();
  input.value = '';
  renderReminders();
}

// Render into the UL
function renderReminders() {
  // always reload fresh
  reminders = loadRemindersFromStorage();

  const list         = document.getElementById('reminder-list');
  const emptyMessage = document.getElementById('empty-message');
  if (!list) return;

  list.innerHTML = '';
  if (reminders.length === 0) {
    emptyMessage && (emptyMessage.style.display = 'block');
    return;
  }
  emptyMessage && (emptyMessage.style.display = 'none');

  reminders.forEach(r => {
    const li = document.createElement('li');
    li.className = 'mb-2';
    li.innerHTML = `
      <span class="font-semibold">${r.text}</span>
      <span class="text-sm ml-2 text-gray-500">[${r.status}]</span>
      <button onclick="acknowledgeReminder(${r.id})" class="ml-2 text-green-600 hover:underline">Acknowledge</button>
      <button onclick="deleteReminder(${r.id})" class="ml-2 text-red-600 hover:underline">Delete</button>
    `;
    list.appendChild(li);
  });
}

// Acknowledge & delete
function acknowledgeReminder(id) {
  reminders = reminders.map(r => r.id === id ? { ...r, status: 'Acknowledged' } : r);
  saveRemindersToStorage();
  renderReminders();
}
function deleteReminder(id) {
  reminders = reminders.filter(r => r.id !== id);
  saveRemindersToStorage();
  renderReminders();
}

// Voice input stays the same
function recordVoice() {
  const status = document.getElementById('voice-status');
  const input  = document.getElementById('reminder-text');
  if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
    return status.textContent = "Your browser doesn't support voice recognition.";
  }
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  status.textContent = "Listening…";
  recognition.start();

  recognition.onresult = e => {
    const t = e.results[0][0].transcript;
    input.value = t;
    status.textContent = `Recognized: "${t}"`;
  };
  recognition.onerror = () => status.textContent = "Voice recognition error.";
  recognition.onend   = () => status.textContent += " (Done)";
}

// Expose for your HTML buttons
window.addReminder         = addReminder;
window.acknowledgeReminder = acknowledgeReminder;
window.deleteReminder      = deleteReminder;
window.renderReminders     = renderReminders;
window.recordVoice         = recordVoice;

// ➡️ Immediately render once, whether DOM is already ready or on next tick
if (document.readyState !== 'loading') {
  renderReminders();
} else {
  document.addEventListener('DOMContentLoaded', renderReminders);
}
