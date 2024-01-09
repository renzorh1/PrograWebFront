import React, { useState, useEffect } from "react";
import Head from 'next/head';
import Layout from './componentes/Layout1.js';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Image from 'next/image';

const AlumnoDatosPersonales = () => {
  const [usuario, setUsuario] = useState({
    id: "2",
    nombre: "",
    apellido: "",
    documento: "",
    numero: "",
  });
  const [editable, setEditable] = useState(true);
  const [guardadoCompleto, setGuardadoCompleto] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState("");

  useEffect(() => {
    const cargarDatosUsuario = async () => {
      try {
        const response = await fetch("/api/Usuario/MostrarUsuariosDatos1");
        
        if (response.ok) {
          const datosUsuarios = await response.json();
  
          if (Array.isArray(datosUsuarios) && datosUsuarios.length > 0) {
            // Aquí asumí que la nueva API devuelve un array de usuarios y tomo el primero
            setUsuario(datosUsuarios[0]);
          } else {
            console.error("Error: No se recibieron datos de usuario válidos desde la nueva API");
          }
        } else {
          console.error("Error al obtener los datos del usuario desde la nueva API");
        }
      } catch (error) {
        console.error("Error en la solicitud fetch:", error);
      }
    };
  
    cargarDatosUsuario();
  }, []);

  const handleGuardarCambios = async () => {
    try {
      // Imprimir datos antes de la solicitud para verificar
      console.log("Datos a enviar:", JSON.stringify(usuario));

      const response = await fetch("/api/Usuario/ActualizarUsuarioDatos", {
        method: "POST", // Puedes ajustar el método según tu implementación
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(usuario),
      });

      if (response.ok) {
        setGuardadoCompleto(true);
        setEditable(false);
      } else if (response.status === 400) {
        setErrorMensaje("Error: Datos incorrectos. Verifica la información ingresada.");
        console.error("Error al actualizar el usuario: Datos incorrectos");
      } else {
        setErrorMensaje("Error al actualizar el usuario. Por favor, inténtalo de nuevo más tarde.");
        console.error("Error al actualizar el usuario:", response.statusText);
      }
    } catch (error) {
      setErrorMensaje("Error interno del servidor. Por favor, inténtalo de nuevo más tarde.");
      console.error("Error en la solicitud fetch:", error);
    }
  };

  return (
    <Layout content={
      <>
        <Head>
          <title>Alumno Datos Personales</title>
        </Head>
        <div className="dos-columnnas">
          <div className="columnna">
            <h1 className="titulo">Mi Perfil</h1>
            <p className="divisor"></p>

            <div className="cuadro_principal">
              <div className="barra_horizontal">
                <li className="barra barra_navegacion barra_contenido_especial"><a href="/AlumnoDatosPersonales">Datos Personales</a></li>
                <li className="barra barra_navegacion barra_contenido_normal"><a href="/AlumnoCuenta">Cuenta</a></li>
              </div>

              <div className="imagen_izquierda">
                {/* Cambia de <img> a <Image> */}
                <Image
                  src={"/alumno.jpg"}
                  alt="Foto de perfil"
                  width={300}
                  height={300}
                />
              </div>
              <div className="formulario">
                <div className="cuadro_principal_contenido" >
                  <div className="texto_sobre_cuadro">
                    <label htmlFor="titulo">Nombre</label>
                  </div>
                  <TextField
                    type="text"
                    id="titulo"
                    className="cuadro_texto"
                    value={usuario.nombre}
                    onChange={(e) => setUsuario({ ...usuario, nombre: e.target.value })}
                    readOnly={!editable}
                  />
                </div>

                <div className="cuadro_principal_contenido">
                  <div className="texto_sobre_cuadro">
                    <label htmlFor="titulo">Apellido</label>
                  </div>
                  <TextField
                    type="text"
                    id="titulo"
                    className="cuadro_texto"
                    value={usuario.apellido}
                    onChange={(e) => setUsuario({ ...usuario, apellido: e.target.value })}
                    readOnly={!editable}
                  />
                </div>

                <div className="cuadro_principal_contenido">
                  <div className="texto_sobre_cuadro">
                    <label htmlFor="titulo">Número de Documento de Identidad</label>
                  </div>
                  <TextField
                    type="text"
                    id="titulo"
                    className="cuadro_texto"
                    value={usuario.documento}
                    onChange={(e) => setUsuario({ ...usuario, documento: e.target.value })}
                    readOnly={!editable}
                  />
                </div>

                <div className="cuadro_principal_contenido">
                  <div className="texto_sobre_cuadro">
                    <label htmlFor="titulo">Celular</label>
                  </div>
                  <TextField
                    type="text"
                    id="titulo"
                    className="cuadro_texto"
                    value={usuario.numero}
                    onChange={(e) => setUsuario({ ...usuario, numero: e.target.value })}
                    readOnly={!editable}
                  />
                </div>
                {guardadoCompleto && (
                  <p className="mensaje-guardado">¡Guardado completo!</p>
                )}

                {errorMensaje && (
                  <p className="mensaje-error">{errorMensaje}</p>
                )}

                {editable && (
                  <Button variant="contained" color="primary" onClick={handleGuardarCambios} className="boton_guardar">
                    Guardar
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    } />
  );
};

export default AlumnoDatosPersonales;
