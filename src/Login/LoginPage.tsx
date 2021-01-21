import React, { ChangeEvent, FormEvent, useState } from 'react';
import './login.css';
import { Link, useHistory } from 'react-router-dom';
import { BsArrowLeftShort, BsPlus } from 'react-icons/bs';
import auth from '../Service/auth';
import firestore from '../Service/firestore';

interface LoginProps {
    tipo?: string
}
//<Link to={"/header/" + a} >Go Header</Link>
const Login: React.FC<LoginProps> = (props) => {
    const history = useHistory();
    const [tipo, setTipo] = useState('');
    const [err, setErr] = useState('');
    const [form, setForm] = useState(false);
    const [dataForm, setDataForm] = useState({
        email: '',
        senha: ''
    });
    function handlerTipo(tipo: string) {
        setTipo(tipo);
        setForm(true);
    }
    function handlerLogin(event: ChangeEvent<HTMLInputElement>) {
        setDataForm({ ...dataForm, email: event.target.value });
    }

    function handlerSenha(event: ChangeEvent<HTMLInputElement>) {
        setDataForm({ ...dataForm, senha: event.target.value });
    }

    async function handlerEntrar(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (dataForm.email !== '' && dataForm.senha !== '') {
            setErr("");
            await auth.signInWithEmailAndPassword(dataForm.email, dataForm.senha)
                .then(async (usera) => {
                    if (tipo === 'medico') {
                        await firestore.collection('Medico').doc(usera?.user?.uid).get()
                            .then((res) => {
                                if (res.exists) {
                                    localStorage.setItem('currentUser', JSON.stringify(usera));
                                    history.push('/medico');
                                }
                                else {
                                    setErr('Esse usuário é um paciente');
                                }
                            })
                            .catch((res) => {
                                setErr('Falha ao cadastrar os dados');
                            });

                    }
                    else {
                        await firestore.collection('Paciente').doc(usera?.user?.uid).get()
                            .then((res) => {
                                if (res.exists) {
                                    localStorage.setItem('currentUser', JSON.stringify(usera));
                                    history.push('/paciente');
                                }
                                else {
                                    setErr('Esse usuário é um médico');
                                }
                            })
                            .catch((res) => {
                                setErr('Falha ao cadastrar os dados');
                            });
                    }
                }, (err) => {
                    if (err) {
                        if (err.code === 'auth/wrong-password') {
                            setErr("Senha incorreta");
                        }
                        else if (err.code === 'auth/user-not-found') {
                            setErr("Usuário não encontrado");
                        }
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        else {
            setErr("Preencha todos os campos");
        }
    }

    return (
        <div className="container">
            <div className="login-container">
                {form ? <button className="voltar" onClick={() => setForm(false)}><BsArrowLeftShort /></button> : ''}
                <div className="topo-inicio">
                    <h2>Bem vindo(a) ao Prontuário Pocket</h2>
                    {!form ? <img className="logo-inicio" src="https://backend-analise.000webhostapp.com/favicon.ico" alt="" /> : ''}
                </div>
                <h3>Login</h3>
                {!form ? <div className="buttons-container">

                    <button onClick={() => handlerTipo('medico')}>Sou médico</button>
                    <p>ou</p>
                    <button onClick={() => handlerTipo('paciente')}>Quero acessar minha conta pessoal</button>
                </div>
                    :
                    <div className="form-container">
                        <div>
                            <h3>{tipo === 'medico' ? 'Login como médico' : 'Entre em sua conta pessoal'}</h3>
                            <small>Preencha seus dados corretamente</small>
                        </div>
                        <form className="form" onSubmit={handlerEntrar}>
                            <input type="email" onChange={handlerLogin} value={dataForm.email} placeholder="Seu E-mail" />
                            <input type="password" onChange={handlerSenha} value={dataForm.senha} placeholder="Sua senha" />
                            <small>{err}</small>
                            <button >Entrar</button>
                        </form>
                    </div>
                }

                <Link className="link" to="/register">Ainda não tem cadastro?</Link>
            </div>
        </div>

    );

}

export default Login;
