<?php
session_start();
session_destroy(); // Cierra la sesión
header("Location: ../vistas/index.php?logout=exito"); // Redirige a index.php
exit();
?>