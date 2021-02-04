import React, {useEffect, useState} from 'react';
import './styles/signInComponent.css';
import bg from '../background.jpg';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

function SignIn(props) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const userData = localStorage.getItem('userData');

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        const {data} = await axios.post("/api/users/login", {email, password});
        if(data.code === 200){
            setLoading(false);
            setError(false);
            localStorage.setItem('userData', JSON.stringify(data.data));
            setSuccess(true);
            setTimeout(() => {
                window.location.href = "/inicio";
            }, 3000);
        }else{
            setLoading(false);
            setError(true);
        }
    }

    useEffect(() => {
        if(userData !== null){
            window.location.href = "/inicio";
        }
    }, [userData])

    const sendToPage = (e) => {
        console.log(e.target.innerText);
        if(e.target.innerText === "Cartera Virtual"){
            window.location.href = "/";
        }
        else if(e.target.innerText === "¡Registrate aquí!"){
            window.location.href = "/register";
        }
    }
    return (
        <div className="signin" style={{ backgroundImage: `url(${bg})` }}>
            <div className="container">
                <button className="signin__button" onClick={sendToPage}><h1>Cartera Virtual</h1></button>
                <form action="" onSubmit={submitHandler}>
                    <div className="mb-3 row email">
                        <label htmlFor="inputEmail" className="col-sm-2 col-form-label">Email</label>
                        <div className="col-sm-10">
                            <input type="email" className="form-control" id="inputEmail" placeholder="email@example.com" onChange={(e) => setEmail(e.target.value)} required={true} />
                        </div>
                    </div>
                    <div className="mb-3 row password">
                        <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Password</label>
                        <div className="col-sm-10">
                            <input type="password" className="form-control" id="inputPassword" onChange={(e) => setPassword(e.target.value)} required={true} />
                        </div>
                        <p className="forgotPassword"><button>¿Olvidaste tu contraseña?</button></p>
                    </div>
                    <Button type="submit" className="btn-login btn btn-lg btn-info" disabled={isLoading || success ? true : false}> {isLoading ? "Cargando..." : "Iniciar sesión"} </Button>
                    {error && <div className="errorMessag">Datos incorrectos, ingreselos nuevamente!</div>}
                    {success && <div className="successMessag">Te has logeado correctamente, serás redireccionado</div> }
                </form>
                <div className="notRegistered">
                    <p className="signInParagrahp">¿Aún no te encuentras registrado?</p> <span>¡No espere más!</span>
                    <button className="btn__notRegistered" onClick={sendToPage}>¡Registrate aquí!</button>
                </div>
            </div>
        </div>
    );
}

export default SignIn;