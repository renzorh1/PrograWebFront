import Head from 'next/head';
import Layout from './componentes/Layout';
import { useRouter } from "next/router";
import { useState, useEffect } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { isBefore, isAfter, addDays, format, isSameDay } from 'date-fns';
import { useUserProvider } from "./context/plantillaContext";

const Resultados = () => {

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [libros, setLibros] = useState([]);
  const [libroSeleccionado, setLibroSeleccionado] = useState([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { palabraClave, buscarPorTitulo, buscarPorISBN, buscarPorAutor, buscarPorSerie } = router.query;
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [usuario, setUsuario] = useUserProvider();
  const [detalleReserva, setDetalleReserva] = useState(null);
  const [openDetalle, setOpenDetalle] = useState(false);
  
  
  const handleEliminarReserva = async () => {
    try {
      console.log(detalleReserva.id)
      console.log(detalleReserva.libroId)
      if (!detalleReserva || !detalleReserva.id) {
        console.log('Detalle de reserva no válido.');
        return;
      }

      // Enviar la solicitud al backend para eliminar la reserva
      const opcionesEliminar = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reservaId: detalleReserva.id , libroId: detalleReserva.libroId}),
      };
      console.log(opcionesEliminar)
  
      const respuestaEliminar = await fetch(`/api/reserva/eliminarReserva`, opcionesEliminar);
      console.log(respuestaEliminar)
      const resultadoEliminar = await respuestaEliminar.json();
  
      // Manejar la respuesta del servidor (puedes mostrar un mensaje, actualizar la lista de libros, etc.)
      console.log(resultadoEliminar);
  
      // Cerrar el popup después de eliminar la reserva
      handleDetalleClose();
      buscarLibro();
    } catch (error) {
      console.error('Error al eliminar la reservaaaaaaa:', error);
      // Manejar errores, por ejemplo, mostrar un mensaje al usuario
    }
  };

  const handleReservaConfirmada = async () => {
    if (selectedStartDate && selectedEndDate) {
      try {
        const reservaData = {
          libroId: libroSeleccionado.id,  // Asumiendo que `libros` es un objeto con el libro actual
          usuarioId: usuario.id,  // Asumiendo que `usuario` es el objeto de usuario actual
          fechaReserva: format(selectedStartDate, 'dd/MM/yyyy'), // Formatear la fecha de inicio
          fechaVencimiento: format(selectedEndDate, 'dd/MM/yyyy'), 
          estado: "activo"
        };
        
        console.log(reservaData)

        // Enviar la solicitud al backend para realizar la reserva
        const opcionesReserva = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reservaData),
        };
  
        const respuesta = await fetch('/api/reserva/reservar', opcionesReserva);
        const resultado = await respuesta.json();
  
        // Manejar la respuesta del servidor (puedes mostrar un mensaje, redirigir, etc.)
        console.log(resultado);

        
  
        // Cerrar el popup después de realizar la reserva
        handleClose();
        buscarLibro();
      } catch (error) {
        console.error('Error al realizar la reserva:', error);
        // Manejar errores, por ejemplo, mostrar un mensaje al usuario
      }
    } else {
      console.error('Selecciona ambas fechas.');
      // Muestra un mensaje de error si las fechas no están seleccionadas
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };

  const handleDetalleOpen = async (libroId) => {
    try {
      // Obtener el detalle de la reserva por ID de libro
      const respuesta = await fetch(`/api/reserva/detalleReserva?libroId=${libroId}`);
      const detalleReserva = await respuesta.json();
      console.log(detalleReserva)

      // Actualizar el estado con la información de detalle de la reserva
      setDetalleReserva(detalleReserva);

      // Abrir el popup de detalle
      setOpenDetalle(true);
    } catch (error) {
      console.error('Error al obtener el detalle de la reserva:', error);
      // Manejar errores, por ejemplo, mostrar un mensaje al usuario
    }
  };

  const handleDetalleClose = () => {
    setOpenDetalle(false);
  };

  const handleReservarClick = (libros,index) => {
    handleOpen();
    console.log(libros[index])
    setLibroSeleccionado(libros[index])
  };


  const handleEliminarClick = async (libroId) => {
    console.log(libroId)
    try {
      // Enviar la solicitud al backend para eliminar el libro
      const opcionesEliminar = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ libroId }),
      };
  
      const respuestaEliminar = await fetch('/api/libro/EliminarLibro', opcionesEliminar);
      const resultadoEliminar = await respuestaEliminar.json();
  
      // Manejar la respuesta del servidor (puedes mostrar un mensaje, actualizar la lista de libros, etc.)
      console.log(resultadoEliminar);
  
      // Recargar la lista de libros después de la eliminación (o puedes manejar esto de acuerdo a tus necesidades)
      buscarLibro();
    } catch (error) {
      console.error('Error al eliminar el libro:', error);
      // Manejar errores, por ejemplo, mostrar un mensaje al usuario
    }
  };

  async function buscarLibro() {

    
    const opciones = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    };
    
    const queryString = `keyword=${encodeURIComponent(palabraClave)}&buscarPorTitulo=${buscarPorTitulo}&buscarPorISBN=${buscarPorISBN}&buscarPorAutor=${buscarPorAutor}&buscarPorSerie=${buscarPorSerie}&page=${page}`;
    const request = await fetch(`/api/libro/buscar?${queryString}`, opciones);
    const data = await request.json();
    console.log(data);

    
    setLibros(data.items);
    //setYaActualizado(true);
    setTotalPages(data.totalPages)
  }


  function retroceder() {
      if (page > 1) {
          setPage(page - 1)
      }
  }

  function avanzar() {
      if (page < totalPages) {
          setPage(page + 1)
      }
  }

  useEffect(() => {
    buscarLibro()
  }, [page])



  return (
    <Layout content={
      <>
        <Head>
          <title>Resultados de la Búsqueda</title>
        </Head>
        <div className="columnna">
          {/* Agrega el ícono de la lupa */}
          <div className="header_icono_derecho">
            <SearchIcon
              style={{ cursor: 'pointer', fontSize: 24 }}
              onClick={() => router.push('/AdminBuscarLibro')}
            />
            {/* Agrega el ícono "+" */}
            <span
              style={{ cursor: 'pointer', fontSize: 24, marginLeft: '10px' }}
              onClick={() => router.push('/AdminAgregarLibro')}
            >
              +
            </span>
          </div>
          <h1 className="titulo">Resultados de la Búsqueda</h1>
          <p className="divisor"></p>
          <ul className="resultado-list-anthony">
            {libros && libros.length > 0 && libros.map((libro, index) => (
              <li key={index} className="libro">
                <h3>{libro.titulo}</h3>
                <p className="autor">Autor: {libro.autor}</p>
                <p className="anio">Año: {libro.anio}</p>
                <p className="isbn">ISBN: {libro.isbn13}</p>
                <img
                  src={libro["imagen"]}
                  alt="Portada"
                  onClick={() => {
                    buscarLibro();
                    handleDetalleOpen(libro.id);
                    setLibroSeleccionado(libro);
                }}
                />
                <button
                  className="reservar"
                  onClick={() => handleReservarClick(libros,index)}
                  disabled={libro.reserva === 'SiReservado'}
                >
                  {libro.reserva === 'SiReservado' ? 'Reservado' : 'Reservar'}
                </button>
                <button
                  className="reservar"
                  onClick={() => handleEliminarClick(libro.id)}
                  disabled={libro.reserva === 'SiReservado'}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div >
          <div >
              <button onClick={retroceder} disabled={page === 1} id="atras" >Anterior</button>
              <button onClick={avanzar} disabled={page === totalPages} id="adelante">Siguiente</button>
          </div>
          <div >
              <p id="total1">Página {page} de {totalPages}</p>
          </div>
        </div>

        {/* Popup para seleccionar fechas de reserva */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Seleccionar fechas de reserva</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Selecciona las fechas de inicio y fin para la reserva.
            </DialogContentText>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              {/* DatePicker para la fecha de inicio */}
              <DatePicker
                label="Fecha de inicio"
                value={selectedStartDate}
                onChange={(date) => setSelectedStartDate(date)}
                renderInput={(params) => <TextField {...params} />}
                shouldDisableDate={(date) => isBefore(date, new Date()) && !isSameDay(date, new Date())}
                maxDate={addDays(new Date(), 30)}
              />
              {/* DatePicker para la fecha de fin */}
              <DatePicker
                label="Fecha de fin"
                value={selectedEndDate}
                onChange={(date) => setSelectedEndDate(date)}
                renderInput={(params) => <TextField {...params} />}
                shouldDisableDate={(date) =>
                  isBefore(date, new Date()) || isAfter(date, addDays(new Date(), 30)) || isBefore(date, selectedStartDate)
                }
              />
            </LocalizationProvider>
          </DialogContent>
          <DialogActions>
            {/* Botón para cerrar el popup */}
            <Button onClick={handleClose}>Cancelar</Button>
            {/* Botón para confirmar las fechas seleccionadas */}
            <Button onClick={handleReservaConfirmada}>
              OK
            </Button>
          </DialogActions>
        </Dialog>

        {/* Popup para el detalle de reserva */}
        <Dialog open={openDetalle} onClose={handleDetalleClose}>
          <DialogTitle>Detalle de Reserva</DialogTitle>
          <DialogContent>
            <DialogContentText>
                {/* Mostrar información detallada de la reserva si está disponible */}
                {detalleReserva ? (
                  <>
                    <p>Título: {libroSeleccionado.titulo}</p>
                    <p>Fecha de Reserva: {detalleReserva.fechaReserva}</p>
                    <p>Fecha de Vencimiento: {detalleReserva.fechaVencimiento}</p>
                    <p>Usuario: {detalleReserva.usuario.nombre} {detalleReserva.usuario.apellido}</p>
                    <p>Correo del Usuario: {detalleReserva.usuario.correo}</p>
                  </>
                ) : (
                  <p>No tiene reserva activa</p>
                )}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {/* Botón para eliminar la reserva */}
            <Button onClick={handleEliminarReserva} color="secondary" disabled={!detalleReserva}>
              Eliminar Reserva
            </Button>
            {/* Botón para cerrar el popup de detalle */}
            <Button onClick={handleDetalleClose}>Cerrar</Button>
          </DialogActions>
        </Dialog>

      </>
    } />
  );
};

export default Resultados;
