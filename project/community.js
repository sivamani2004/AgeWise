import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  setDoc,
  getDocs,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Assuming auth.js handles Firebase initialization and nav UI
const auth = window.firebaseAuth;
const db = window.firestoreDB;

// Element references
let showBtn, formSection;

document.addEventListener('DOMContentLoaded', () => {
  console.log('Community support script loaded');
  // Enrollment form toggle
  showBtn = document.getElementById('show-enrollment-btn');
  formSection = document.getElementById('enrollment-section');
  if (showBtn && formSection) {
    showBtn.addEventListener('click', () => {
      formSection.classList.toggle('hidden');
    });
  }

  // Wait for Firebase
  const check = setInterval(() => {
    if (auth && db) {
      clearInterval(check);
      initCommunitySupport();
    }
  }, 100);
});

async function initCommunitySupport() {
  console.log('Initializing community support...');
  const form = document.getElementById('supporter-form');
  const list = document.getElementById('supporters-list');
  if (!form || !list) return;

  // Show/hide enrollment button & form based on user’s supporter status
  auth.onAuthStateChanged(async user => {
    if (!user) return window.location.href = 'login.html';
    try {
      const snap = await getDoc(doc(db, 'supporters', user.uid));
      const isSupporter = snap.exists();
      // Hide or show the "Become a Supporter" button
      if (showBtn) showBtn.style.display = isSupporter ? 'none' : 'block';
      // Hide the form initially if user already supporter
      if (formSection) formSection.classList.add('hidden');
      await loadSupporters();
    } catch (err) {
      console.error('Error fetching supporter state', err);
      showAlert('Error loading community features', true);
    }
  });

  // Handle new registration
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return showAlert('Please log in first!', true);

    const data = {
      name: document.getElementById('supporter-name').value,
      age: parseInt(document.getElementById('supporter-age').value, 10),
      phone: document.getElementById('supporter-phone').value,
      language: document.getElementById('supporter-language').value,
      availability: Array.from(document.querySelectorAll('input[name="days"]:checked')).map(i => i.value),
      email: user.email,
      userId: user.uid,
      photoURL: user.photoURL || '',
      createdAt: new Date()
    };
    try {
      await setDoc(doc(db, 'supporters', user.uid), data);
      showAlert('Successfully registered as supporter!');
      if (showBtn) showBtn.style.display = 'none';
      if (formSection) formSection.classList.add('hidden');
      await loadSupporters();
    } catch (err) {
      console.error('Registration failed:', err);
      showAlert(`Registration failed: ${err.message}`, true);
    }
  });
}

async function loadSupporters() {
  const list = document.getElementById('supporters-list');
  list.innerHTML = '<p class="text-center py-4">Loading supporters...</p>';
  try {
    const snapshot = await getDocs(collection(db, 'supporters'));
    if (snapshot.empty) {
      list.innerHTML = '<p class="text-center py-4">No supporters available yet</p>';
      return;
    }
    const user = auth.currentUser;
    list.innerHTML = snapshot.docs.map(docSnap => {
      const d = docSnap.data();
      const avatar = d.photoURL || 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
      const isOwner = user && user.uid === d.userId;
      return `
        <div class="supporter-card flex items-center bg-white p-4 rounded-lg shadow-md">
          <img src="${avatar}" alt="${d.name}" class="w-16 h-16 rounded-full object-cover mr-4" />
          <div class="flex-1">
            <div class="flex justify-between items-start">
              <h3 class="text-xl font-bold mb-1">${d.name}</h3>
              ${isOwner ? `<button onclick="deleteSupporter('${docSnap.id}')" class="text-red-500 text-sm">Delete</button>` : ''}
            </div>
            <p class="text-gray-600">${d.age} years</p>
            <p class="text-gray-600">Phone: ${d.phone}</p>
            <p class="text-gray-600">Language: ${d.language}</p>
            <p class="text-gray-600">Available: ${d.availability.join(', ')}</p>
            <div class="mt-3 flex space-x-2">
              <a href="tel:${d.phone}" class="bg-blue-500 text-white px-4 py-2 rounded">Call Now</a>
              <a href="https://wa.me/${d.phone.replace(/\D/g,'')}" target="_blank" class="bg-green-500 text-white px-4 py-2 rounded">Text Now</a>
            </div>
          </div>
        </div>
      `;
    }).join('');
  } catch (err) {
    console.error('Error loading supporters:', err);
    list.innerHTML = '<p class="text-red-500 text-center py-4">Error loading supporters</p>';
  }
}

window.deleteSupporter = async id => {
  if (!confirm('Are you sure you want to delete your supporter profile?')) return;
  try {
    await deleteDoc(doc(db, 'supporters', id));
    showAlert('Supporter profile deleted successfully!');
    // After deletion, allow re-registration
    if (showBtn) showBtn.style.display = 'block';
    if (formSection) formSection.classList.add('hidden');
    await loadSupporters();
  } catch (err) {
    console.error('Error deleting profile:', err);
    showAlert('Failed to delete supporter profile.', true);
  }
};

function showAlert(msg, isError = false) {
  const el = document.createElement('div');
  el.className = `fixed top-4 right-4 p-4 rounded-md text-white ${isError ? 'bg-red-500' : 'bg-green-500'}`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}
