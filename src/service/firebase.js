import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWqs3XEt4Z6Vo6b28f0MT12dTQM5wQBVM",
  authDomain: "aktwifi-184a6.firebaseapp.com",
  projectId: "aktwifi-184a6",
  storageBucket: "aktwifi-184a6.firebasestorage.app",
  messagingSenderId: "398937796673",
  appId: "1:398937796673:web:e5a6dfb729ff7e4e3556c0"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); 
export const db = getFirestore(app);

export default app;