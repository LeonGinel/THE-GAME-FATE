// ------------------------------------------------------------------------------------------------------------ //
// --------------------------------------------- MENÚ HAMBURGUESA --------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------ //

// Seleccionar los elementos
let btn_menu = document.querySelector(".head_btn-menu");
let menu = document.querySelector(".head_menu");

// Agregar evento de clic al botón ☰
btn_menu.addEventListener("click", function(evento) {
    menu.classList.toggle("open");   // Alternar la clase "open"
});

// Evento para cerrar el menú al hacer click fuera
document.addEventListener("click", function(evento) {
    if (!menu.contains(evento.target) && !btn_menu.contains(evento.target)) {
        menu.classList.remove("open");
    }
});


// ------------------------------------------------------------------------------------------------------------ //
// ---------------------------------------- CAMBIO TRANSPARENCIA HEADER --------------------------------------- //
// ------------------------------------------------------------------------------------------------------------ //

document.addEventListener("DOMContentLoaded", function () {
    let header = document.querySelector(".head");
    let contenedor = document.querySelector(".contenedor_principal");

    window.addEventListener("scroll", function () {
        let contenedorTop = contenedor.getBoundingClientRect().top;
        
        if (contenedorTop <= 90) { // 90px es la altura del header
            header.style.backgroundColor = "rgba(34, 34, 34, 0.9)"; // Color sólido
        } else {
            header.style.backgroundColor = "rgba(34, 34, 34, 0.4)"; // Color transparente
        }
    });
});


// ------------------------------------------------------------------------------------------------------------ //
// ----------------------------------------- BARRA DE BUSQUEDA HEADER ----------------------------------------- //
// ------------------------------------------------------------------------------------------------------------ //

let barra_busqueda_header = document.querySelector(".head_barra-buscador");
let resultados_busqueda_tiempo_real = document.querySelector(".resultados_busqueda_tiempo_real");

// Buscar juego en tiempo real (sugerencias del buscador)
barra_busqueda_header.addEventListener("input", function() {
    let consulta = barra_busqueda_header.value.trim();
    if (consulta.length > 0) {
        buscar_juego_formulario (consulta, resultados_busqueda_tiempo_real, barra_busqueda_header);
    } else {
        resultados_busqueda_tiempo_real.innerHTML = ""; // Limpiar si no hay texto
    }
});

// Función de búsqueda de juegos en la BD
function buscar_juego_formulario (consulta, resultados_busqueda_tiempo_real, barra_busqueda_header) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", `../app/modelo/header_modelo.php?consulta=${consulta}`, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let juegos = JSON.parse(xhr.responseText);

            resultados_busqueda_tiempo_real.innerHTML = ""; // Limpiar resultados anteriores
            resultados_busqueda_tiempo_real.style.display = "block";

            juegos.forEach(function(juego) {
                let opcion = document.createElement("div");
                opcion.classList.add("opcion_juego");
                opcion.textContent = juego.titulo;

                opcion.addEventListener("click", function() {
                    barra_busqueda_header.value = juego.titulo;
                    barra_busqueda_header.style.fontWeight = "bold"; // Simular que está seleccionado (negrita)
                    resultados_busqueda_tiempo_real.innerHTML = ""; // Limpiar después de seleccionar
                    resultados_busqueda_tiempo_real.style.display = "none";
                    
                    window.location.href = `ficha_juego.php?id_juego=${juego.id_juego}`;  // Redirigir a la ficha del juego con su id
                });

                resultados_busqueda_tiempo_real.appendChild(opcion);
            });
        }
    };

    xhr.send();

    barra_busqueda_header.addEventListener("click", function () {
        barra_busqueda_header.value = ""; // Vaciar el input
        barra_busqueda_header.style.fontWeight = "normal"; // Restaurar peso de fuente
    });
};