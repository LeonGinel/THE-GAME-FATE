<?php
require_once '../conexion/conexion_bbdd.php';

// --------- DESPLEGABLE CON LOS GÉNEROS --------- //

if (isset($_GET['tipo']) && $_GET['tipo'] == 'generos') {
    $resultado = $conexion->query('SELECT genero FROM generos');
    
    $generos = [];
    if ($resultado->num_rows > 0) {
        while ($fila = $resultado->fetch_assoc()) {
            $generos[] = $fila['genero'];
        }
    }
    echo json_encode($generos);
}

// --------- DESPLEGABLE CON LOS PLATAFORMAS --------- //

if (isset($_GET['tipo']) && $_GET['tipo'] == 'plataformas') {
    $resultado = $conexion->query('SELECT plataforma FROM plataformas');
    
    $plataformas = [];
    if ($resultado->num_rows > 0) {
        while ($fila = $resultado->fetch_assoc()) {
            $plataformas[] = $fila['plataforma'];
        }
    }
    echo json_encode($plataformas);
}

// Cerramos la conexión a la base de datos
$conexion->close(); 

?>