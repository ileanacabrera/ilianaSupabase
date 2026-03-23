import React from 'react';
import { Navigate } from 'react-router-dom';

const RutaProtegida = ({ children }) => {
  // TODO: Más adelante esto dependerá del estado de autenticación real
  const estaAutenticado = true; 

  if (!estaAutenticado) {
    // Si no está autenticado, lo enviamos al login
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderizamos la vista protegida
  return children;
};

export default RutaProtegida;