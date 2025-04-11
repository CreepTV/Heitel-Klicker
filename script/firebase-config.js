import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
    updateDoc,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

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
const db = getFirestore(app);
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

const registerUser = async (email, password, username, profilePicture) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save user profile to Firestore
        await saveUserProfile(user.uid, { username, profilePicture });

        console.log("User registered and profile saved:", userCredential);
        return user;
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

const saveUserProfile = async (userId, profileData) => {
    try {
        const userDoc = doc(db, "users", userId);
        await setDoc(userDoc, profileData, { merge: true });
        console.log("User profile saved:", profileData);
    } catch (error) {
        console.error("Error saving user profile:", error);
        throw error;
    }
};

const updateUserProfile = async (userId, profileData) => {
    try {
        const userDoc = doc(db, "users", userId);
        await setDoc(userDoc, profileData, { merge: true });
        console.log("User profile updated:", profileData);
    } catch (error) {
        console.error("Error updating user profile:", error);
        throw error;
    }
};

const getUserProfile = async (userId) => {
    try {
        const userDoc = doc(db, "users", userId);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
            console.log("User profile fetched:", userSnapshot.data());
            return userSnapshot.data();
        } else {
            console.log("No user profile found.");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
};

export { registerUser, loginUser, logoutUser, saveUserProfile, updateUserProfile, getUserProfile };
