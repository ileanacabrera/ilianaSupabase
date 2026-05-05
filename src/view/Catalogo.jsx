import React, { useEffect, useState } from "react";
import { Row, Col, Container, Form } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import TarjetaCatalogo from "../components/catalogo/TarjetaCatalogo";

const Catalogo = () => {

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const { data: prod } = await supabase.from("productos").select("*");
    const { data: cat } = await supabase.from("categorias").select("*");

    setProductos(prod || []);
    setCategorias(cat || []);
  };

  const productosFiltrados = productos.filter(p =>
    filtro === "" || p.categoria_producto == filtro
  );

  return (
    <Container className="mt-4">
      <h2>Catálogo</h2>

      <Form.Select onChange={(e) => setFiltro(e.target.value)}>
        <option value="">Todas las categorías</option>
        {categorias.map(c => (
          <option key={c.id_categoria} value={c.id_categoria}>
            {c.nombre_categoria}
          </option>
        ))}
      </Form.Select>

      <Row className="mt-3">
        {productosFiltrados.map(p => (
          <Col md={3} key={p.id_producto} className="mb-3">
            <TarjetaCatalogo producto={p} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Catalogo;