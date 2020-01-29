eventListeners();

function eventListeners() {
    document.querySelector('#formulario').addEventListener('submit', validarRegistro);
}

function validarRegistro(e) {
    /* preventDefault() hace que el formulario NO se envíe por default y NO te lleve al 'action'
       que tiene asignado. */
    e.preventDefault();
    
    var usuario = document.querySelector('#usuario').value,
        password = document.querySelector('#password').value,
        tipo = document.querySelector('#tipo').value;

    if (usuario === '' || password === '') {
        // La validación falló.
        Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: 'Ambos campos son obligatorios'
        });
    } else {
        // Los campos son correctos, mandar a ejecutar AJAX.

        // Datos que se envían al servidor
        var datos = new FormData();
        datos.append('usuario', usuario);
        datos.append('password', password);
        datos.append('accion', tipo);

        // Crear el llamado a AJAX
        var xhr = new XMLHttpRequest();
        // Abrir la conexión.
        xhr.open('POST', 'inc/modelos/modelo-admin.php', true);
        // Retorno de datos.
        xhr.onload = function () {
            if (this.status === 200) {
                var respuesta = JSON.parse(xhr.responseText);
                console.log(respuesta);
                // Si la respuesta es correcta.
                if (respuesta.respuesta === 'correcto') {
                    // Si es un nuevo usuario.
                    if (respuesta.tipo === 'crear') {
                        Swal.fire({
                            icon: 'success',
                            title: 'Usuario creado',
                            text: 'El usuario se creó correctamente'
                        }); 
                    } else if (respuesta.tipo === 'login') {
                        Swal.fire({
                            icon: 'success',
                            title: 'Login Correcto',
                            text: 'Presiona OK para abrir el dashboard'
                        })
                        .then(resultado => {
                            if (resultado.value) {
                                // Redireccionar con JavaScript. El usuario no tiene que hacer nada.
                                window.location.href = 'index.php'
                            };
                        })
                    }
                } else {
                    // Hubo un error.
                    Swal.fire({
                        icon: 'error',
                        title: '¡Error!',
                        text: 'Ha ocurrido un error'
                    });
                }
            }
        }
        // Enviar la petición.
        xhr.send(datos);
    }


}