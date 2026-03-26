import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../database/supabaseconfig";
import FormularioLogin from "../components/login/FormularioLogin";

const Login = () => {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState(null);

  const navegar = useNavigate();

  const iniciarSesion = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: usuario,
        password: contrasena,
      });

      if (error) {
        setError("Usuario o contraseña incorrectos");
        return;
      }

      if (data.user) {
        localStorage.setItem("usuario-supabase", usuario);
        navegar("/");
      }
    } catch (err) {
      setError("Error al conectar con el servidor");
      console.error(err);
    }
  };

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario-supabase");
    if (usuarioGuardado) {
      navegar("/");
    }
  }, [navegar]);

  // 👇 ESTILO QUE TE FALTABA
  const estiloContenedor = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f5f5f5",
  };

  return (
    <div style={estiloContenedor}>
      <FormularioLogin
        usuario={usuario}
        contrasena={contrasena}
        error={error}
        setUsuario={setUsuario}
        setContrasena={setContrasena}
        iniciarSesion={iniciarSesion}
      />
    </div>
  );
};

export default Login;