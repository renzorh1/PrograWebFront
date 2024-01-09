import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Link from "next/link";
import { useUserProvider } from "./context/plantillaContext";

const Index = () => {
  const [credentials, setCredentials] = useState({
    usuario: "",
    contraseña: "",
  });

  const router = useRouter();
  const [usuario, setUsuario] = useUserProvider();
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/Usuario/verificarUsuario", {
        method: "POST",
        body: JSON.stringify(credentials),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        console.log("Usuario encontrado:", userData);

        setUsuario(userData);

        console.log("Valor de userData.rol:", userData.rol);

        // Agrega este log para asegurarte de que esté entrando en el caso correcto
        console.log("Redirigiendo a:", userData.rol);

        // Redirige después de iniciar sesión según el rol
        switch (userData.rol) {
          case "administrador":
            router.push("/AdminPrincipal");
            break;
          case "alumno":
            router.push("/AlumnoPrincipal");
            break;
          default:
            // Manejar otros roles si es necesario
            break;
        }
      } else if (response.status === 401) {
        setError("Correo no registrado");
      } else {
        setError("Error en la llamada fetch");
      }
    } catch (error) {
      console.error("Error en la llamada fetch:", error);
      setError("Hubo un error en la llamada fetch.");
    }
  };

  return (
    <>
      <Head>
        <title>Iniciar Sesión</title>
      </Head>
      <Container maxWidth="sm">
        <div className="formulario_login">
          <Typography variant="h4" component="h1">
            Sistema de Reserva de Libros
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Correo"
              variant="outlined"
              fullWidth
              id="usuario"
              name="usuario"
              value={credentials.usuario}
              onChange={handleChange}
              required
              margin="normal"
            />
            <TextField
              label="Contraseña"
              variant="outlined"
              fullWidth
              type="password"
              id="contraseña"
              name="contraseña"
              value={credentials.contraseña}
              onChange={handleChange}
              required
              margin="normal"
            />

            <div className="enviar">
              <Button variant="contained" color="primary" type="submit">
                Ingresar
              </Button>
            </div>
            <Box mt={1}>
              <Link href="/registro" passHref>
                <Button variant="contained" color="secondary">
                  Registrar usuario
                </Button>
              </Link>
            </Box>
          </form>
          {error && <div className="error-message">{error}</div>}
        </div>
      </Container>
    </>
  );
};

export default Index;
