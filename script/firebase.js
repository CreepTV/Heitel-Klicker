// Import the functions you need from the SDKs you need
  import { isSupported, getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, deleteUser } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
  import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyD3cWjT020hW4FjrvHmKDTVVBUHHza3Gyo",
    authDomain: "heitelklicker.firebaseapp.com",
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

  if (await isSupported()) {
      const analytics = getAnalytics(app);
      console.log("Analytics initialisiert");
  } else {
      console.warn("Analytics wird in dieser Umgebung nicht unterstützt.");
  }

  // Benutzer registrieren
  export function registerUser(email, password) {
      return createUserWithEmailAndPassword(auth, email, password)
          .then(userCredential => {
              console.log("Benutzer registriert:", userCredential.user);
              return userCredential.user;
          })
          .catch(error => {
              console.error("Fehler bei der Registrierung:", error); // Detailed error logging
              switch (error.code) {
                  case 'auth/email-already-in-use':
                      throw new Error('Diese E-Mail-Adresse wird bereits verwendet.');
                  case 'auth/invalid-email':
                      throw new Error('Die E-Mail-Adresse ist ungültig.');
                  case 'auth/weak-password':
                      throw new Error('Das Passwort ist zu schwach. Es muss mindestens 6 Zeichen lang sein.');
                  default:
                      throw new Error('Ein unbekannter Fehler ist aufgetreten.');
              }
          });
  }

  // Benutzer anmelden
  export async function loginUser(email, password) {
      try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          console.log("Benutzer angemeldet:", userCredential.user);

          // Spielstand laden
          const userData = await loadGameData(userCredential.user.uid);
          return { user: userCredential.user, data: userData };
      } catch (error) {
          console.error("Fehler bei der Anmeldung:", error); // Detailed error logging
          throw error;
      }
  }

  // Benutzer abmelden
  export function logoutUser() {
      return signOut(auth)
          .then(() => {
              console.log("Benutzer abgemeldet");
          })
          .catch(error => {
              console.error("Fehler beim Abmelden:", error); // Detailed error logging
          });
  }

  // Spielstand speichern
  export async function saveGameData(userId, data) {
      try {
          await setDoc(doc(db, "users", userId), data); // "users" ist die Sammlung
          console.log("Spielstand gespeichert");
      } catch (error) {
          console.error("Fehler beim Speichern des Spielstands:", error); // Detailed error logging
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
          console.error("Fehler beim Laden des Spielstands:", error); // Detailed error logging
      }
  }

  // Firebase-APIs testen
  export async function testFirebaseAPIs() {
      try {
          // Teste Authentication
          const testEmail = "test@example.com";
          const testPassword = "test123";
          const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
          console.log("Authentication funktioniert: Benutzer erstellt:", userCredential.user);
          await deleteUser(userCredential.user); // Testbenutzer löschen

          // Teste Firestore
          const testDocRef = doc(db, "testCollection", "testDoc");
          await setDoc(testDocRef, { testField: "testValue" });
          const testDocSnap = await getDoc(testDocRef);
          if (testDocSnap.exists()) {
              console.log("Firestore funktioniert: Dokument gelesen:", testDocSnap.data());
          } else {
              console.warn("Firestore funktioniert nicht: Dokument nicht gefunden.");
          }

          // Teste Analytics (falls unterstützt)
          if (await isSupported()) {
              console.log("Analytics funktioniert: Unterstützt in dieser Umgebung.");
          } else {
              console.warn("Analytics wird in dieser Umgebung nicht unterstützt.");
          }
      } catch (error) {
          console.error("Fehler beim Testen der Firebase-APIs:", error); // Detailed error logging
      }
  }
