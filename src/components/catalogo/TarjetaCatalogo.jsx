import React, { useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";

const TarjetaCatalogo = ({ producto }) => {

  const [mostrar, setMostrar] = useState(false);

  return (
    <>
      <Card>
        <Card.Img src={producto.url_imagen} style={{ height: "200px", objectFit: "cover" }} />

        <Card.Body>
          <Card.Title>{producto.nombre_producto}</Card.Title>
          <Card.Text>
            {String(producto.descripcion_producto).substring(0, 40)}...
          </Card.Text>
          <h5>C$ {producto.precio_venta}</h5>

          <Button onClick={() => setMostrar(true)}>Ver más</Button>
        </Card.Body>
      </Card>

      <Modal show={mostrar} onHide={() => setMostrar(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{producto.nombre_producto}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <img src={producto.url_imagen} style={{ width: "100%" }} />
          <p>{producto.descripcion_producto}</p>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TarjetaCatalogo;