<?php
session_start();
session_destroy(); // Cierra la sesión

$motivo = isset($_GET['motivo']) ? $_GET['motivo'] : 'voluntario';

header("Location: ../vistas/home.php?logout=exito&motivo=$motivo"); // Redirige a home.php
exit();
?>