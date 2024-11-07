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

    initMap();
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


// Función para inicializar el mapa de Google
function initMap() {
    // Esta función será llamada cuando el script de Google Maps haya cargado correctamente
    obtenerUbicacion();
}

// Función para obtener la geolocalización
function obtenerUbicacion() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(mostrarUbicacion, mostrarError);
    } else {
        alert("La geolocalización no es soportada por este navegador.");
    }
}

// Función que se ejecuta si la geolocalización es exitosa
function mostrarUbicacion(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    // Mostrar la latitud y longitud
    console.log("Latitud: " + lat + ", Longitud: " + lon);

    // Llamar a la función para obtener la dirección
    obtenerDireccion(lat, lon);

    // Inicializar el mapa y el Street View
    initMapComponents(lat, lon);
}

// Función que se ejecuta en caso de error en la geolocalización
function mostrarError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("El usuario negó el permiso de ubicación.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("La ubicación no está disponible.");
            break;
        case error.TIMEOUT:
            alert("Se agotó el tiempo de espera.");
            break;
        default:
            alert("Error desconocido: " + error.message);
            break;
    }
}

// Función para obtener la dirección de las coordenadas
function obtenerDireccion(lat, lon) {
    const latLng = { lat: lat, lng: lon };
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ location: latLng }, function (results, status) {
        if (status === 'OK') {
            if (results[0]) {
                const direccion = results[0].formatted_address;
                // Mostrar la dirección obtenida en el HTML
                document.getElementById('direccion').innerText = "Dirección: " + direccion;
            } else {
                alert("No se encontraron resultados de dirección.");
            }
        } else {
            alert("Geocodificación fallida: " + status);
        }
    });
}

// Función para inicializar el mapa y el Street View
function initMapComponents(lat, lon) {
    const ubicacion = { lat: lat, lng: lon };

    // Inicializar el mapa
    const mapa = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: ubicacion
    });

    // Añadir un marcador en el mapa
    new google.maps.Marker({
        position: ubicacion,
        map: mapa,
        title: "Ubicación Actual"
    });

    // Configurar Street View
    const panorama = new google.maps.StreetViewPanorama(
        document.getElementById("street"), {
        position: ubicacion,
        pov: { heading: 90, pitch: 5 }
    }
    );

    // Vincular el Street View al mapa
    mapa.setStreetView(panorama);
}
