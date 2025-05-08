// Import shared Firebase app config
import { auth, db } from './auth.js';
import { doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// Important: DO NOT re-declare db here. You already imported it from auth.js!

let currentUID = null;

onAuthStateChanged(auth, async (user) => {
  if (!user) return;
  currentUID = user.uid;

  console.log("[reminder_db] Logged in as:", user.email);

  // Expose functions to global scope
  window.addReminder = addReminderDB;
  window.renderReminders = renderRemindersDB;
  window.acknowledgeReminder = acknowledgeReminderDB;
  window.deleteReminder = deleteReminderDB;
  window.recordVoice = recordVoice;

  await renderRemindersDB();
});

const getUserDocRef = () => doc(db, "users", currentUID);

async function addReminderDB() {
  const input = document.getElementById('reminder-text');
  const text = input.value.trim();
  if (!text || !currentUID) return;

  try {
    const userRef = getUserDocRef();
    const snap = await getDoc(userRef);
    const existingReminders = snap.exists() && snap.data().reminders ? snap.data().reminders : [];

    const newReminder = {
      id: Date.now(),
      text,
      status: 'Pending'
    };

    const updatedReminders = [...existingReminders, newReminder];
    await setDoc(userRef, { reminders: updatedReminders }, { merge: true });

    input.value = '';
    await renderRemindersDB();
  } catch (e) {
    console.error("Error adding reminder:", e);
    alert('Error adding reminder: ' + e.message);
  }
}

async function renderRemindersDB() {
  const list = document.getElementById('reminder-list');
  const emptyMessage = document.getElementById('empty-message');
  list.innerHTML = '';

  const snap = await getDoc(getUserDocRef());
  const reminders = snap.data()?.reminders || [];

  if (!reminders.length) {
    if (emptyMessage) emptyMessage.style.display = 'block';
    return;
  }

  emptyMessage.style.display = 'none';

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

async function acknowledgeReminderDB(id) {
  const snap = await getDoc(getUserDocRef());
  const reminders = snap.data()?.reminders || [];

  const updated = reminders.map(r =>
    r.id === id ? { ...r, status: 'Acknowledged' } : r
  );

  await updateDoc(getUserDocRef(), { reminders: updated });
  await renderRemindersDB();
}

async function deleteReminderDB(id) {
  const snap = await getDoc(getUserDocRef());
  const reminders = snap.data()?.reminders || [];

  const updated = reminders.filter(r => r.id !== id);
  await updateDoc(getUserDocRef(), { reminders: updated });
  await renderRemindersDB();
}

function recordVoice() {
  const voiceStatus = document.getElementById("voice-status");
  const reminderInput = document.getElementById("reminder-text");

  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    voiceStatus.textContent = "Your browser doesn't support voice recognition.";
    return;
  }

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  voiceStatus.textContent = "Listening... Speak your reminder.";

  recognition.start();

  recognition.onresult = function(event) {
    const transcript = event.results[0][0].transcript;
    reminderInput.value = transcript;
    voiceStatus.textContent = `Recognized: "${transcript}"`;
  };

  recognition.onerror = function(event) {
    voiceStatus.textContent = "Voice recognition error. Please try again.";
  };

  recognition.onend = function() {
    voiceStatus.textContent += " (Done)";
  };
}
