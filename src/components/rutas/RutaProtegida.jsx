import React from 'react';
import { Navigate } from 'react-router-dom';

const RutaProtegida = ({ children }) => {
  
  const estaLogueado= !!localStorage.getItem("usuario-supabase"); 

  //Log para depuracion 
  console .log("Usuario autenticado:" ,estaLogueado);

  //si esta aunteticado,redirige ala pagina de login 
  return estaLogueado ? children :<Navigate to="/login " replace/>;
    

  };

  
export default RutaProtegida;