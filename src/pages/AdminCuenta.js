import React, { useState, useEffect } from "react";
import Head from 'next/head';
import Layout from './componentes/Layout.js';
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Image from 'next/image';

const AdminCuenta = () => {
  const [usuario, setUsuario] = useState({
    id: "1",
    correo: "",
    contrasena: "",
  });
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [editable, setEditable] = useState(true);
  const [guardadoCompleto, setGuardadoCompleto] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState("");

  useEffect(() => {
    const cargarDatosUsuario = async () => {
      try {
        const response = await fetch("/api/Usuario/MostrarUsuariosDatos");
        
        if (response.ok) {
          const datosUsuarios = await response.json();
  
          if (Array.isArray(datosUsuarios) && datosUsuarios.length > 0) {
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

  const handleImagenChange = (event) => {
    const imagen = event.target.files[0];
    if (imagen) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenSeleccionada(reader.result);
      };
      reader.readAsDataURL(imagen);
    }
  };

  const handleGuardarCambios = async () => {
    try {
      // Imprimir datos antes de la solicitud para verificar
      console.log("Datos a enviar:", JSON.stringify(usuario));

      const response = await fetch("/api/Usuario/EditarUsuariosCuenta", {
        method: "POST",
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
        console.error("Error al actualizar la cuenta: Datos incorrectos");
      } else {
        setErrorMensaje("Error al actualizar la cuenta. Por favor, inténtalo de nuevo más tarde.");
        console.error("Error al actualizar la cuenta:", response.statusText);
      }
      
      console.log("Datos a enviar:", JSON.stringify({ id: usuario.id, nuevaFotoUrl: imagenSeleccionada }));
      if (imagenSeleccionada) {
      const fotoResponse = await fetch("/api/Usuario/ActualizarFotoUsuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: usuario.id, nuevaFotoUrl: imagenSeleccionada }),
      });

      if (!fotoResponse.ok) {
        console.error("Error al actualizar la URL de la foto:", fotoResponse.statusText);
        }
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
          <title>Administrador Buscar Cuenta</title>
        </Head>
        <div className="dos-columnnas">
          <div className="columnna">
            <h1 className="titulo">Mi Perfil</h1>
            <p className="divisor"></p>

            <div className="cuadro_principal">
              <div className="barra_horizontal">
                <li className="barra barra_navegacion barra_contenido_normal"><a href="/AdminDatosPersonales">Datos Personales</a></li>
                <li className="barra barra_navegacion barra_contenido_especial"><a href="/AdminCuenta">Cuenta</a></li>
              </div>

              <div className="imagen_izquierda">
                {/* Cambia de <img> a <Image> */}
                <Image
                  src={"/admin.jpg"}
                  alt="Foto de perfil"
                  width={300}
                  height={300}
                />
                {/* Input de tipo file para seleccionar una imagen */}
                <input type="file" accept="image/*" onChange={handleImagenChange} />
              </div>

              <div className="formulario">
              <div className="cuadro_principal_contenido2">
  <div className="texto_sobre_cuadro">
    <label htmlFor="correo">Correo Electrónico</label>
  </div>
  <TextField
    type="text"
    id="correo"
    className="cuadro_texto"
    value={usuario.correo}
    onChange={(e) => setUsuario({ ...usuario, correo: e.target.value })}
  />
</div>

<div className="cuadro_principal_contenido2">
  <div className="texto_sobre_cuadro">
    <label htmlFor="contrasena">Contraseña</label>
  </div>
  <TextField
    type="password"
    id="contrasena"
    className="cuadro_texto"
    value={usuario.contrasena}
    onChange={(e) => setUsuario({ ...usuario, contrasena: e.target.value })}
  />
</div>
<div className="cuadro_principal_contenido2">
  <div className="texto_sobre_cuadro">
    <label htmlFor="imagenUrl">Imagen URL</label>
  </div>
  <TextField
    type="text"
    id="imagenUrl"
    className="cuadro_texto"
    value={imagenSeleccionada}
    onChange={(e) => setImagenSeleccionada(e.target.value)}
  />
</div>

{/* Botón o función para guardar los cambios */}
<Button variant="contained" color="primary" onClick={handleGuardarCambios} className="boton_guardar2">
  Guardar
</Button>
              </div>
            </div>
          </div>
        </div>
      </>
    } />
  );
};

export default AdminCuenta;
