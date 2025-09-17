document.addEventListener("DOMContentLoaded", function () {
  // Obtener el ID del usuario desde la URL
  const url_param = new URLSearchParams(window.location.search);
  const id_usuario = url_param.get("id_usuario");

  if (id_usuario) {
    // Obtener primero el id_usuario_logueado
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "../app/sesion.php?id_usuario_logueado", true);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let respuesta = JSON.parse(xhr.responseText); // Aquí obtienes la respuesta JSON
        let id_usuario_logueado = respuesta.id_usuario; // Extraemos el id_usuario
        let rol_usuario = respuesta.rol; // Y aquí extraemos el rol

        // Ahora cargamos la información del usuario
        let xhr_perfil = new XMLHttpRequest();
        xhr_perfil.open("GET", `../app/modelo/perfil_usuario_modelo.php?id_usuario=${id_usuario}`, true);

        xhr_perfil.onreadystatechange = function () {
          if (xhr_perfil.readyState === 4 && xhr_perfil.status === 200) {
            let carga_inicial = JSON.parse(xhr_perfil.responseText);

            let informacion_usuario = carga_inicial.informacion_usuario;
            let juegos_top = carga_inicial.juegos_top;
            let lista_reviews = carga_inicial.lista_reviews;

            if (informacion_usuario) {
              // Actualizar imagen de perfil
              let imagen_perfil = document.querySelector(".imagen_perfil");

              imagen_perfil.src = informacion_usuario.imagen_perfil;
              imagen_perfil.alt = `Avatar de ${informacion_usuario.usuario}`;

              let nombre_usuario = document.querySelector(".nombre_usuario");
              nombre_usuario.textContent = informacion_usuario.usuario;
            }

            // Cargar los juegos del Top
            if (juegos_top.length > 0) {
              cargar_juegos_top(juegos_top);
            }

            if (lista_reviews.length > 0) {
              lista_reviews.forEach((review) => {
                agregar_juego_lista(
                  review.id_review,
                  review.id_juego,
                  review.titulo,
                  review.portada,
                  review.puntuacion,
                  review.critica,
                  review.etiqueta_obra_maestra,
                  review.etiqueta_sobrevalorado
                );
              });
            }

            // Si el perfil es de otro usuario, desactivar botones
            if (id_usuario !== id_usuario_logueado) {
              // Desactivar los botones "+" del Top 3
              let btns_top = document.querySelectorAll(".btn_top");
              btns_top.forEach((boton) => (boton.style.display = "none"));

              // Desactivar el botón de agregar juego
              let btn_agregar_juego = document.querySelector(".btn_agregar_juego");
              btn_agregar_juego.style.display = "none";

              // Desactivar los botones de eliminar review
              let btns_eliminar_review = document.querySelectorAll(".eliminar_review");
              btns_eliminar_review.forEach((boton) => (boton.style.display = "none"));
            }

            // Desactivar los botones de gestion si no es el admin y ajustar copntenedores
            let btns_gestion = document.querySelector(".contenedor_gestionar_juegos");
            let top3 = document.querySelector(".top_3");
            if (rol_usuario !== "admin" || id_usuario !== id_usuario_logueado) {
              btns_gestion.style.display = "none";
              top3.classList.remove("admin");
            } else {
              top3.classList.add("admin");
            }

            // LLamar a al función para cambiar la imagen de avatar
            cambiar_avatar(id_usuario, id_usuario_logueado);
            // Llamar a la función para manejar los botones del TOP
            seleccionar_top_3();
            // LLamar a las funciones de administrador
            banear_usuario();
            modificar_juego();
            añadir_juego();
            eliminar_juego();
            // LLamar a la función de agregar review
            agregar_juego();
          }
        };

        xhr_perfil.send(); // Enviar la petición AJAX para obtener el perfil del usuario
      }
    };

    xhr.send(); // Enviar la petición AJAX para obtener el id_usuario logueado
  }
});

