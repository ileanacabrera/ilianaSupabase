import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import ModalRegistroCategoria from "../components/categorias/ModalRegistroCategoria";
import NotificacionOperacion from "../components/NotificacionOperacion";
import TablaCategorias from "../components/categorias/TablaCategorias";

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

  // --- MÉTODO DE CARGA (DE LA IMAGEN) ---
  const cargarCategorias = async () => {
    try {
      setCargando(true);

      const { data, error } = await supabase
        .from("categorias")
        .select("*")
        .order("id_categoria", { ascending: true });

      if (error) {
        console.error("Error al cargar categorías:", error.message);
        setToast({
          mostrar: true,
          mensaje: "Error al cargar categorías.",
          tipo: "error",
        });
        return;
      }

      setCategorias(data || []);

    } catch (err) {
      console.error("Excepción al cargar categorías:", err.message);
      setToast({
        mostrar: true,
        mensaje: "Error inesperado al cargar categorías.",
        tipo: "error",
      });

    } finally {
      setCargando(false);
    }        
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  // --- MANEJADORES ---
  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevaCategoria((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --- MÉTODOS ---
  const abrirModalEdicion = (categoria) => {
    setCategoriaEditar({
      id_categoria: categoria.id_categoria,
      nombre_categoria: categoria.nombre_categoria,
      descripcion_categoria: categoria.descripcion_categoria,
    });
    setMostrarModalEdicion(true);
  };

  const abrirModalEliminacion = (categoria) => {
    setCategoriaAEliminar(categoria);
    setMostrarModalEliminacion(true);
  };

  
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
        mensaje: `Categoría "${nuevaCategoria.nombre_categoria}" registrada exitosamente.`,
        tipo: "exito",
      });

      setNuevaCategoria({ nombre_categoria: "", descripcion_categoria: "" });
      setMostrarModal(false);

    
    await cargarCategorias();
      cargarCategorias(); // 🔥 ahora usa el nuevo método

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

      {/* Spinner mientras se cargan las categorías */}
{cargando && (
  <Row className="text-center my-5">
    <Col>
      <Spinner animation="border" variant="success" size="lg" />
      <p className="mt-3 text-muted">Cargando categorías...</p>
    </Col>
  </Row>
)}

{/* Lista de categorías cargadas */}
{!cargando && categorias.length > 0 && (
  <Row>
    <Col lg={12} className="d-none d-lg-block">
      <TablaCategorias
        categorias={categorias}
        abrirModalEdicion={abrirModalEdicion}
        abrirModalEliminacion={abrirModalEliminacion}
      />
    </Col>
  </Row>
)}

      {cargando ? (
        <div className="text-center">
          <h4>Cargando categorías...</h4>
          <Spinner animation="border" variant="success" />
        </div>
      ) : (
        <TablaCategorias
          Categorias={categorias}
          abrirModalEdicion={abrirModalEdicion}
          abrirModalEliminacion={abrirModalEliminacion}
        />
      )}

      <ModalRegistroCategoria
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevaCategoria={nuevaCategoria}
        manejoCambioInput={manejoCambioInput}
        agregarCategoria={agregarCategoria}
      />

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