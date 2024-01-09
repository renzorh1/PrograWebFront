import React, { useState } from "react";
import Head from "next/head";
import Layout from "./componentes/Layout.js";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert"; // Importa el componente Alert

const Index = () => {
  const [formData, setFormData] = useState({
    usuario: "",
    contraseña: "",
    fecha: "",
  });
  const [reservationMessage, setReservationMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleReservarClick = () => {
    setReservationMessage(
      `La reserva se ha realizado con éxito. Debe ser devuelto hasta el día ${formData.fecha}`
    );
  };

  return (
    <Layout
      content={
        <>
          <Head>
            <title>Detalle del Libro</title>
          </Head>
          <Container maxWidth="md">
            <div className="dos-columnnas">
              <div className="columnna">
                <h1 className="titulo">Citas</h1>
                <p className="divisor"></p>

                <div className="cuadro_principal">
                  <h2 className="cuadro_texto_titulo cuadro_principal_titulo">
                    Software la Superbabosa
                  </h2>
                  <div className="libros">
                    <div className="autor_libro">Joyce dunbar</div>
                    <div className="disponible_info">Diponible</div>
                  </div>
                  <div className="libros">
                    <img
                      src="https://images.cdn2.buscalibre.com/fit-in/180x180/1f/a6/1fa666e0f93fb0bc63c4c214188f3a46.jpg"
                      width="184px"
                      height="151px"
                    />
                    <div className="info_libro">
                      Este libro sólo tiene un objetivo principal: provocar el
                      inicio de un nuevo campo de estudio: la programación
                      informática como actividad humana o, en pocas palabras, la
                      psicología de la programación informática. Todos los demás
                      objetivos están subordinados a éste. Por ejemplo, he
                      intentado que el libro sea interesante y no técnico, en la
                      medida de lo posible, para animar al mayor número posible de
                      personas a leerlo: no sólo programadores, sino gestores de
                      programación y otras personas relacionadas con la
                      programación en las muchas formas en que estamos relacionados
                      con la programación hoy en día. Lo que intento conseguir es
                      que el lector diga, al terminar el libro: "Sí, la programación
                      no es sólo una cuestión de hardware y software. A partir de
                      ahora tendré que ver las cosas de otra manera".
                    </div>
                    <div className="editorial_info">
                      <div>Editorial</div>
                      <div>Edebé</div>
                    </div>
                  </div>
                  <div className="topico_info">Tópicos</div>
                  <div>
                    <div className="libros">
                      <div className="etiqueta">Ingeniería de Software</div>
                      <div className="etiqueta">Progrmación Web</div>
                    </div>
                  </div>
                </div>

                <h1 className="titulo">Reservar</h1>
                <p className="divisor"></p>
                <Typography variant="h6">Ingresa una fecha límite</Typography>
                <TextField
                  type="date"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  name="fecha"
                  value={formData.fecha}
                  onChange={handleChange}
                />
                <Typography variant="body2">DD/MM/YYYY</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  className="reservar"
                  onClick={handleReservarClick}
                >
                  Reservar
                </Button>
                {reservationMessage && (
                  <Alert severity="success">{reservationMessage}</Alert>
                )}
              </div>
            </div>
          </Container>
        </>
      }
    />
  );
};

export default Index;
