import React from 'react';
import './App.css';
import Routes from './routes';
import db from './Service/firebase';

// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/firestore";
//<Header title='MyMedicalRecord'></Header>
const App: React.FC = (props) => {
  interface User {
    nome: string
  }
  
  return (
    <div className="app">
      <Routes />
    </div>
  );
}

export default App;
