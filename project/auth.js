import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBKDS9rZf1_vEWEgXHV8lnEwvYgS_RXm6o",
  authDomain: "agewise-c71f3.firebaseapp.com",
  projectId: "agewise-c71f3",
  storageBucket: "agewise-c71f3.appspot.com",
  messagingSenderId: "243707359011",
  appId: "1:243707359011:web:f60b9cf7713b6765692696",
  measurementId: "G-GZYG2C7L3Y"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

// Auth-based UI change
onAuthStateChanged(auth, user => {
  document.body.dataset.auth = 'done'; // ✅ CSS trigger for nav

  const loginLink = document.getElementById("nav-login");
  if (!loginLink) return;

  if (user) {
    loginLink.innerHTML = `
      <div class="relative" id="avatar-container">
        <img src="${user.photoURL}" class="w-8 h-8 rounded-full cursor-pointer" title="${user.displayName}" />
        <div id="logout-dropdown" class="absolute right-0 mt-2 w-32 bg-white border rounded shadow hidden z-50">
          <button id="logout-btn" class="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">Logout</button>
        </div>
      </div>
    `;
    loginLink.href = "#";
    loginLink.onclick = e => e.preventDefault(); // Prevent page reload
  } else {
    loginLink.innerHTML = `Login`;
    loginLink.href = "login.html";
  }
});

// 🔁 Handle dropdown & logout
document.addEventListener("click", async e => {
  const avatar = document.querySelector("#nav-login img");
  const dropdown = document.getElementById("logout-dropdown");

  if (e.target.id === "logout-btn") {
    await signOut(auth);
    window.location.href = "index.html";
    return;
  }

  // If click is on avatar image
  if (avatar && avatar.contains(e.target)) {
    if (dropdown) dropdown.classList.toggle("hidden");
    return;
  }

  // If click is outside both avatar and dropdown
  if (
    dropdown &&
    !dropdown.contains(e.target) &&
    !(avatar && avatar.contains(e.target))
  ) {
    dropdown.classList.add("hidden");
  }
});

// Expose Firebase auth and Firestore to the global scope
window.firebaseApp = app;
window.firebaseAuth = auth;
window.firestoreDB = db; // This is crucial

// Add explicit initialization check
console.log("Firebase Services Initialized:", {
  Auth: !!auth,
  Firestore: !!db,
  App: !!app
});
