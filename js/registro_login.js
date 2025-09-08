document.addEventListener("DOMContentLoaded", function () {
  // ------- SELECCIÓN DE LOS ELEMENTOS DEL DOM --------- //

  //  Selección de elementos del DOM del formulario de registro
  let form = document.querySelector(".formulario");
  let email = form.querySelector("input[name='email']");
  let usuario = form.querySelector("input[name='usuario']");
  let contraseña = form.querySelector("input[name='contraseña']");
  let confirmar_contraseña = form.querySelector("input[name='confirmar_contraseña']");
  let condiciones = form.querySelector("input[name='condiciones']");
  let btn_alternar_crear_cuenta_entrar = form.querySelector(".btn_crear_cuenta");
  let btn_alternar_registro_login = form.querySelector(".btn_registro_login");
  let titulo_formulario = form.querySelector(".registro");

  // Selección de los elementos de la cabecera
  let head_btn_registro = document.querySelector(".head_btn-registro");
  let head_btn_login = document.querySelector(".head_btn-login");

  // ------- ALTERNAR REGFISTRO / LOGIN --------- //

  let pantalla_registro = true;

  // Evento para el botón dentro del formulario que alterna entre login y registro
  btn_alternar_registro_login.addEventListener("click", function () {
    if (titulo_formulario.textContent === "REGISTRATE") {
      mostrar_login();
    } else {
      mostrar_registro();
    }
  });

  // Detectar el parámetro en la URL (CABECERA) al cargar la página para dirigir a REGISTRO o a LOGIN
  let params = new URLSearchParams(window.location.search);
  if (params.get("modo") === "login") {
    mostrar_login();
  } else {
    mostrar_registro();
  }

  // Eventos para los botones de la cabecera
  head_btn_registro.addEventListener("click", function (event) {
    event.preventDefault();
    mostrar_registro();
  });

  head_btn_login.addEventListener("click", function (event) {
    event.preventDefault();
    mostrar_login();
  });

  // Función para cambiar a la vista de registro
  function mostrar_registro() {
    titulo_formulario.textContent = "REGISTRATE";
    document.querySelector(".email").style.display = "flex";
    document.querySelector(".confirmar_contraseña").style.display = "flex";
    document.querySelector(".condiciones").style.display = "flex";
    btn_alternar_crear_cuenta_entrar.textContent = "Crear cuenta";
    btn_alternar_registro_login.previousSibling.textContent = "¿ya tienes cuenta? ";
    btn_alternar_registro_login.textContent = "Inicia sesión";

    pantalla_registro = true;

    // Restablecer los eventos de validación
    email.addEventListener("blur", verificar_email);
    usuario.addEventListener("blur", verificar_usuario);

    // Habilitar los campos
    email.disabled = false;
    confirmar_contraseña.disabled = false;
    condiciones.disabled = false;

    // Si quieres que los campos estén vacíos cuando cambias de formulario
    email.value = "";
    usuario.value = "";
    contraseña.value = "";
    confirmar_contraseña.value = "";
  }

  // Función para cambiar a la vista de login
  function mostrar_login() {
    titulo_formulario.textContent = "INICIA SESIÓN";
    document.querySelector(".email").style.display = "none";
    document.querySelector(".confirmar_contraseña").style.display = "none";
    document.querySelector(".condiciones").style.display = "none";
    btn_alternar_crear_cuenta_entrar.textContent = "Entrar";
    btn_alternar_registro_login.previousSibling.textContent = "¿Aún no tienes cuenta? ";
    btn_alternar_registro_login.textContent = "Regístrate";

    pantalla_registro = false;

    // Eliminar eventos de verificación (para que no validen en login)
    email.removeEventListener("blur", verificar_email);
    usuario.removeEventListener("blur", verificar_usuario);

    // Ocultar los mensajes de error al cambiar a login
    let mensajes_error = form.querySelectorAll(".error");
    mensajes_error.forEach(function (mensaje) {
      mensaje.style.display = "none";

      // Desactivar campos de confirmación de email, contraseña y condiciones
      email.disabled = true;
      confirmar_contraseña.disabled = true;
      condiciones.disabled = true;

      // Si quieres que los campos estén vacíos cuando cambias de formulario
      usuario.value = "";
      contraseña.value = "";
    });
  }

  // ------- VALIDACIÓN DE LOS CAMPOS --------- //

  // Esta funcion se encarga de validar que los valores introducidos en los campos cumplan con unos estandares
  function validar_campos() {
    let errores = [];

    // Validación de correo (comprueba que el correo tiene el formato estandar)
    let email_validacion = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email_validacion.test(email.value)) {
      errores.push("El correo electrónico no es válido.");
    }

    // Validación de usuario (mínimo 4 caracteres)
    if (usuario.value.trim().length < 4) {
      errores.push("El nombre de usuario debe tener al menos 4 caracteres.");
    } else {
      // Validación de usuario (solo letras y números, mínimo 4 caracteres)
      let usuario_validacion = /^[a-zA-Z0-9]+$/;
      if (!usuario_validacion.test(usuario.value)) {
        errores.push("El nombre de usuario solo puede contener letras y números, sin espacios ni caracteres especiales.");
      } else if (usuario.value.length < 4) {
        errores.push("El nombre de usuario debe tener al menos 4 caracteres.");
      }
    }

    // Validación de contraseña
    let contraseña_validacion = /^(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!contraseña_validacion.test(contraseña.value)) {
      errores.push("La contraseña debe tener al menos 8 caracteres, un número y un carácter especial.");
    }

    // Validación de la Confirmación de contraseña
    if (contraseña.value !== confirmar_contraseña.value) {
      errores.push("Las contraseñas no coinciden.");
    }

    // Validación de que se haya aceptado el Checkbox de condiciones
    if (!condiciones.checked) {
      errores.push("Debes aceptar los términos y condiciones.");
    }

    // Si hay errores, los mostramos y detenemos el envío
    if (errores.length > 0) {
      alert(errores.join("\n"));
      return false; // Si hay errores, no enviamos los datos
    } else {
      return true; // Si no hay errores, lo enviamos
    }
  }

  // ------- BOTÓN MOSTRAR/COULTAR CONTRASEÑA --------- //

  // Botón mostrar/ocultar contraseña
  let mostrar_ocultar_contraseña = document.querySelector(".btn_mostrar-contraseña");
  let img_mostrar_ocultar_contraseña = mostrar_ocultar_contraseña.querySelector("img");

  // Función para alternar entre mostrar y ocultar contraseña
  mostrar_ocultar_contraseña.addEventListener("click", (e) => {
    e.preventDefault();

    if (contraseña.type === "password") {
      contraseña.type = "text";
      img_mostrar_ocultar_contraseña.src = "../multimedia/iconos/ojo-cerrado.webp";
    } else {
      contraseña.type = "password";
      img_mostrar_ocultar_contraseña.src = "../multimedia/iconos/ojo.webp";
    }
  });

  // ------- VERIFICACIÓN DE LA EXISTENCIA DEL EMAIL Y EL USUARIO --------- //

  // Funciones para la verificación
  function verificar_email() {
    if (email.value.trim() !== "") {
      verificar_disponibilidad("email", email.value);
    }
  }

  function verificar_usuario() {
    if (usuario.value.trim() !== "") {
      verificar_disponibilidad("usuario", usuario.value);
    }
  }

  // Función para verificar disponibilidad de email y usuario
  function verificar_disponibilidad(tipo, valor) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", `../app/modelo/registro_usuario_modelo.php?tipo=${tipo}&valor=${encodeURIComponent(valor)}`, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let response = JSON.parse(xhr.responseText);

        // Obtener el mensaje de error según el tipo
        let mensaje_error = document.querySelector(`.mensaje-${tipo}`);
        if (!response.disponible) {
          // Si el valor no está disponible, mostramos el mensaje de error
          mensaje_error.textContent = `El ${tipo} ya está en uso.`;
          mensaje_error.style.display = "block";
          document.querySelector(`[name="${tipo}"]`).value = ""; // Borra el campo incorrecto
        } else {
          // Si está disponible, limpiamos el mensaje
          mensaje_error.style.display = "none";
        }
      }
    };
    xhr.send();
  }

  // ------- REGISTRAR NUEVO USUARIO / INICIAR SESIÓN --------- //

  // Evento del boton CREAR CUENTA / ENTRAR
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que el formulario se envíe de forma tradicional

    if (pantalla_registro) {
      if (validar_campos()) {
        // Si las validaciones son correctas
        enviar_datos(); // Enviamos los datos al servidor
      }
    } else {
      iniciar_sesion();
    }
  });

  // Función para enviarlos los datos del formulario para el registro
  function enviar_datos() {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "../app/modelo/registro_usuario_modelo.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    let datos = `email=${encodeURIComponent(email.value)}&usuario=${encodeURIComponent(usuario.value)}&contraseña=${encodeURIComponent(
      contraseña.value
    )}`;

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        alert(xhr.responseText); // Muestra la respuesta del servidor
      }
    };

    form.reset(); // Limpiar formulario tras registro exitoso
    xhr.send(datos);
  }

  // Funcion para enviar los datos para iniciar sesión
  function iniciar_sesion() {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "../app/modelo/login_modelo.php", true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    let datos = `usuario=${encodeURIComponent(usuario.value)}&contraseña=${encodeURIComponent(contraseña.value)}`;

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let respuesta = xhr.responseText.trim();

        if (respuesta === "admin") {
          alert("Bienvenido ADMINISTRADOR.");
          window.location.href = "home.php";
        } else if (respuesta === "exito") {
          alert(`Bienvenido ${usuario.value}`);
          window.location.href = "home.php";
        } else {
          alert(respuesta); // Muestra "Usuario no encontrado" o "Contraseña incorrecta"
        }
      }
    };

    xhr.send(datos);
  }
});
