document.addEventListener("DOMContentLoaded", function () {
    // Obtener el ID del juego desde la URL
    const url_param = new URLSearchParams(window.location.search);
    const id_juego = url_param.get("id_juego");

    if (id_juego) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", "../app/sesion.php?obtener_rol=1", true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                let respuesta = JSON.parse(xhr.responseText);
                let rol = respuesta.rol || "invitado";

                let xhrJuego = new XMLHttpRequest();
                xhrJuego.open("GET", `../app/modelo/ficha_juego_modelo.php?id_juego=${id_juego}`, true);
                xhrJuego.onreadystatechange = function () {
                    if (xhrJuego.readyState === 4 && xhrJuego.status === 200) {
                        let ficha_juego = JSON.parse(xhrJuego.responseText);

                        let informacion_juego = ficha_juego.informacion_juego;
                        let criticas_usuarios = ficha_juego.criticas_usuarios;
                        let etiquetas = ficha_juego.etiquetas;

                        cargar_info_juego(informacion_juego, etiquetas);

                        if (rol === "invitado") {
                            document.querySelector(".criticas").innerHTML = '<p>Debes <a class="registrate" href="registro_login.php?modo=registro">registrarte</a> e <a class="inicia_sesion" href="registro_login.php?modo=login">iniciar sesión</a> para poder ver las críticas de otros usuarios.</p>';
                        } else {
                            if (criticas_usuarios.length > 0) {
                                cargar_criticas(criticas_usuarios);
                            }
                        }
                    }
                };
                xhrJuego.send();
            }
        };
        xhr.send();
    }
});

function cargar_info_juego(informacion_juego, etiquetas) {
        document.querySelector(".imagen_portada").src = informacion_juego.portada;
        document.querySelector(".imagen_portada").alt = `Portada de "${informacion_juego.titulo}"`;

        let valoracion = document.querySelector(".imagen_valoracion");
        valoracion.src = "../multimedia/iconos/";
        valoracion.alt = `Valoración de "${informacion_juego.titulo}"`;

        if (informacion_juego.valoracion_media >= 0 && informacion_juego.valoracion_media < 2) {
            valoracion.src += "1_estrellas.png";
        } else if (informacion_juego.valoracion_media >= 2 && informacion_juego.valoracion_media < 3) {
            valoracion.src += "2_estrellas.png";
        } else if (informacion_juego.valoracion_media >= 3 && informacion_juego.valoracion_media < 4) {
            valoracion.src += "3_estrellas.png";
        } else if (informacion_juego.valoracion_media >= 4 && informacion_juego.valoracion_media < 5) {
            valoracion.src += "4_estrellas.png";
        } else if (informacion_juego.valoracion_media == 5) {
            valoracion.src += "5_estrellas.png";
        }

        document.querySelector(".informacion h2").textContent = informacion_juego.titulo;
        document.querySelector(".desarrolladora span").textContent = informacion_juego.desarrolladora;
        document.querySelector(".lanzamiento span").textContent = informacion_juego.lanzamiento ? informacion_juego.lanzamiento : "Desconocido";
        document.querySelector(".genero span").textContent = informacion_juego.generos || "Desconocido";
        document.querySelector(".plataforma span").textContent = informacion_juego.plataformas || "Desconocido";
        document.querySelector(".duracion span").textContent = `${informacion_juego.duracion} h`;
        document.querySelector(".duracion span").textContent = informacion_juego.duracion ? `${informacion_juego.duracion} h` : "Desconocida";
        

        document.querySelector(".descripcion p").innerHTML = informacion_juego.descripcion || "Sin descripción disponible.";

        let goty = document.querySelector(".goty");
        let obra_maestra = document.querySelector(".obra_maestra");
        let sobrevalorado = document.querySelector(".sobrevalorado");

        if (informacion_juego.goty == "1") {
            goty.src = "../multimedia/logos/goty.webp";
        } else {
            goty.remove();
        }

        // Si el porcentaje de "Obra Maestra" es mayor o igual a 90%, mostrar la etiqueta
        if (etiquetas.porcentaje_obra_maestra >= 90) {
            obra_maestra.src = "../multimedia/logos/obra_maestra.jpg";
        } else {
            obra_maestra.remove();
        }

        // Si el porcentaje de "Sobrevalorado" es mayor o igual a 90%, mostrar la etiqueta
        if (etiquetas.porcentaje_sobrevalorado >= 90) {
            sobrevalorado.src = "../multimedia/logos/sobrevalorado.jpg";
        } else {
            sobrevalorado.remove();
        }
};

function cargar_criticas(criticas_usuarios) {
    let contenedor_criticas = document.querySelector(".criticas");

    if (criticas_usuarios.length > 0) {
        contenedor_criticas.innerHTML = "";
        criticas_usuarios.forEach(critica => {
            let critica_item = document.createElement("div");
            critica_item.classList.add("critica")

            critica_item.innerHTML += `
                <div class="informacion_usuario">
                    <a href="perfil_usuario.php?id_usuario=${critica.id_usuario}" class="imagen_usuario">
                        <img  src="${critica.imagen_perfil}" alt="Avatar de ${critica.usuario}" class="avatar_usuario">
                    </a>
                    <a href="perfil_usuario.php?id_usuario=${critica.id_usuario}" class="nombre_usuario">${critica.usuario}</a>
                    <span class="fecha_review">${new Date(critica.fecha).toLocaleDateString()}</span> 
                </div>
                <p class="critica_texto">${critica.critica}</p>
            `;
            contenedor_criticas.prepend(critica_item);
        });
    } else {
        contenedor_criticas.innerHTML = "<p>No hay críticas aún.</p>";
    }
};
 
