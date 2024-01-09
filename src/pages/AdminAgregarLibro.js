import { useState } from "react";
import Head from 'next/head';
import Layout from './componentes/Layout.js';

const Index = () => {
  const [formData, setFormData] = useState({
    titulo: "",
    autor: "",
    editorial: "",
    anio: "",
    idioma: "",
    ISBN13: "",
    Categoría: "",
    imagen_portada_url: "",

    url_compra: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleGuardarJSON = async (e) => {
    e.preventDefault();

    // Crear un objeto formData con los valores del formulario
    const nuevoLibro = {
      ...formData
    };

    // Realiza una solicitud POST a la API para guardar los datos
    try {
      const response = await fetch("/api/Libro/AgregarLibro", {
        method: "POST",
        body: JSON.stringify(nuevoLibro),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        alert("Libro guardado exitosamente");
        // Limpia el formulario o realiza otras acciones necesarias
        setFormData({
          titulo: "",
          autor: "",
          editorial: "",
          anio: "",
          idioma: "",
          ISBN13: "",
          imagen_portada_url: "",
          url_compra: ""
        });
      } else {
        alert("Error al guardar el libro");
      }
    } catch (error) {
      console.error("Error al guardar el libro:", error);
    }
  };

  return (
    <>
      <Head>
        <title>Administrador Buscar Libro</title>
      </Head>
      <Layout content={
        <div className="dos-columnnas">
          <div className="columnna">
            <h1 className="titulo">Agregar Nuevo Libro</h1>
            <p className="divisor"></p>
        
            <div className="cuadro_principal">
              <a className="barra barra_texto_especial barra_contenido_especial">INSERTAR NUEVO LIBRO</a>
              <img src="./biblioteca.png" className="imagen_izquierda" />
              <div className="formulario">
                <div className="cuadro_principal_contenido3">
                  <div className="texto_sobre_cuadro">
                    <label htmlFor="formato">Título</label>
                  </div>
                  <input type="text" id="titulo" className="cuadro_texto" name="formato" value={formData.titulo} onChange={handleChange} />
                </div>

                <div className="cuadro_principal_contenido3">
                  <div className="texto_sobre_cuadro">
                    <label htmlFor="autor">Autor</label>
                  </div>
                  <input type="text" id="autor" className="cuadro_texto" name="autor" value={formData.autor} onChange={handleChange} />
                </div>

                <div className="cuadro_principal_contenido">
                  <div className="texto_sobre_cuadro">
                    <label htmlFor="editorial">Editorial</label>
                  </div>
                  <input type="text" id="editorial" className="cuadro_texto" name="editorial" value={formData.editorial} onChange={handleChange} />
                </div>

                <div className="cuadro_principal_contenido">
                  <div className="texto_sobre_cuadro">
                    <label htmlFor="anio">Año</label>
                  </div>
                  <input type="text" id="anio" className="cuadro_texto" name="anio" value={formData.anio} onChange={handleChange} />
                </div>

                <div className="cuadro_principal_contenido">
                  <div className="texto_sobre_cuadro">
                    <label htmlFor="idioma">Idioma</label>
                  </div>
                  <input type="text" id="idioma" className="cuadro_texto" name="idioma" value={formData.idioma} onChange={handleChange} />
                </div>

                <div className="cuadro_principal_contenido">
                  <div className="texto_sobre_cuadro">
                    <label htmlFor="ISBN13">ISBN13</label>
                  </div>
                  <input type="text" id="ISBN13" className="cuadro_texto" name="ISBN13" value={formData.ISBN13} onChange={handleChange} />
                </div>

                <div className="cuadro_principal_contenido">
                  <div className="texto_sobre_cuadro">
                    <label htmlFor="imagen_portada_url">Imagen</label>
                  </div>
                  <input type="text" id="imagen_portada_url" className="cuadro_texto" name="imagen_portada_url" value={formData.imagen_portada_url} onChange={handleChange} />
                </div>

                <div className="cuadro_principal_contenido">
                  <div className="texto_sobre_cuadro">
                    <label htmlFor="url_compra">URL Compra</label>
                  </div>
                  <input type="text" id="url_compra" className="cuadro_texto" name="url_compra" value={formData.url_compra} onChange={handleChange} />
                </div>

                <br />
                <button className="boton_guardar3" onClick={handleGuardarJSON}>Guardar</button>
              </div>
            </div>
          </div>
        </div>
      } />
    </>
  );
};

export default Index;
