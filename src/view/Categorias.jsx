import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";

import ModalRegistroCategoria from "../components/categorias/ModalRegistroCategoria";
import ModalEdicionCategoria from "../components/categorias/ModalEdicionCategoria";
import ModalEliminacionCategoria from "../components/categorias/ModalEliminacionCategoria";

import NotificacionOperacion from "../components/NotificacionOperacion";
import TablaCategorias from "../components/categorias/TablaCategorias";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import Paginacion from "../components/ordenamiento/Paginacion";

const Categorias = () => {

  const [categorias, setCategorias] = useState([]);
  const [categoriasFiltradas, setCategoriasFiltradas] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [textoBusqueda, setTextoBusqueda] = useState("");

  const [paginaActual, setPaginaActual] = useState(1);
  const [registrosPorPagina, setRegistrosPorPagina] = useState(5);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [mostrarModalEliminacion, setMostrarModalEliminacion] = useState(false);

  const [categoriaAEliminar, setCategoriaAEliminar] = useState(null);

  const [categoriaEditar, setCategoriaEditar] = useState({
    id_categoria: "",
    nombre_categoria: "",
    descripcion_categoria: "",
  });

  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre_categoria: "",
    descripcion_categoria: "",
  });

  const [toast, setToast] = useState({ mostrar: false, mensaje: "", tipo: "" });

  // 🔥 CARGAR
  const cargarCategorias = async () => {
    setCargando(true);
    const { data } = await supabase.from("categorias").select("*");
    setCategorias(data || []);
    setCargando(false);
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  // 🔍 BUSQUEDA
  useEffect(() => {
    if (!textoBusqueda.trim()) {
      setCategoriasFiltradas(categorias);
    } else {
      const texto = textoBusqueda.toLowerCase();
      const filtradas = categorias.filter(c =>
        c.nombre_categoria.toLowerCase().includes(texto) ||
        (c.descripcion_categoria || "").toLowerCase().includes(texto)
      );
      setCategoriasFiltradas(filtradas);
    }
    setPaginaActual(1);
  }, [textoBusqueda, categorias]);

  // 📄 PAGINACION
  const categoriasPaginadas = categoriasFiltradas.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  // ➕ AGREGAR
  const agregarCategoria = async () => {
    await supabase.from("categorias").insert([nuevaCategoria]);
    setMostrarModal(false);
    setNuevaCategoria({ nombre_categoria: "", descripcion_categoria: "" });
    cargarCategorias();
  };

  // ✏️ EDITAR
  const abrirModalEdicion = (cat) => {
    setCategoriaEditar(cat);
    setMostrarModalEdicion(true);
  };

  const actualizarCategoria = async () => {
    await supabase
      .from("categorias")
      .update(categoriaEditar)
      .eq("id_categoria", categoriaEditar.id_categoria);

    setMostrarModalEdicion(false);
    cargarCategorias();
  };

  // 🗑️ ELIMINAR
  const abrirModalEliminacion = (cat) => {
    setCategoriaAEliminar(cat);
    setMostrarModalEliminacion(true);
  };

  const eliminarCategoria = async () => {
    await supabase
      .from("categorias")
      .delete()
      .eq("id_categoria", categoriaAEliminar.id_categoria);

    setMostrarModalEliminacion(false);
    cargarCategorias();
  };

  return (
    <Container className="mt-3">

      <Row className="mb-3">
        <Col><h3>Categorías</h3></Col>
        <Col className="text-end">
          <Button onClick={() => setMostrarModal(true)}>Nueva</Button>
        </Col>
      </Row>

      <Row className="mb-3">
  <Col md={4} lg={5}>
    <CuadroBusquedas
      textoBusqueda={textoBusqueda}
      manejarCambioBusqueda={(e) => setTextoBusqueda(e.target.value)}
    />
  </Col>
</Row>

      {cargando && <Spinner />}

      {!cargando && (
        <>
          <TablaCategorias
            categorias={categoriasPaginadas}
            abrirModalEdicion={abrirModalEdicion}
            abrirModalEliminacion={abrirModalEliminacion}
          />

          <Paginacion
            registrosPorPagina={registrosPorPagina}
            totalRegistros={categoriasFiltradas.length}
            paginaActual={paginaActual}
            establecerPaginaActual={setPaginaActual}
            establecerRegistrosPorPagina={setRegistrosPorPagina}
          />
        </>
      )}

      {/* MODALES */}
      <ModalRegistroCategoria
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevaCategoria={nuevaCategoria}
        manejoCambioInput={(e) =>
          setNuevaCategoria({ ...nuevaCategoria, [e.target.name]: e.target.value })
        }
        agregarCategoria={agregarCategoria}
      />

      <ModalEdicionCategoria
        mostrarModalEdicion={mostrarModalEdicion}
        setMostrarModalEdicion={setMostrarModalEdicion}
        categoriaEditar={categoriaEditar}
        setCategoriaEditar={setCategoriaEditar}
        actualizarCategoria={actualizarCategoria}
      />

      <ModalEliminacionCategoria
        mostrarModalEliminacion={mostrarModalEliminacion}
        setMostrarModalEliminacion={setMostrarModalEliminacion}
        eliminarCategoria={eliminarCategoria}
        categoria={categoriaAEliminar}
      />

      <NotificacionOperacion {...toast} onCerrar={() => setToast({ ...toast, mostrar: false })} />

    </Container>
  );
};

export default Categorias;