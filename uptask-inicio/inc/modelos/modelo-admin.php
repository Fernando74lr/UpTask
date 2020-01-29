<?php
    $accion = $_POST['accion'];
    $password = $_POST['password'];
    $usuario = $_POST['usuario'];

    if ($accion === 'crear') {
        // Código para crear a los administradores

        // HASHEAR PASSWORDS

        # El valor del costo dice qué tan robusto hashea el password. El mejor es 'cost => 10'.

        # Un valor más alto hashea mejor la contraseña, pero si tienes muchos usuarios consume más en el servidor.
        $opciones = array(
            'cost' => 12
        );

        # password_hash() nos crea el password hasheado.
        # Requiere 3 parámetros: el password que quieres hashear, el algoritmo de incriptación y las opciones.
        $hash_password = password_hash($password, PASSWORD_BCRYPT, $opciones);

        // Importar la conexión
        include '../funciones/conexion.php';

        try {
            // Realizar la consulta a la Base de Datos.

            # Los prepare statement previene problemas de inyección SQL.
            $stmt = $conn->prepare("INSERT INTO usuarios (usuario, password) VALUES (?, ?) ");
            # Aquí es donde en realidad se pasan los valores.
            $stmt->bind_param('ss', $usuario, $hash_password);
            # Ejecutamos la consulta que regresará valores.
            $stmt->execute();
            # Dar una respuesta personalizada.
            if ($stmt->affected_rows > 0) {
                $respuesta = array( 
                    'respuesta' => 'correcto',
                    # Para acceder al ID.
                    'id_insertado' => $stmt->insert_id,
                    'tipo' => $accion
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

    if ($accion === 'login') {
        // Código para loguear a los administradores

        // Importar la conexión
        include '../funciones/conexion.php';

        try {
            // Seleccionar el administrador de la Base de Datos
            $stmt = $conn->prepare("SELECT usuario, id, password FROM usuarios WHERE usuario = ?");
            $stmt->bind_param('s', $usuario);
            $stmt->execute();
            // Loguear el usuario
            $stmt->bind_result($nombre_usuario, $id_usuario, $pass_usuario);
            // Ir a buscar los resultados
            $stmt->fetch();
            if ($nombre_usuario) {
                // El usuario existe, verificar el password.
                if (password_verify($password, $pass_usuario)) {
                    // Iniciar la sesión.
                    session_start();
                    $_SESSION['nombre'] = $usuario;
                    $_SESSION['id'] = $id_usuario;
                    $_SESSION['login'] = true;
                    // Login correcto.
                    $respuesta = array(
                        'respuesta' => 'correcto',
                        'nombre' => $nombre_usuario,
                        'tipo' => $accion
                    );
                } else {
                    // Login incorrecto, enviar error.
                    $respuesta = array(
                        'resultado' => 'Password Incorrecto'
                    );
                }

            } else {
                $respuesta = array(
                    'error' => 'Usuario no existe'
                );
            }
            $stmt->close();
            $conn->close();
        } catch (Exception $e) {
            // En caso de error, toma la excepción.
            $respuesta = array(
                'pass' => $e->getMessage()
            );
        }

        echo json_encode($respuesta);
    }