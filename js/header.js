// ------------------------------------------------------------------------------------------------------------ //
// ------------------------------------------------- ELEMENTOS ------------------------------------------------ //
// ------------------------------------------------------------------------------------------------------------ //

let btn_menu = document.querySelector(".head_btn-menu");
let menu = document.querySelector(".head_menu");
let barra_busqueda_header = document.querySelector(".head_barra-buscador");
let resultados_busqueda_tiempo_real = document.querySelector(".resultados_busqueda_tiempo_real");

// ------------------------------------------------------------------------------------------------------------ //
// --------------------------------------------- MENÚ HAMBURGUESA --------------------------------------------- //
// ------------------------------------------------------------------------------------------------------------ //

// Agregar evento de clic al botón ☰
btn_menu.addEventListener("click", function (e) {
  e.stopPropagation();
  menu.classList.toggle("open");
});

// ------------------------------------------------------------------------------------------------------------ //
// --------------------------- CIERRE AL HACER CLICK FUERA (MENU Y BUSCADOR) --------------------------- //
// ------------------------------------------------------------------------------------------------------------ //

document.addEventListener("click", (e) => {
  // cerrar menú si click fuera
  if (!menu.contains(e.target) && !btn_menu.contains(e.target)) {
    menu.classList.remove("open");
  }

  // cerrar resultados si click fuera
  if (!barra_busqueda_header.contains(e.target) && !resultados_busqueda_tiempo_real.contains(e.target)) {
    resultados_busqueda_tiempo_real.style.display = "none";
  }
});

// Evitar cierre al hacer click dentro
barra_busqueda_header.addEventListener("click", (e) => e.stopPropagation());
resultados_busqueda_tiempo_real.addEventListener("click", (e) => e.stopPropagation());

// ------------------------------------------------------------------------------------------------------------ //
// ----------------------------------------- BARRA DE BUSQUEDA HEADER ----------------------------------------- //
// ------------------------------------------------------------------------------------------------------------ //

// Buscar juego en tiempo real (sugerencias del buscador)
barra_busqueda_header.addEventListener("input", function () {
  let consulta = barra_busqueda_header.value.trim();
  if (consulta.length > 0) {
    buscar_juego_formulario(consulta, resultados_busqueda_tiempo_real, barra_busqueda_header);
  } else {
    resultados_busqueda_tiempo_real.innerHTML = "";
    resultados_busqueda_tiempo_real.style.display = "none";
  }
});

// Función de búsqueda de juegos en la BD
function buscar_juego_formulario(consulta, resultados_busqueda_tiempo_real, barra_busqueda_header) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", `../app/modelo/header_modelo.php?consulta=${consulta}`, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let juegos = JSON.parse(xhr.responseText);

      resultados_busqueda_tiempo_real.innerHTML = ""; // Limpiar resultados anteriores
      resultados_busqueda_tiempo_real.style.display = "grid";

      juegos.forEach(function (juego) {
        let opcion = document.createElement("div");
        opcion.classList.add("opcion_juego");
        opcion.textContent = juego.titulo;

        opcion.addEventListener("click", function () {
          barra_busqueda_header.value = juego.titulo;
          barra_busqueda_header.style.fontWeight = "bold"; // Simular que está seleccionado (negrita)
          resultados_busqueda_tiempo_real.innerHTML = ""; // Limpiar después de seleccionar
          resultados_busqueda_tiempo_real.style.display = "none";

          window.location.href = `ficha_juego.php?id_juego=${juego.id_juego}`; // Redirigir a la ficha del juego con su id
        });

        resultados_busqueda_tiempo_real.appendChild(opcion);
      });
    }
  };

  xhr.send();
}
