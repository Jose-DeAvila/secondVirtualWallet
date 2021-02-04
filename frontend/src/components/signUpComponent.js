import React, { useEffect, useState } from 'react';
import './styles/signUpComponent.css';
import bg from '../background.jpg';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

function SignUp(props) {

    const [document, setDocument] = useState(0);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cellphone, setCellphone] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const userData = localStorage.getItem('userData');

    const sendToPage = (e) => {
        console.log(e.target.innerText);
        if (e.target.innerText === "Cartera Virtual") {
            window.location.href = "/";
        }
        else if (e.target.innerText === "¡Inicia sesión aquí!") {
            window.location.href = "/login";
        }
    }

    useEffect(() => {
        if(userData !== null){
            window.location.href = "/inicio";
        };
    }, [userData])

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        const {data} = await axios.post("/api/users/register", {
            document,
            name,
            email,
            password,
            cellphone
        });
        console.log(data);
        if(data.code === 201){
            setLoading(false);
            setError(true);
        }
        else{
            setError(false);
            setLoading(false);
            setSuccess(true);
            setTimeout(()=> {
                window.location.href = "/login";
            }, 3000)
        }
    }

    return (
        <div className="signin" style={{ backgroundImage: `url(${bg})` }}>
            <div className="container">
                <button className="signin__button" onClick={sendToPage}><h1>Cartera Virtual</h1></button>
                <form action="" onSubmit={submitHandler}>
                    <div className="mb-3 row document">
                        <label htmlFor="inputDocument" className="col-sm-2 col-form-label">N° documento</label>
                        <div className="col-sm-10">
                            <input type="number" className="form-control" id="inputDocument" placeholder="1234567899" onChange={(e) => setDocument(e.target.value)} required={true}/>
                        </div>
                    </div>
                    <div className="mb-3 row name">
                        <label htmlFor="inputName" className="col-sm-2 col-form-label">Nombre completo</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" id="inputName" placeholder="Jhon Doe" onChange={(e) => setName(e.target.value)} required={true}/>
                        </div>
                    </div>
                    <div className="mb-3 row email">
                        <label htmlFor="inputEmail" className="col-sm-2 col-form-label">Email</label>
                        <div className="col-sm-10">
                            <input type="email" className="form-control" id="inputEmail" placeholder="email@example.com" onChange={(e) => setEmail(e.target.value)} required={true}/>
                        </div>
                    </div>
                    <div className="mb-3 row password">
                        <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Contraseña</label>
                        <div className="col-sm-10">
                            <input type="password" className="form-control" id="inputPassword" onChange={(e) => setPassword(e.target.value)} required={true}/>
                        </div>
                    </div>
                    <div className="mb-3 row cellphone">
                            <label htmlFor="inputPhone" className="col-sm-2 col-form-label">Teléfono</label>
                            <div className="col-sm-10">
                                <input type="number" className="form-control" id="inputPhone" onChange={(e) => setCellphone(e.target.value)} required={true}/>
                            </div>
                        </div>
                    <Button type="submit" className="btn__register btn btn-lg btn-info" disabled={isLoading || success ? true : false}>{isLoading ? "Cargando..." : "Registrarse"}</Button>
                    {
                        error && <div className="errorMessag">¡El usuario ya se encuentra registrado!</div>
                    }
                    {
                        success && <div className="successMessag">Usuario creado con éxito, redireccionando...</div>
                    }
                </form>
                <div className="notRegistered">
                    <p className="signInParagrahp">¿Ya te encuentras registrado?</p>
                    <button className="btn__notRegistered" onClick={sendToPage}>¡Inicia sesión aquí!</button>
                </div>
            </div>
        </div>
    );
}

export default SignUp;