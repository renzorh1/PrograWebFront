import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from './componentes/Layout1.js';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import Image from 'next/image'

const AlumnoBiblioteca = () => {
  const router = useRouter();
  const [libros, setLibros] = useState([]);

  useEffect(() => {
    // Hacer una solicitud a la API para obtener la lista de libros
    const fetchLibros = async () => {
      try {
        const response = await fetch('/api/Libro/MostrarLibros');
        if (response.ok) {
          const librosList = await response.json();
          setLibros(librosList);
        } else {
          console.error('Error al obtener la lista de libros');
        }
      } catch (error) {
        console.error('Error en la solicitud fetch:', error);
      }
    };

    fetchLibros();
  }, []); // Se ejecuta solo una vez al montar el componente

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const handleSearchClick = () => {
    // Redirige a la página de búsqueda
    router.push('/AlumnoBuscarLibro');
  };


  const listItems = libros.map((item) => (
    <div className="libro" key={item.id}>
      <div className="libro_cabecera">
        <h2>{item.titulo}</h2>
      </div>
      <div className="libro_imagen">
        <img src={item.imagen} alt={item.titulo} />
      </div>
      <div className="libro_detalle">
        <p>ISBN: {item.isbn13}</p>
        <p>Autor: {item.autor}</p>
        <p>Editorial: {item.editorial}</p>
      </div>
      <Link href="">
        <Link href="/AdminDatosPersonales">
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          className="comprar_libro"
        >
          Más información
        </Button>

        </Link>
      </Link>

      
    </div>
  ));

  return (
    <Layout content={
      <div className="main_content">
        {/* Agrega el ícono de la lupa */}
        <div className="header_icono_derecho">
          <SearchIcon
            style={{ cursor: 'pointer', fontSize: 24 }}
            onClick={handleSearchClick}
          />

        </div>
        {/* Agrega el título de bienvenida y el divisor */}
        <h1 className="titulo">Todos los libros</h1>
        <p className="divisor"></p>
        {/* Resto del contenido */}
        {listItems}
      </div>
    } />
  );
};

export default AlumnoBiblioteca;
