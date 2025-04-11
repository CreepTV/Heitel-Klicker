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
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-storage.js";

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
const storage = getStorage(app);
const signUpForm = document.getElementById("signup-form");
const signUpPopup = document.getElementById("signup-popup");
const closePopupBtn = document.getElementById("close-popup-btn");

const email = document.getElementById("email");
const password = document.getElementById("password");
const signUpBtn = document.getElementById("signup-btn");

const profileNameInput = document.getElementById("profileNameInput");
const saveProfileButton = document.getElementById("saveProfileButton");

onAuthStateChanged(auth, (user) => {
    console.log("User state changed:", user);
    if (user) {
        console.log("User signed in:", user.email);
        loadUsername(user.uid);
        loadProfileManagementPopup(user.uid); // Lade Benutzername und Profilbild für das Popup
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
        showNotification('success', 'Erfolgreich registriert!');
        // Close the popup or redirect
    } catch (error) {
        console.error("Error signing up:", error);
        showNotification('error', 'Fehler bei der Registrierung: ' + error.message);
    }
};

const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User logged in:", userCredential);
        showNotification('success', 'Erfolgreich eingeloggt!');
        return userCredential.user;
    } catch (error) {
        console.error("Error logging in:", error);
        showNotification('error', 'Fehler beim Einloggen: ' + error.message);
        throw error;
    }
};

const registerUser = async (email, password, profilePicture) => {
    try {
        // Überprüfe, ob die E-Mail bereits registriert ist
        const existingUser = await signInWithEmailAndPassword(auth, email, password).catch(() => null);
        if (existingUser) {
            throw new Error("Diese E-Mail-Adresse ist bereits registriert.");
        }

        // Registriere den neuen Benutzer
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Generiere einen zufälligen Benutzernamen
        const randomNumber = Math.floor(Math.random() * (400 - 212 + 1)) + 212; // Zahl zwischen 212 und 400
        const username = `HeitelFan${randomNumber}`;

        // Speichere das Benutzerprofil in Firestore
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
        showNotification('success', 'Erfolgreich abgemeldet!');
    } catch (error) {
        console.error("Error logging out:", error);
        showNotification('error', 'Fehler beim Abmelden: ' + error.message);
    }
};

const saveUserProfile = async (userId, profileData) => {
    try {
        const { profilePicturePath, ...otherData } = profileData; // Entferne das Bild aus den Daten
        const userDoc = doc(db, "users", userId);
        await setDoc(userDoc, otherData, { merge: true });
        console.log("User profile saved:", otherData);
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

// Funktion zum Speichern des Benutzernamens in der Datenbank
async function saveUsername(userId, username) {
    try {
        const userDocRef = doc(db, "users", userId);
        await setDoc(userDocRef, { username }, { merge: true });
        console.log("Benutzername erfolgreich gespeichert.");
    } catch (error) {
        console.error("Fehler beim Speichern des Benutzernamens:", error);
    }
}

// Funktion zum Laden des Benutzernamens aus der Datenbank
async function loadUsername(userId) {
    try {
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.username) {
                profileNameInput.value = data.username;
                const usernameElements = document.querySelectorAll(".username-display");
                usernameElements.forEach(el => el.textContent = data.username); // Aktualisiere alle Elemente mit der Klasse
            }
        } else {
            console.log("Kein Benutzername gefunden.");
        }
    } catch (error) {
        console.error("Fehler beim Laden des Benutzernamens:", error);
    }
}

// Funktion zum Laden des Benutzernamens und Profilbilds und Anzeigen im profileManagementPopup
async function loadProfileManagementPopup(userId) {
    try {
        const userProfile = await getUserProfile(userId);
        if (userProfile) {
            const usernameDisplay = document.getElementById("currentUsername");
            const profileNameInput = document.getElementById("profileNameInput");
            const profilePicturePreview = document.getElementById("profilePicturePreview");

            if (userProfile.username && usernameDisplay) {
                usernameDisplay.textContent = userProfile.username; // Zeige den Benutzernamen im Popup an
            }
            if (userProfile.username && profileNameInput) {
                profileNameInput.value = userProfile.username; // Setze den Benutzernamen in das Eingabefeld
            }

            // Lade das Profilbild aus Firebase Storage
            if (userProfile.profilePicturePath) {
                const profilePictureRef = ref(storage, userProfile.profilePicturePath);
                const profilePictureURL = await getDownloadURL(profilePictureRef);
                if (profilePicturePreview) {
                    profilePicturePreview.src = profilePictureURL; // Zeige das Profilbild im Popup an
                }
            } else if (profilePicturePreview) {
                profilePicturePreview.src = "assets/profile-placeholder.png"; // Fallback auf Platzhalterbild
            }
        }
    } catch (error) {
        console.error("Fehler beim Laden des Profils für das Popup:", error);
    }
}

// Event-Listener für das Speichern des Benutzernamens
saveProfileButton.addEventListener("click", async () => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
        console.error("Kein Benutzer angemeldet.");
        showNotification('error', 'Kein Benutzer angemeldet.');
        return;
    }

    const username = profileNameInput.value.trim();
    if (!username) {
        showNotification('warning', 'Bitte einen Benutzernamen eingeben.');
        return;
    }

    await saveUsername(userId, username);
    showNotification('success', 'Benutzername erfolgreich gespeichert!');
});

async function uploadProfilePictureToGitHub(userId, file) {
    const GITHUB_TOKEN = "DEIN_PERSONAL_ACCESS_TOKEN"; // Ersetze durch deinen GitHub PAT
    const REPO_OWNER = "DEIN_GITHUB_USERNAME"; // Ersetze durch deinen GitHub-Benutzernamen
    const REPO_NAME = "DEIN_REPOSITORY_NAME"; // Ersetze durch den Namen deines Repositories
    const BRANCH = "main"; // Der Branch, auf dem die Datei gespeichert werden soll
    const FILE_PATH = `profilePictures/${userId}/${file.name}`; // Pfad im Repository

    const fileContent = await file.arrayBuffer();
    const base64Content = btoa(String.fromCharCode(...new Uint8Array(fileContent)));

    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}`;

    const response = await fetch(url, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: `Profilbild für Benutzer ${userId} hochgeladen`,
            content: base64Content,
            branch: BRANCH,
        }),
    });

    if (!response.ok) {
        throw new Error("Fehler beim Hochladen des Profilbilds auf GitHub");
    }

    const data = await response.json();
    return data.content.download_url; // URL der hochgeladenen Datei
}

export { registerUser, loginUser, logoutUser, saveUserProfile, updateUserProfile, getUserProfile };
