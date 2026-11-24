import React from "react";
import FormularioRegi from "../components/registro/formularioregi";
import "../styles/interfaces_navbar/usuario.css";

function Registro() {
    return (
        <div className="registro-container">

            <div className="registro-background"></div>

            <FormularioRegi />

        </div>
    );
}

export default Registro;