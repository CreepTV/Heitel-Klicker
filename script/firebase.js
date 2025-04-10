  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
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
