<?php
session_start();

require_once "../conexion/conexion_bbdd.php";

// Obtener el ID del juego desde la URL
if (isset($_GET['id_juego'])) {
    $informacion_juego = obtener_info_juego($conexion, $_GET['id_juego']);
    $criticas_usuarios = obtener_criticas_juego($conexion, $_GET['id_juego']);
    $etiquetas = calcular_etiquetas($conexion, $_GET['id_juego']);

    $ficha_juego = ["informacion_juego" => $informacion_juego, "criticas_usuarios" => $criticas_usuarios, "etiquetas" => $etiquetas];

    echo json_encode($ficha_juego);
    exit;
};

function obtener_info_juego($conexion, $id_juego) {

    if ($id_juego > 0) {
        // Consulta SQL para obtener los datos del juego
        $query = "SELECT juegos.*, 
                    (SELECT GROUP_CONCAT(DISTINCT generos.genero SEPARATOR ', ') 
                    FROM generos 
                    JOIN juegos_generos ON generos.id_genero = juegos_generos.id_genero 
                    WHERE juegos_generos.id_juego = juegos.id_juego) AS generos,
                    
                    (SELECT GROUP_CONCAT(DISTINCT plataformas.plataforma SEPARATOR ', ') 
                    FROM plataformas 
                    JOIN juegos_plataformas ON plataformas.id_plataforma = juegos_plataformas.id_plataforma 
                    WHERE juegos_plataformas.id_juego = juegos.id_juego) AS plataformas
            FROM juegos
            WHERE juegos.id_juego = $id_juego";
        
        // Ejecutar la consulta
        $resultado = $conexion->query($query);

        // Obtener los datos del juego
        $juego = $resultado->fetch_assoc();

        // Decodifica cualquier entidad HTML en la descripción para que se interprete correctamente en el frontend
        // ENT_QUOTES: Decodifica tanto comillas simples (&apos;) como dobles (&quot;).
        // ENT_HTML5 → Asegura que se decodifiquen todas las entidades válidas en HTML5.
        $juego['descripcion'] = html_entity_decode($juego['descripcion'], ENT_QUOTES | ENT_HTML5, 'UTF-8');                                                                                                     

        // Devolver los resultados
        return $juego;
    };
};

function obtener_criticas_juego($conexion, $id_juego) {
    $query = "SELECT reviews.critica, reviews.fecha, usuarios.id_usuario, usuarios.usuario, usuarios.imagen_perfil 
              FROM reviews
              JOIN usuarios ON reviews.id_usuario = usuarios.id_usuario
              WHERE reviews.id_juego = $id_juego
              ORDER BY reviews.fecha ASC";

    $resultado = $conexion->query($query);
    $criticas = [];

    while ($fila = $resultado->fetch_assoc()) {
        $criticas[] = $fila;
    }

    return $criticas;
}

// Función para calcular el porcentaje de críticas de "Obra Maestra" y "Sobrevalorado"
function calcular_etiquetas($conexion, $id_juego) {
    // Consulta para obtener total de reviews y cuántas tienen cada etiqueta
    $query = "SELECT 
                COUNT(*) as total_reviews,
                SUM(CASE WHEN etiqueta_obra_maestra = 1 THEN 1 ELSE 0 END) as obra_maestra_count,
                SUM(CASE WHEN etiqueta_sobrevalorado = 1 THEN 1 ELSE 0 END) as sobrevalorado_count
              FROM reviews
              WHERE id_juego = $id_juego";

    $resultado = $conexion->query($query);
    $data = $resultado->fetch_assoc();

    // Calcular los porcentajes
    $porcentaje_obra_maestra = ($data['total_reviews'] > 0) ? ($data['obra_maestra_count'] / $data['total_reviews']) * 100 : 0;
    $porcentaje_sobrevalorado = ($data['total_reviews'] > 0) ? ($data['sobrevalorado_count'] / $data['total_reviews']) * 100 : 0;

    // Devolver los porcentajes
    return [
        "porcentaje_obra_maestra" => $porcentaje_obra_maestra,
        "porcentaje_sobrevalorado" => $porcentaje_sobrevalorado
    ];
}

// Cerrar la conexión
$conexion->close();
?>
