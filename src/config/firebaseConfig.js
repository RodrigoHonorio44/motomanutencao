// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; // ← adicione isso
import { getAuth } from 'firebase/auth'; // ← se você quiser usar auth também

const firebaseConfig = {
    apiKey: "AIzaSyDAiS1lzC-U7g9XBQhHCW_RmA032LmoSBM",
    authDomain: "mantencao-moto.firebaseapp.com",
    projectId: "mantencao-moto",
    storageBucket: "mantencao-moto.firebasestorage.app",
    messagingSenderId: "189029543066",
    appId: "1:189029543066:web:4121d2c47b6410dc5fc323"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app); // ✅ Firestore instanciado corretamente
const auth = getAuth(app);    // ✅ Auth também (opcional)

export { app, db, auth }; // ✅ exporte os dois