// ------------------------------------------------------------------------------------------------ //
// ---------------------------------- CAMBIAR IMAGEN DE AVATAR ------------------------------------ //
// ------------------------------------------------------------------------------------------------ //

function cambiar_avatar(id_usuario, id_usuario_logueado) {
  let imagen_perfil = document.querySelector(".imagen_perfil");
  let input_avatar = document.getElementById("input_avatar");

  // Evita que el avatar se pueda cambiar en perfiles ajenos
  if (id_usuario !== id_usuario_logueado) {
    // Bloquear interacción
    input_avatar.disabled = true;
    imagen_perfil.style.cursor = "default";
  } else {
    imagen_perfil.addEventListener("click", () => input_avatar.click());

    input_avatar.addEventListener("change", () => {
      let avatar = input_avatar.files[0];
      if (!avatar) return;

      // Previsualización inmediata
      imagen_perfil.src = URL.createObjectURL(avatar);

      // Subida al servidor
      const datos = new FormData();
      datos.append("avatar", avatar);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "../app/modelo/perfil_usuario_modelo.php", true);

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const respuesta = JSON.parse(xhr.responseText);
        }
      };

      xhr.send(datos);
    });
  }
}

// ------------------------------------------------------------------------------------------------ //
// ---------------------------- FUNCIONAMIENTO DE LOS SELECTORES TOP 3 ---------------------------- //
// ------------------------------------------------------------------------------------------------ //

// Función para seleccionar juegos para cada posición del TOP 3
function seleccionar_top_3() {
  let btns_top = document.querySelectorAll(".btn_top");

  btns_top.forEach(function (boton) {
    let valor = boton.value;
    let buscador = document.querySelector(".buscador_top_" + valor);
    let barra_busqueda = document.querySelector(".buscador_top_" + valor + " input");
    let resultados_busqueda = document.querySelector(".buscador_top_" + valor + " div");

    boton.addEventListener("click", function () {
      barra_busqueda.value = "";
      resultados_busqueda.style.display = "none";

      // Alternar visibilidad del formulario
      if (buscador.style.display === "block") {
        buscador.style.display = "none"; // Ocultar
      } else {
        buscador.style.display = "block"; // Mostrar
        barra_busqueda.focus(); // Dar foco a la barra de búsqueda
      }
    });

    // Cerrar formulario si se hace clic fuera de él
    document.addEventListener("click", function (event) {
      // Verificar si el clic no fue dentro del formulario ni en el botón
      if (!buscador.contains(event.target) && event.target !== boton) {
        buscador.style.display = "none"; // Ocultar el formulario
      }
    });

    barra_busqueda.addEventListener("input", function () {
      let consulta = barra_busqueda.value.trim();

      if (consulta.length > 0) {
        buscar_juego_top(consulta, resultados_busqueda, valor, buscador);
      } else {
        resultados_busqueda.innerHTML = ""; // Limpiar si no hay texto
      }
    });
  });
}

// Función para los buscadores de juegos para el TOP 3 en tiempo real
function buscar_juego_top(consulta, resultados_busqueda, valor, buscador) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", `../app/modelo/perfil_usuario_modelo.php?consulta=${consulta}`, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let juegos = JSON.parse(xhr.responseText);

      resultados_busqueda.innerHTML = ""; // Limpiar resultados anteriores
      resultados_busqueda.style.display = "block";

      juegos.forEach(function (juego) {
        let opcion = document.createElement("div");
        opcion.classList.add("opcion_juego");
        opcion.textContent = juego.titulo;

        opcion.addEventListener("click", function () {
          resultados_busqueda.innerHTML = ""; // Limpiar después de seleccionar
          // Guardar el juego en el servidor
          guardar_juego_top(juego.id_juego, valor, juego);
          // Ocultar el buscador después de seleccionar
          buscador.style.display = "none";
        });

        resultados_busqueda.appendChild(opcion);
      });
    }
  };

  xhr.send();
}

