<?php
session_start();

if (!isset($_SESSION["rol"])) {
    $_SESSION["rol"] = "invitado";
}

if (isset($_GET['obtener_rol'])) {
    header('Content-Type: application/json');
    echo json_encode(["rol" => $_SESSION["rol"]]);
    exit;
}

// Si se solicita el id_usuario a través de la URL
if (isset($_GET['id_usuario_logueado'])) {
    header('Content-Type: application/json');
    
    // Comprobar si existe un id_usuario en la sesión y devolverlo, o devolver 0 si no
    echo json_encode([
        "id_usuario" => $_SESSION['id_usuario'],
        "rol" => $_SESSION['rol']
    ]);
    exit;
}
?>