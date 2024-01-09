import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from './componentes/Layout.js';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import Image from 'next/image'

const AdminBiblioteca = () => {
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
  }, []); 

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const handleSearchClick = () => {
    router.push('/AdminBuscarLibro');
  };

  const handleAddClick = () => {

    router.push('/AdminAgregarLibro');
  };

  const handleEliminarLibro = async(isbn13) => {
    //Confirmar antes de eliminar
    const confirmacion = window.confirm('¿Estás seguro de que deseas eliminar este libro?');

    if(!confirmacion){
      return; //si se da a cancelar no sucede nada
    }

    try{
      //solicitud al back
      await fetch(`/api/AdminEliminarLibro/${isbn13}?confirmacion=true`, {
        method: 'DELETE',
      });

      //volver a mostrar libros
      const response = await fetch('api/Libro/MostrarLibros');
      if(response.ok){
        const librosList = await response.json();
        setLibros(librosList);
        console.log('Libro eliminado');
      } else {
        console.error('Error al obtener lista de libros');
      }
    } catch (error){
      console.error('Error al eliminar el libro',error);
    }
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
      <Link href="/DetalleLibroAdmin1">
        <Link href={item.urlCompra}>
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

      <Link href="/AdminEditarLibro">
        <Link href={item.urlCompra}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          className="comprar_libro"
        >
          Editar información
        </Button>

        </Link>
      </Link>

      <Link href="/AdminEliminarLibro">
        <Link href={item.urlCompra}>
          <Button 
            variant="contained"
            style={{ backgroundColor: 'red', color: 'white' }}
            fullWidth
            size="large"
            className="comprar_libro"
            >
              Eliminar libro
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
          {/* Agrega el ícono "+" */}
          <span
            style={{ cursor: 'pointer', fontSize: 24, marginLeft: '10px' }}
            onClick={handleAddClick}
          >
            +
          </span>
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

export default AdminBiblioteca;
