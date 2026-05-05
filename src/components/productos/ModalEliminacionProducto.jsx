import React from "react";
import { Modal, Button } from "react-bootstrap";
import { supabase } from "../../database/supabaseconfig";

const ModalEliminacionProducto = ({
  mostrar,
  cerrar,
  producto,
  recargar
}) => {

  const eliminarProducto = async () => {
    try {
      // 🔥 eliminar imagen
      if (producto.url_imagen) {
        const nombre = producto.url_imagen.split("/").pop();
        await supabase.storage.from("imagenes_productos").remove([nombre]);
      }

      // 🔥 eliminar en BD
      const { error } = await supabase
        .from("productos")
        .delete()
        .eq("id_producto", producto.id_producto);

      if (error) throw error;

      cerrar();
      recargar();

    } catch (err) {
      console.error(err);
      alert("Error al eliminar");
    }
  };

  return (
    <Modal show={mostrar} onHide={cerrar}>
      <Modal.Header closeButton>
        <Modal.Title>Eliminar Producto</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        ¿Seguro que deseas eliminar <b>{producto?.nombre_producto}</b>?
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={cerrar}>Cancelar</Button>
        <Button variant="danger" onClick={eliminarProducto}>Eliminar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEliminacionProducto;