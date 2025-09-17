<?php
session_start();

// Si no está logueado (no existe la variable 'id_usuario' en la sesión), redirigir a la página de registro
if (!isset($_SESSION['id_usuario'])) {
    header('Location: registro_login.php'); // Redirige a la página de registro
    exit(); // Es importante llamar a exit después de header para detener la ejecución del script
}

require_once "../conexion/conexion_bbdd.php";

// Al cargar la pagina
if (isset($_GET['id_usuario'])) {
    $informacion_usuario = obtener_informacion_usuario ($conexion);
    $juegos_top = obtener_juegos_top($conexion);
    $lista_reviews = obtener_lista_reviews($conexion, $_GET['id_usuario']);

    $Carga_inicial = ["informacion_usuario" => $informacion_usuario, "juegos_top" => $juegos_top, "lista_reviews" => $lista_reviews];
    echo json_encode ($Carga_inicial);
    exit;
}

// Si esta cambiado el avatar
if (isset($_POST['avatar'])) {
    cambia_avatar($conexion);
}

// Si se está haciendo una búsqueda
if (isset($_GET['consulta'])) {
    consultas_buscadores($conexion);
}

//Si se esta estableciendo un juego en el TOP 3
if (isset($_GET['id_juego'])) {
    guardar_juego_top($conexion);
}

// Si se está baneando un usuario
if (isset($_POST['banear'])) {
    banear_usuario($conexion);
}

if (isset($_POST['modo'])) {
    if ($_POST['modo'] === 'modificar') {
        modificar_juego($conexion);
    } elseif ($_POST['modo'] === 'añadir') {
        añadir_juego($conexion);
    }
}

// Si se está eliminando un juego
if (isset($_POST['eliminar'])) {
    eliminar_juego($conexion);
}

// Si se está agregando una review
if (isset($_GET['juego'])) {
    insertar_nueva_review($conexion);
}

// Si se elimina una review
if (isset($_GET['id_review'])) {
    eliminar_review($conexion);
}


// -------------- CONSULTA DE LOS DATOS DE USUARIO --------------- //

function obtener_informacion_usuario ($conexion) {
    // Recuperar el parámetro 'id_usuario' de la URL
    $id_usuario = isset($_GET['id_usuario']) ? $_GET['id_usuario'] : '';

    // Comprobar si 'consulta' tiene un valor válido
    if ($id_usuario) {
        // Preparar la consulta SQL para buscar los datos de usuario
        $sql = "SELECT usuario, imagen_perfil FROM usuarios WHERE id_usuario = $id_usuario";

        // Ejecutar la consulta
        $resultado = $conexion->query($sql);

        // Obtener los datos del juego
        $informacion_usuario = $resultado->fetch_assoc();

        // Devolver los resultados como un JSON
        return $informacion_usuario;
    }
}

function cambia_avatar ($conexion) {
    // Comprobar que el usuario está logueado
    if (!isset($_SESSION['id_usuario'])) {
        exit;}
    $id_usuario = $_SESSION['id_usuario'];

    // Comprobar que se ha subido un archivo
    if (!isset($_FILES['avatar'])) {
        exit;
    }
    $avatar = $_FILES['avatar'];

    // Extraer extensión real
    $extension = pathinfo($avatar['name'], PATHINFO_EXTENSION);

    // Carpeta destino
    $ruta_destino = "../multimedia/avatares/avatar_" . $id_usuario . "." . $extension;

    // Mover el archivo a la carpeta
    move_uploaded_file($avatar['tmp_name'], $ruta_destino);

    // Guardar ruta en la base de datos
    $sql = "UPDATE usuarios SET imagen_perfil='$ruta_destino' WHERE id_usuario=$id_usuario";
    $conexion->query($sql);

    echo json_encode(['estado' => 'exito']);
    exit;
}


// -------------- CONSULTAS DE LOS BUSCADORES (avata Y FORMULARIO) --------------- //

function consultas_buscadores ($conexion) {
    // Recuperar el parámetro 'query' de la URL
    $consulta = isset($_GET['consulta']) ? trim($_GET['consulta']) : '';

    // Preparar la consulta SQL para buscar juegos cuyo nombre contenga la palabra clave
    $sql = "SELECT id_juego, titulo, portada FROM juegos WHERE titulo LIKE '%$consulta%' LIMIT 5";

    // Ejecutar la consulta
    $resultado = $conexion->query($sql);

    // Obtener los datos del juego
    $juegos = [];

    while ($fila = $resultado->fetch_assoc()) {
    $juegos[] = $fila;
    }

    // Devolver los resultados como un JSON
    echo json_encode($juegos);
    exit;
}

function guardar_juego_top($conexion) {
    $id_usuario = isset($_SESSION['id_usuario']) ? $_SESSION['id_usuario'] : "";
    $id_juego = isset($_GET['id_juego']) ? $_GET['id_juego'] : "";
    $posicion = isset($_GET['posicion']) ? $_GET['posicion'] : "";

    // Guardar el juego seleccionado en el Top 3
    $sql = "INSERT INTO top_juegos (id_usuario, id_juego, posicion) 
            VALUES ($id_usuario, $id_juego, $posicion)
            ON DUPLICATE KEY UPDATE id_juego = $id_juego, posicion = $posicion";
    $conexion->query($sql);

    // Responder con éxito
    echo json_encode(['estado' => 'exito']);
}

function obtener_juegos_top($conexion) {
    $id_usuario = isset($_GET['id_usuario']) ? $_GET['id_usuario'] : "";

    $sql = "SELECT j.id_juego, j.titulo, j.portada
            FROM top_juegos t
            JOIN juegos j ON t.id_juego = j.id_juego
            WHERE t.id_usuario = $id_usuario
            ORDER BY t.posicion ASC";
    $resultado = $conexion->query($sql);

    $juegos_top= [];
    while ($fila = $resultado->fetch_assoc()) {
        $juegos_top[] = $fila;
    }
    // Responder con éxito
    return $juegos_top;
}

// -------------- ADMINISTRADOR: FORMULARIOS DE GESTIÓN --------------- //

function banear_usuario($conexion) {
    $usuario_baneado = isset($_POST["banear"]) ? $_POST["banear"] : "";

    $sql = "DELETE FROM usuarios WHERE usuario = '$usuario_baneado'";
    $conexion->query($sql);
    
    if ($conexion->affected_rows > 0) {
        // Si la eliminación fue exitosa
        echo json_encode(["estado" => "eliminado"]);
    } else {
        // Si la eliminación falló
        echo json_encode(["estado" => "no_existe"]);
    }
    exit;
}

