import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { supabase } from "../../database/supabaseconfig";

const ModalEliminacionProducto = ({
  mostrarModalEliminacion,
  setMostrarModalEliminacion,
  producto,
  recargarProductos,
}) => {

  const [deshabilitado, setDeshabilitado] = useState(false);

  const handleEliminar = async () => {
    if (deshabilitado) return;

    try {
      setDeshabilitado(true);

      // 🔥 1. Eliminar imagen del storage
      if (producto?.url_imagen) {
        const nombreArchivo = producto.url_imagen.split("/").pop();
        await supabase.storage
          .from("imagenes_productos")
          .remove([nombreArchivo]);
      }

      // 🔥 2. Eliminar producto de la BD
      const { error } = await supabase
        .from("productos")
        .delete()
        .eq("id_producto", producto.id_producto);

      if (error) throw error;

      // 🔥 3. Cerrar y recargar
      setMostrarModalEliminacion(false);
      recargarProductos();

    } catch (err) {
      console.error(err);
      alert("Error al eliminar producto");
    } finally {
      setDeshabilitado(false);
    }
  };

  return (
    <Modal
      show={mostrarModalEliminacion}
      onHide={() => setMostrarModalEliminacion(false)}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Eliminar Producto</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        ¿Estás seguro que deseas eliminar el producto{" "}
        <strong>{producto?.nombre_producto}</strong>?
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
          {deshabilitado ? "Eliminando..." : "Eliminar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionProducto;