<?php
session_start();

require_once "../conexion/conexion_bbdd.php";

// Si se está haciendo una búsqueda
if (isset($_GET['consulta'])) {
    consultas_buscadores($conexion);
}


// ------------------------------------------------------------------------------------------------------------ //
// ------------------------------------------------- FUNCIONES ------------------------------------------------ //
// ------------------------------------------------------------------------------------------------------------ //

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

?>