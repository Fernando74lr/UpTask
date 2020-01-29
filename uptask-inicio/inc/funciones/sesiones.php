<?php

    function usuario_autenticado () {
        if (!revisar_usuario()) {
            header('Location:login.php');
            exit(); // se cierra para que ya se pueda redireccionar
        }
    }

    function revisar_usuario () {
        return isset($_SESSION['nombre']);
    }


    // Te permite ir de una página a otra sin necesidad de loguearte todo el tiempo.
    session_start();
    usuario_autenticado();