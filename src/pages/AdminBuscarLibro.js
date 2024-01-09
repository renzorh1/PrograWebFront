import { useState } from "react";
import Head from "next/head";
import Layout from "./componentes/Layout";
import { useRouter } from "next/router";

const Index = () => {
    const router = useRouter();
    const [palabraClave, setPalabraClave] = useState("");
    const [buscarPorTitulo, setBuscarPorTitulo] = useState(false);
    const [buscarPorISBN, setBuscarPorISBN] = useState(false);
    const [buscarPorAutor, setBuscarPorAutor] = useState(false);
    const [buscarPorSerie, setBuscarPorSerie] = useState(false);
    const [tipoRecurso, setTipoRecurso] = useState("");

    const handleBuscarPorTitulo = (e) => {
        setBuscarPorTitulo(e.target.checked);
    };

    const handleBuscarPorISBNChange = (e) => {
        setBuscarPorISBN(e.target.checked);
    };

    const handleTipoRecursoChange = (e) => {
        setTipoRecurso(e.target.value);
    };

    const handleBuscarPorAutorChange = (e) => {
        setBuscarPorAutor(e.target.checked);
    };

    const handleBuscarPorSerieChange = (e) => {
        setBuscarPorSerie(e.target.checked);
    };

    const handlePalabraClaveChange = (e) => {
        setPalabraClave(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.push({
            pathname: "/AdminResultados",
            query: { palabraClave, buscarPorTitulo, buscarPorISBN, buscarPorAutor, buscarPorSerie, tipoRecurso }
        });
    };

    return (
        <Layout content={
            <>
                <Head>
                    <title>Busqueda Filtros Biblioteca</title>
                </Head>
                <div className="dos-columnnas">
                    <div className="columnna">
                        <h1 className="titulo">Búsqueda</h1>
                        <p className="divisor"></p>
                        <div className="cuadro_principal">
                            <form onSubmit={handleSubmit}>
                                <div className="cuadro_fondo_formulario">
                                    <div className="formulario_input_container">
                                        <input
                                            type="text"
                                            className="formulario_input_filtro"
                                            id="palabraClaveInput"
                                            placeholder=""
                                            value={palabraClave}
                                            onChange={handlePalabraClaveChange}
                                        />
                                        <label htmlFor="palabraClaveInput" className="formulario_label">
                                            Ingresa la palabra clave
                                        </label>
                                    </div>
                                    <div className="formulario_input_container">
                                        <input
                                            type="text"
                                            className="formulario_input_filtro"
                                            id="tiporecursoInput"
                                            placeholder=""
                                            value={tipoRecurso}
                                            onChange={handleTipoRecursoChange}
                                        />
                                        <label htmlFor="tiporecursoInput" className="formulario_label">
                                            Tipo de recurso
                                        </label>
                                    </div>
                                </div>
                                <div className="cuadro_fondo_derecha_anthony">
                                    <h2 className="subtitulo_anthony">Incluir búsqueda en</h2>
                                    <ul className="lista_botones_anthony">
                                        <li>
                                            <label className="boton_marcar_anthony">
                                                <input type="checkbox" checked={buscarPorTitulo} onChange={handleBuscarPorTitulo} className="custom-checkbox"/>
                                                Título
                                            </label>
                                        </li>
                                        <li>
                                            <label className="boton_marcar_anthony">
                                                <input type="checkbox" checked={buscarPorSerie} onChange={handleBuscarPorSerieChange} className="custom-checkbox"/>
                                                Categoría
                                            </label>
                                        </li>
                                        <li>
                                            <label className="boton_marcar_anthony">
                                                <input type="checkbox" checked={buscarPorISBN} onChange={handleBuscarPorISBNChange} className="custom-checkbox"/>
                                                ISBN
                                            </label>
                                        </li>
                                        <li>
                                            <label className="boton_marcar_anthony">
                                                <input type="checkbox" checked={buscarPorAutor} onChange={handleBuscarPorAutorChange} className="custom-checkbox"/>
                                                Autor / Autores
                                            </label>
                                        </li>
                                    </ul>
                                </div>
                                <input type="reset" value="Limpiar" />
                                <input type="submit" value="Buscar" id="buscarBtn" />
                            </form>
                        </div>
                    </div>
                </div>
            </>
        } />
    );
};

export default Index;
