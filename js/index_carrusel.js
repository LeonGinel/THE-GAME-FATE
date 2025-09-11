// --------------------------------- FUNCIONAMIENTO CARRUSEL -------------------------------------//
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".carrusel").forEach(function (carrusel) {
    let tipo_carrusel = carrusel.id;

    // Petición AJAX
    let xhr = new XMLHttpRequest();
    xhr.open("GET", `../app/modelo/carrusel_modelo.php?tipo=${tipo_carrusel}`, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let juegos = JSON.parse(xhr.responseText);
        let lista = carrusel.querySelector(".lista_carrusel");

        if (juegos.length === 0) {
          lista.innerHTML = "<p>No hay juegos disponibles</p>";
          return;
        }

        // Limpiar la lista antes de agregar elementos nuevos
        lista.innerHTML = "";

        // Insertar información dinámicamente
        juegos.forEach((juego) => {
          let li = document.createElement("li");
          li.classList.add("imagen_carrusel");
          li.innerHTML = `
            <a href="ficha_juego.php?id_juego=${juego.id_juego}">
              <img src="${juego.portada}" alt="${juego.titulo}">
              <p>${juego.titulo}</p>
            </a>`;
          lista.appendChild(li);
        });

        // Variables de control
        let index = 0;
        let total_imagenes = 0;
        let ancho_imagen = 0;
        let visibles = window.innerWidth <= 480 ? 2 : 3; // Número de imágenes visibles

        function actualizarMedidas() {
          visibles = window.innerWidth <= 480 ? 2 : 3;
          let imagenes = lista.querySelectorAll(".imagen_carrusel");

          // Limpiar clones previos
          lista.querySelectorAll(".imagen_carrusel.clone").forEach((c) => c.remove());

          // Duplicar las primeras 'visibles' para efecto infinito
          for (let i = 0; i < visibles; i++) {
            let copia = imagenes[i].cloneNode(true);
            copia.classList.add("clone");
            lista.appendChild(copia);
          }

          // Actualizar total de imágenes y ancho
          total_imagenes = lista.querySelectorAll(".imagen_carrusel").length;
          ancho_imagen = lista.querySelector(".imagen_carrusel").clientWidth;

          // Ajustar posición según index
          lista.style.transition = "none";
          lista.style.transform = `translateX(-${index * ancho_imagen}px)`;
        }

        // Inicializa medidas
        actualizarMedidas();

        // Función para mover carrusel
        function mover_carrusel() {
          lista.style.transition = "transform 0.5s ease-in-out";
          lista.style.transform = `translateX(-${index * ancho_imagen}px)`;

          // Reinicio infinito
          if (index >= total_imagenes - visibles) {
            setTimeout(() => {
              lista.style.transition = "none";
              index = 0;
              lista.style.transform = `translateX(0px)`;
            }, 500);
          }
        }

        // Botones
        let btnDcha = carrusel.querySelector(".carrusel_btn-dcha");
        let btnIzq = carrusel.querySelector(".carrusel_btn-izq");

        btnDcha.addEventListener("click", () => {
          index++;
          mover_carrusel();
        });

        btnIzq.addEventListener("click", () => {
          if (index > 0) {
            index--;
            mover_carrusel();
          } else {
            index = total_imagenes - visibles;
            lista.style.transition = "none";
            lista.style.transform = `translateX(-${index * ancho_imagen}px)`;
            setTimeout(() => {
              index--;
              mover_carrusel();
            }, 50);
          }
        });

        // Movimiento automático cada 3 segundos
        setInterval(() => btnDcha.click(), 3000);

        // Recalcular medidas al redimensionar ventana
        window.addEventListener("resize", actualizarMedidas);
      }
    };
    xhr.send();
  });
});