// Función para guardar la selección de un juego en el TOP 3
function guardar_juego_top(id_juego, valor, juego) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", `../app/modelo/perfil_usuario_modelo.php?id_juego=${id_juego}&posicion=${valor}`, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let respuesta = JSON.parse(xhr.responseText);
      if (respuesta.estado === "exito") {
        // Asignar la imagen del juego seleccionado a la etiqueta <img>
        let imagen_juego = document.querySelector(".juego_" + valor + " img");
        imagen_juego.src = juego.portada; // Asignar la imagen
        imagen_juego.alt = `Imagen de ${juego.titulo}`; // Texto alternativo
      }
    }
  };
  xhr.send();
}

// Función para cargar las selecciones previas en el TOP 3
function cargar_juegos_top(juegos_top) {
  juegos_top.forEach(function (juego, index) {
    // Buscar el contenedor de la imagen para cada posición en el Top 3
    let imagen_juego = document.querySelector(`.juego_${index + 1} img`);

    if (imagen_juego) {
      imagen_juego.src = juego.portada; // Asignar la imagen
      imagen_juego.alt = `Imagen de ${juego.titulo}`; // Texto alternativo
    }
  });
}

// ------------------------------------------------------------------------------------------------ //
// ---------------------------- ADMINISTRADOR: FORMULARIOS DE GESTIÓN ---------------------------- //
// ------------------------------------------------------------------------------------------------ //

// Función para alternar la visibilidad de los formularios
function alternar_visibilidad_formularios(btn_activar_formulario, contenedor_formulario, formulario, barra_busqueda_formulario) {
  btn_activar_formulario.addEventListener("click", () => {
    const formularios = document.querySelectorAll(".contenedor_formularios_gestionar_juegos form");
    formularios.forEach((form) => (form.style.display = "none")); // Ocultar todos los formularios

    contenedor_formulario.style.display = "grid"; // Mostrar
    formulario.style.display = "grid";
    barra_busqueda_formulario.focus(); // Dar foco a la barra de búsqueda
  });

  // Mostrar y ocultar formulario
  contenedor_formulario.addEventListener("click", function (e) {
    if (e.target === contenedor_formulario) {
      // solo si clicas el overlay, no el form
      contenedor_formulario.style.display = "none";
      formulario.style.display = "none";
      formulario.reset(); // Resetea todos los campos del formulario

      // Limpiar arrays y contenedores visuales
      generos_seleccionados.length = 0;
      plataformas_seleccionadas.length = 0;
      contenedor_generos.innerHTML = "";
      contenedor_plataformas.innerHTML = "";
    }
  });
}

// Función ELIMINAR UN USUARIO de la BBDD
function banear_usuario() {
  let btn_activar_formulario = document.querySelector(".btn_banear_usuario");
  let contenedor_formulario = document.querySelector(".contenedor_formularios_gestionar_juegos");
  let formulario = document.querySelector(".formulario_banear_usuario");
  let barra_busqueda = document.querySelector(".buscador_banear");

  alternar_visibilidad_formularios(btn_activar_formulario, contenedor_formulario, formulario, barra_busqueda);

  let btn_banear = document.querySelector(".btn_banear");

  btn_banear.addEventListener("click", function () {
    let usuario_baneado = document.querySelector(".buscador_banear").value;
    // Mostrar confirmación antes de eliminar
    if (confirm(`¿Estás seguro de que deseas banear a ${usuario_baneado}`)) {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", `../app/modelo/perfil_usuario_modelo.php`, true);

      let datos = `banear=${encodeURIComponent(usuario_baneado)}`;

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          let resultado = JSON.parse(xhr.responseText);
          if (resultado.estado === "eliminado") {
            alert("Usuario baneado!");
          } else {
            alert("Usuario no encontrado!");
          }

          formulario.reset(); // Esto limpia el formulario después de añadir el juego
          formulario.style.display = "none";
        }
      };
      xhr.send(datos);
    }
  });
}

