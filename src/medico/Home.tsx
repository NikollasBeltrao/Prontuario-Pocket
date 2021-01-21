import firebase from 'firebase';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../Header';
import auth from '../Service/auth';
import firestore from '../Service/firestore';
import { VscFilePdf } from 'react-icons/vsc';
import api from '../Service/apiImg'
import cpfMask from "../cpfMask";
import './Medico.css';

interface Props {
    user?: any,
    page?: string
}


const HomeMedico: React.FC<Props> = (props) => {
    const history = useHistory();
    let storage = localStorage.getItem('currentUser');
    const [user, setUser] = useState(JSON.parse(storage ? storage : '{}'));
    const [alterar, setAlterar] = useState(false);
    const [err, setErr] = useState('');
    const [pesquisa, setpesquisar] = useState(false);
    const [novoUser, setNovoUser] = useState({
        nome: user.user ? user.user.displayName : '',
        email: user.user ? user.user.email : '',
        novaSenha: '',
        senha: ''
    });
    const [paciente, setPaciente] = useState({
        uid: '',
        codigo: "",
        dataN: "",
        email: "",
        imagem: "",
        nome: "",
        tipo: "",
        cpf: ""

    });
    const [exame, setExame] = useState({
        arquivos: Array<File>(),
        data: '',
        desc: '',
        medico: user.user.uid,
        titulo: ''

    });

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
                        await firestore.collection("Medico").doc(user.user.id).set({
                            nome: novoUser.nome
                        })
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
                        await firestore.collection("Medico").doc(user.user.id).set({
                            email: novoUser.email
                        })
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

    async function pesquisar(event: React.KeyboardEvent<HTMLInputElement>) {
        const e = event.target as HTMLInputElement;
        e.value = cpfMask(e.value)
        if (event.key === "Enter") {
            await firestore.collection("Paciente").where("cpf", "==", e.value).get().then((res) => {
                if (res?.docs[0]) {
                    setPaciente({
                        uid: res.docs[0].id,
                        codigo: res.docs[0].data().codigo,
                        dataN: res.docs[0].data().dataN,
                        email: res.docs[0].data().email,
                        imagem: res.docs[0].data().imagem,
                        nome: res.docs[0].data().nome,
                        tipo: res.docs[0].data().tipo,
                        cpf: res.docs[0].data().cpf
                    });
                    setpesquisar(true);
                }
                else {
                    setPaciente({
                        uid: "",
                        codigo: "",
                        dataN: "",
                        email: "",
                        imagem: "",
                        nome: "",
                        tipo: "",
                        cpf: ''
                    })
                }
            })
        }
    }
    async function addArquivo(event: ChangeEvent<HTMLInputElement>) {
        const e = event.target as HTMLInputElement;

        if (e.files && e.files[0]) {
            setExame({ ...exame, arquivos: [...exame.arquivos, e.files[0]] })
        }
    }

    async function enviarExame(event: FormEvent) {
        event.preventDefault();
        let e = event.target as HTMLInputElement;
        let title = e.childNodes[3] as HTMLInputElement;
        let message = e.childNodes[5] as HTMLInputElement;
        let now = new Date();
        let data = now.getDate() + "/" + (now.getMonth() + 1) + "/" + now.getFullYear();
        setExame({
            ...exame,
            data: data,
            desc: message.value,
            titulo: title.value
        });
        let nAqrquivo = Array<string>();
        await exame.arquivos.map((el) => {
            nAqrquivo.push("https://backend-analise.000webhostapp.com/docs/" + el.name);
            let form = new FormData();
            form.append("file", el);

            api.post("/", form).then(res => {
                console.log(res);
            }).catch(console.error);
        })
        if (paciente.uid !== '') {
            await firestore.collection("Paciente").doc(paciente.uid).collection("consultas").add({ ...exame, arquivos: nAqrquivo }).then(res => {
                setExame({
                    arquivos: Array<File>(),
                    data: '',
                    desc: '',
                    medico: user.user.uid,
                    titulo: ''
                })
                alert("Exame enviado");
            })
        }

    }

    if (storage) {
        return (
            <>
                <Header tipo="medico" user={user.user ? user.user : {}} />
                {props.page === undefined ?
                    <div className="inicio">
                        <div className="list-container">
                            <div><input type="text" maxLength={14} placeholder="Pesquisar" onKeyPress={pesquisar} /></div>
                            {pesquisa && paciente.nome !== '' && paciente.email !== '' ?
                                <div className="paciente">
                                    <img src={paciente.imagem ? paciente.imagem : "https://www.icirnigeria.org/wp-content/uploads/2018/07/noavatar.png"} alt="" />
                                    <h2>{paciente.nome}</h2>
                                    <p>{paciente.email}</p>

                                    <form onSubmit={enviarExame}>
                                        <input type="file" name="file" id="file" accept=".pdf" onChange={addArquivo} />
                                        <div className="lista-exames">{exame.arquivos?.map((el, i) => {
                                            return (
                                                <li key={i}> <VscFilePdf className="icon-exames" /> <p>{el.name}</p></li>
                                            )
                                        })
                                        }</div>
                                        <label htmlFor="t">Tópico</label>
                                        <input id="t" type="text" placeholder="Tópico" />
                                        <label htmlFor="m">Menssagem</label>
                                        <input id="m" type="text" placeholder="Menssagem" />
                                        <button type="submit">Enviar</button>
                                    </form>
                                </div> : ''
                            }
                        </div>
                    </div>
                    : props.page === "perfil" ?
                        <div className="todo-perfil-medico">
                            <div className="todo">
                                <div className="topo">
                                    <div className="top-div">
                                        <img src={user.user.photoURL ? user.user.photoURL : 'https://www.icirnigeria.org/wp-content/uploads/2018/07/noavatar.png'}
                                            alt="Não foi possivel carregar a imagem"
                                            title="Perfil" />
                                    </div>
                                    <div className="top-div">
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
                        </div> : ''
                }
            </>
        )
    }
    else {
        return <div>Erro{history.push("/")}</div>
    }
}
export default HomeMedico;

