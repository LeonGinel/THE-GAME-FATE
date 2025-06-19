<?php

require_once 'conexion/conexion_bbdd.php';

// Función para obtener juegos de RAWG API
function obtener_juegos($pagina = 1) {
    $url = "https://api.rawg.io/api/games?key=".API_KEY."&page=$pagina&page_size=100"; // Obtener 100 juegos por página
    $json = file_get_contents($url);
    return json_decode($json, true); // Decodificamos el JSON en un array asociativo
}

// Funcion para obtener los detalles de cada juego
function obtener_detalles_juegos ($id_rawg) {
    $url = "https://api.rawg.io/api/games/$id_rawg?key=".API_KEY;
    $json = file_get_contents($url);
    return json_decode($json, true); // Decodificamos el JSON en un array asociativo
}


// Obtener solo los "id" de cada juego
$pagina = 1; // Empezamos por la página 1
$juegos = obtener_juegos($pagina); // Llamamos a la función para obtener los juegos

foreach ($juegos['results'] as $juego) {
    $id_rawg = $juego['id']; // ID del juego en RAWG

    // Llamada a la función con los detalles de cada juego (gracias a su "id" obtenido con la función "obtener_juegos")
    $detalles = obtener_detalles_juegos($id_rawg);
    
    // Comienza la extracción e inserción de datos
    $titulo = $detalles['name']; // Titulo del juego
    $portada = isset($detalles['background_image']) ? $detalles['background_image'] : "multimedia/imagenes/img_no_disponible.png";
    $lanzamiento = isset($detalles['released']) ? substr($detalles['released'], 0, 4) : "Desconocido"; // Año de lanzamiento
    $valoracion = isset($detalles['rating']) ? $detalles['rating'] : 0; // Valoración del juego
    $duracion = isset($detalles['playtime']) ? $detalles['playtime'] : NULL;
    $desarrolladora = isset($detalles['developers'][0]['name']) ? $detalles['developers'][0]['name'] : "Desconocido"; // Obtener desarrolladora (solo la primera si hay varias)
    $descripcion = isset($detalles['description_raw']) ? $detalles['description_raw'] : NULL;

    

    // Comprueba si el juego ya existe en la bbdd
    $juego_check = $conexion->query("SELECT id_rawg FROM juegos WHERE id_rawg = $id_rawg");

    // Todo esto es para escapar los apóstrofes y otros caracteres especiales
    $titulo = mysqli_real_escape_string($conexion, $titulo);                  
    $desarrolladora = mysqli_real_escape_string($conexion, $desarrolladora);  
    $lanzamiento = mysqli_real_escape_string($conexion, $lanzamiento);        
    $valoracion = mysqli_real_escape_string($conexion, $valoracion);          
    $duracion = mysqli_real_escape_string($conexion, $duracion);              
    $portada = mysqli_real_escape_string($conexion, $portada);                
    $descripcion = mysqli_real_escape_string($conexion, htmlspecialchars($descripcion, ENT_QUOTES, 'UTF-8'));                

    // Si el juego no existe, se inserta en la base de datos
    if ($juego_check->num_rows == 0) {
        $sql = "INSERT INTO juegos (id_rawg, titulo, desarrolladora, lanzamiento, valoracion_media, duracion, portada, descripcion) 
            VALUES ('$id_rawg', '$titulo', '$desarrolladora', '$lanzamiento', '$valoracion', '$duracion', '$portada', '$descripcion')";

        // Ahora se insertan los campos multivaluados 
        if ($conexion->query($sql) === TRUE) {
            echo "Juego insertado: $titulo <br>";
            $id_juego = $conexion->insert_id; // Guardar el ID del juego para las tablas realcionales
    
             // Inserta géneros del juego
            foreach ($detalles['genres'] as $genero) {
                //comprueba si existe el nombre del género en la API
                $nombre_genero = isset($genero['name']) ? $genero['name'] : "Desconocido";
    
                // Comprueba si el género ya existe en la bbdd
                $genero_check = $conexion->query("SELECT id_genero FROM generos WHERE genero = '$nombre_genero'");
    
                if ($genero_check->num_rows == 0) {
                    // Inserta el género si no existe
                    $conexion->query("INSERT INTO generos (genero) VALUES ('$nombre_genero')");
                    $id_genero = $conexion->insert_id;
                } else {
                    // Si el género ya existe se queda con el id para la tabla relacional
                    $row = $genero_check->fetch_assoc();
                    $id_genero = $row['id_genero'];
                }

                // Comprueba si la relacion entre el juego y la plataforma ya existe
                $relacion_juego_genero_check = $conexion->query("SELECT id_juego, id_genero FROM juegos_generos WHERE id_juego = '$id_juego' AND id_genero = '$id_genero'");

                if ($relacion_juego_genero_check->num_rows == 0) {
                    // Relaciona el juego con el género en su respectiva tabla
                    $conexion->query("INSERT INTO juegos_generos (id_juego, id_genero) VALUES ('$id_juego', '$id_genero')");
                } else {
                    echo "La relación entre el juego y el género ya existe. Se omite la inserción.<br>";
                }
                
                
            }

            // Inserta platafomas del juego
            foreach ($detalles['platforms'] as $plataforma) {
                //comprueba si existe el nombre de la plataforma en la API
                $nombre_plataforma = isset($plataforma['platform']['name']) ? $plataforma['platform']['name'] : "Desconocida";
    
                // Comprueba si la plataforma ya existe en la bbdd
                $plataforma_check = $conexion->query("SELECT id_plataforma FROM plataformas WHERE plataforma = '$nombre_plataforma'");
    
                if ($plataforma_check->num_rows == 0) {
                    // Inserta la plataforma si no existe
                    $conexion->query("INSERT INTO plataformas (plataforma) VALUES ('$nombre_plataforma')");
                    $id_plataforma = $conexion->insert_id;
                } else {
                    // Si ela plataforma ya existe se queda con el id para la tabla relacional
                    $row = $plataforma_check->fetch_assoc();
                    $id_plataforma = $row['id_plataforma'];
                }

                // Comprueba si la relacion entre el juego y la plataforma ya existe
                $relacion_juego_plataforma_check = $conexion->query("SELECT id_juego, id_plataforma FROM juegos_plataformas WHERE id_juego = '$id_juego' AND id_plataforma = '$id_plataforma'");

                if ($relacion_juego_plataforma_check->num_rows == 0) {
                    // Relaciona el juego con la plataforma en su respectiva tabla
                    $conexion->query("INSERT INTO juegos_plataformas (id_juego, id_plataforma) VALUES ('$id_juego', '$id_plataforma')");
                } else {
                    echo "La relación entre el juego y la plataforma ya existe. Se omite la inserción.<br>";
                }
            }

            // Comprueba si el juego es multijugador o no (si lo es, actualiza el campo)
            foreach ($detalles['tags'] as $tag) {
                $multijugador = $tag['name'];
            
                if ($multijugador == "Multiplayer") {
                    $conexion->query("UPDATE juegos SET multijugador = TRUE WHERE id_rawg = {$juego['id']}");
                }
            
            }
    
            // Indica si ha habido algun error en el proceso
        } else {
            echo "Error al insertar el juego: " . $conexion->error . "<br>";
        }
    }

    $pagina ++;
}

// Cerramos la conexión a la base de datos
$conexion->close(); 

?>