// función para MODIFICAR LOS DATOS DE UN JUEGO existente
function modificar_juego() {
  let btn_activar_formulario = document.querySelector(".btn_modificar_juego");
  let contenedor_formulario = document.querySelector(".contenedor_formularios_gestionar_juegos");
  let formulario = document.querySelector(".formulario_modificar_juego");
  let barra_busqueda = document.querySelector(".titulo_modificar");
  let resultados_busqueda = document.querySelector(".resultados_busqueda_midificar_juegos");

  let select_generos = document.querySelector(".generos_modificar");
  let contenedor_generos = document.querySelector(".contenedor_generos_modificar");
  let select_Plataformas = document.querySelector(".plataformas_modificar");
  let contenedor_plataformas = document.querySelector(".contenedor_plataformas_modificar");
  let lanzamiento = document.querySelector(".lanzamiento_modificar");

  alternar_visibilidad_formularios(btn_activar_formulario, contenedor_formulario, formulario, barra_busqueda);

  // Buscar juego en tiempo real (sugerencias del buscador)
  barra_busqueda.addEventListener("input", function () {
    let consulta = barra_busqueda.value.trim();
    if (consulta.length > 0) {
      buscar_juego_formulario(consulta, resultados_busqueda, barra_busqueda);
    } else {
      resultados_busqueda.innerHTML = ""; // Limpiar si no hay texto
    }
  });

  // Llenar los desplegables de géneros, plataformas y lanzamiento
  let { generos_seleccionados, plataformas_seleccionadas } = desplegables_generos_plataformas(
    select_generos,
    contenedor_generos,
    select_Plataformas,
    contenedor_plataformas
  );
  desplegable_lanzamiento(lanzamiento);

  formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    let titulo = document.querySelector(".titulo_modificar").value;
    let portada = document.querySelector(".portada_modificar").value;
    let desarrolladora = document.querySelector(".desarrolladora_modificar").value;

    let plataformas_seleccion = plataformas_seleccionadas;
    let generos_seleccion = generos_seleccionados;

    let lanzamiento = document.querySelector(".lanzamiento_modificar").value;
    let duracion = document.querySelector(".duracion_modificar").value;
    let descripcion = document.querySelector(".descripcion_modificar").value;

    let datos = `modo=modificar&titulo=${encodeURIComponent(titulo)}&portada=${encodeURIComponent(
      portada
    )}&desarrolladora=${encodeURIComponent(desarrolladora)}&plataforma[]=${plataformas_seleccion.join(
      "&plataforma[]="
    )}&genero[]=${generos_seleccion.join("&genero[]=")}&lanzamiento=${encodeURIComponent(lanzamiento)}&duracion=${encodeURIComponent(
      duracion
    )}&descripcion=${encodeURIComponent(descripcion)}`;

    if (confirm(`¿Estás seguro de que deseas modificar ${titulo}`)) {
      let xhr = new XMLHttpRequest();
      xhr.open("POST", "../app/modelo/perfil_usuario_modelo.php", true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          let resultado = JSON.parse(xhr.responseText);
          if (resultado.estado === "modificado") {
            alert("Juego modificado correctamente!");
          } else {
            alert("No hay cambios nuevos en el juego.");
          }

          formulario.reset(); // Esto limpia el formulario después de añadir el juego
          formulario.style.display = "none";
        }
      };

      // Enviar los datos
      xhr.send(datos);
    }
  });
}

