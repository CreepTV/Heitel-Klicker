import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyD3cWjT020hW4FjrvHmKDTVVBUHHza3Gyo",
    authDomain: "heitel-klicker.firebaseapp.com",
    projectId: "heitel-klicker",
    storageBucket: "heitel-klicker.firebasestorage.app",
    messagingSenderId: "361288831525",
    appId: "1:361288831525:web:aded4d44799c73401165cc",
    measurementId: "G-CPWHGMYPV3"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

const auth = getAuth();
const signUpForm = document.getElementById("signup-form");
const signUpPopup = document.getElementById("signup-popup");
const closePopupBtn = document.getElementById("close-popup-btn");

const email = document.getElementById("email");
const password = document.getElementById("password");
const signUpBtn = document.getElementById("signup-btn");

onAuthStateChanged(auth, (user) => {
    console.log("User state changed:", user);
    if (user) {
        console.log("User signed in:", user.email);
    } else {
        console.log("No user is signed in.");
    }
});

const signUpButtonPressed = async (e) => {
    e.preventDefault();

    try {
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email.value,
            password.value
        );
        console.log("User signed up:", userCredential);
        alert("Erfolgreich registriert!");
        // Close the popup or redirect
    } catch (error) {
        console.error("Error signing up:", error);
        alert("Error signing up: " + error.message);
    }
};

const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in:", userCredential);
        alert("Erfolgreich eingeloggt!");
        return userCredential.user;
    } catch (error) {
        console.error("Error logging in:", error);
        alert("Fehler beim Einloggen: " + error.message);
        throw error;
    }
};

const registerUser = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User registered:", userCredential);
        return userCredential.user;
    } catch (error) {
        console.error("Error registering user:", error);
        throw error;
    }
};

const logoutUser = async () => {
    try {
        await signOut(auth);
        console.log("User logged out");
        alert("Erfolgreich abgemeldet!");
    } catch (error) {
        console.error("Error logging out:", error);
        alert("Fehler beim Abmelden: " + error.message);
    }
};

export { registerUser, loginUser, logoutUser };
