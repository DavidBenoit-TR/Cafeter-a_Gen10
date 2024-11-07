$(document).ready(function () {
    // Asignar evento de 'blur' para activar las validaciones en cada campo
    $('#contact_name').on('blur', validarNombreCorreo);
    $('#contact_mail').on('blur', validarNombreCorreo);
    $('#contact_people').on('blur', validarPersonas);
    $('#contact_add').on('blur', validarPersonas);
    $('#contact_fecha').on('blur', validarFechaHora);
    $('#contact_hora').on('blur', validarFechaHora);

    // Asignar el evento 'click' al botón
    $('#miBoton').on('click', enviarFormulario);
});

// Función principal de envío del formulario
function enviarFormulario(event) {
    event.preventDefault();

    if (validarNombreCorreo() && validarPersonas() && validarFechaHora()) {
        mostrarAlerta("success", "Reservación exitosa", "La reservación se ha hecho correctamente.");
    }
}

// Validación de personas y personas adicionales
function validarPersonas() {
    const personas = parseInt($('#contact_people').val()) || 0;
    const personasAdd = parseInt($('#contact_add').val()) || 0;

    if (personas > 8 || personasAdd > 4) {
        mostrarAlerta("error", "Límite alcanzado", "La reservación solo puede hacerse para un máximo de 12 personas (8 + 4).");
        $('#contact_people').val(1); // Restablecer a valor permitido
        $('#contact_add').val(0);    // Restablecer a valor permitido
        return false;
    }

    Sumar();
    return true;
}

// Validación de nombre y correo
function validarNombreCorreo() {
    const nombre = $('#contact_name').val();
    const correo = $('#contact_mail').val();

    // Verificar que el nombre no esté vacío
    if (!nombre) {
        mostrarAlerta("warning", "Campo requerido", "Por favor, ingresa tu nombre.");
        return false;
    }

    // Validación del correo electrónico con una expresión regular
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!correo || !emailRegex.test(correo)) {
        mostrarAlerta("warning", "Correo inválido", "Por favor, ingresa un correo electrónico válido.");
        return false;
    }

    return true;
}

// Validación de la fecha y hora con condiciones adicionales
function validarFechaHora() {
    const fecha = $("#contact_fecha").val();
    const hora = $("#contact_hora").val();
    const ahora = new Date();
    const fechaReserva = new Date(`${fecha}T${hora}:00`);
    const esHoy = fechaReserva.toDateString() === ahora.toDateString();

    if (fechaReserva < ahora && !esHoy) {
        mostrarAlerta("warning", "Fecha inválida", "La reservación no puede ser para una fecha anterior a hoy.");
        return false;
    }

    if (esHoy) {
        const dosHorasDespues = new Date(ahora);
        dosHorasDespues.setHours(ahora.getHours() + 2);

        if (fechaReserva < dosHorasDespues) {
            mostrarAlerta("warning", "Tiempo insuficiente", "Para reservaciones de hoy, se requiere al menos 2 horas de anticipación.");
            return false;
        }
    }

    return true;
}

// Función para sumar el total de personas
function Sumar() {
    const personas = parseInt($('#contact_people').val()) || 0;
    const personasAdd = parseInt($('#contact_add').val()) || 0;
    $('#total').val(personas + personasAdd);
}

// Función para mostrar alertas
function mostrarAlerta(icono, titulo, mensaje) {
    Swal.fire({
        icon: icono,
        title: titulo,
        text: mensaje
    });
}


//Google Maps
function getGeo() {
    if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(geoOK, geoERROR)
    }
}

function geoOK(position) {
    console.log(position)
    showLatLong(position.coords.latitude, position.coords.longitude)
    initMap2(position.coords.latitude, position.coords.longitude)
}

function geoERROR(error) {
    if (error.code == 1) {
        console.log("El usuario negó el permiso")
        alert("El usuario negó el permiso")
    } else if (error.code == 2) {
        console.log("No se puede recuperar la Ubicación")
        alert("No se puede recuperar la Ubicación")
    } else if (error.code == 3) {
        console.log("Expiró el tiempo de respuesta")
        alert("Expiró el tiempo de respuesta")
    } else {
        console.log("Error: " + error.code)
        alert("Error: " + error.code)
    }
}

function showLatLong(lat, long) {
    var geocoder = new google.maps.Geocoder(); //esto servirá para serializar las coordenadas para el street view
    var milocalizacion = new google.maps.LatLng(lat, long); //convierte mis coordenadas en el formato para el mapa de Google
    console.log(milocalizacion)
    //Generamos la dirección
    geocoder.geocode({ 'latLng': milocalizacion }, processGeocoder);
}

function processGeocoder(result, status) {
    //imprimimos lo que estamos recibiendo en la función
    console.log(result);
    console.log(status);
    if (status == google.maps.GeocoderStatus.OK) {
        //esperamos los resultados de google para obtener una direcciónr real en lugar de solo coordenadas
        if (result[0]) {
            var direccion = result[0].formatted_address;
            //buscamos (usando JQUERY) el elemnto #direccion y colocamos la dirección que nos respondió Google
            $("#direccion").html(direccion);
        }
        else {
            error("Google no retornó ningún resultado");
        }
    }
    else {
        error("Google marcó un Error");
    }
}

let map;

async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
}

function initMap2(lat, lng) {
    //genero la información para obtener un mapa desde Google
    var miscoordenadas = new google.maps.LatLng(lat, lng);
    //configuro las opciones para mi mapa
    var mapoptions = {
        zoom: 15,
        center: miscoordenadas,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    //imprimo el mapa en pantalla
    var map = new google.maps.Map(document.getElementById("map"), mapoptions)
    //Configuro un marcador de posición par ami mapa
    new google.maps.Marker({
        position: miscoordenadas,
        map,
        title: "Hello World!"
    });

    //con Jquery asigno un tamaño al espacio del streetview
    $("#street").css("height", 300);
    //creo y configuro el streetview
    var panorama = new google.maps.StreetViewPanorama(document.getElementById("street"),
        { position: miscoordenadas, pov: { heading: 90, pitch: 5 } })
    //muestro el street view
    map.setStreetView(panorama)
    //recargo el mapa por ultima ocasión
    window.initMap = initMap;
}