function añadir_juego() {
  let btn_activar_formulario = document.querySelector(".btn_introducir_juego");
  let contenedor_formulario = document.querySelector(".contenedor_formularios_gestionar_juegos");
  let formulario = document.querySelector(".formulario_introducir_juego");
  let barra_busqueda = document.querySelector(".titulo_añadir");

  let select_generos = document.querySelector(".generos_añadir");
  let contenedor_generos = document.querySelector(".contenedor_generos_añadir");
  let select_Plataformas = document.querySelector(".plataformas_añadir");
  let contenedor_plataformas = document.querySelector(".contenedor_plataformas_añadir");
  let lanzamiento = document.querySelector(".lanzamiento_añadir");

  alternar_visibilidad_formularios(btn_activar_formulario, contenedor_formulario, formulario, barra_busqueda);

  // Llenar los desplegables de géneros, plataformas y lanzamiento
  let { generos_seleccionados, plataformas_seleccionadas } = desplegables_generos_plataformas(
    select_generos,
    contenedor_generos,
    select_Plataformas,
    contenedor_plataformas
  );
  desplegable_lanzamiento(lanzamiento);

  formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    // Recoger los datos del formulario
    let titulo = document.querySelector(".titulo_añadir").value;
    let portada = document.querySelector(".portada_añadir").value;
    let desarrolladora = document.querySelector(".desarrolladora_añadir").value;

    let plataformas_seleccion = plataformas_seleccionadas;
    let generos_seleccion = generos_seleccionados;

    let lanzamiento = document.querySelector(".lanzamiento_añadir").value;
    let duracion = document.querySelector(".duracion_añadir").value;
    let descripcion = document.querySelector(".descripcion_añadir").value;

    let datos = `modo=añadir&titulo=${encodeURIComponent(titulo)}&portada=${encodeURIComponent(
      portada
    )}&desarrolladora=${encodeURIComponent(desarrolladora)}&plataforma[]=${plataformas_seleccion.join(
      "&plataforma[]="
    )}&genero[]=${generos_seleccion.join("&genero[]=")}&lanzamiento=${encodeURIComponent(lanzamiento)}&duracion=${encodeURIComponent(
      duracion
    )}&descripcion=${encodeURIComponent(descripcion)}`;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", "../app/modelo/perfil_usuario_modelo.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let resultado = JSON.parse(xhr.responseText);
        if (resultado.estado === "añadido") {
          alert("Juego añadido correctamente!");
        } else {
          alert("Hubo un error al añadir el juego.");
        }

        formulario.reset(); // Esto limpia el formulario después de añadir el juego
        formulario.style.display = "none";
      }
    };

    // Enviar los datos
    xhr.send(datos);
  });
}

// Función para cargar las opciones en los select de GÉNEROS Y PLATAFORMAS
function desplegables_generos_plataformas(select_generos, contenedor_generos, select_Plataformas, contenedor_plataformas) {
  // Listas predefinidas de géneros y plataformas
  let generos = [
    "Arcade",
    "Action",
    "Adventure",
    "Sports",
    "Strategy",
    "Racing",
    "Figth",
    "Massively Multiplayer",
    "Platformer",
    "RPG",
    "Sandbox",
    "Shooter",
    "Simulation",
    "Survival",
    "Horror",
    "Puzzle",
    "Indie",
  ];

  let plataformas = [
    "Wii",
    "Wii U",
    "Nintendo Switch",
    "Nintendo 64",
    "GameCube",
    "Nintendo DS",
    "GameBoy Advance",
    "Nintendo 3DS",
    "PlayStation 5",
    "PlayStation 4",
    "PlayStation 3",
    "PlayStation 2",
    "PSX",
    "PSP",
    "PS Vita",
    "Xbox",
    "Xbox 360",
    "Xbox One",
    "Xbox Series S/X",
    "PC",
    "Dreamcast",
    "Android",
    "macOS",
    "Linux",
    "iOS",
    "Web",
  ];

  // Función para agrergar las opciones a los desplegables
  function agregar_opciones(select, opciones) {
    opciones.forEach((opcion) => {
      let option = document.createElement("option");
      option.value = opcion;
      option.textContent = opcion;
      select.appendChild(option);
    });
  }

  agregar_opciones(select_generos, generos);
  agregar_opciones(select_Plataformas, plataformas);

  // Función para manejar selecciones multiples en géneros y plataformas
  function manejar_seleccion_multiple(select, contenedor) {
    let seleccionados = []; // Almacena los elementos seleccionados

    select.addEventListener("change", function () {
      let valor = select.value;

      if (!seleccionados.includes(valor) || seleccionados.length < 5) {
        // Agregar al array
        seleccionados.push(valor);

        // Crear un elemento visual
        let item = document.createElement("div");
        item.classList.add("item_seleccionado");
        item.textContent = valor;

        // Botón de eliminar con una "X"
        let btn_eliminar = document.createElement("span");
        btn_eliminar.textContent = "❌";
        btn_eliminar.classList.add("eliminar_item");
        btn_eliminar.addEventListener("click", function () {
          // Eliminar del array
          seleccionados.splice(seleccionados.indexOf(valor), 1);
          // Eliminar del contenedor
          contenedor.removeChild(item);
        });

        item.appendChild(btn_eliminar);
        contenedor.appendChild(item);
      }
    });

    return seleccionados;
  }

  let generos_seleccionados = manejar_seleccion_multiple(select_generos, contenedor_generos);
  let plataformas_seleccionadas = manejar_seleccion_multiple(select_Plataformas, contenedor_plataformas);

  return { generos_seleccionados, plataformas_seleccionadas };
}

