<?php

class Solicitud {

    private $conn;
    private $table = "solicitudes";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function crear($data) {

        $sql = "INSERT INTO {$this->table}
            (nombre_completo, rut, correo, tipo_solicitud, descripcion, estado, fecha_creacion)
            VALUES (:nombre, :rut, :correo, :tipo, :descripcion, :estado, :fecha_creacion)";

        $stmt = $this->conn->prepare($sql);

        return $stmt->execute([
            ":nombre" => $data['nombre_completo'],
            ":rut" => $data['rut'],
            ":correo" => $data['correo'],
            ":tipo" => $data['tipo_solicitud'],
            ":descripcion" => $data['descripcion'],
            ":estado" => "PENDIENTE",
            ":fecha_creacion" => date("Y-m-d H:i:s")
        ]);
    }

    public function listar($estado, $limit, $offset) {

        $sql = "SELECT * FROM {$this->table}";

        if ($estado) {
            $sql .= " WHERE estado = :estado";
        }

        $sql .= " LIMIT :limit OFFSET :offset";

        $stmt = $this->conn->prepare($sql);

        if ($estado) {
            $stmt->bindValue(':estado', $estado);
        }

        $stmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);

        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function cambiarEstado($id, $estado) {

        $sql = "UPDATE {$this->table}
                SET estado = :estado
                WHERE id = :id";

        $stmt = $this->conn->prepare($sql);

        return $stmt->execute([
            ":estado" => $estado,
            ":id" => $id
        ]);
    }
}