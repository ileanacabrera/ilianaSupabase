import React from "react";
// Importamos el componente de Bootstrap con un alias para que no choque
import { Pagination as BootstrapPagination, Row, Col, Form } from "react-bootstrap";

// Cambiamos el nombre a Paginacion (en español)
const Paginacion = ({ 
    registrosPorPagina, // Asegúrate de que coincida con Categorias.jsx
    totalRegistros,
    paginaActual,
    establecerPaginaActual,
    establecerRegistrosPorPagina 
}) => {

    // --- AQUÍ VA LA LÓGICA DE LA CAPTURA 2 (Imagen c41e56) ---
    const totalPaginas = Math.ceil(totalRegistros / registrosPorPagina);

    const cambiarPagina = (numeroPagina) => {
        if (numeroPagina >= 1 && numeroPagina <= totalPaginas) {
            establecerPaginaActual(numeroPagina);
        }
    };

    const cambiarCantidadRegistros = (evento) => {
        establecerRegistrosPorPagina(Number(evento.target.value));
        establecerPaginaActual(1);
    };

    const elementosPaginacion = [];
    const maximoPaginasAMostrar = 3;

    let paginaInicio = Math.max(1, paginaActual - Math.floor(maximoPaginasAMostrar / 2));
    let paginaFin = Math.min(totalPaginas, paginaInicio + maximoPaginasAMostrar - 1);

    if (paginaFin - paginaInicio + 1 < maximoPaginasAMostrar) {
        paginaInicio = Math.max(1, paginaFin - maximoPaginasAMostrar + 1);
    }

    for (let numeroPagina = paginaInicio; numeroPagina <= paginaFin; numeroPagina++) {
        elementosPaginacion.push(
            <BootstrapPagination.Item
                key={numeroPagina}
                active={numeroPagina === paginaActual}
                onClick={() => cambiarPagina(numeroPagina)}
            >
                {numeroPagina}
            </BootstrapPagination.Item>
        );
    }

    // --- AQUÍ VA EL RETORNO (Imagen c43040) ---
    return (
        <Row className="mt-1 align-items-center">
            <Col xs="auto">
                <Form.Select
                    size="sm"
                    value={registrosPorPagina}
                    onChange={cambiarCantidadRegistros}
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={50}>50</option>
                </Form.Select>
            </Col>

            <Col className="d-flex justify-content-center">
                <BootstrapPagination className="shadow-sm mt-2">
                    <BootstrapPagination.First onClick={() => cambiarPagina(1)} disabled={paginaActual === 1} />
                    <BootstrapPagination.Prev onClick={() => cambiarPagina(paginaActual - 1)} disabled={paginaActual === 1} />
                    
                    {paginaInicio > 1 && <BootstrapPagination.Ellipsis />}
                    {elementosPaginacion}
                    {paginaFin < totalPaginas && <BootstrapPagination.Ellipsis />}

                    <BootstrapPagination.Next onClick={() => cambiarPagina(paginaActual + 1)} disabled={paginaActual === totalPaginas} />
                    <BootstrapPagination.Last onClick={() => cambiarPagina(totalPaginas)} disabled={paginaActual === totalPaginas} />
                </BootstrapPagination>
            </Col>
        </Row>
    );
};

export default Paginacion;