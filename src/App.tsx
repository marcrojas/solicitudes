import { useState, useEffect } from "react";
import {
    obtenerSolicitudes,
    crearSolicitud as crearSolicitudAPI,
    cambiarEstado as cambiarEstadoAPI,
} from "./api/solicitudes";

function App() {

    //Declaro las varibles con su estado inicial más la función para cambiar el estado
    const [nombre, setNombre] = useState("");
    const [rut, setRut] = useState("");
    const [correo, setCorreo] = useState("");
    const [tipo, setTipo] = useState("ACCESO");
    const [descripcion, setDescripcion] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");

    //Declaro un arreglo vacio
    const [solicitudes, setSolicitudes] = useState<any[]>([]);

    const [offset, setOffset] = useState(0);
    const limit = 1;

    //Obtengo los datos de la base de datos desde la API
    const cargarSolicitudes = async () => {
        const data = await obtenerSolicitudes(filtroEstado);
        setSolicitudes(data);
    };


    //Obtengo las solicitudes
    useEffect(() => {
        const fetchData = async () => {
            const data = await obtenerSolicitudes(filtroEstado);
            setSolicitudes(data);
        };

        fetchData();
    }, [filtroEstado]);


    useEffect(() => {
        const fetchData = async () => {
            const data = await obtenerSolicitudes(filtroEstado, offset);
            setSolicitudes(data);
        };

        fetchData();
    }, [filtroEstado, offset]);



    //Creo una nueva solicitud
    const crearSolicitudForm = async (e: any) => {
        e.preventDefault();

        const res = await crearSolicitudAPI({
            nombre_completo: nombre,
            rut: rut,
            correo: correo,
            tipo_solicitud: tipo,
            descripcion: descripcion,
        });

        if (res.error) {
            alert(res.error);
            return;
        }

        //Limpio los campos del formulario
        setNombre("");
        setRut("");
        setCorreo("");
        setTipo("ACCESO");
        setDescripcion("");

        //Recargo los datos
        cargarSolicitudes();
    };

    // Cambiar estado
    const cambiarEstadoSolicitud = async (id: number, estado: string) => {
        await cambiarEstadoAPI(id, estado);
        cargarSolicitudes();
    };





    return (
        <div>
            {/* NAVBAR */}
            <nav className="navbar navbar-dark bg-dark">
                <div className="container">
                    <span className="navbar-brand">Sistema de Solicitudes</span>
                </div>
            </nav>

            <div className="container mt-4">
                <div className="row">
                    {/* FORMULARIO */}
                    <div className="col-md-3">
                        <div className="card shadow">
                            <div className="card-header bg-primary text-white">
                                Crear Solicitud
                            </div>

                            <div className="card-body">
                                <form onSubmit={crearSolicitudForm}>
                                    <div className="mb-3">
                                        <label className="form-label">Nombre</label>
                                        <input
                                            className="form-control"
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Rut</label>
                                        <input
                                            className="form-control"
                                            value={rut}
                                            onChange={(e) => setRut(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Correo</label>
                                        <input
                                            className="form-control"
                                            value={correo}
                                            onChange={(e) => setCorreo(e.target.value)}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Tipo</label>
                                        <select
                                            className="form-select"
                                            value={tipo}
                                            onChange={(e) => setTipo(e.target.value)}
                                        >
                                            <option value="ACCESO">ACCESO</option>
                                            <option value="SOPORTE">SOPORTE</option>
                                            <option value="PERMISO">PERMISO</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Descripción</label>
                                        <textarea
                                            className="form-control"
                                            value={descripcion}
                                            onChange={(e) => setDescripcion(e.target.value)}
                                        />
                                    </div>

                                    <button className="btn btn-success w-100">
                                        Crear
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* TABLA */}
                    <div className="col-md-9">
                        <div className="card shadow">
                            <div className="card-header bg-secondary text-white">
                                Listado de Solicitudes
                            </div>

                            <div className="card-body">
                                {/* FILTRO */}
                                <div className="mb-3">
                                    <label className="form-label">Filtrar por estado</label>
                                    <select
                                        className="form-select"
                                        value={filtroEstado}
                                        onChange={(e) => setFiltroEstado(e.target.value)}
                                    >
                                        <option value="">Todos</option>
                                        <option value="PENDIENTE">PENDIENTE</option>
                                        <option value="APROBADA">APROBADA</option>
                                        <option value="RECHAZADA">RECHAZADA</option>
                                    </select>
                                </div>

                                {/* TABLA */}
                                <table className="table table-bordered">
                                    <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Rut</th>
                                        <th>Correo</th>
                                        <th>Tipo</th>
                                        <th>Estado</th>
                                        <th>Acciones</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {solicitudes.map((s) => (
                                        <tr key={s.id}>
                                            <td>{s.nombre_completo}</td>
                                            <td>{s.rut}</td>
                                            <td>{s.correo}</td>
                                            <td>{s.tipo_solicitud}</td>
                                            <td>{s.estado}</td>
                                            <td>
                                                {s.estado === "PENDIENTE" && (
                                                    <>
                                                        <button
                                                            className="btn btn-success btn-sm me-2"
                                                            onClick={() =>
                                                                cambiarEstadoSolicitud(s.id, "APROBADA")
                                                            }
                                                        >
                                                            Aprobar
                                                        </button>

                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() =>
                                                                cambiarEstadoSolicitud(s.id, "RECHAZADA")
                                                            }
                                                        >
                                                            Rechazar
                                                        </button>
                                                    </>
                                                )}

                                                {s.estado !== "PENDIENTE" && (
                                                    <button
                                                        className="btn btn-warning btn-sm"
                                                        onClick={() =>
                                                            cambiarEstadoSolicitud(s.id, "PENDIENTE")
                                                        }
                                                    >
                                                        Volver a pendiente
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>

                                <div className="d-flex justify-content-between mt-3">
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => setOffset(Math.max(offset - limit, 0))}
                                    >
                                        Anterior
                                    </button>

                                    <button
                                        className="btn btn-primary"
                                        onClick={() => setOffset(offset + limit)}
                                    >
                                        Siguiente
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;