<?php
require_once '../conexion/conexion_bbdd.php';

// Recibir el tipo de carrusel desde GET
$tipo = $_GET['tipo'];

// Definir la consulta según el tipo de carrusel
if ($tipo === 'top_rated') {
    $query = "SELECT id_juego, portada, titulo FROM juegos ORDER BY valoracion_media DESC LIMIT 5";
} elseif ($tipo === 'novedades') {
    $query = "SELECT id_juego, portada, titulo FROM juegos ORDER BY lanzamiento DESC LIMIT 5";
} else {
    echo '<p>Error: Tipo de carrusel inválido.</p>';
    exit;
}

// Ejecuta la consulta
$resultado = $conexion->query($query);

// Guardar los resultados en un array
$juegos = [];
if ($resultado->num_rows>0) {
    while ($fila = $resultado->fetch_assoc()) {
        $fila['portada'] = $fila['portada'] ? $fila['portada'] : "multimedia/imagenes/img_no_disponible.png";
        $juegos[] = $fila;
    }
}

// Retornar los juegos
echo json_encode($juegos);

// Cerramos la conexión a la base de datos
$conexion->close(); 
?>


