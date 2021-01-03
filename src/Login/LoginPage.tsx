import React, { ChangeEvent, useState } from 'react';
import './login.css'
import { Link } from 'react-router-dom';
import { BsArrowLeftShort, BsPlus } from 'react-icons/bs';

interface LoginProps {
    tipo?: string
}
//<Link to={"/header/" + a} >Go Header</Link>
const Login: React.FC<LoginProps> = (props) => {
    const [tipo, setTipo] = useState('');
    const [form, setForm] = useState(false);
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    function handlerTipo(tipo: string) {
        setTipo(tipo);
        setForm(true);
    }

    function handlerLogin(event: ChangeEvent<HTMLInputElement>) {
        setLogin(event.target.value);
    }

    function handlerSenha(event: ChangeEvent<HTMLInputElement>) {
        setSenha(event.target.value);
    }

    return (
        <div className="container">
            <div className="login-container">
                {form? <button className="voltar" onClick={() => setForm(false)}><BsArrowLeftShort /></button> : ''}
                <h2>Bem vindo(a) ao Med<BsPlus/></h2>
                {!form ? <div className="buttons-container">
                    <button onClick={() => handlerTipo('medico')}>Sou médico</button>
                    <p>ou</p>
                    <button onClick={() => handlerTipo('paciente')}>Quero acessar minha conta pessoal</button>
                </div>
                    :
                    <div className="form-container">
                        <div>
                            <h3>{tipo == 'medico' ? 'Login como médico' : 'Entre em sua conta pessoal'}</h3>
                            <small>Preencha seus dados corretamente</small>
                        </div>
                        <form className="form">
                            <input type="text" onChange={handlerLogin} placeholder="Seu login" />
                            <input type="password" onChange={handlerSenha} value={senha} placeholder="Sua senha" />
                            <button >Entrar</button>
                        </form>
                    </div>
                }
                <Link className="link" to="/">Ainda não tem cadastro?</Link>
            </div>
        </div>

    );

}

export default Login;
