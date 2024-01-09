  import { useUserProvider } from "./context/plantillaContext";
  import Head from "next/head";
  import Layout from "./componentes/Layout.js";
  import { useState, useEffect } from "react"

  const AdminPrincipal = () => {
    const [usuario] = useUserProvider();

    const [ultimasReservas, setUltimasReservas] = useState([]) 
    const [paginasUltimasReserva, setPaginasUltimasReserva] = useState(1)
    const [totalPaginasUltimasReservas, setTotalPaginasUltimasReservas] = useState(1)

    const [masPedidos, setMasPedidos] = useState([]);
    const [paginasMasPedidos, setPaginasMasPedidos] = useState(1);
    const [totalPaginasMasPedidos, setTotalPaginasMasPedidos] = useState(1);

    const cargarUltimasReservas = async () => {
      try {
        const opciones = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
  
        // Asegúrate de ajustar la ruta de la API y los parámetros según tu implementación
        const request = await fetch(`/api/reserva/ultimasReservas?page=${paginasUltimasReserva}`, opciones);
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


    const cargarMasPedidos = async () => {
      try {
        const opciones = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
    
        const request = await fetch(`/api/reserva/masPedidos?page=${paginasMasPedidos}`, opciones);
        const data = await request.json();
    
        console.log("Los más Pedidos:", data);
        setMasPedidos(data.items);
        setTotalPaginasMasPedidos(data.totalPages);
      } catch (error) {
        console.error("Error al cargar los más Pedidos", error);
      }
    };

    function retrocederMasPedidos() {
      if (paginasMasPedidos > 1) {
        setPaginasMasPedidos(paginasMasPedidos - 1);
      }
    }
    
    function avanzarMasPedidos() {
      if (paginasMasPedidos < totalPaginasMasPedidos) {
        setPaginasMasPedidos(paginasMasPedidos + 1);
      }
    }

    useEffect(() => {
      cargarUltimasReservas();
      cargarMasPedidos();
    }, [paginasUltimasReserva, paginasMasPedidos]);
  
    

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
                    Los más pedidos
                  </h2>
                  <div className="cuadro_principal_contenido_doblebarra">
                    <ul className="resultado-list-index">
                    {masPedidos && masPedidos.length > 0 && masPedidos.map((masPedido, index) => (
                      <li key={index} className="libro">
                        <h3>{masPedido['libro.titulo']}</h3>
                        <p className="autor">Autor: {masPedido['libro.autor']}</p>
                        <p className="anio">Año: {masPedido['libro.anio']}</p>
                        <p className="isbn">ISBN: {masPedido['libro.isbn13']}</p>
                        <img src={masPedido['libro.imagen']} alt="Portada" />
                        <br></br>
                      </li>
                    ))}
                    </ul>
                  </div>
                  <div >
                  <div >
                      <button onClick={retrocederMasPedidos} disabled={paginasMasPedidos === 1} id="atrasMasPedidos" >Anterior</button>
                      <button onClick={avanzarMasPedidos} disabled={paginasMasPedidos === totalPaginasMasPedidos} id="adelanteMasPedidos">Siguiente</button>
                  </div>
                  <div >
                      <p id="totalMasPedidos">Página {paginasMasPedidos} de {totalPaginasMasPedidos}</p>
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
