const API_URL = "http://localhost/solicitudes/api/solicitudes";

//Llamada para filtrar por estado
export const obtenerSolicitudes = async (estado?: string, offset = 0) => {
    let url = `${API_URL}?limit=10&offset=${offset}`;

    if (estado) {
        url += `&estado=${estado}`;
    }

    const res = await fetch(url);
    return res.json();
};


//Llamada para crear una nueva solicitud
export const crearSolicitud = async (data: any) => {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    return res.json();
};



//Llamada para cambiar de estado
export const cambiarEstado = async (id: number, estado: string) => {
    const res = await fetch(`${API_URL}/${id}/estado`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado }),
    });

    return res.json();
};