function desplegable_lanzamiento(año_lanzamiento) {
  let año_actual = new Date().getFullYear(); // Obtener el año actual

  // Llenar el select con los años desde 1950 hasta el año actual
  for (let año = 1950; año <= año_actual; año++) {
    let opcion_año = document.createElement("option");
    opcion_año.value = año;
    opcion_año.textContent = año;
    año_lanzamiento.appendChild(opcion_año);
  }
}

// Función para ELIMINAR UN JUEGO de la BBDD
function eliminar_juego() {
  let btn_activar_formulario = document.querySelector(".btn_borrar_juego");
  let contenedor_formulario = document.querySelector(".contenedor_formularios_gestionar_juegos");
  let formulario = document.querySelector(".formulario_eliminar_juego");
  let barra_busqueda = document.querySelector(".buscador_eliminar_juego");
  let resultados_busqueda = document.querySelector(".resultados_busqueda_eliminar_juegos");

  alternar_visibilidad_formularios(btn_activar_formulario, contenedor_formulario, formulario, barra_busqueda);

  // Buscar juego en tiempo real (sugerencias del buscador)
  barra_busqueda.addEventListener("input", function () {
    let consulta = barra_busqueda.value.trim();
    if (consulta.length > 0) {
      buscar_juego_formulario(consulta, resultados_busqueda, barra_busqueda);
    } else {
      resultados_busqueda.innerHTML = ""; // Limpiar si no hay texto
    }
  });

  formulario.addEventListener("submit", function (event) {
    event.preventDefault();
    let consulta = barra_busqueda.value.trim();
    // Mostrar confirmación antes de eliminar
    if (confirm(`¿Estás seguro de que deseas eliminar ${consulta}`)) {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", `../app/modelo/perfil_usuario_modelo.php`, true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

      let datos = `eliminar=${encodeURIComponent(consulta)}`;

      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          let resultado = JSON.parse(xhr.responseText);
          if (resultado.estado === "eliminado") {
            alert("Juego eliminado!");
          } else {
            alert("Juego no encontrado!");
          }
          formulario.reset(); // Esto limpia el formulario después de añadir el juego
          formulario.style.display = "none";
        }
      };
      xhr.send(datos);
    }
  });
}

// ------------------------------------------------------------------------------------------------ //
// ------------------------ FUNCIONAMIENTO DEL FORMULARIO DE AGREGAR REVIEW ------------------------ //
// ------------------------------------------------------------------------------------------------ //

