import React from 'react';
import './App.css';
import { useHistory } from 'react-router-dom';
interface User {
    displayName: string,
    email: string
    uid: string
}
interface HeaderProps {
    user?: User,
    title?: String,
    tipo: string,
    match?: {
        params?: {
            teste?: String
        }
    }
}
//<h1>{props?.match?.params?.teste}</h1>
const Header: React.FC<HeaderProps> = (props) => {
    const history = useHistory();
    async function handlerSair() {
        if (localStorage.getItem('currentUser')) {
            await localStorage.removeItem('currentUser');
            history.push('/');
        }
    }
    function handlerPerfil() {
        history.push('/' + props.tipo + '/perfil');
    }
    function handlerHome() {
        history.push('/' + props.tipo);
    }
    return (
        <header className="header">
            <h1><img className="logo" src="https://backend-analise.000webhostapp.com/favicon.ico" alt=""/></h1>
            <ul className="header-btns">
                <li onClick={handlerHome}>Início</li>
                <li onClick={handlerPerfil}>Perfil</li>
                <li onClick={handlerSair}>Sair</li>
            </ul>
        </header>
    );

}
export default Header;