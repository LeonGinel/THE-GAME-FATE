
// --------------------------------- FUNCIONAMIENTO CARRUSEL -------------------------------------//
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".carrusel").forEach(function(carrusel) {

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

                // Insertar información dinámicamente en el carrusel
                juegos.forEach((juego) => {
                    let imagen_carrusel = document.createElement("li");
                    imagen_carrusel.classList.add("imagen_carrusel");
                    imagen_carrusel.innerHTML = `
                        <a href="ficha_juego.php?id_juego=${juego.id_juego}">
                            <img src="${juego.portada}" alt="${juego.titulo}">
                            <p>${juego.titulo}</p>
                        </a>`;
                    lista.appendChild(imagen_carrusel);
                });

                let imagenes = lista.querySelectorAll(".imagen_carrusel");

                // Duplicamos las primeras imágenes para lograr el efecto infinito
                for (let i = 0; i < 3; i++) {
                    let copia = imagenes[i].cloneNode(true);
                    lista.appendChild(copia);
                }

                let ancho_imagen = lista.querySelector(".imagen_carrusel").clientWidth;
                let total_imagenes = imagenes.length;
                let index = 0;

                // Función para mover el carrusel
                function mover_carrusel() {
                    lista.style.transition = "transform 0.5s ease-in-out";
                    lista.style.transform = `translateX(-${index * ancho_imagen}px)`;

                    // Reinicio sin que se note (cuando llega al final)
                    if (index === total_imagenes) {
                        setTimeout(() => {
                            lista.style.transition = "none";
                            index = 0;
                            lista.style.transform = `translateX(0px)`;
                        }, 500);
                    }
                }

                // Botón "Siguiente"
                let btnDcha = carrusel.querySelector(".carrusel_btn-dcha");

                btnDcha.addEventListener("click", function() {
                    if (index < total_imagenes) {
                        index++;
                    }
                    mover_carrusel();
                });

                // Botón "Anterior"
                let btnIzq = carrusel.querySelector(".carrusel_btn-izq");

                btnIzq.addEventListener("click", function() {
                    if (index > 0) {
                        index--;
                    } else {
                        index = total_imagenes;
                        lista.style.transition = "none";
                        lista.style.transform = `translateX(-${index * ancho_imagen}px)`;
                        setTimeout(() => {
                            index--;
                            mover_carrusel();
                        }, 50);
                    }
                });

                // Movimiento automático cada 3 segundos
                setInterval(function() {
                    btnDcha.click();
                }, 3000);

                // Ajustar el ancho si se cambia el tamaño de la ventana
                window.addEventListener("resize", () => {
                    ancho_imagen = lista.querySelector(".imagen_carrusel").clientWidth;
                });
            }
        };

        xhr.send();
    });
});
