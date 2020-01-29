
eventListeners();
// Lista de proyectos.
var listaProyectos = document.querySelector('ul#proyectos');
function eventListeners() {
    // Document Ready.
    document.addEventListener('DOMContentLoaded', function () {
        actualizarProgreso();
    });

    // Botón para crear proyecto.
    document.querySelector('.crear-proyecto a').addEventListener('click', nuevoProyecto);

    // Boton para una nueva tarea.
    if (document.querySelector('.nueva-tarea')) {
        document.querySelector('.nueva-tarea').addEventListener('click', agregarTarea);
    }

    // Botones para las acciones de las tareas.
    document.querySelector('.listado-pendientes').addEventListener('click', accionesTareas);
}

function nuevoProyecto(e) {
    e.preventDefault();

    // Crea un <input> para el nombre del nuevo proyecto.
    var nuevoProyecto = document.createElement('li');
    nuevoProyecto.innerHTML = '<input type="text" id="nuevo-proyecto">';
    listaProyectos.appendChild(nuevoProyecto);

    // Seleccionar el ID con el nuevoProyecto.
    var inputNuevoProyecto = document.querySelector('#nuevo-proyecto');
    //  Resalta/Selecciona la entrada para poder escribir.
    inputNuevoProyecto.focus();

    // Al presionar enter crear el proyecto.
    inputNuevoProyecto.addEventListener('keypress', function(e) {
        var tecla = e.wich || e.keyCode;
        // 13 => Tecla 'Enter'.
        if (tecla === 13) {
            // Guarda el proyecto en el html y en BD.
            guardarProyectoDB(inputNuevoProyecto.value);

            // Elimina la entrada del input.
            listaProyectos.removeChild(nuevoProyecto);
        }
    });
}

// Guarda proyecto en el HTML y en Base de Datos.
function guardarProyectoDB(nombreProyecto) {
    // Crear llamado a AJAX.
    var xhr = new XMLHttpRequest();
    
    // Enviar datos por el FormData.
    var datos = new FormData();
    // append funciona con clave:valor en sus parámetros.
    datos.append('proyecto', nombreProyecto); // clave:proyecto | valor:nombreProyecto
    datos.append('accion', 'crear');

    // Abrir la conexión.
    xhr.open('POST', 'inc/modelos/modelo-proyecto.php', true);

    // En la carga.
    xhr.onload = function () {
        if (this.status === 200) {
            // Obtener datos de la respuesta.
            var respuesta = JSON.parse(xhr.responseText);
            var proyecto = respuesta.nombre_proyecto,
                id_proyecto = respuesta.id_proyecto,
                tipo = respuesta.tipo,
                resultado = respuesta.respuesta;

            // Comprobar la inserción.
            if (resultado === 'correcto') {
                // Fue exitoso.
                if (tipo === 'crear') {
                    // Se creó un nuevo proyecto.

                    // Inyectar en el HTML.
                    var nuevoProyecto = document.createElement('li');
                    nuevoProyecto.innerHTML = `
                        <a href="index.php?id_proyecto=${id_proyecto}" id="proyecto_${id_proyecto}">
                            ${proyecto}
                        </a>
                    `;
                    // Agregar al HTML.
                    listaProyectos.appendChild(nuevoProyecto);
                    // Enviar alerta.
                    Swal.fire({
                        icon: 'success',
                        title: 'Proyecto Creado',
                        text: `El proyecto: ${proyecto}, se creó correctamente`
                    }).then(resultado => {
                        if (resultado.value) {
                            // Redireccionar a la nueva URL.
                            window.location.href = `index.php?id_proyecto=${id_proyecto}`;
                        };
                    })
                } else {
                    // Se actualizó o se eliminó.
                }
            } else {
                // Hubo un error.
                Swal.fire({
                    icon: 'error',
                    title: '¡Error!',
                    text: 'Hubo un error'
                });
            }
            
        }
    }

    // Enviar el Request
    xhr.send(datos);
}