function modificar_juego($conexion) {
    // Con esto ire contando la cantidad de cambios que se efectuan por todas las modificaciones.
    $filas_afectadas = 0;

    // Recoger los datos enviados por el formulario
    $titulo = isset($_POST['titulo']) ? $_POST['titulo'] : "";
    $portada = isset($_POST['portada']) ? $_POST['portada'] : "";
    $desarrolladora = isset($_POST['desarrolladora']) ? $_POST['desarrolladora'] : "";
    $plataformas = isset($_POST['plataforma']) ? $_POST['plataforma'] : [];
    $generos = isset($_POST['genero']) ? $_POST['genero'] : [];
    $lanzamiento = isset($_POST['lanzamiento']) ? $_POST['lanzamiento'] : "";
    $duracion = isset($_POST['duracion']) ? $_POST['duracion'] : "";
    $descripcion = isset($_POST['descripcion']) ? $_POST['descripcion'] : "";

    // Obtenemos el id_juego
    $resultado = $conexion->query("SELECT id_juego FROM juegos WHERE titulo = '$titulo'");
    $id_juego = $resultado->fetch_assoc()['id_juego'];

    // Construir la consulta UPDATE dinámicamente
    $sql = "UPDATE juegos SET ";
    $updates = [];

    $updates[] = ($portada === "") ? "portada = DEFAULT" : "portada = '$portada'";
    $updates[] = ($desarrolladora === "") ? "desarrolladora = DEFAULT" : "desarrolladora = '$desarrolladora'";
    $updates[] = ($lanzamiento === "" || $lanzamiento === null) ? "lanzamiento = 'Desconocido'" : "lanzamiento = '$lanzamiento'";
    $updates[] = ($duracion === "" || $duracion === null) ? "duracion = 'Desconocida'" : "duracion = '$duracion'";
    $updates[] = ($descripcion === "") ? "descripcion = DEFAULT" : "descripcion = '$descripcion'";
    
    // Unir los campos con comas y agregar el WHERE
    $sql .= implode(", ", $updates) . " WHERE titulo = '$titulo'";
    $conexion->query($sql);

    $filas_afectadas += $conexion->affected_rows;

    // Actualizar plataformas
    if (!empty($plataformas)) {
        // Eliminar plataformas antiguas
        $conexion->query("DELETE FROM juegos_plataformas WHERE id_juego = $id_juego");

        $filas_afectadas += $conexion->affected_rows;

        // Obtener el id_plataforma para cada plataforma
        foreach ($plataformas as $plataforma) {
            // Buscar el id_plataforma correspondiente
            $consulta_plataforma = $conexion->query("SELECT id_plataforma FROM plataformas WHERE plataforma = '$plataforma'");

            // Si existe la plataforma, obtenemos el id
            if ($consulta_plataforma->num_rows > 0) {
                $plataforma_info = $consulta_plataforma->fetch_assoc();
                $id_plataforma = $plataforma_info['id_plataforma'];
            } else {
                // Si no existe, insertamos la nueva plataforma
                $conexion->query("INSERT INTO plataformas (plataforma) VALUES ('$plataforma')");
                $id_plataforma = $conexion->insert_id; // Obtenemos el id recién insertado
            }

             // Insertar el id_plataforma en la tabla juegos_plataformas
             $conexion->query("INSERT INTO juegos_plataformas (id_juego, id_plataforma) VALUES ($id_juego, $id_plataforma)");
             $filas_afectadas += $conexion->affected_rows;
        }
    }

    // Actualizar géneros
    if (!empty($generos)) {
        // Eliminar géneros antiguos
        $conexion->query("DELETE FROM juegos_generos WHERE id_juego = $id_juego");

        $filas_afectadas += $conexion->affected_rows;

         // Obtener el id_plataforma para cada plataforma
         foreach ($generos as $genero) {
            // Buscar el id_plataforma correspondiente
            $consulta_genero = $conexion->query("SELECT id_genero FROM generos WHERE genero = '$genero'");

            // Si existe la plataforma, obtenemos el id
            if ($consulta_genero->num_rows > 0) {
                $genero_info = $consulta_genero->fetch_assoc();
                $id_genero = $genero_info['id_genero'];
            } else {
                // Si no existe, insertamos el nuevo género
                $conexion->query("INSERT INTO generos (genero) VALUES ('$genero')");
                $id_genero = $conexion->insert_id; // Obtenemos el id recién insertado
            }

            // Insertar el id_plataforma en la tabla juegos_plataformas
            $conexion->query("INSERT INTO juegos_generos (id_juego, id_genero) VALUES ($id_juego, $id_genero)");
            $filas_afectadas += $conexion->affected_rows;
        }
    }

    if ($filas_afectadas > 0) {
        echo json_encode(["estado" => "modificado"]);
    } else {
        echo json_encode(["estado" => "sin_cambios"]);
    }
    exit;
}

