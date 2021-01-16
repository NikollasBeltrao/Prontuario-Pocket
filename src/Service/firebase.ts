//<script src="https://www.gstatic.com/firebasejs/8.2.1/firebase-app.js"></script>

// Your web app's Firebase configuration
import firebase from "firebase/app";

const firebaseConfig = {
  
};
// Initialize Firebase
const db = firebase.initializeApp(firebaseConfig);





//      firebase.firestore().collection("User").add({ nome: 'Nikollas' }).then(res => {
//        console.log(res);
//     }).catch(console.error);


export default db;
