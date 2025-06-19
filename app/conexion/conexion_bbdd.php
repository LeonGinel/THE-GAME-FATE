<?php

require_once 'credenciales_conexion.php';

// Creamos la conexión
$conexion = new mysqli(HOST, USER, PASS, BBDD);

// Verificamos si la conexión fue exitosa
if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
}

// Configurar el juego de caracteres (opcional, pero recomendable)
$conexion->set_charset("utf8");

?>