function agregar_juego() {
  let btn_agregar_juego = document.querySelector(".btn_agregar_juego");
  let contenedor_formulario = document.querySelector(".contenedor_formulario_agregar_juego");
  let formulario = document.querySelector(".formulario_agregar_juego");
  let barra_busqueda_formulario = document.querySelector(".buscador");
  let resultados_busqueda_formulario = document.querySelector(".resultados_busqueda_formulario");

  btn_agregar_juego.addEventListener("click", function () {
    // Alternar visibilidad del formulario
    if (formulario.style.display === "grid") {
      formulario.style.display = "none"; // Ocultar
    } else {
      contenedor_formulario.style.display = "grid";
      formulario.style.display = "grid"; // Mostrar
      barra_busqueda_formulario.focus(); // Dar foco a la barra de búsqueda
    }
  });

  // Mostrar y ocultar formulario
  contenedor_formulario.addEventListener("click", function (e) {
    if (e.target === contenedor_formulario) {
      // solo si clicas el overlay, no el form
      contenedor_formulario.style.display = "none";
      formulario.style.display = "none";
      formulario.reset(); // Resetea todos los campos del formulario
    }
  });

  // Buscar juego en tiempo real (sugerencias del buscador)
  barra_busqueda_formulario.addEventListener("input", function () {
    let consulta = barra_busqueda_formulario.value.trim();
    if (consulta.length > 0) {
      buscar_juego_formulario(consulta, resultados_busqueda_formulario, barra_busqueda_formulario);
    } else {
      resultados_busqueda_formulario.innerHTML = ""; // Limpiar si no hay texto
    }
  });

  // Manejar envío del formulario
  formulario.addEventListener("submit", function (event) {
    event.preventDefault(); // Evita recarga

    let juego_seleccionado = barra_busqueda_formulario.value.trim();
    let estrellas = parseInt(document.querySelector("input[name='estrella']:checked").value);
    let critica = document.querySelector(".critica_texto").value.trim();
    // Verificar qué etiqueta está seleccionada
    let obra_maestra = document.querySelector(".etiqueta_obra_maestra").checked ? 1 : 0;
    let sobrevalorado = document.querySelector(".etiqueta_sobrevalorado").checked ? 1 : 0;

    // Enviar datos en una cadena de consulta
    let consulta = `juego=${encodeURIComponent(juego_seleccionado)}&estrellas=${estrellas}&critica=${encodeURIComponent(
      critica
    )}&obra_maestra=${obra_maestra}&sobrevalorado=${sobrevalorado}`;

    let xhr = new XMLHttpRequest();
    xhr.open("GET", `../app/modelo/perfil_usuario_modelo.php?${consulta}`, true);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let review = JSON.parse(xhr.responseText);
        if (review) {
          console.log(review);

          agregar_juego_lista(
            review.id_review,
            review.id_juego,
            review.titulo,
            review.portada,
            review.puntuacion,
            review.critica,
            review.etiqueta_obra_maestra,
            review.etiqueta_sobrevalorado
          );

          formulario.reset(); // Limpiar formulario
          formulario.style.display = "none"; // Ocultar formulario
        } else {
          alert("Error al agregar el juego.");
        }
      }
    };
    xhr.send();
  });
}

// Función de búsqueda de juegos en la BD
function buscar_juego_formulario(consulta, resultados_busqueda_formulario, barra_busqueda_formulario) {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", `../app/modelo/perfil_usuario_modelo.php?consulta=${consulta}`, true);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      let juegos = JSON.parse(xhr.responseText);

      resultados_busqueda_formulario.innerHTML = ""; // Limpiar resultados anteriores
      resultados_busqueda_formulario.style.display = "block";

      juegos.forEach(function (juego) {
        let opcion = document.createElement("div");
        opcion.classList.add("opcion_juego");
        opcion.textContent = juego.titulo;

        opcion.addEventListener("click", function () {
          barra_busqueda_formulario.value = juego.titulo;
          barra_busqueda_formulario.style.fontWeight = "bold"; // Simular que está seleccionado (negrita)
          resultados_busqueda_formulario.innerHTML = ""; // Limpiar después de seleccionar
          resultados_busqueda_formulario.style.display = "none";
        });

        resultados_busqueda_formulario.appendChild(opcion);
      });
    }
  };

  xhr.send();

  barra_busqueda_formulario.addEventListener("click", function () {
    barra_busqueda_formulario.value = ""; // Vaciar el input
    barra_busqueda_formulario.style.fontWeight = "normal"; // Restaurar peso de fuente
  });
}