function añadir_juego($conexion) {
    // Con esto iré contando la cantidad de cambios que se efectúan por todas las modificaciones.
    $filas_afectadas = 0;

    // Recoger los datos enviados por el formulario
    $titulo = isset($_POST['titulo']) ? $_POST['titulo'] : "";
    $portada = isset($_POST['portada']) ? $_POST['portada'] : "";
    $desarrolladora = isset($_POST['desarrolladora']) ? $_POST['desarrolladora'] : "";
    $plataformas = isset($_POST['plataforma']) ? $_POST['plataforma'] : [];
    $generos = isset($_POST['genero']) ? $_POST['genero'] : [];
    $lanzamiento = isset($_POST['lanzamiento']) ? $_POST['lanzamiento'] : "";
    $duracion = isset($_POST['duracion']) ? $_POST['duracion'] : "";
    $descripcion = isset($_POST['descripcion']) ? $_POST['descripcion'] : "";

    // Insertar el nuevo juego en la tabla juegos
    $sql = "INSERT INTO juegos (titulo, portada, desarrolladora, lanzamiento, duracion, descripcion)
            VALUES ('$titulo', '$portada', '$desarrolladora', '$lanzamiento', '$duracion', '$descripcion')";

    $conexion->query($sql);

    // Obtener el id_juego del juego recién insertado
    $resultado = $conexion->query("SELECT id_juego FROM juegos WHERE titulo = '$titulo'");
    $id_juego = $resultado->fetch_assoc()['id_juego'];

    // Insertar géneros
    if (!empty($generos)) {
        foreach ($generos as $genero) {
            // Verificar si el género ya existe
            $consulta_genero = $conexion->query("SELECT id_genero FROM generos WHERE genero = '$genero'");
            if ($consulta_genero->num_rows > 0) {
                // Si ya existe, obtenemos el id_genero
                $genero_info = $consulta_genero->fetch_assoc();
                $id_genero = $genero_info['id_genero'];
            } else {
                // Si no existe, insertamos el nuevo género
                $conexion->query("INSERT INTO generos (genero) VALUES ('$genero')");
                $id_genero = $conexion->insert_id; // Obtenemos el id recién insertado
            }

            // Insertar la relación entre el juego y el género en la tabla intermedia
            $conexion->query("INSERT INTO juegos_generos (id_juego, id_genero) VALUES ($id_juego, $id_genero)");
            $filas_afectadas += $conexion->affected_rows;
        }
    }

    // Insertar plataformas
    if (!empty($plataformas)) {
        foreach ($plataformas as $plataforma) {
            // Verificar si la plataforma ya existe
            $consulta_plataforma = $conexion->query("SELECT id_plataforma FROM plataformas WHERE plataforma = '$plataforma'");
            if ($consulta_plataforma->num_rows > 0) {
                // Si ya existe, obtenemos el id_plataforma
                $plataforma_info = $consulta_plataforma->fetch_assoc();
                $id_plataforma = $plataforma_info['id_plataforma'];
            } else {
                // Si no existe, insertamos la nueva plataforma
                $conexion->query("INSERT INTO plataformas (plataforma) VALUES ('$plataforma')");
                $id_plataforma = $conexion->insert_id; // Obtenemos el id recién insertado
            }

            // Insertar la relación entre el juego y la plataforma en la tabla intermedia
            $conexion->query("INSERT INTO juegos_plataformas (id_juego, id_plataforma) VALUES ($id_juego, $id_plataforma)");
            $filas_afectadas += $conexion->affected_rows;
        }
    }

    if ($filas_afectadas > 0) {
        echo json_encode(["estado" => "añadido"]);
    } else {
        echo json_encode(["estado" => "sin_cambios"]);
    }
    exit;
}

function eliminar_juego($conexion) {
    $juego_eliminado = isset($_POST["eliminar"]) ? $_POST["eliminar"] : "";

    $sql = "DELETE FROM juegos WHERE titulo = '$juego_eliminado'";
    $conexion->query($sql);
    
    if ($conexion->affected_rows > 0) {
        echo json_encode(["estado" => "eliminado"]);
    } else {
        echo json_encode(["estado" => "no_existe"]);
    }
    exit;
}


// -------------- INSERTAR NUEVA REVIEW --------------- //

function insertar_nueva_review($conexion) {

    $id_usuario = isset($_SESSION['id_usuario']) ? $_SESSION['id_usuario'] : "";
    $titulo_juego = isset($_GET['juego']) ? $_GET['juego'] : "";
    $estrellas = isset($_GET['estrellas']) ? $_GET['estrellas'] : "";
    $critica = isset($_GET['critica']) ? $_GET['critica'] : "";
    $obra_maestra = isset($_GET['obra_maestra']) ? $_GET['obra_maestra'] : "";
    $sobrevalorado = isset($_GET['sobrevalorado']) ? $_GET['sobrevalorado'] : "";
    
    // Obtener id_juego a partir del título
    $query_obtener_id_juego = "SELECT id_juego FROM juegos WHERE titulo = '$titulo_juego'";
    $resultado_obtener_id_juego = $conexion->query($query_obtener_id_juego);
    $fila_obtener_id_juego = $resultado_obtener_id_juego->fetch_assoc();
    $id_juego = $fila_obtener_id_juego['id_juego'];

    // Insertar review
    $query_insertar_review = "INSERT INTO reviews (id_usuario, id_juego, puntuacion, critica, etiqueta_obra_maestra, etiqueta_sobrevalorado, fecha) VALUES ($id_usuario, $id_juego, $estrellas, '$critica', $obra_maestra, $sobrevalorado, NOW())";

    $resultado = $conexion->query($query_insertar_review);

    if ($resultado) {
        recalcular_valoracion_media($conexion, $id_juego);
        obtener_porcentaje_etiqueta($conexion, $id_juego, $obra_maestra);
        obtener_porcentaje_etiqueta($conexion, $id_juego, $sobrevalorado);
        
        // Obtener detalles del juego directamente aquí
        $query_detalles = "SELECT r.id_review, r.id_juego, j.titulo, j.portada, r.puntuacion, r.critica, r.etiqueta_obra_maestra, r.etiqueta_sobrevalorado 
            FROM reviews r 
            JOIN juegos j ON r.id_juego = j.id_juego 
            WHERE r.id_usuario = $id_usuario 
            ORDER BY r.id_review DESC LIMIT 1";

        $resultado_detalles = $conexion->query($query_detalles);
        $review = $resultado_detalles->fetch_assoc();
    }

    echo json_encode($review);
    exit;
}

