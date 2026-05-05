import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { supabase } from "../../database/supabaseconfig";

const ModalEdicionProducto = ({
  mostrarModalEditar,
  setMostrarModalEditar,
  productoEditar,
  categorias,
  recargarProductos,
}) => {

  const [cargando, setCargando] = useState(false);
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState(productoEditar?.url_imagen);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    productoEditar[name] = value;
  };

  const manejarArchivo = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivo(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const actualizarProducto = async () => {
    if (cargando) return;

    try {
      setCargando(true);

      if (!productoEditar.nombre_producto || !productoEditar.categoria_producto || !productoEditar.precio_venta) {
        alert("Campos obligatorios faltantes");
        return;
      }

      let urlImagen = productoEditar.url_imagen;

      // 🔥 SUBIR NUEVA IMAGEN
      if (archivo) {
        const nombreArchivo = `${Date.now()}_${archivo.name}`;

        const { error: uploadError } = await supabase.storage
          .from("imagenes_productos")
          .upload(nombreArchivo, archivo);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("imagenes_productos")
          .getPublicUrl(nombreArchivo);

        urlImagen = data.publicUrl;

        // 🔥 ELIMINAR IMAGEN ANTERIOR
        if (productoEditar.url_imagen) {
          const nombreViejo = productoEditar.url_imagen.split("/").pop();
          await supabase.storage.from("imagenes_productos").remove([nombreViejo]);
        }
      }

      const { error } = await supabase
        .from("productos")
        .update({
          nombre_producto: productoEditar.nombre_producto,
          descripcion_producto: productoEditar.descripcion_producto,
          categoria_producto: parseInt(productoEditar.categoria_producto),
          precio_venta: parseFloat(productoEditar.precio_venta),
          url_imagen: urlImagen,
        })
        .eq("id_producto", productoEditar.id_producto);

      if (error) throw error;

      alert("Producto actualizado");
      setMostrarModalEditar(false);
      recargarProductos();

    } catch (err) {
      console.error(err);
      alert("Error al actualizar");
    } finally {
      setCargando(false);
    }
  };

  return (
    <Modal show={mostrarModalEditar} onHide={() => setMostrarModalEditar(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Editar Producto</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row>
          <Col md={5} className="text-center">
            <img src={preview} alt="" style={{ maxWidth: "100%" }} />
            <Form.Control type="file" onChange={manejarArchivo} />
          </Col>

          <Col md={7}>
            <Form.Control className="mb-2" name="nombre_producto" defaultValue={productoEditar?.nombre_producto} onChange={manejarCambio}/>
            <Form.Select className="mb-2" name="categoria_producto" defaultValue={productoEditar?.categoria_producto} onChange={manejarCambio}>
              {categorias.map((c) => (
                <option key={c.id_categoria} value={c.id_categoria}>{c.nombre_categoria}</option>
              ))}
            </Form.Select>
            <Form.Control className="mb-2" type="number" name="precio_venta" defaultValue={productoEditar?.precio_venta} onChange={manejarCambio}/>
            <Form.Control as="textarea" name="descripcion_producto" defaultValue={productoEditar?.descripcion_producto} onChange={manejarCambio}/>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={actualizarProducto} disabled={cargando}>
          Actualizar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEdicionProducto;