<?php
    $accion = $_POST['accion'];
    $proyecto = $_POST['proyecto'];

    if ($accion === 'crear') {

        // Importar la conexión
        include '../funciones/conexion.php';

        try {
            // Realizar la consulta a la Base de Datos.

            # Los prepare statement previene problemas de inyección SQL.
            $stmt = $conn->prepare("INSERT INTO proyectos (nombre) VALUES (?) ");
            # Aquí es donde en realidad se pasan los valores.
            $stmt->bind_param('s', $proyecto);
            # Ejecutamos la consulta que regresará valores.
            $stmt->execute();
            # Dar una respuesta personalizada.
            if ($stmt->affected_rows > 0) {
                $respuesta = array( 
                    'respuesta' => 'correcto',
                    # Para acceder al ID.
                    'id_proyecto' => $stmt->insert_id,
                    'tipo' => $accion, 
                    'nombre_proyecto' => $proyecto
                );
            } else {
                $respuesta = array(
                    'respuesta' => 'error'
                );
            }
            $stmt->close();
            $conn->close();
        } catch (Exception $e) {
            // En caso de error, toma la excepción.
            $respuesta = array(
                'error' => $e->getMessage()
              );
        }

        echo json_encode($respuesta);
    
    }