import React from 'react';
import './App.css';
import Routes from './routes';
import db from './Service/firebase';

// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/firestore";
import { textSpanEnd } from 'typescript';
//<Header title='MyMedicalRecord'></Header>
const App: React.FC = (props) => {
  interface User {
    nome: string
  }
  function teste() {
    db.firestore().collection("User").add({ nome: 'Nikollas' }).then(res => {
      console.log(res);
    }).catch(console.error);

  }
  return (
    <div className="app">
      <Routes />
    </div>
  );
}

export default App;
