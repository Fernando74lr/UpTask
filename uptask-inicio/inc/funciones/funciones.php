<?php

    // Esta función obtiene el nombre del archivo donde se está llamando.
    function obtenerPaginaActual() {
        # basename: nos regresará el nombre del archivo seleccionado.
        # SERVER: accede a los archivos donde está hospedado.
        # PHP_SELF: nos regresa el archivo actual.
        $archivo = basename($_SERVER['PHP_SELF']);
        # Reemplaza el '.php' por nada.
        $pagina = str_replace(".php", "", $archivo);

        return $pagina;
    }

    /** Consultas **/

    /* Obtener todos los proyectos */
    function obtenerProyectos() {
        include 'conexion.php';
        try {
            return $conn->query('SELECT id, nombre FROM proyectos');
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage();
            return false;  
        }
    }

    // Obtener el nombre del Proyecto.
    function obtenerNombreProyecto($id = null) {
        include 'conexion.php';
        try {
            return $conn->query("SELECT nombre FROM proyectos WHERE id = {$id}");
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage();
            return false;  
        }
    }

    // Obtener las clases del proyecto.
    function obtenerTareasProyecto($id = null) {
        include 'conexion.php';
        try {
            return $conn->query("SELECT id, nombre, estado FROM tareas WHERE id_proyecto = {$id}");
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage();
            return false;  
        }
    }