function recalcular_valoracion_media($conexion, $id_juego) {
// Verificar si esta es la primera review del juego
    $resultado = $conexion->query("SELECT COUNT(*) AS total FROM reviews WHERE id_juego = $id_juego");
    $fila = $resultado->fetch_assoc();

    if ($fila['total'] == 1) {
        // Es la primera review -> resetear valoracion_media a 0
        $conexion->query("UPDATE juegos SET valoracion_media = 0 WHERE id_juego = $id_juego");
    }

    // Calcular la nueva media de los usuarios
    $resultado_media = $conexion->query("SELECT AVG(puntuacion) AS nueva_media FROM reviews WHERE id_juego = $id_juego");
    $fila_media = $resultado_media->fetch_assoc();
    $nueva_media = round($fila_media['nueva_media'], 2);

    // Actualizar la valoracion_media del juego
    $conexion->query("UPDATE juegos SET valoracion_media = $nueva_media WHERE id_juego = $id_juego");
}

function obtener_porcentaje_etiqueta($conexion, $id_juego, $etiqueta) {
    // Contar cuántas veces el juego ha sido marcado con la etiqueta específica
    $resultado_etiqueta = $conexion->query("SELECT COUNT(*) AS total_etiqueta FROM reviews WHERE id_juego = $id_juego AND $etiqueta = 1");
    $total_etiqueta = $resultado_etiqueta->fetch_assoc()['total_etiqueta'];

    // Contar cuántas reviews tiene el juego en total
    $resultado_total_reviews = $conexion->query("SELECT COUNT(*) AS total_reviews FROM reviews WHERE id_juego = $id_juego");
    $total_reviews = $resultado_total_reviews->fetch_assoc()['total_reviews'];

    // Calcular el porcentaje de usuarios que marcaron el juego con la etiqueta
    if ($total_reviews > 0) {
        $porcentaje = ($total_etiqueta / $total_reviews) * 100;
    } else {
        $porcentaje = 0; // Si no hay reviews, el porcentaje es 0
    }
}

// -------------- OBTENER LA LISTA CON TODAS REVIEWS REALIZADAS --------------- //

function obtener_lista_reviews($conexion, $id_usuario) {

    $sql = "SELECT juegos.id_juego, juegos.titulo, juegos.portada, reviews.id_review, reviews.puntuacion, reviews.critica, reviews.etiqueta_obra_maestra, reviews. etiqueta_sobrevalorado
            FROM reviews 
            INNER JOIN juegos ON reviews.id_juego = juegos.id_juego 
            WHERE reviews.id_usuario = $id_usuario";
    $resultado = $conexion->query($sql);

    $reviews = [];
    while ($fila = $resultado->fetch_assoc()) {
        $reviews[] = $fila;
    }
    return $reviews;
    exit;
}


// -------------- ELIMINAR UNA REVIEW --------------- //

function eliminar_review($conexion) {
        $id_review = $_GET['id_review'];
    
        // Eliminamos la revisión sin usar prepare o bind_param
        $sql = "DELETE FROM reviews WHERE id_review = $id_review";
        $resultado = $conexion->query($sql);
    
        echo json_encode(["estado" => "eliminado"]);
        exit;
}

// Cerramos la conexión a la base de datos
$conexion->close(); 
?>


