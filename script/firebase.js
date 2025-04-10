// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
  import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
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
  const analytics = getAnalytics(app);
  const auth = getAuth();
  const db = getFirestore(app);

  // Benutzer registrieren
  export function registerUser(email, password) {
      return createUserWithEmailAndPassword(auth, email, password)
          .then(userCredential => {
              console.log("Benutzer registriert:", userCredential.user);
              return userCredential.user;
          })
          .catch(error => {
              console.error("Fehler bei der Registrierung:", error.message);
              throw error;
          });
  }

  // Benutzer anmelden
  export function loginUser(email, password) {
      return signInWithEmailAndPassword(auth, email, password)
          .then(userCredential => {
              console.log("Benutzer angemeldet:", userCredential.user);
              return userCredential.user;
          })
          .catch(error => {
              console.error("Fehler bei der Anmeldung:", error.message);
              throw error;
          });
  }

  // Benutzer abmelden
  export function logoutUser() {
      return signOut(auth)
          .then(() => {
              console.log("Benutzer abgemeldet");
          })
          .catch(error => {
              console.error("Fehler beim Abmelden:", error.message);
          });
  }

  // Spielstand speichern
  export async function saveGameData(userId, data) {
      try {
          await setDoc(doc(db, "users", userId), data); // "users" ist die Sammlung
          console.log("Spielstand gespeichert");
      } catch (error) {
          console.error("Fehler beim Speichern des Spielstands:", error.message);
      }
  }

  // Spielstand laden
  export async function loadGameData(userId) {
      try {
          const docSnap = await getDoc(doc(db, "users", userId));
          if (docSnap.exists()) {
              console.log("Spielstand geladen:", docSnap.data());
              return docSnap.data(); // Gibt die gespeicherten Daten zurück
          } else {
              console.log("Kein Spielstand gefunden");
              return null;
          }
      } catch (error) {
          console.error("Fehler beim Laden des Spielstands:", error.message);
      }
  }
