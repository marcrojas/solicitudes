<?php

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PATCH, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Manejo de preflight (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once "config/db.php";
require_once "models/Solicitud.php";

$db = (new Database())->connect();
$solicitud = new Solicitud($db);

$method = $_SERVER['REQUEST_METHOD'];

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
// Limpiar URI (importante en Laragon)
$uri = str_replace('/solicitudes/api', '', $uri);


// Obtener body JSON
$data = json_decode(file_get_contents("php://input"), true);

// ----------------------
// POST /solicitudes
// ----------------------
if ($method === "POST" && $uri === "/solicitudes") {

    // VALIDACIONES
    if (
        empty($data['nombre_completo']) ||
        empty($data['rut']) ||
        empty($data['correo']) ||
        empty($data['tipo_solicitud']) ||
        empty($data['descripcion'])
    ) {
        http_response_code(400);
        echo json_encode(["error" => "Todos los campos son obligatorios"]);
        exit;
    }

    // REGLA DE NEGOCIO
    if ($data['tipo_solicitud'] === "PERMISO" && strlen($data['descripcion']) < 20) {
        http_response_code(400);
        echo json_encode(["error" => "Descripción mínima 20 caracteres"]);
        exit;
    }

    $solicitud->crear($data);

    echo json_encode(["success" => true]);
    exit;
}

// ----------------------
// GET /solicitudes
// ----------------------
if ($method === "GET" && $uri === "/solicitudes") {

    $estado = $_GET['estado'] ?? null;
    $limit = $_GET['limit'] ?? 10;
    $offset = $_GET['offset'] ?? 0;

    $data = $solicitud->listar($estado, $limit, $offset);

    echo json_encode($data);
    exit;
}

// ----------------------
// PATCH /solicitudes/{id}/estado
// ----------------------
if ($method === "PATCH" && preg_match('/\/solicitudes\/(\d+)\/estado/', $uri, $matches)) {

    $id = $matches[1];
    $estado = $data['estado'] ?? null;

    $estadosValidos = ['PENDIENTE', 'APROBADA', 'RECHAZADA'];

    if (!in_array($estado, $estadosValidos)) {
        http_response_code(400);
        echo json_encode(["error" => "Estado inválido"]);
        exit;
    }

    $solicitud->cambiarEstado($id, $estado);

    echo json_encode(["success" => true]);
    exit;
}

// ----------------------
http_response_code(404);
echo json_encode(["error" => "Ruta no encontrada"]);