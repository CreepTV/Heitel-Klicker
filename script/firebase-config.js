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
const profilePictureInput = document.getElementById("profilePictureInput");

const devProfilePictureInput = document.getElementById("devProfilePictureInput");
const devProfilePicturePreview = document.getElementById("devProfilePicturePreview");
const devLoadProfileButton = document.getElementById("devLoadProfile");
const devSaveProfileButton = document.getElementById("devSaveProfile");

onAuthStateChanged(auth, (user) => {
    console.log("User state changed:", user);
    if (user) {
        console.log("User signed in:", user.email);
        loadUsername(user.uid);
        loadProfileManagementPopup(user.uid); // Lade Benutzername und Profilbild für das Popup
    } else {
        console.log("No user is signed in.");
        profilePicturePreview.src = "assets/profile-placeholder.png";
        profileNameInput.value = "#Username#"; // Setze den Standardwert für den Benutzernamen
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
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Generiere einen zufälligen Benutzernamen
        const randomNumber = Math.floor(Math.random() * (400 - 212 + 1)) + 212;
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
                usernameElements.forEach(el => el.textContent = data.username); // Aktualisiere alle Anzeigen
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
            const profilePicturePreview = document.getElementById("profilePicturePreview");

            if (userProfile.profilePicturePath) {
                profilePicturePreview.src = userProfile.profilePicturePath; // Lade das Bild von Imgur
            } else {
                profilePicturePreview.src = "assets/profile-placeholder.png"; // Fallback
            }
        }
    } catch (error) {
        console.error("Fehler beim Laden des Profils:", error);
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

profilePictureInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) {
        showNotification('warning', 'Bitte eine Datei auswählen.');
        return;
    }

    try {
        const imageUrl = await uploadProfilePictureToImgur(file);
        console.log("Bild erfolgreich hochgeladen:", imageUrl);

        // Aktualisiere die Vorschau
        const profilePicturePreview = document.getElementById("profilePicturePreview");
        profilePicturePreview.src = imageUrl;

        // Speichere die URL in der Firebase-Datenbank
        const userId = auth.currentUser?.uid;
        if (userId) {
            await updateUserProfile(userId, { profilePicturePath: imageUrl });
        }

        showNotification('success', 'Profilbild erfolgreich hochgeladen!');
    } catch (error) {
        console.error("Fehler beim Hochladen des Profilbilds:", error);
        showNotification('error', 'Fehler beim Hochladen des Profilbilds.');
    }
});

devProfilePictureInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) {
        alert("Bitte eine Datei auswählen.");
        return;
    }

    try {
        const imageUrl = await uploadProfilePictureToImgur(file);
        console.log("Test-Bild erfolgreich hochgeladen:", imageUrl);

        // Aktualisiere die Vorschau im Development Menu
        devProfilePicturePreview.src = imageUrl;

        alert("Test-Bild erfolgreich hochgeladen!");
    } catch (error) {
        console.error("Fehler beim Hochladen des Test-Bildes:", error);
        alert("Fehler beim Hochladen des Test-Bildes.");
    }
});

devLoadProfileButton.addEventListener("click", async () => {
    const testUserId = "testUser123"; // Beispiel-Benutzer-ID für Tests
    try {
        const userProfile = await getUserProfile(testUserId);
        if (userProfile && userProfile.profilePicturePath) {
            devProfilePicturePreview.src = userProfile.profilePicturePath;
            alert("Test-Profil geladen!");
        } else {
            devProfilePicturePreview.src = "assets/profile-placeholder.png";
            alert("Kein Test-Profil gefunden.");
        }
    } catch (error) {
        console.error("Fehler beim Laden des Test-Profils:", error);
        alert("Fehler beim Laden des Test-Profils.");
    }
});

devSaveProfileButton.addEventListener("click", async () => {
    const testUserId = "testUser123"; // Beispiel-Benutzer-ID für Tests
    const testProfilePicturePath = devProfilePicturePreview.src;

    try {
        await updateUserProfile(testUserId, { profilePicturePath: testProfilePicturePath });
        alert("Test-Profil erfolgreich gespeichert!");
    } catch (error) {
        console.error("Fehler beim Speichern des Test-Profils:", error);
        alert("Fehler beim Speichern des Test-Profils.");
    }
});

async function savePublicProfile() {
    const profileName = document.getElementById('profileNameInput').value.trim();
    const profilePicture = document.getElementById('profilePicturePreview').src;

    if (!profileName) {
        showNotification('warning', 'Bitte einen Benutzernamen eingeben.');
        return;
    }

    const user = auth.currentUser;
    if (!user) {
        showNotification('error', 'Kein Benutzer angemeldet.');
        return;
    }

    try {
        await updateUserProfile(user.uid, { username: profileName, profilePicture });
        showNotification('success', 'Dein öffentliches Profil wurde gespeichert!');
        document.getElementById('currentUsername').textContent = profileName; // Aktualisiere die Anzeige
        closePopup('profileManagementPopup');
    } catch (error) {
        console.error('Fehler beim Speichern des Profils:', error);
        showNotification('error', 'Fehler beim Speichern des Profils.');
    }
}

async function uploadProfilePictureToImgur(file) {
    const CLIENT_ID = "9bf044fb8afeecf"; // Ersetze durch deine Imgur Client-ID
    const url = "https://api.imgur.com/3/image";

    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Client-ID ${CLIENT_ID}`,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Fehler beim Hochladen des Bildes auf Imgur");
    }

    const data = await response.json();
    return data.data.link; // URL des hochgeladenen Bildes
}

export { registerUser, loginUser, logoutUser, saveUserProfile, updateUserProfile, getUserProfile };






