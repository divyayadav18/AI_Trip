// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore,collection,addDoc} from "firebase/firestore"
import { browserLocalPersistence, getAuth,onAuthStateChanged, setPersistence } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAU7Jcv-9Ybk0kJYPsnaogGAWyhUV8Axog",
  authDomain: "trip-plan-b3dc4.firebaseapp.com",
  projectId: "trip-plan-b3dc4",
  storageBucket: "trip-plan-b3dc4.firebasestorage.app",
  messagingSenderId: "135565617032",
  appId: "1:135565617032:web:0c3350effd183c287e3c3d"
};
// Initialize Firebase
 const app = initializeApp(firebaseConfig);
 const db=getFirestore(app); 
 const auth=getAuth(app);
 setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("✅ Auth persistence set to LOCAL");
  })
  .catch((error) => {
    console.error("❌ Failed to set persistence:", error.message);
  });
 const checkUserAuth = (callback) => {
  console.log("Auth State Changed:", user ? user.email : "Not Logged In");
  onAuthStateChanged(auth, (user) => {
    callback(user ? user.email : null);
  });
};
export {db,addDoc,collection,auth,checkUserAuth};