import React from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";

const ModalRegistroProducto = ({
  mostrarModal,
  setMostrarModal,
  nuevoProducto,
  manejoCambioInput,
  manejoCambioArchivo,
  agregarProducto,
  categorias,
}) => {
  return (
    <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Registro de Producto</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Row>
            <Col md={5} className="text-center border-end">
              <div style={{ height: "200px" }}>
                {nuevoProducto.imagen_url ? (
                  <img src={nuevoProducto.imagen_url} style={{ maxWidth: "100%" }} />
                ) : (
                  <span>Sin imagen</span>
                )}
              </div>

              <Form.Control type="file" accept="image/*" onChange={manejoCambioArchivo} />
            </Col>

            <Col md={7}>
              <Form.Control className="mb-2" name="nombre_producto" placeholder="Nombre" value={nuevoProducto.nombre_producto} onChange={manejoCambioInput}/>
              
              <Form.Select className="mb-2" name="id_categoria" value={nuevoProducto.id_categoria} onChange={manejoCambioInput}>
                <option value="">Seleccione</option>
                {categorias.map(c => (
                  <option key={c.id_categoria} value={c.id_categoria}>{c.nombre_categoria}</option>
                ))}
              </Form.Select>

              <Form.Control className="mb-2" type="number" name="precio_producto" placeholder="Precio" value={nuevoProducto.precio_producto} onChange={manejoCambioInput}/>
              
              <Form.Control className="mb-2" as="textarea" name="descripcion_producto" placeholder="Descripción" value={nuevoProducto.descripcion_producto} onChange={manejoCambioInput}/>
            </Col>
          </Row>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={agregarProducto}>Guardar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRegistroProducto;