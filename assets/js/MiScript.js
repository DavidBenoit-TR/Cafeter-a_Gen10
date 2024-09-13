//Imprimir en consola para saber que la referencia se hizo correctamente
console.log("Hola desde MiScript.js")

//Validar la Fecha y Hora
//Una reservación no puede hacerce con menos de 2 horas de antelación
//P/E
//si es medio día (1 pm) la reservación tiene que hacerse como mínimo a las 2 pm
//esto aplica solo si es para el dái de hoy, ya que si es para mañana o un día posterior, la reservación se puede realizar en el horario del restaurante (8am - 7pm)


//Validar el total de personas
//una reservación debe tener como mínimo 1 persona, como máximo 12 personas repartidas de la siguiente manera
// Personas por reservación (contact_people) min 1, max 8
// Personas adicionales (contact_add) min 0, max 4

//Sumar en tiempo real, la cantidad de personas
//al momento de escribir o modificar las personas de la reservación, deberá actualizarce el total en la pantalla (se mostrará en el output)

//NOTA ADICIONAL
//se deberá usar Sweet Alert, para mostrar mensajes de alerta en caso de que una validación falle

var posible = false;
var esMayor = false;
var titulo, icono, msg;

function ValidarFecha() {
    //Yo no puedo reserver en un fecha menor a hoy
    var mifecha = document.getElementById("contact_fecha")
    var now = new Date(Date.now())
    //validar la fecha
    var dia = now.getDate()
    var mes = now.getMonth() + 1
    var anio = now.getFullYear()

    dia = (dia < 10) ? "0" + dia : dia
    mes = (mes < 10) ? "0" + mes : mes

    var fechaFormatted = anio + "-" + mes + "-" + dia

    if (mifecha.value < fechaFormatted) {
        //Sweet Alert
        icono = "warning"
        titulo = "Algo salió mal"
        msg = "La reservación no puede ser menor al día de hoy"
        posible = false
    } else {
        esMayor = (mifecha.value > fechaFormatted) ? true : false
        posible = true
    }
}

function validarHora() {
    var now = new Date(Date.now()); //recupero la fecha actual del server
    var timecontrol = document.getElementById('contact_hora'); //recupero un elemnto con identificador 'contact_hora'
    var horas = now.getHours() + 2 //recupero la hora actual del server
    var minutos = now.getMinutes() //recupero el minuto actual del server
    var apertura = "08:00"
    var cierre = "19:00"


    //para formatear las horas
    if (horas < 10) {
        horas = "0" + horas;
    }

    if (minutos < 10) {
        minutos = "0" + minutos;
    }

    var formatted = horas + ":" + minutos;

    console.log("Formatted: " + formatted)
    console.log("timecontrol.value: " + timecontrol.value)

    //valido que el día sea mayor a hoy
    if (esMayor) {
        //el día es mayor a hoy, valido solo apertura y cierre
        if (timecontrol.value > apertura && timecontrol.value < cierre) {
            posible = true
        }
    } else {
        //la fecha seleccionada es hoy
        if (timecontrol.value > apertura && timecontrol.value < cierre) {
            if (timecontrol.value < formatted) {
                icono = "warning"
                titulo = "Ops..."
                msg = "Una reservación debe tener 2 horas de antelación"
                posible = false
            } else {
                posible = true
            }
        } else {
            posible = false
            icono = "warning"
            titulo = "Ops..."
            msg = "Reservación fuera de Horario"
        }
        //posible = (timecontrol.value < formatted) ? false : true
    }
}

function validarNombre() {
    var nombre = document.getElementById("contact_name")
    var valor = nombre.value
    if (valor === '') {
        posible = false
        icono = "warning"
        titulo = "Vacio"
        msg = "el nombre está vacío"
    }
}

function validarCorreo() {
    var correo = document.getElementById("contact_mail")
    var valor = correo.value

    // Expresión regular para validar correo electrónico
    //A-Za-z@A-Za-z.a-z
    var expresionRegularCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (valor === '') {
        posible = false;
        icono = "warning"
        titulo = "Vacio"
        msg = "el correo está vacío"

    } else if (!expresionRegularCorreo.test(valor)) {
        posible = false;
        icono = "info"
        titulo = "Formato"
        msg = "el correo no tiene el formato correcto"
    }
}

function Sumar() {
    //Sumar el total de personas para la reservación incluidas las personas adicionales
    //Personas para rservación max.8
    //personas add mas. 4

    var personas = document.getElementById("contact_people")
    var personas_add = document.getElementById("contact_add")
    var total = document.getElementById("total")

    var a = parseInt(personas.value)
    var b = parseInt(personas_add.value)

    if (a <= 0 || b < 0) {
        posible = false
        icono = "warning"
        titulo = "Algo salió mal"
        msg = "No se pueden colocar número negativos"
        personas.value = 1
        personas_add.value = 0
        a = 1
        b = 0
    }

    total.value = a + b
}

function validar() {
    var personas = document.getElementById('contact_people')
    var personas_add = document.getElementById('contact_add')
    var timeControl = document.getElementById("contact_hora");
    var mifecha = document.getElementById("contact_fecha")

    //el vento 'blur' se ejcuta una vez que el elemnto haya perdido el foco
    personas.addEventListener('blur', validar)
    personas_add.addEventListener('blur', validar)
    timeControl.addEventListener('blur', validarHora)
    mifecha.addEventListener('blur', ValidarFecha)

    var a = parseInt(personas.value)
    var b = parseInt(personas_add.value)

    if (a > 8 || b > 4) {
        icono = "error"
        titulo = "Límite alcanzado"
        msg = "La reservación solo puede hacerse para un máximo de 12 personas (8 + 4)"
        personas.value = 1
        personas_add.value = 0
        posible = false
    } else {
        posible = true
    }

    Sumar()
    ValidarFecha()
    validarHora()
}

function enviar_formulario() {
    validarNombre()
    validarCorreo()
    if (posible) {
        mostrar("success", "Listo", "Su reservación fue realizada con éxito")
    } else {
        mostrar(icono, titulo, msg)
    }
}

function mostrar(icono, titulo, mensaje) {
    Swal.fire({
        title: titulo,
        text: mensaje,
        icon: icono
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