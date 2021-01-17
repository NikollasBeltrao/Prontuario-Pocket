//<script src="https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js"></script>

// Your web app's Firebase configuration
import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAjtbRqjqb8Ut2QYJ1V0FUzYRLDCgOps34",
  authDomain: "medplus-5a6e8.firebaseapp.com",
  projectId: "medplus-5a6e8",
  storageBucket: "medplus-5a6e8.appspot.com",
  messagingSenderId: "782383586119",
  appId: "1:782383586119:web:d32df0e5362b4cc13b8a62"
};
// Initialize Firebase
const db = firebase.initializeApp(firebaseConfig);





//      firebase.firestore().collection("User").add({ nome: 'Nikollas' }).then(res => {
//        console.log(res);
//     }).catch(console.error);


export default db;
