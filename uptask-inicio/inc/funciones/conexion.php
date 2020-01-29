<?php
    # Se crea conexión a la Base de Datos
    # Parámetros: host, user, password, db name.
    $conn = new mysqli('localhost', 'root', '123456', 'uptask');

    # Forma fácil de comprobar que se conectó exitosamente o no: regresa un booleano.
        // var_dump($conn->ping());
    # Forma completa de comprobar que se conectó exitosamente o no: es más detallado.
        // var_dump($conn);
    # Verificar que se haya conectado correctamente la Base de Datos.
    if ($conn->connect_error) {
        echo $conn->connect_error;
    }

    # Asegurarnos que al imprimir resultados de la BD, se muestren acentos o eñes.
    $conn->set_charset('utf8');
    