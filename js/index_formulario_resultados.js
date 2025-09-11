document.addEventListener("DOMContentLoaded", function () {
  let formulario = document.getElementById("formulario");

  formulario.addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que la página se recargue

    // Obtener los valores de los campos del formulario manualmente
    let nombre_juego = document.getElementById("nombre_juego").value || "";
    let genero = document.getElementById("generos").value !== "genero" ? document.getElementById("generos").value : "";
    let plataforma = document.getElementById("plataformas").value !== "plataforma" ? document.getElementById("plataformas").value : "";
    let duracion_minima = document.getElementById("duracion_minima").value || 0;
    let duracion_maxima = document.getElementById("duracion_maxima").value || 500;
    let año_minimo = document.getElementById("año_minimo").value !== "desde" ? document.getElementById("año_minimo").value : 1900;
    let año_maximo =
      document.getElementById("año_maximo").value !== "hasta" ? document.getElementById("año_maximo").value : new Date().getFullYear();
    let multi = document.getElementById("multi").checked ? 1 : 0;
    let goty = document.getElementById("goty").checked ? 1 : 0;
    let obra_maestra = document.getElementById("obra_maestra").checked ? 1 : 0;

    // Obtener la valoración seleccionada
    let valoracion = document.querySelector('input[name="estrellas"]:checked');
    let valoracion_minima = valoracion ? valoracion.value : null;

    // Construir la URL manualmente con los parámetros
    let consulta = `nombre_juego=${encodeURIComponent(
      nombre_juego
    )}&generos=${genero}&plataformas=${plataforma}&duracion_minima=${duracion_minima}&duracion_maxima=${duracion_maxima}&año_minimo=${año_minimo}&año_maximo=${año_maximo}&multi=${multi}&goty=${goty}&obra_maestra=${obra_maestra}&estrellas=${valoracion_minima}`;

    // Crear la solicitud AJAX tradicional
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "../app/modelo/filtrar_juegos_modelo.php?" + consulta, true);
    xhr.send();

    // Manejo de la respuesta
    xhr.onload = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let juegos = JSON.parse(xhr.responseText);

        // Mostrar la sección
        let seccion_contenedor = document.querySelector(".fondo1-resultados");
        seccion_contenedor.style.display = "block";

        // Función para paginar los resultados
        function mostrarPagina(numeroPagina) {
          let seccion_resultados = document.getElementById("seccion_resultados");
          seccion_resultados.innerHTML = '<div id="resultados"></div>';
          let resultados = document.getElementById("resultados");
          resultados.innerHTML = "";

          // Tamaño de página (10 juegos por página)
          let juegosPorPagina = 10;

          // Alamcenamos todos los juegos en otra variable para manipularla sin alterar el array original
          let juegosTotales = juegos;

          // Calculamos el total de páginas redondeando hacia arriba
          let totalPaginas = Math.ceil(juegosTotales.length / juegosPorPagina);

          // Índices de inicio y fin
          let inicio = (numeroPagina - 1) * juegosPorPagina;
          let fin = inicio + juegosPorPagina;

          // Cortar el array
          let juegosPagina = juegosTotales.slice(inicio, fin);

          if (juegosTotales.length === 0) {
            resultados.innerHTML = "<p>No se encontraron juegos.</p>";
          } else {
            juegosPagina.forEach((juego) => {
              let estrellas = "../multimedia/iconos/";

              if (juego.valoracion_media >= 0 && juego.valoracion_media < 2) {
                estrellas += "1_estrellas.png";
              } else if (juego.valoracion_media >= 2 && juego.valoracion_media < 3) {
                estrellas += "2_estrellas.png";
              } else if (juego.valoracion_media >= 3 && juego.valoracion_media < 4) {
                estrellas += "3_estrellas.png";
              } else if (juego.valoracion_media >= 4 && juego.valoracion_media < 5) {
                estrellas += "4_estrellas.png";
              } else if (juego.valoracion_media == 5) {
                estrellas += "5_estrellas.png";
              }

              let goty = juego.goty == "1" ? '<img class="etiqueta_goty" src="../multimedia/logos/goty.webp" alt="GOTY">' : "";
              let obra_maestra =
                juego.obra_maestra == "1"
                  ? '<img class="etiqueta_obra_maestra" src="../multimedia/logos/obra_maestra.jpg" alt="Obra Maestra">'
                  : "";

              let juego_HTML = `
                              <div class="resultado">
                                  <div class="portada">
                                      <a href="ficha_juego.php?id_juego=${juego.id_juego}">
                                          <img class="portada_imagen" src="${juego.portada}" alt="Portada de ${juego.titulo}">
                                          <img class="etiqueta_estrellas" src="${estrellas}" alt="Valoración de ${juego.valoracion_media}">
                                      </a>
                                  </div>
                                  <div class="informacion">
                                      <h3><a href="ficha_juego.php?id_juego=${juego.id_juego}">${juego.titulo}</a></h3>
                                      <p>Desarrolladora: ${juego.desarrolladora}</p>
                                      <p>Lanzamiento: ${juego.lanzamiento}</p>
                                  </div>
                                  <div class="etiquetas">
                                      ${goty}
                                      ${obra_maestra}
                                  </div>
                              </div>`;
              resultados.innerHTML += juego_HTML;
            });
          }

          // Botones para pasar de página
          let paginacion = document.getElementById("paginacion");
          paginacion.innerHTML = "";
          for (let i = 1; i <= totalPaginas; i++) {
            let btn = document.createElement("button");
            btn.textContent = i;
            btn.classList.add("btn-pagina");
            btn.addEventListener("click", () => mostrarPagina(i));
            paginacion.appendChild(btn);
          }
        }

        mostrarPagina(1);
      } else {
        console.log(`Error en la solicitud AJAX: ${xhr.status}`);
      }
    };
  });
});
