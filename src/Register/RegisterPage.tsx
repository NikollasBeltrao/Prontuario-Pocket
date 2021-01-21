import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import './Register.css';
import '../Login/login.css'
import { Link, useHistory } from 'react-router-dom';
import { BsArrowLeftShort, BsPlus } from 'react-icons/bs';
import auth from '../Service/auth';
import firestore from '../Service/firestore';
import cpfMask from "../cpfMask";

const Register: React.FC = (props) => {
    const history = useHistory();
    const [tipo, setTipo] = useState('');
    const [form, setForm] = useState(false);
    const [tab, setTab] = useState(0);
    const [tabM, setTabM] = useState(0);
    const [err, setErr] = useState('');
    const [dataMedico, setDataMedico] = useState({
        nome: '',
        email: '',
        foto: '',
        senha: ''
    });
    const [confSenhaM, setConfSenhaM] = useState('');
    const [dataPaciente, setDataPaciente] = useState({
        cpf: '',
        nome: '',
        email: '',
        senha: '',
        tipoS: '',
        foto: '',
        dataN: ''

    });

    const [confSenhaP, setConfSenhaP] = useState('');

    function handlerTipo(tipo: string) {
        setTipo(tipo);
        setForm(true);
    }


    async function handlerCadastrarPaciente(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (dataPaciente.email !== '' && dataPaciente.senha !== '' && confSenhaP !== '' && dataPaciente.nome !== ''
            && dataPaciente.tipoS !== '' && dataPaciente.dataN !== '' && (confSenhaP === dataPaciente.senha)) {
            setErr('');
            await auth.createUserWithEmailAndPassword(dataPaciente.email, dataPaciente.senha)
                .then(async (user) => {
                    let dataUser = {
                        cpf: dataPaciente.cpf,
                        nome: dataPaciente.nome,
                        email: dataPaciente.email,
                        dataN: dataPaciente.dataN,
                        tipoS: dataPaciente.tipoS,
                        imagem: dataPaciente.foto,
                        tipo: "paciente"
                    }
                    await firestore.collection('Paciente').doc(user?.user?.uid).set(dataUser)
                        .then((res) => {
                        })
                        .catch((res) => {
                            setErr('Falha ao cadastrar os dados');
                        });
                    await auth.signInWithEmailAndPassword(dataPaciente.email, dataPaciente.senha)
                        .then(async (usera) => {
                            let u = await auth.currentUser;
                            await u?.updateProfile({
                                displayName: dataPaciente.nome,
                                photoURL: dataPaciente.foto
                            }).then(function (a) {
                                console.log(a)
                                setErr("");
                                // Update successful.
                            }).catch(function (error) {
                                // An error happened.
                            });
                            localStorage.setItem('currentUser', JSON.stringify(usera));
                            history.push('/paciente');
                        })
                        .catch((error) => {
                            setErr('Falha ao fazer login');
                        });
                }, (err) => {
                    if (err.code == "auth/email-already-in-use") {
                        setErr('Esse email já está cadastrado');
                    }
                })
                .catch((error) => {
                    setErr('Falha ao cadastrar os dados');
                    // ..
                });
        }
        else {
            if (confSenhaP === dataPaciente.senha) {
                setErr('Preencha todos os campos');
            }
            else {
                setErr('As senhas devem ser iguais');
            }
        }
    }


    function handlerLoginP(event: ChangeEvent<HTMLInputElement>) {
        setDataPaciente({ ...dataPaciente, email: event.target.value });
    }

    function handlerNomeP(event: ChangeEvent<HTMLInputElement>) {
        setDataPaciente({ ...dataPaciente, nome: event.target.value });
    }

    function handlerDataP(event: ChangeEvent<HTMLInputElement>) {
        setDataPaciente({ ...dataPaciente, dataN: event.target.value });
    }

    function handlerTipoSP(event: ChangeEvent<HTMLSelectElement>) {
        setDataPaciente({ ...dataPaciente, tipoS: event.target.value });
    }

    function handlerConfSenhaP(event: ChangeEvent<HTMLInputElement>) {
        setConfSenhaP(event.target.value);
    }

    function handlerSenhaP(event: ChangeEvent<HTMLInputElement>) {
        setDataPaciente({ ...dataPaciente, senha: event.target.value });
        //await realtime.ref('User').set({
        //    nome: event.target.value,
        //});
    }
    function handleCpfP(event: ChangeEvent<HTMLInputElement>) {
        setDataPaciente({ ...dataPaciente, cpf: cpfMask(event.target.value) })
    }


    async function handlerCadastrarMedico(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (dataMedico.email !== '' && dataMedico.senha !== '' && confSenhaM !== '' && dataMedico.nome !== ''
            && (confSenhaM === dataMedico.senha)) {
            setErr('');
            await auth.createUserWithEmailAndPassword(dataMedico.email, dataMedico.senha)
                .then(async (user) => {
                    let dataUser = {
                        nome: dataMedico.nome,
                        email: dataMedico.email,
                        tipo: 'medico'
                    }
                    await firestore.collection('Medico').doc(user?.user?.uid).set(dataUser)
                        .then((res) => {
                            console.log(res);
                        })
                        .catch((res) => {
                            setErr('Falha ao cadastrar os dados');
                        });
                    await auth.signInWithEmailAndPassword(dataMedico.email, dataMedico.senha)
                        .then(async (usera) => {
                            let u = await auth.currentUser;
                            await u?.updateProfile({
                                displayName: dataMedico.nome,
                                photoURL: dataMedico.foto
                            }).then(function () {
                                setErr("");
                                // Update successful.
                            }).catch(function (error) {
                                // An error happened.
                            });

                            localStorage.setItem('currentUser', JSON.stringify(usera));
                            history.push('/medico');
                        })
                        .catch((error) => {
                            setErr('Falha as fazer login');
                        });
                }, (err) => {
                    if (err.code == "auth/email-already-in-use") {
                        setErr('Esse email já está cadastrado');
                    }
                })
                .catch((error) => {
                    setErr('Falha ao cadastrar os dados');
                });
        }
        else {
            if (confSenhaM === dataMedico.senha) {
                setErr('Preencha todos os campos');
            }
            else {
                setErr('As senhas devem ser iguais');
            }
        }
    }
    function handlerFotoM(event: ChangeEvent<HTMLInputElement>) {
        setDataMedico({ ...dataMedico, foto: event.target.value });
    }

    function handlerFotoP(event: ChangeEvent<HTMLInputElement>) {
        setDataPaciente({ ...dataPaciente, foto: event.target.value });
    }
    function handlerLoginM(event: ChangeEvent<HTMLInputElement>) {
        setDataMedico({ ...dataMedico, email: event.target.value });
    }

    function handlerNomeM(event: ChangeEvent<HTMLInputElement>) {
        setDataMedico({ ...dataMedico, nome: event.target.value });
    }

    function handlerConfSenhaM(event: ChangeEvent<HTMLInputElement>) {
        setConfSenhaM(event.target.value);
        if (dataMedico.senha.substr(0, event.target.value.length) !== event.target.value) {
            setErr("As senhas devem ser iguais");
        }
        else {
            setErr("");
        }
    }

    function handlerSenhaM(event: ChangeEvent<HTMLInputElement>) {
        setDataMedico({ ...dataMedico, senha: event.target.value });
    }


    return (
        <div className="container">
            <div className="register-container">
                {form ? <button className="voltar" onClick={() => setForm(false)}><BsArrowLeftShort /></button> : ''}
                <br/>
                <h2>Bem vindo(a) ao Prontuário Pocket</h2>
                {!form ? <img className="logo-inicio" src="https://backend-analise.000webhostapp.com/favicon.ico" alt="" /> : ''}
                {!form ? <div className="buttons-container">
                    <button onClick={() => handlerTipo('medico')}>Quero criar uma conta empresarial</button>
                    <p>ou</p>
                    <button onClick={() => handlerTipo('paciente')}>Quero criar uma conta pessoal</button>
                </div> :
                    <div className="form-container-register">

                        {tipo === 'paciente' ?
                            <form onSubmit={handlerCadastrarPaciente} >
                                {tab === 0 ?
                                    <div className="form">
                                        <label htmlFor="nome">* Nome</label>
                                        <input id='nome' type="text" onChange={handlerNomeP} value={dataPaciente.nome} placeholder="Seu nome" />

                                        <label htmlFor="email">* E-mail</label>
                                        <input id='email' type="email" onChange={handlerLoginP} value={dataPaciente.email} placeholder="Seu E-mail" />

                                        <label htmlFor="datan">* Data de nascimento</label>
                                        <input id="datan" type="date" onChange={handlerDataP} value={dataPaciente.dataN} />

                                        <label htmlFor="cpf">* CPF</label>
                                        <input id="cpf" type="text" maxLength={14} placeholder="000.000.000-00" onChange={handleCpfP} value={dataPaciente.cpf} />

                                        <div><button type="button" className="proximo" onClick={() => setTab(1)}>Proximo</button></div>
                                    </div> :
                                    <div className="form">
                                        <label htmlFor="ts">* Tipo sanguineo</label>
                                        <select id='ts' className="sel" value={dataPaciente.tipoS} onChange={handlerTipoSP}>
                                            <option value="">Seu tipo sanguineo</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">Ab-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                        </select>
                                        <label htmlFor="senha">* Senha</label>
                                        <input id='senha' type="password" onChange={handlerSenhaP} value={dataPaciente.senha} placeholder="Sua senha" />

                                        <label htmlFor="conf">* Confirmar senha</label>
                                        <input id='conf' type="password" onChange={handlerConfSenhaP} value={confSenhaP} placeholder="Confirme a senha" />

                                        <label htmlFor="f">Foto (url)</label>
                                        <input id='f' type="text" onChange={handlerFotoP} value={dataPaciente.foto} placeholder="Url" />
                                        <small>{err}</small>
                                        <div>
                                            <button type="button" className="anterior" onClick={() => setTab(0)}>Anterior</button>
                                            <button className="proximo" type='submit'>Cadastrar</button>
                                        </div>
                                    </div>
                                }
                            </form> :
                            <form onSubmit={handlerCadastrarMedico}>
                                {tabM === 0 ?
                                    <div className="form">
                                        <label htmlFor="nome">* Nome</label>
                                        <input id='nome' type="text" onChange={handlerNomeM} value={dataMedico.nome} placeholder="Seu nome" />

                                        <label htmlFor="email">* E-mail</label>
                                        <input id='email' type="email" onChange={handlerLoginM} value={dataMedico.email} placeholder="Seu E-mail" />
                                        <small>{err}</small>
                                        <div><button type="button" className="proximo" onClick={() => setTabM(1)}>Proximo</button></div>
                                    </div> :
                                    <div className="form">
                                        <label htmlFor="senha">* Senha</label>
                                        <input id='senha' type="password" onChange={handlerSenhaM} value={dataMedico.senha} placeholder="Sua senha" />

                                        <label htmlFor="conf">* Confirmar senha</label>
                                        <input id='conf' type="password" onChange={handlerConfSenhaM} value={confSenhaM} placeholder="Confirme a senha" />

                                        <label htmlFor="f">Foto (url)</label>
                                        <input id='f' type="text" onChange={handlerFotoM} value={dataMedico.foto} placeholder="Url" />
                                        <small>{err}</small>
                                        <div>
                                            <button type="button" className="anterior" onClick={() => setTabM(0)}>Anterior</button>
                                            <button className="proximo" type='submit'>Cadastrar</button>
                                        </div>
                                    </div>
                                }
                            </form>
                        }
                    </div>
                }
                <Link className="link" to="/">Fazer login</Link>
            </div>
        </div>
    );
}
export default Register;