<?php
    $accion = $_POST['accion'];
    $id_proyecto = (int) $_POST['id_proyecto'];
    $tarea = $_POST['tarea'];
    $estado = $_POST['estado'];
    $id_tarea = (int) $_POST['id'];

    if ($accion === 'crear') {

        // Importar la conexión
        include '../funciones/conexion.php';

        try {
            // Realizar la consulta a la Base de Datos.

            # Los prepare statement previene problemas de inyección SQL.
            $stmt = $conn->prepare("INSERT INTO tareas (nombre, id_proyecto) VALUES (?, ?) ");
            # Aquí es donde en realidad se pasan los valores.
            $stmt->bind_param('si', $tarea, $id_proyecto);
            # Ejecutamos la consulta que regresará valores.
            $stmt->execute();
            # Dar una respuesta personalizada.
            if ($stmt->affected_rows > 0) {
                $respuesta = array( 
                    'respuesta' => 'correcto',
                    # Para acceder al ID.
                    'id_insertado' => $stmt->insert_id,
                    'tipo' => $accion, 
                    'tarea' => $tarea
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

    if ($accion === 'actualizar') {
        
        // Importar la conexión
        include '../funciones/conexion.php';

        try {
            // Realizar la consulta a la Base de Datos.

            # Los prepare statement previene problemas de inyección SQL.
            $stmt = $conn->prepare("UPDATE tareas SET estado = ? WHERE id = ?");
            # Aquí es donde en realidad se pasan los valores.
            $stmt->bind_param('ii', $estado, $id_tarea);
            # Ejecutamos la consulta que regresará valores.
            $stmt->execute();
            # Dar una respuesta personalizada.
            if ($stmt->affected_rows > 0) {
                $respuesta = array( 
                    'respuesta' => 'correcto'
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

    if ($accion === 'eliminar') {
        
        // Importar la conexión
        include '../funciones/conexion.php';

        try {
            // Realizar la consulta a la Base de Datos.

            # Los prepare statement previene problemas de inyección SQL.
            $stmt = $conn->prepare("DELETE FROM tareas WHERE id = ?");
            # Aquí es donde en realidad se pasan los valores.
            $stmt->bind_param('i', $id_tarea);
            # Ejecutamos la consulta que regresará valores.
            $stmt->execute();
            # Dar una respuesta personalizada.
            if ($stmt->affected_rows > 0) {
                $respuesta = array( 
                    'respuesta' => 'correcto'
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