// Agregar una nueva tarea al proyecto actual
function agregarTarea (e) {
    e.preventDefault();
    var nombreTarea = document.querySelector('.nombre-tarea').value;
    
    // Validar que el campo tenga algo escrito.
    if (nombreTarea === '') {
        // Viene vacío.
        Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: 'Una tarea no puede ir vacía'
        });
    } else {
        // La tarea tiene algo, insertar en PHP.

        // Crear llamado a AJAX
        var xhr = new XMLHttpRequest();

        // Crear FormData.
        var datos = new FormData();
        datos.append('tarea', nombreTarea);
        datos.append('accion', 'crear');
        datos.append('id_proyecto', document.querySelector('#id_proyecto').value);

        // Abrir la conexión.
        xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

        // Ejecutarlo y respueta.
        xhr.onload = function () {
            if (this.status === 200) {
                // Todo correcto.
                var respuesta = JSON.parse(xhr.responseText);
                
                // Asignar valores
                var resultado = respuesta.respuesta,
                    tarea = respuesta.tarea,
                    id_insertado = respuesta.id_insertado,
                    tipo = respuesta.tipo;
                if (resultado === 'correcto') {
                    // Se agregó correctamente.
                    if (tipo === 'crear') {
                        // Lanzar alerta.
                        Swal.fire({
                            icon: 'success',
                            title: 'Tarea creada',
                            text: `La tarea: ${tarea}, se creó correctamente`
                        });

                        // Seleccionar el párrafo con la lista vacía.
                        var parrafoListaVacia = document.querySelectorAll('.lista-vacia');
                        if (parrafoListaVacia.length > 0) {
                            document.querySelector('.lista-vacia').remove();
                        }

                        // Construir Template.
                        var nuevaTarea = document.createElement('li');

                        // Agregamos el ID.
                        nuevaTarea.id = 'tarea_'+id_insertado;

                        // Agregar la clase tarea.
                        nuevaTarea.classList.add('tarea');

                        // Construir en el HTML.
                        nuevaTarea.innerHTML = `
                            <p>${tarea}</p>
                            <div class="acciones">
                                <i class="far fa-check-circle"></i>
                                <i class="fas fa-trash"></i>
                            </div>
                        `;

                        // Agregar al HTML.
                        var listado = document.querySelector('.listado-pendientes ul');
                        listado.appendChild(nuevaTarea);

                        // Limpiar formulario.
                        document.querySelector('.agregar-tarea').reset();

                        // Actualizar el progreso.
                        actualizarProgreso();
                    }
                } else {
                    // Hubo un error.
                    Swal.fire({
                        icon: 'error',
                        title: '¡Error!',
                        text: 'Hubo un error'
                    });
                }
            }
        }

        // Enviar la consulta.
        xhr.send(datos);

    }
}

// Cambia el estado de las tareas o las elimina.
function accionesTareas(e) {
    e.preventDefault();

    var idTarea = e.target.parentElement.parentElement.id.split('_');
    var textoTarea = document.querySelector('li' + '#tarea_' + idTarea[1] + ' p');

    // Delgation -> e.target. Nos dice el elemento al que el usuario dio click.
    if (e.target.classList.contains('fa-check-circle')) {
        if (e.target.classList.contains('completo')) {
            e.target.classList.remove('completo');
            cambiarEstadoTarea(e.target, 0);
            // Destachar tarea como completada.
            textoTarea.style.textDecoration = 'none';
        } else {
            e.target.classList.add('completo');
            cambiarEstadoTarea(e.target, 1);
            // Tachar tarea como completada.
            textoTarea.style.textDecoration = 'line-through';
        }
    }
    if (e.target.classList.contains('fa-trash')) {
        Swal.fire({
            title: '¿Seguro(a)?',
            text: "Esta acción no se puede deshacer.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, elimínalo',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.value) {
                var tareaEliminar = e.target.parentElement.parentElement;
                // Borrar de la Base de Datos.
                eliminarTareaBD(tareaEliminar);

                // Borrar del HTML.
                tareaEliminar.remove();
                Swal.fire(
                    '¡Eliminado!',
                    'Tu tarea ha sido eliminada.',
                    'success'
                )
            }
        })
    }
}

// Completa o descompleta una tarea.
function cambiarEstadoTarea (tarea, estado) {
    var idTarea = tarea.parentElement.parentElement.id.split('_');

    // Crear llamado a AJAX
    var xhr = new XMLHttpRequest();

    // Información.
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'actualizar');
    datos.append('estado', estado);
    
    // Abrir la conexión.
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

    // Carga de archivos.
    xhr.onload = function () {
        if (this.status === 200) {
            console.log(JSON.parse(xhr.responseText));
            // Actualizar el progreso.
            actualizarProgreso();
        }
    }

    // Enviar la petición.
    xhr.send(datos);
}

// Elimina las tareas de la Base de Datos.
function eliminarTareaBD (tarea) {
    var idTarea = tarea.id.split('_');
    
    // Crear llamado a AJAX
    var xhr = new XMLHttpRequest();

    // Información.
    var datos = new FormData();
    datos.append('id', idTarea[1]);
    datos.append('accion', 'eliminar');
    // Abrir la conexión.
    xhr.open('POST', 'inc/modelos/modelo-tareas.php', true);

    // Carga de archivos.
    xhr.onload = function () {
        if (this.status === 200) {
            console.log(JSON.parse(xhr.responseText));

            // Comprobar que haya tareas restantes.
            var listaTareasRestantes = document.querySelectorAll('li.tarea');
            if (listaTareasRestantes.length === 0) {
                document.querySelector('.listado-pendientes ul').innerHTML = "<p class='lista-vacia'>No hay tareas en este proyecto</p>";
            }

            // Actualizar el progreso.
            actualizarProgreso();
        }
    }

    // Enviar la petición.
    xhr.send(datos);
}

// Actualiza el avance del Proyecto.
function actualizarProgreso () {
    const tareas = document.querySelectorAll('li.tarea');

    // Obtener las tareas completadas
    const tareasCompletadas = document.querySelectorAll('i.completo');

    // Determinar el avance.
    const avance = Math.round((tareasCompletadas.length / tareas.length) * 100);

    // Asignar el avance a la barra.
    const porcentaje = document.querySelector('#porcentaje');
    porcentaje.style.width = avance + '%';

    if (avance === 100) {
        // Lanzar alerta.
        Swal.fire({
            icon: 'success',
            title: '¡Proyecto completado!',
            text: `Has completado todas tus tareas pendientes.`
        });
    }
    
}