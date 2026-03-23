import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Login = () => {
  return (
    <Container className="mt-3">
      <Row className="align-items-center">
        <Col>
          <h2><i className="bi-box-arrow-in-right me-2"></i> Inicio de Sesión</h2>
          <p>Vista temporal para realizar pruebas de acceso en las rutas definidas.</p>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;