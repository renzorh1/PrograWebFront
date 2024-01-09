import Head from "next/head";
import Layout from "./componentes/Layout1.js";
import { useUserProvider } from "./context/plantillaContext";
  import { useState, useEffect } from "react"

  const AdminPrincipal = () => {
    const [usuario] = useUserProvider();

    const [ultimasReservas, setUltimasReservas] = useState([]) 
    const [paginasUltimasReserva, setPaginasUltimasReserva] = useState(1)
    const [totalPaginasUltimasReservas, setTotalPaginasUltimasReservas] = useState(1)

    const [reservasProximasAVencer, setReservasProximasAVencer] = useState([]);
    const [paginasReservasProximasAVencer, setPaginasReservasProximasAVencer] = useState(1);
    const [totalPaginasReservasProximasAVencer, setTotalPaginasReservasProximasAVencer] = useState(1);

  

    const cargarUltimasReservas = async () => {
      try {
        const opciones = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
  
        // Asegúrate de ajustar la ruta de la API y los parámetros según tu implementación
        console.log(usuario.id)
        const request = await fetch(`/api/reserva/ultimasReservasPorCodigo?codigoUsuario=${usuario.id}&page=${paginasUltimasReserva}`, opciones);
        const data = await request.json();
        
        console.log("Últimas Reservas:", data);
        setUltimasReservas(data.items)
        setTotalPaginasUltimasReservas(data.totalPages)
      } catch (error) {
        console.error("Error al cargar las últimas reservas", error);
      }
    };

    function retrocederUltimasReservas() {
      if (paginasUltimasReserva > 1) {
        setPaginasUltimasReserva(paginasUltimasReserva - 1)
      }
    }

    function avanzarUltimasReservas() {
        if (paginasUltimasReserva < totalPaginasUltimasReservas) {
            setPaginasUltimasReserva(paginasUltimasReserva + 1)
        }
    }


    const cargarReservasProximasAVencer = async () => {
      try {
        const opciones = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
  
        const request = await fetch(`/api/reserva/reservasProximasAVencer?codigoUsuario=${usuario.id}&page=${paginasReservasProximasAVencer}`, opciones);
        const data = await request.json();
  
        console.log("Proximas a vencer:", data);
        setReservasProximasAVencer(data.items);
        setTotalPaginasReservasProximasAVencer(data.totalPages);
        console.log(data.items)
      } catch (error) {
        console.error("Error al cargar las reservas próximas a vencer", error);
      }
    };

    function retrocederReservasProximasAVencer() {
      if (paginasReservasProximasAVencer > 1) {
        setPaginasReservasProximasAVencer(paginasReservasProximasAVencer - 1);
      }
    }
  
    function avanzarReservasProximasAVencer() {
      if (paginasReservasProximasAVencer < totalPaginasReservasProximasAVencer) {
        setPaginasReservasProximasAVencer(paginasReservasProximasAVencer + 1);
      }
    }

    useEffect(() => {
      cargarUltimasReservas();
      cargarReservasProximasAVencer();
    }, [paginasUltimasReserva, paginasReservasProximasAVencer]);
  
    

    return (
      <Layout
        content={
          <>
            <Head>
              <title>Página Principal Administrador</title>
            </Head>
            <div className="dos-columnnas">
              <div className="columnna">
                <h1 className="titulo">Bienvenido, {usuario.nombre}</h1>
                <p className="divisor"></p>
                
                <div className="cuadro_principal">
                  <h2 className="cuadro_texto_titulo cuadro_principal_titulo">
                    Últimas reservas
                  </h2>
                  <div className="cuadro_principal_contenido_doblebarra">
                    <ul className="resultado-list-index">
                    {ultimasReservas && ultimasReservas.length > 0 && ultimasReservas.map((ultimaReserva, index) => (
                      <li key={index} className="libro">
                        <h3>{ultimaReserva.libro.titulo}</h3>
                        <p className="autor">Autor: {ultimaReserva.libro.autor}</p>
                        <p className="anio">Año: {ultimaReserva.libro.anio}</p>
                        <p className="isbn">ISBN: {ultimaReserva.libro.isbn13}</p>
                        <img src={ultimaReserva.libro["imagen"]} alt="Portada" />
                        <br></br>
                      </li>
                    ))}
                    </ul>
                  </div>
                  <div >
                  <div >
                      <button onClick={retrocederUltimasReservas} disabled={paginasUltimasReserva === 1} id="atras" >Anterior</button>
                      <button onClick={avanzarUltimasReservas} disabled={paginasUltimasReserva === totalPaginasUltimasReservas} id="adelante">Siguiente</button>
                  </div>
                  <div >
                      <p id="total1">Página {paginasUltimasReserva} de {totalPaginasUltimasReservas}</p>
                  </div>
                </div>
                </div>
                <div className="cuadro_principal">
                  <h2 className="cuadro_texto_titulo cuadro_principal_titulo">
                    Proximos a vencer
                  </h2>
                  <div className="cuadro_principal_contenido_doblebarra">
                    <ul className="resultado-list-index">
                    {reservasProximasAVencer  && reservasProximasAVencer.length > 0 && reservasProximasAVencer.map((reservaProximaAVencer, index) => (
                      <li key={index} className="libro">
                        <h3>{reservaProximaAVencer.libro.titulo}</h3>
                        <p className="autor">Autor: {reservaProximaAVencer.libro.autor}</p>
                        <p className="anio">Año: {reservaProximaAVencer.libro.anio}</p>
                        <p className="isbn">ISBN: {reservaProximaAVencer.libro.isbn13}</p>
                        <img src={reservaProximaAVencer.libro.imagen} alt="Portada" />
                        <br></br>
                      </li>
                    ))}
                    </ul>
                  </div>
                  <div >
                  <div >
                      <button onClick={retrocederReservasProximasAVencer} disabled={paginasReservasProximasAVencer === 1} id="atrasMasPedidos" >Anterior</button>
                      <button onClick={avanzarReservasProximasAVencer} disabled={paginasReservasProximasAVencer === totalPaginasReservasProximasAVencer} id="adelanteMasPedidos">Siguiente</button>
                  </div>
                  <div >
                      <p id="totalMasPedidos">Página {paginasReservasProximasAVencer} de {totalPaginasReservasProximasAVencer}</p>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </>
        }
      ></Layout>
    );
  };

  export default AdminPrincipal;
