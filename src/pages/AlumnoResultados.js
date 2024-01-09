import Head from 'next/head';
import Layout from './componentes/Layout1';
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

  const [pageHistorico, setPageHistorico] = useState(1);
  const [totalPagesHistorico, setTotalPagesHistorico] = useState(1);

  const [libros, setLibros] = useState([]);
  const [libroSeleccionado, setLibroSeleccionado] = useState([]);
  const [open, setOpen] = useState(false);
  const [openDetalle, setOpenDetalle] = useState(false);
  const router = useRouter();
  const { palabraClave, buscarPorTitulo, buscarPorISBN, buscarPorAutor, buscarPorSerie } = router.query;
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [usuario, setUsuario] = useUserProvider();

  const [historialReservas, setHistorialReservas] = useState([]);
  const [openHistorial, setOpenHistorial] = useState(false);
  
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
      } catch (error) {
        console.error('Error al realizar la reserva:', error);
        // Manejar errores, por ejemplo, mostrar un mensaje al usuario
      }
    } else {
      console.error('Selecciona ambas fechas.');
      // Muestra un mensaje de error si las fechas no están seleccionadas
    }
  };

  const obtenerHistorialReservas = async (page) => {
    try {
      const codigoUsuario = usuario.id; // Asegúrate de que esta variable contenga el código de usuario
      const respuesta = await fetch(`/api/reserva/historicoReservas?codigoUsuario=${codigoUsuario}&page=${page}`);
      const data = await respuesta.json();
      setHistorialReservas(data.items);
      setTotalPagesHistorico(data.totalPages)
    } catch (error) {
      console.error('Error al obtener historial de reservas:', error);
      // Manejar errores, por ejemplo, mostrar un mensaje al usuario
    }
  };

  const handleHistorialOpen = () => {
    setOpenHistorial(true);
    // Llamar a la función que obtiene el historial de reservas del usuario desde el backend
    // y establecerlo en el estado
    obtenerHistorialReservas();
  };

  const handleHistorialClose = () => {
    setOpenHistorial(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };
  
  const handleClose = () => {
    setOpen(false);
  };

  const handleDetalleOpen = () => {
    setOpenDetalle(true);
  };

  const handleDetalleClose = () => {
    setOpenDetalle(false);
  };

  const handleDetalleClick = (libros, index) => {
    handleDetalleOpen();
    console.log(libros[index]);
    setLibroSeleccionado(libros[index]);
  };

  const handleReservarClick = (libros,index) => {
    handleOpen();
    console.log(libros[index])
    setLibroSeleccionado(libros[index])
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
    setTotalPages(data.totalPages)
  }

  const handleHistorialPageChange = (action) => {
    if (action === 'prev' && pageHistorico > 1) {
      setPageHistorico(pageHistorico - 1);
    } else if (action === 'next' && pageHistorico < totalPagesHistorico) {
      setPageHistorico(pageHistorico + 1);
    }
  };


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
    buscarLibro(),
    obtenerHistorialReservas(page)
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
              onClick={() => router.push('/AlumnoBuscarLibro')}
            />
            {/* Agrega el ícono "+" */}
            <span
              style={{ cursor: 'pointer', fontSize: 24, marginLeft: '10px' }}
              onClick={() => {
                handleHistorialOpen();
                obtenerHistorialReservas(pageHistorico);
              }}
            >
              Ver Reservas
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
                  // Abrir el diálogo de detalle al hacer clic en la imagen
                  onClick={() => handleDetalleClick(libros, index)}
                  style={{ cursor: 'pointer' }}
                />
                <a className="comprar" href={libro["urlCompra"]}>Comprar</a>
                <button
                  className="reservar"
                  onClick={() => handleReservarClick(libros,index)}
                  disabled={libro.reserva === 'SiReservado'}
                >
                  {libro.reserva === 'SiReservado' ? 'Reservado' : 'Reservar'}
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

        {/* Popup para el detalle del libro */}
      <Dialog open={openDetalle} onClose={handleDetalleClose}>
        <DialogTitle>Detalle del Libro</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {/* Mostrar información detallada del libro */}
            {libroSeleccionado ? (
              <>
                <p>Título: {libroSeleccionado.titulo}</p>
                <p>Autor: {libroSeleccionado.autor}</p>
                <p>Año: {libroSeleccionado.anio}</p>
                <p>ISBN: {libroSeleccionado.isbn13}</p>
                {/* Agrega más detalles según sea necesario */}
                <img src={libroSeleccionado.imagen} alt="Portada" />
              </>
            ) : (
              <p>No se ha seleccionado un libro</p>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* Botón para cerrar el popup de detalle */}
          <Button onClick={handleDetalleClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openHistorial} onClose={handleHistorialClose}>
        <DialogTitle>Historial de Reservas</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {/* Mostrar la lista de reservas del historial */}
            {historialReservas.map((reserva) => (
              <div key={reserva.id}>
                <p>Título: {reserva.libro.titulo}</p>
                <p>Fecha de Reserva: {reserva.fechaReserva}</p>
                <p>Fecha de Vencimiento: {reserva.fechaVencimiento}</p>
                <p>Estado: {reserva.estado}</p>
                <p>*****************************************</p>
                <br></br>
                {/* Agrega más detalles según sea necesario */}
              </div>
            ))}
          </DialogContentText>
          <div style={{ marginTop: '20px' }}>
            <button onClick={() => handleHistorialPageChange('prev')} disabled={pageHistorico === 1}>
              Anterior
            </button>
            <span>Página {pageHistorico} de {totalPagesHistorico}</span>
            <button onClick={() => handleHistorialPageChange('next')} disabled={pageHistorico === totalPagesHistorico}>
              Siguiente
            </button>
          </div>
        </DialogContent>
        <DialogActions>
          {/* Botón para cerrar el popup del historial */}
          <Button onClick={handleHistorialClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      </>
    } />
  );
};

export default Resultados;
