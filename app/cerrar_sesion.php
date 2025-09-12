<?php
session_start();

if (isset($_SESSION['id_usuario'])) {
    session_destroy();
}

$motivo = $_GET['motivo'] ?? 'voluntario';
header("Location: ../vistas/home.php?logout=exito&motivo=$motivo");
exit();
?>