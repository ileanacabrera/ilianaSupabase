import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import ModalRegistroCategoria from "../components/categorias/ModalRegistroCategoria";
import NotificacionOperacion from "../components/NotificacionOperacion";
import TablaCategorias from "../components/categorias/TablaCategorias";
import TarjetaCategoria from "../components/categorias/TarjetaCategoria";
import ModalEdicionCategoria from "../components/categorias/ModalEdicionCategoria";
import ModalEliminacionCategoria from "../components/categorias/ModalEliminacionCategoria";

const Categorias = () => {

  // --- ESTADOS BASE ---
  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre_categoria: "",
    descripcion_categoria: "",
  });

  // --- ESTADOS ---
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);
  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);

  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [categoriaEditar, setCategoriaEditar] = useState({
    id_categoria: "",
    nombre_categoria: "",
    descripcion_categoria: "",
  });

  // 🔥 TARJETAS
  const [idTarjetaActiva, setIdTarjetaActiva] = useState(null);

  const alternarTarjetaActiva = (id) => {
    setIdTarjetaActiva((anterior) => (anterior === id ? null : id));
  };

  const manejarTeclaEscape = (evento) => {
    if (evento.key === "Escape") setIdTarjetaActiva(null);
  };

  useEffect(() => {
    window.addEventListener("keydown", manejarTeclaEscape);
    return () => window.removeEventListener("keydown", manejarTeclaEscape);
  }, []);

  const eliminarCategoria = async () => {
  if (!categoriaAEliminar) return;
  try {
    setMostrarModalEliminacion(false);

    const { error } = await supabase
      .from("categorias")
      .delete()
      .eq("id_categoria", categoriaAEliminar.id_categoria);

    if (error) {
      console.error("Error al eliminar categoría:", error.message);
      setToast({
        mostrar: true,
        mensaje: `Error al eliminar la categoría ${categoriaAEliminar.nombre_categoria}.`,
        tipo: "error",
      });
      return;
    }

    await cargarCategorias();
    setToast({
      mostrar: true,
      mensaje: `Categoría ${categoriaAEliminar.nombre_categoria} eliminada exitosamente.`,
      tipo: "exito",
    });
  } catch (err) {
    setToast({
      mostrar: true,
      mensaje: "Error inesperado al eliminar categoría.",
      tipo: "error",
    });
    console.error("Excepción al eliminar categoría:", err.message);
  }
};

  // --- CARGAR DATOS ---
  const cargarCategorias = async () => {
    try {
      setCargando(true);

      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .order("id_categoria", { ascending: true });

      if (error) {
        setToast({
          mostrar: true,
          mensaje: "Error al cargar categorías.",
          tipo: "error",
        });
        return;
      }

      setCategorias(data || []);
    } catch (err) {
      setToast({
        mostrar: true,
        mensaje: "Error inesperado.",
        tipo: "error",
      });
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  // --- INPUT ---
  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevaCategoria((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --- MODALES ---
  const abrirModalEdicion = (categoria) => {
    setCategoriaEditar(categoria);
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (categoria) => {
    setCategoriaAEliminar(categoria);
    setMostrarModalEliminacion(true);
  };

  // --- AGREGAR ---
  const agregarCategoria = async () => {
    try {
      if (
        !nuevaCategoria.nombre_categoria.trim() ||
        !nuevaCategoria.descripcion_categoria.trim()
      ) {
        setToast({
          mostrar: true,
          mensaje: "Debe llenar todos los campos.",
          tipo: "advertencia",
        });
        return;
      }

      const { error } = await supabase.from("categorias").insert([
        {
          nombre_categoria: nuevaCategoria.nombre_categoria,
          descripcion_categoria: nuevaCategoria.descripcion_categoria,
        },
      ]);

      if (error) {
        setToast({
          mostrar: true,
          mensaje: "Error al registrar categoría.",
          tipo: "error",
        });
        return;
      }

      setToast({
        mostrar: true,
        mensaje: "Categoría registrada exitosamente.",
        tipo: "exito",
      });

      setNuevaCategoria({ nombre_categoria: "", descripcion_categoria: "" });
      setMostrarModal(false);

      await cargarCategorias();

    } catch (err) {
      setToast({
        mostrar: true,
        mensaje: "Error inesperado.",
        tipo: "error",
      });
    }
  };

  // --- INTERFAZ ---
  return (
    <Container className="mt-3">

      <Row className="align-items-center mb-3">
        <Col xs={9}>
          <h3 className="mb-0">
            <i className="bi bi-bookmark-plus-fill me-2"></i> Categorías
          </h3>
        </Col>
        <Col xs={3} className="text-end">
          <Button onClick={() => setMostrarModal(true)}>
            <i className="bi bi-plus-lg"></i> Nueva
          </Button>
        </Col>
      </Row>

      <hr />

      {/* CARGANDO */}
      {cargando && (
        <Row className="text-center my-5">
          <Col>
            <Spinner animation="border" variant="success" />
            <p>Cargando categorías...</p>
          </Col>
        </Row>
      )}

      {/* TABLA (ESCRITORIO) */}
      {!cargando && (
        <Row>
          <Col className="d-none d-lg-block">
            <TablaCategorias
              categorias={categorias}
              abrirModalEdicion={abrirModalEdicion}
              abrirModalEliminacion={abrirModalEliminacion}
            />
          </Col>
        </Row>
      )}

      {/* TARJETAS (MÓVIL / MODERNO) */}
      {!cargando && categorias.length > 0 && (
        <Row className="mt-3">
          {categorias.map((categoria) => {
            const tarjetaActiva = idTarjetaActiva === categoria.id_categoria;

            return (
              <Col xs={12} key={categoria.id_categoria}>
                <div
                  className="mb-3 shadow-sm rounded card"
                  onClick={() => alternarTarjetaActiva(categoria.id_categoria)}
                >
                  <div className="p-2">
                    <Row className="align-items-center">

                      <Col xs={2}>
                        <i className="bi bi-bookmark fs-3 text-muted"></i>
                      </Col>

                      <Col xs={6}>
                        <div className="fw-bold">
                          {categoria.nombre_categoria}
                        </div>
                        <div className="text-muted small">
                          {categoria.descripcion_categoria}
                        </div>
                      </Col>

                      <Col xs={4} className="text-end">
                        <small>Activa</small>
                      </Col>

                    </Row>
                  </div>

                  {tarjetaActiva && (
                    <div
                      className="p-2 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        size="sm"
                        variant="warning"
                        className="me-2"
                        onClick={() => abrirModalEdicion(categoria)}
                      >
                        Editar
                      </Button>

                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => abrirModalEliminacion(categoria)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  )}
                </div>
              </Col>
            );
          })}
        </Row>
      )}

      {/* MODAL */}
      <ModalRegistroCategoria
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevaCategoria={nuevaCategoria}
        manejoCambioInput={manejoCambioInput}
        agregarCategoria={agregarCategoria}
      />

<ModalEliminacionCategoria
  mostrarModalEliminacion={mostrarModalEliminacion}
  setMostrarModalEliminacion={setMostrarModalEliminacion}
  eliminarCategoria={eliminarCategoria}
  categoria={categoriaAEliminar}
/>



      

      

      {/* NOTIFICACIÓN */}
      <NotificacionOperacion
        mostrar={toast.mostrar}
        mensaje={toast.mensaje}
        tipo={toast.tipo}
        onCerrar={() => setToast({ ...toast, mostrar: false })}
      />

    </Container>
  );
};

export default Categorias;