1. Clonar el repositorio

   git clone https://github.com/marcrojas/solicitudes.git  

2. CREATE DATABASE solicitudes;

    CREATE TABLE solicitudes ( id INT AUTO_INCREMENT PRIMARY KEY, nombre_completo VARCHAR(150) NOT NULL, rut VARCHAR(20) NOT NULL, correo VARCHAR(150) NOT NULL,       tipo_solicitud ENUM('ACCESO','SOPORTE','PERMISO') NOT NULL, descripcion TEXT NOT NULL, estado ENUM('PENDIENTE','APROBADA','RECHAZADA') NOT NULL DEFAULT            'PENDIENTE', fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ); 
   
3. Configurar conexión a base de datos  

   api/config/db.php  

   private $host = "localhost";  
   private $db = "solicitudes";  
   private $user = "root";  
   private $pass = "";  

4. Instalar dependencias  
   npm install  

5. Configurar URL de la API  
   src/api/solicitudes.ts  
   const API_URL = "http://localhost/solicitudes/api/solicitudes";  

6. Ejecutar aplicación  
   npm run dev  

7. Endpoints  
    POST /api/solicitudes  
    GET /api/solicitudes?limit=10&offset=0&estado=PENDIENTE  
    PATCH /api/solicitudes/{id}/estado  

   
