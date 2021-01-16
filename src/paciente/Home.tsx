import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import Header from '../Header';
import auth from '../Service/auth';
import firestore from '../Service/firestore';
import { VscFilePdf } from 'react-icons/vsc';
import './Home.css';

interface Props {
    user?: any,
    page?: string
}
class Medico {
    nome?: any
    email?: any
    constructor(nome: any, email: any) {
        this.nome = nome;
        this.email = email;
    }
}
interface Consulta { id: string, arquivos?: Array<string>, desc: string, titulo: string, data: string, medico: Medico }

const HomePaciente: React.FC<Props> = (props) => {
    let storage = localStorage.getItem('currentUser');
    const [user, setUser] = useState(JSON.parse(storage ? storage : '{}'));
    const [alterar, setAlterar] = useState(false);
    const [err, setErr] = useState('');
    const [novoM, setM] = useState(Array<Medico>());
    const [consultas, setConsultas] = useState(Array<Consulta>());
    const [novoUser, setNovoUser] = useState({
        nome: user.user ? user.user.displayName : '',
        email: user.user ? user.user.email : '',
        novaSenha: '',
        senha: ''
    });
    console.log(props.page);


    /*let a = new FormData();
    a.append("file", event.target.files?event.target.files[0] : '');
    api.post('/', a)
        .then(function (response) {
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });*/

    async function carregarConsultas() {
        await firestore.collection("Paciente").doc(user.user.uid).collection("consultas").get().then(res => {
            let a: Array<Consulta> = [];
            res.forEach(async el => {
                carregarMedico(el.data().medico);
                a.push({
                    desc: el.data().desc,
                    arquivos: el.data().arquivos,
                    titulo: el.data().titulo,
                    id: el.id,
                    data: el.data().data,
                    medico: el.data().medico
                })
                console.log(a);
            });
            setConsultas(a);
        }).catch(() => {
            return ('');
        })
    }

    async function carregarMedico(id: string) {
        await firestore?.collection("Medico").doc(id).get().then(res => {
            let obj = new Medico(res.data()?.nome, res.data()?.email);
            let a: Array<Medico> = [obj];
            setM([...a])
        })


    }

    useEffect(() => {
        carregarConsultas();
    }, [])




    const [loding, setLoding] = useState(false)
    function handlerChange(event: ChangeEvent<HTMLInputElement>) {
        setAlterar(true);
        switch (event.target.id) {
            case 'nome':
                setNovoUser({ ...novoUser, nome: event.target.value });
                break;
            case 'novaSenha':
                setNovoUser({ ...novoUser, novaSenha: event.target.value });
                break;
            case 'email':
                setNovoUser({ ...novoUser, email: event.target.value });
                break;
            case 'senha':
                setNovoUser({ ...novoUser, senha: event.target.value });
                break;
        }
    }
    async function handlerAlterar(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (novoUser.senha !== '') {
            setErr("");
            await auth.signInWithEmailAndPassword(user.user.email, novoUser.senha)
                .then(async res => {
                    setLoding(true);
                    let email = user.user.email;
                    let senha = novoUser.senha;
                    let u = await auth.currentUser;
                    if (novoUser.nome !== '') {
                        await u?.updateProfile({
                            displayName: novoUser.nome,
                        }).then(function () {
                            setErr("");
                            // Update successful.
                        }).catch(function (error) {
                            // An error happened.
                        });
                    }
                    if (novoUser.email !== '') {
                        await u?.updateEmail(novoUser.email).then(function () {
                            email = novoUser.email;
                            setErr("");
                            // Update successful.
                        }).catch(function (err) {
                            // An error happened.
                        });
                    }
                    if (novoUser.novaSenha !== '' && novoUser.novaSenha.length > 5) {
                        await u?.updatePassword(novoUser.novaSenha).then(function () {
                            senha = novoUser.novaSenha;
                            setErr("");
                        }).catch(function (errr) {
                            // An error happened.
                        });
                    }
                    else if (novoUser.novaSenha !== '') {
                        setErr("Senha inválida");
                    }

                    await auth.signInWithEmailAndPassword(email, senha)
                        .then(u => {
                            setUser(u);
                            if (err === '') {
                                setNovoUser({
                                    nome: '',
                                    email: '',
                                    novaSenha: '',
                                    senha: ''
                                });
                                alert("Alterado com sucesso!");
                            }

                            localStorage.setItem('currentUser', JSON.stringify(u));
                        }).catch(console.error);
                    setLoding(false);

                }, (err) => {
                    if (err) {
                        if (err.code === 'auth/wrong-password') {
                            setErr("Senha incorreta");
                        }
                        else if (err.code === 'auth/user-not-found') {
                            setErr("Usuário não encontrado");
                        }
                    }
                }).catch(console.error);

        }
        else {
            setErr('Digite sua senha atual');
        }

    }
    return (
        <>
            <Header tipo="paciente" user={user.user ? user.user : {}} />
            {props.page === undefined ?
                <div className="inicio">
                    <ul>
                        {
                            consultas?.map((el, j) => {
                                return (
                                    <li key={el.id}>
                                        <div className="medico"><h3>{novoM[j]?.nome}</h3>
                                            <small>{novoM[j]?.email}</small></div>
                                        <small>{el.data}</small>
                                        <div className="arquivos">
                                            {
                                                el.arquivos?.map((res, i) => {
                                                    return (
                                                        <a key={el.id + (i)}
                                                            href={res} type="application/pdf"
                                                            target="_blank">
                                                            <VscFilePdf className="pdficon" />
                                                            <span>{res.split('/')[res.split('/').length - 1]}</span>
                                                        </a>
                                                    )
                                                })
                                            }

                                        </div>
                                        <h4>{el.titulo}</h4>
                                        <p>{el.desc} sfsfsfsf sdf sdf sdf sdfsdfsdfsfss </p>
                                    </li>
                                );
                            })
                        }
                    </ul>
                </div>
                :
                props.page === 'perfil' ?
                    <div className="todo-perfil-medico">
                        <div className="todo">
                            <div className="topo">
                                <div className="topo-div">
                                    <img src={user.user.photoURL ? user.user.photoURL : 'https://www.icirnigeria.org/wp-content/uploads/2018/07/noavatar.png'}
                                        alt="Não foi possivel carregar a imagem"
                                        title="Perfil" />
                                </div>
                                <div className="topo-div">
                                    <h3>{user.user ? user.user.displayName : 'undefined'}</h3>
                                    <p>{user.user ? user.user.email : ''}</p>
                                </div>

                            </div>
                            <div className="bot">
                                <form onSubmit={handlerAlterar}>
                                    <label htmlFor="nome">Nome</label>
                                    <input id="nome" type="text" onChange={handlerChange} value={novoUser.nome ? novoUser.nome : ''} placeholder="Nome" />

                                    <label htmlFor="email">Email</label>
                                    <input id="email" type="email" onChange={handlerChange} value={novoUser.email ? novoUser.email : ''} placeholder="E-mail" />

                                    <label htmlFor="novaSenha">Alterar senha</label>
                                    <input id="novaSenha" type="password" onChange={handlerChange} value={novoUser.novaSenha} placeholder="Nova senha" />
                                    <small>* A senha deve ter mais de 5 caracters</small>
                                    <label htmlFor="senha">Digite sua senha atual </label>
                                    <input id="senha" type="password" onChange={handlerChange} value={novoUser.senha} placeholder="Senha atual" disabled={!alterar} />

                                    <small>{err}</small>
                                    <div className={"loader " + (!loding ? "none" : "flex")} ></div>
                                    <button type="submit" disabled={!alterar} >Alterar</button>
                                </form>
                            </div>
                        </div>
                    </div>
                    :
                    ''
            }
        </>
    )
}
export default HomePaciente;