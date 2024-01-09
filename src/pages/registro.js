import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useUserProvider } from "./context/plantillaContext";

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    documento: "",
    numero: "",
    correo: "",
    contrasena: "",
  });

  const router = useRouter();
  const [usuario, setUsuario] = useUserProvider();

  const registrarEstado = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const doGuardarJSON = async (e) => {
    e.preventDefault();

    const jsonObject = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      documento: formData.documento,
      numero: formData.numero,
      correo: formData.correo,
      contrasena: formData.contrasena,
    };

    const params = JSON.stringify(jsonObject);

    try {
      const peticion = await fetch("/api/Usuario/RegistrarUsuarios", {
        method: "POST",
        body: params,
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await peticion.json();

      if (data.success) {
        localStorage.setItem("usuarioNombre", formData.nombre);
        setUsuario({
          ...usuario,
          nombre: formData.nombre,
          apellido: formData.apellido,
          documento: formData.documento,
          numero: formData.numero,
          correo: formData.correo,
          contrasena: formData.contrasena,
        });


        alert("Registro Completado");
        router.push(`/AlumnoPrincipal`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // Intentar recuperar el nombre del usuario desde localStorage al cargar la página
    const storedNombre = localStorage.getItem("usuarioNombre");
    if (storedNombre) {
      setFormData({
        ...formData,
        nombre: storedNombre,
      });
    }
  }, []);

  return (
    <>
      <Head>
        <title>Registro</title>
      </Head>
      <Container maxWidth="sm">
        <Box
          sx={{
            marginTop: "50px",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" component="h1" sx={{ marginBottom: "20px" }}>
            Sistema de reserva de Libros
          </Typography>
          <Typography variant="h5" component="h2" sx={{ marginBottom: "20px" }}>
            Registro de usuario
          </Typography>
          <form onSubmit={doGuardarJSON}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="nombre"
                  variant="outlined"
                  fullWidth
                  id="nombre"
                  name="nombre"
                  onChange={registrarEstado}
                  value={formData.nombre}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="apellido"
                  variant="outlined"
                  fullWidth
                  id="apellido"
                  name="apellido"
                  onChange={registrarEstado}
                  value={formData.apellido}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Numero de Documento de Identidad"
                  variant="outlined"
                  fullWidth
                  id="documento"
                  name="documento"
                  onChange={registrarEstado}
                  value={formData.documento}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Celular"
                  variant="outlined"
                  fullWidth
                  id="numero"
                  name="numero"
                  onChange={registrarEstado}
                  value={formData.numero}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Correo Electrónico"
                  variant="outlined"
                  fullWidth
                  id="correo"
                  name="correo"
                  onChange={registrarEstado}
                  value={formData.correo}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Password"
                  variant="outlined"
                  fullWidth
                  type="password"
                  id="contrasena"
                  name="contrasena"
                  onChange={registrarEstado}
                  value={formData.contrasena}
                  required
                />
              </Grid>
              <Grid item xs={12}></Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="secondary"
                  type="submit"
                  fullWidth
                >
                  Registrar
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Container>
    </>
  );
};

export default Registro;
