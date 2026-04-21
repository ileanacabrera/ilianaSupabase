import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

const ModalEliminacionCategoria = ({
  mostrarModalEliminacion,
  setMostrarModalEliminacion,
  eliminarCategoria,
  categoria,
}) => {

  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleEliminar = async () => {
    if (deshabilitado) return;
    setDeshabilitado(true);
    await eliminarCategoria();
    setDeshabilitado(false);
  };

  return (
     <Modal
      show={mostrarModalEliminacion}
      onHide={() => setMostrarModalEliminacion(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Eliminar Categoría</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        ¿Estás seguro que deseas eliminar esta categoría?
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => setMostrarModalEliminacion(false)}
        >
          Cancelar
        </Button>

        <Button
          variant="danger"
          onClick={handleEliminar}
          disabled={deshabilitado}
        >
          Eliminar
        </Button>
      </Modal.Footer>
    </Modal>
    
  );
};

export default ModalEliminacionCategoria;