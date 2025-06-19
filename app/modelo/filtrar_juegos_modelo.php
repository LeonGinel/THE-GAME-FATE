<?php
// Conectar a la base de datos
require_once '../conexion/conexion_bbdd.php';

// Recoger valores del formulario
$nombre_juego = isset($_GET['nombre_juego']) ? $_GET['nombre_juego'] : '';
$genero = isset($_GET['generos']) ? $_GET['generos'] : '';
$plataforma = isset($_GET['plataformas']) ? $_GET['plataformas'] : '';
$duracion_minima = isset($_GET['duracion_minima']) ? (int) $_GET['duracion_minima'] : 0;
$duracion_maxima = isset($_GET['duracion_maxima']) ? (int) $_GET['duracion_maxima'] : 500;
$año_minimo = isset($_GET['año_minimo']) ? (int) $_GET['año_minimo'] : 1900;
$año_maximo = isset($_GET['año_maximo']) ? (int) $_GET['año_maximo'] : date('Y');
$multi = isset($_GET['multi']) ? (int) $_GET['multi'] : 0;
$goty = isset($_GET['goty']) ? (int) $_GET['goty'] : 0;
$obra_maestra = isset($_GET['obra_maestra']) ? (int) $_GET['obra_maestra'] : 0;
$valoracion_minima = isset($_GET['estrellas']) ? (int) $_GET['estrellas'] : 0;

// Construir la consulta base
$query = "SELECT DISTINCT juegos.*, 
                 (SELECT (SUM(CASE WHEN etiqueta_obra_maestra = 1 THEN 1 ELSE 0 END) / COUNT(*) * 100) 
                  FROM reviews WHERE reviews.id_juego = juegos.id_juego) AS obra_maestra
          FROM juegos 
          LEFT JOIN juegos_generos ON juegos.id_juego = juegos_generos.id_juego
          LEFT JOIN generos ON juegos_generos.id_genero = generos.id_genero
          LEFT JOIN juegos_plataformas ON juegos.id_juego = juegos_plataformas.id_juego
          LEFT JOIN plataformas ON juegos_plataformas.id_plataforma = plataformas.id_plataforma
          WHERE 1=1";  // Esto hace que la consulta siempre sea válida

// Agregar condiciones dinámicamente
if (!empty($nombre_juego)) {
    $query .= " AND juegos.titulo LIKE '%$nombre_juego%'";
}
if (!empty($genero)) {
    $query .= " AND generos.genero = '$genero'";
}
if (!empty($plataforma)) {
    $query .= " AND plataformas.plataforma = '$plataforma'";
}
if ($duracion_minima > 0) {
    $query .= " AND juegos.duracion >= $duracion_minima";
}
if ($duracion_maxima < 500) {
    $query .= " AND juegos.duracion <= $duracion_maxima";
}
if ($año_minimo > 1900 || $año_maximo < date('Y')) {
    $query .= " AND juegos.lanzamiento BETWEEN $año_minimo AND $año_maximo";
}
if ($multi) {
    $query .= " AND juegos.multijugador = 1";
}
if ($goty) {
    $query .= " AND juegos.goty = 1";
}
// Filtrar "Obra Maestra" basándonos en la lógica del porcentaje
if ($obra_maestra) {
    $query .= " AND juegos.id_juego IN (
        SELECT reviews.id_juego
        FROM reviews 
        GROUP BY reviews.id_juego
        HAVING (SUM(CASE WHEN etiqueta_obra_maestra = 1 THEN 1 ELSE 0 END) / COUNT(*) * 100) >= 90
    )";
}
if ($valoracion_minima > 0) {
    $query .= " AND juegos.valoracion_media >= $valoracion_minima";
}

// Ejecutar la consulta
$resultado = $conexion->query($query);

// Guardar los resultados en un array
$juegos = [];
while ($fila = $resultado->fetch_assoc()) {
    // Convertir porcentaje_obra_maestra a 1 o 0 según el valor
    $porcentaje_obra_maestra = (float) $fila['obra_maestra'];
    $fila['obra_maestra'] = ($porcentaje_obra_maestra >= 90) ? 1 : 0;
    
    $juegos[] = $fila;
}

// Devolver los resultados en formato JSON
echo json_encode($juegos);

// Cerramos la conexión a la base de datos
$conexion->close(); 

?>