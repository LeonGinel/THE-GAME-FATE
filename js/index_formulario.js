
// -------------------------- DESPLEGABLES FORMULARIO PRINCIPAL ---------------------------------//

// Cargar géneros y plataformas al cargar la página
document.addEventListener("DOMContentLoaded", function() {
    cargar_opciones_generos_plataformas('../app/modelo/formulario_modelo.php?tipo=generos', 'generos');
    cargar_opciones_generos_plataformas('../app/modelo/formulario_modelo.php?tipo=plataformas', 'plataformas');
    cargar_año_lanzamiento(); // Llamamos a la función de los años
});


//-------- GENEROS Y PLATAFORMAS ----------//

// Función para cargar las opciones en los "select" (desplegables)
function cargar_opciones_generos_plataformas(url, select_id) {
    
    // Crear la solicitud AJAX con XMLHttpRequest
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);

    xhr.onload = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {  // Cuando la solicitud sea completada
            let datos = JSON.parse(xhr.responseText);   // Parsear la respuesta JSON
            let select = document.getElementById(select_id);  // Obtener el select donde se van a insertar los géneros
            
            if (select) {
                datos.forEach(function(dato) {
                    let option = document.createElement("option");
                    option.value = dato;
                    option.textContent = dato;
                    select.appendChild(option);
                });
            } else {
                console.log(`Error: No se encontró el select con id ${selectId}`);
            }    
        } else {
            console.log(`Error al cargar los datos desde ${url}`);
        };

        // Manejo de errores
        xhr.onerror = function() {
        console.log(`Error en la solicitud AJAX a ${url}`);
        };
    };

    xhr.send();
}


//-------- AÑO MÏNIMO Y MÄXIMO DE LANZAMIENTO ----------//

// Función para llenar los selectores de año de lanzamiento
function cargar_año_lanzamiento() {
    let año_minimo = document.getElementById("año_minimo");
    let año_maximo = document.getElementById("año_maximo");

    let año_actual = new Date().getFullYear(); // Obtener el año actual

    // Llenar los select con los años desde 1950 hasta la actualidad
    for (let año = 1950; año <= año_actual; año++) {
        let opcion_año_minimo = document.createElement("option");
        opcion_año_minimo.value = año;
        opcion_año_minimo.textContent = año;
        año_minimo.appendChild(opcion_año_minimo);

        let opcion_año_maximo = document.createElement("option");
        opcion_año_maximo.value = año;
        opcion_año_maximo.textContent = año;
        año_maximo.appendChild(opcion_año_maximo);
    }

    // Validación para que el usuario no seleccione un rango incorrecto
    año_minimo.addEventListener("change", function () {
        let valor_minimo = parseInt(año_minimo.value);
        let valor_maximo = parseInt(año_maximo.value);

        if (valor_minimo > valor_maximo) {
            año_maximo.value = valor_minimo; // Ajusta automáticamente el valor máximo
        }
    });

    año_maximo.addEventListener("change", function () {
        let valor_minimo = parseInt(año_minimo.value);
        let valor_maximo = parseInt(año_maximo.value);

        if (valor_minimo > valor_maximo) {
            año_minimo.value = valor_maximo; // Ajusta automáticamente el valor mínimo
        }
    });
}

