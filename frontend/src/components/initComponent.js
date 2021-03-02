import React, { useState } from 'react';
import "./styles/initComponent.css";
import bg from '../bg.svg';
import recharge from '../recharge.svg';
import payments from '../payments.svg';
import axios from 'axios';

function Initcomponent(props) {
    const [rotated, setRotated] = useState(false);
    const [section, setSection] = useState('home');
    const [reCellPhone, setReCellPhone] = useState(0);
    const [reDocument, setReDocument] = useState(0);
    const [reIsLoading, setReIsLoading] = useState(false);
    const [reError, setReError] = useState(false);
    const [reSuccess, setReSuccess] = useState(false);
    const [qty, setQty] = useState(0);
    const [payQty, setPayQty] = useState(0);
    const [paIsLoading, setPaIsLoading] = useState(false);
    const [paError, setPaError] = useState(false);
    const [paSuccess, setPaSuccess] = useState(false);

    const putOff = () => {
        setPaSuccess(false);
        setPaError(false);
        setPaIsLoading(false);
        setReError(false);
        setReSuccess(false);
        setReIsLoading(false);
    }

    const rotate = () => {
        document.querySelector(".bars").classList.toggle("active");
    }
    const toggleButton = async (e) => {
        putOff();
        fetchData();
        if (e.target.innerText === "Recargar") {
            setSection("recargar");
        }
        else if (e.target.innerText === "Pagar") {
            setSection("pagar");
        }
        else if (e.target.innerText === "Salir") {
            localStorage.removeItem('userData');
            localStorage.removeItem('token');
            window.location.href = "/";
        }
        else if (e.target.innerText === "Consultar") {
            await fetchData();
            setSection("consultar");
        }
        setRotated(!rotated);
        rotate();
        showSeconds();
    }

    const fetchData = async (req, res) => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        const {data} = await axios.get(`api/users/consult/${userData.id}`);
        localStorage.setItem('userData', JSON.stringify(data.payload));
    }

    const showSeconds = () => {
        document.querySelector(".secondButton").classList.toggle("active");
        document.querySelector(".thirdButton").classList.toggle("active");
        document.querySelector(".fourthButton").classList.toggle("active");
        document.querySelector(".fifthButton").classList.toggle("active");
    }

    const rechargeHandler = async (e) => {
        e.preventDefault();
        e.target.reset();
        setReIsLoading(true);
        const userData = JSON.parse(localStorage.getItem('userData'));
        if(userData.document === parseInt(reDocument) && userData.cellphone === parseInt(reCellPhone)){
            var {
                document, 
                name, 
                email, 
                password, 
                cellphone,
                money
            } = userData;
            money += parseInt(qty);
            const {data} = await axios.put(`/api/users/addMoney/${userData.id}`, {document, name, email, cellphone, password, money});
            if(data.code === 200){
                setReIsLoading(false);
                setReError(false);
                setReSuccess(true);
            }
            else{
                setReIsLoading(false);
                setReSuccess(false);
                setReError(true);
            }
        }
        else{
            setReIsLoading(false);
            setReSuccess(false);
            setReError(true);
        }
        fetchData();
    }

    const payerHandler = async (e) => {
        e.preventDefault();
        e.target.reset();
        setPaIsLoading(true);
        const userData = JSON.parse(localStorage.getItem('userData'));
        const userMoney = userData.money;
        const token = localStorage.getItem('token');
        var caracteres = "abcdefghijkmnpqrtuvwxyzABCDEFGHJKMNPQRTUVWXYZ2346789";
        var contrasenia = "";
        for (let i=0; i<6; i++) contrasenia +=caracteres.charAt(Math.floor(Math.random()*caracteres.length)); 
        if(payQty > userMoney){
            setPaIsLoading(false);
            setPaSuccess(false);
            setPaError(true);
        }
        else{
            var {
                document, 
                name, 
                email, 
                password, 
                cellphone,
                money
            } = userData;
            money -= parseInt(payQty);
            const {data} = await axios.put(`/api/users/lessMoney/${userData.id}/${token}/${contrasenia}`, {document, name, email, cellphone, password, money});
            if(data.code === 200){
                setPaIsLoading(false);
                setPaError(false);
                setPaSuccess(true);
            }
            else{
                setPaIsLoading(false);
                setPaSuccess(false);
                setPaError(true);
            }
        }
        fetchData();
    }

    return (
        <div className="initComponent">
            <button className={"bars"} onClick={toggleButton}></button>
            <button className="secondButton" onClick={toggleButton}>Recargar</button>
            <button className="thirdButton" onClick={toggleButton}>Pagar</button>
            <button className="fourthButton" onClick={toggleButton}>Consultar</button>
            <button className="fifthButton" onClick={toggleButton}>Salir</button>
            <div className="container-fluid">
                {section === "home" &&
                    <div className="home">
                        <div className="img-bg">
                            <img src={bg} alt="Background" />
                        </div>
                        <div className="text">¡Presiona el botón de arriba para empezar!</div>
                    </div>
                }
                {section === "pagar" &&
                    <div className="payer">
                    <div className="form">
                        <h1 className="title">Pagar dinero</h1>
                        <form action="" onSubmit={payerHandler}>
                            <div className="mb-12 col-12 quantity">
                                <label htmlFor="inputQuantity" className="col-sm-12 col-form-label">Cantidad</label>
                                <div className="col-sm-12">
                                    <input type="number" className="form-control" id="inputQuantity" required={true} onChange={(e) => setPayQty(e.target.value)} />
                                </div>
                            </div>
                            <button className="btn btn-info btn-lg" disabled={paIsLoading && true}>{paIsLoading ? "Cargando..." : "Recargar"} </button>
                        </form>
                        <div className="info">
                            {paSuccess && <div className="successMessag">Pago realizado correctamente</div> }
                            {paError && <div className="errorMessag">El pago no se realizó correctamente</div> }
                        </div>
                    </div>
                    <div className="img">
                        <img src={payments} alt="Recharge identifier"/>
                    </div>
                </div>
                }
                {section === "recargar" &&
                    <div className="recharge">
                        <div className="form">
                            <h1 className="title">Recargar dinero</h1>
                            <form action="" onSubmit={rechargeHandler}>
                                <div className="mb-12 col-12 email">
                                    <label htmlFor="inputDocument" className="col-sm-12 col-form-label">Documento</label>
                                    <div className="col-sm-12">
                                        <input type="numer" className="form-control" id="inputDocument" required={true} onChange={(e) => setReDocument(e.target.value)} />
                                    </div>
                                </div>
                                <div className="mb-12 col-12 cellphone">
                                    <label htmlFor="inputCellPhone" className="col-sm-12 col-form-label">Teléfono</label>
                                    <div className="col-sm-12">
                                        <input type="number" className="form-control" id="inputCellPhone" required={true} onChange={(e) => setReCellPhone(e.target.value)} />
                                    </div>
                                </div>
                                <div className="mb-12 col-12 quantity">
                                    <label htmlFor="inputQuantity" className="col-sm-12 col-form-label">Cantidad</label>
                                    <div className="col-sm-12">
                                        <input type="number" className="form-control" id="inputQuantity" required={true} onChange={(e) => setQty(e.target.value)} />
                                    </div>
                                </div>
                                <button className="btn btn-info btn-lg" disabled={reIsLoading && true}>{reIsLoading ? "Cargando..." : "Recargar"} </button>
                            </form>
                            <div className="info">
                                {reSuccess && <div className="successMessag">Balance agregado correctamente</div> }
                                {reError && <div className="errorMessag">El balance no se agregó correctamente</div> }
                            </div>
                        </div>
                        <div className="img">
                            <img src={recharge} alt="Recharge identifier"/>
                        </div>
                    </div>
                }
                {section === "consultar" &&
                    <div className="consult">
                        <h1>Saldo actual: </h1>
                        <h2>{ JSON.parse(localStorage.getItem('userData')).money ? JSON.parse(localStorage.getItem('userData')).money : "0"}</h2>
                    </div>
                }
            </div>
        </div>
    )
}

export default Initcomponent;
