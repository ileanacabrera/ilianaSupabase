import React from "react";
import { Form, InputGroup } from "react-bootstrap";

const CuadroBusquedas = ({ textoBusqueda, manejarCambioBusqueda }) => {
  return (
    <InputGroup className="shadow-sm" style={{ borderRadius: "0.375rem" }}>
      <InputGroup.Text>
        <i className="bi bi-search"></i>
      </InputGroup.Text>

      <Form.Control
        size="sm"   // 👈 AQUI
        type="text"
        placeholder="Buscar..."
        value={textoBusqueda}
        onChange={manejarCambioBusqueda}
      />
    </InputGroup>
  );
};

export default CuadroBusquedas;