// Función para agregar el juego a la lista visualmente
function agregar_juego_lista(id_review, id_juego, titulo, portada, puntuacion, critica, obra_maestra, sobrevalorado) {
  let lista_juegos_agregados = document.querySelector(".lista_juegos_agregados");

  let estrellas = "../multimedia/iconos/";
  if (puntuacion <= 1) {
    estrellas += "1_estrellas.png";
  } else if (puntuacion <= 2) {
    estrellas += "2_estrellas.png";
  } else if (puntuacion <= 3) {
    estrellas += "3_estrellas.png";
  } else if (puntuacion <= 4) {
    estrellas += "4_estrellas.png";
  } else {
    estrellas += "5_estrellas.png";
  }

  let etiqueta = "";
  if (obra_maestra == "1" && sobrevalorado == "0") {
    etiqueta = '<img class="imagen_etiqueta" src="../multimedia/logos/obra_maestra.jpg" alt="etiqueta de obra maestra">';
  } else if (obra_maestra == "0" && sobrevalorado == "1") {
    etiqueta = '<img class="imagen_etiqueta" src="../multimedia/logos/sobrevalorado.jpg" alt="etiqueta de sobrevalorado">';
  }

  let juego_agregado = document.createElement("div");
  juego_agregado.classList.add(`juego_item_${id_review}`);
  juego_agregado.innerHTML = `
            <div class="contenedor_review">          
                <div class="contenedor">
                    <div class="portada">
                        <a href="ficha_juego.php?id_juego=${id_juego}">
                            <img class="portada_imagen" src="${portada}" alt="Portada de ${titulo}">
                        </a>
                    </div>
                    <div class="informacion">
                        <h3><a href="ficha_juego.php?id_juego=${id_juego}">${titulo}</a></h3>
                        <img class="etiqueta_estrellas" src="${estrellas}" alt="puntuación de ${puntuacion}">
                    </div>
                    <div class="etiqueta">
                        ${etiqueta}
                    </div>
                    <div class="eliminar_review">
                        <button class="btn_eliminar_review" value="${id_review}">
                            <img class="papelera" src="../multimedia/iconos/borrar.png" alt="icono de borrar">
                        </button>  
                    </div>
                </div>
                <div class="contenedor_critica">
                    <p class="texto_critica">${critica}</p>
                </div>  
                <button class="btn_expandir">Ver más</button>
            </div>  
    `;

  lista_juegos_agregados.prepend(juego_agregado); // Agrega el nuevo juego al inicio de la lista

  // --- Lógica del botón "Ver más" solo si el texto se corta ---
  let texto_critica = juego_agregado.querySelector(".texto_critica");
  let btn_expandir = juego_agregado.querySelector(".btn_expandir");

  if (texto_critica.scrollHeight <= texto_critica.clientHeight) {
    btn_expandir.style.display = "none"; // Oculta si no hay texto oculto
  }

  btn_expandir.addEventListener("click", () => {
    texto_critica.classList.toggle("expandir");
    btn_expandir.textContent = texto_critica.classList.contains("expandir") ? "Ver menos" : "Ver más";
  });

  eliminar_review();
}

// Función eliminar la review
function eliminar_review() {
  let btn_borrar = document.querySelectorAll(".btn_eliminar_review");

  btn_borrar.forEach(function (btn) {
    if (!btn.dataset.listener) {
      // Verificamos si el botón ya tiene el evento
      btn.dataset.listener = "true"; // Marcamos que ya tiene un evento asignado

      btn.addEventListener("click", function () {
        let id_review = btn.value;
        // Mostrar confirmación antes de eliminar
        if (confirm("¿Estás seguro de que deseas eliminar esta revisión?")) {
          var xhr = new XMLHttpRequest();
          xhr.open("GET", `../app/modelo/perfil_usuario_modelo.php?id_review=${id_review}`, true);

          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
              let review_borrada = JSON.parse(xhr.responseText);
              if (review_borrada.estado === "eliminado") {
                let review_item = document.querySelector(`.juego_item_${id_review}`);
                review_item.remove();
                alert("Review eliminada");
              }
            }
          };
          xhr.send();
        }
      });
    }
  });
}
