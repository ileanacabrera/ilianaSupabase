import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { supabase } from "../database/supabaseconfig";
import ModalRegistroProducto from "../components/productos/ModalRegistroProducto";
import ModalEdicionProducto from "../components/productos/ModalEdicionProducto";
import NotificacionOperacion from "../components/NotificacionOperacion";
import CuadroBusquedas from "../components/busquedas/CuadroBusquedas";
import ModalEliminacionProducto from "../components/productos/ModalEliminacionProducto";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);

  const [productoEliminar, setProductoEliminar] = useState(null);
const [mostrarEliminar, setMostrarEliminar] = useState(false);

  const [productoEditar, setProductoEditar] = useState(null);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre_producto: "",
    descripcion_producto: "",
    id_categoria: "",
    precio_producto: "",
    archivo: null,
    imagen_url: "",
  });

  const abrirEliminar = (producto) => {
  setProductoEliminar(producto);
  setMostrarEliminar(true);
};

  const [toast, setToast] = useState({
    mostrar: false,
    mensaje: "",
    tipo: "",
  });

  // 🔹 Cargar datos
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    const { data: prod } = await supabase.from("productos").select("*");
    const { data: cat } = await supabase.from("categorias").select("*");

    setProductos(prod || []);
    setCategorias(cat || []);
  };

  // 🔹 Inputs
  const manejoCambioInput = (e) => {
    const { name, value } = e.target;
    setNuevoProducto((prev) => ({ ...prev, [name]: value }));
  };

  const manejoCambioArchivo = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      const preview = URL.createObjectURL(archivo);
      setNuevoProducto((prev) => ({
        ...prev,
        archivo,
        imagen_url: preview,
      }));
    }
  };

  // 🔥 AGREGAR PRODUCTO
  const agregarProducto = async () => {
    try {
      if (!nuevoProducto.nombre_producto || !nuevoProducto.id_categoria || !nuevoProducto.precio_producto || !nuevoProducto.archivo) {
        setToast({ mostrar: true, mensaje: "Faltan campos obligatorios", tipo: "advertencia" });
        return;
      }

      const nombreArchivo = `${Date.now()}_${nuevoProducto.archivo.name}`;

      // SUBIR IMAGEN
      const { error: uploadError } = await supabase.storage
        .from("imagenes_productos")
        .upload(nombreArchivo, nuevoProducto.archivo);

      if (uploadError) throw uploadError;

      // OBTENER URL
      const { data } = supabase.storage
        .from("imagenes_productos")
        .getPublicUrl(nombreArchivo);

      // INSERTAR
      const { error } = await supabase.from("productos").insert([
        {
          nombre_producto: nuevoProducto.nombre_producto,
          descripcion_producto: nuevoProducto.descripcion_producto,
          categoria_producto: parseInt(nuevoProducto.id_categoria),
          precio_venta: parseFloat(nuevoProducto.precio_producto),
          url_imagen: data.publicUrl,
        },
      ]);

      if (error) throw error;

      setToast({ mostrar: true, mensaje: "Producto guardado", tipo: "exito" });
      setMostrarModal(false);
      cargarDatos();

      // limpiar
      setNuevoProducto({
        nombre_producto: "",
        descripcion_producto: "",
        id_categoria: "",
        precio_producto: "",
        archivo: null,
        imagen_url: "",
      });

    } catch (err) {
      console.error(err);
      setToast({ mostrar: true, mensaje: err.message, tipo: "error" });
    }
  };

  // 🔥 EDITAR
  const abrirEditar = (producto) => {
    setProductoEditar(producto);
    setMostrarModalEditar(true);
  };

  // 🔍 FILTRO
  const productosFiltrados = productos.filter((p) =>
    p.nombre_producto.toLowerCase().includes(textoBusqueda.toLowerCase())
  );

  return (
    <Container className="mt-4">

      <Row className="mb-3">
        <Col><h2>Productos</h2></Col>
        <Col className="text-end">
          <Button onClick={() => setMostrarModal(true)}>Nuevo</Button>
        </Col>
      </Row>

      <CuadroBusquedas
        textoBusqueda={textoBusqueda}
        manejarCambioBusqueda={(e) => setTextoBusqueda(e.target.value)}
      />

      {/* LISTADO */}
      <Row className="mt-3">
        {productosFiltrados.map((p) => (
          <Col md={3} key={p.id_producto} className="mb-3">
            <div className="border p-2 text-center">
              <img src={p.url_imagen} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
              <h5>{p.nombre_producto}</h5>
              <p>C$ {p.precio_venta}</p>
              <Button size="sm" onClick={() => abrirEditar(p)}>Editar</Button>


              
<Button variant="danger" size="sm" onClick={() => abrirEliminar(p)}>
  Eliminar
</Button>
            </div>
          </Col>
        ))}
      </Row>

      {/* MODAL REGISTRO */}
      <ModalRegistroProducto
        mostrarModal={mostrarModal}
        setMostrarModal={setMostrarModal}
        nuevoProducto={nuevoProducto}
        manejoCambioInput={manejoCambioInput}
        manejoCambioArchivo={manejoCambioArchivo}
        agregarProducto={agregarProducto}
        categorias={categorias}
      />

      <ModalEliminacionProducto
  mostrar={mostrarEliminar}
  cerrar={() => setMostrarEliminar(false)}
  producto={productoEliminar}
  recargar={cargarDatos}
/>

      {/* MODAL EDITAR */}
      <ModalEdicionProducto
        mostrarModalEditar={mostrarModalEditar}
        setMostrarModalEditar={setMostrarModalEditar}
        productoEditar={productoEditar}
        categorias={categorias}
        recargarProductos={cargarDatos}
      />

      {/* TOAST */}
      <NotificacionOperacion
        mostrar={toast.mostrar}
        mensaje={toast.mensaje}
        tipo={toast.tipo}
        onCerrar={() => setToast({ ...toast, mostrar: false })}
      />

    </Container>
  );
};

export default Productos;