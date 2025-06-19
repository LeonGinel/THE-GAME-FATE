<?php
session_start();

// Conectar a la base de datos
require_once '../conexion/conexion_bbdd.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $usuario = $_POST["usuario"];
    $contraseña = $_POST["contraseña"];

    // Consulta directa
    $sql = "SELECT * FROM usuarios WHERE usuario = '$usuario'";
    $resultado = mysqli_query($conexion, $sql);

    if ($resultado->num_rows > 0) {
        $fila = $resultado->fetch_assoc();
        
        // Verificar la contraseña
        if (password_verify($contraseña, $fila["contraseña"])) {
            $_SESSION["id_usuario"] = $fila["id_usuario"]; // Guardar ID del usuario
            $_SESSION["usuario"] = $usuario; // Guarda el nombre del usuario

            // Asignar rol
            if ($fila["admin"] == 1) {
                $_SESSION["rol"] = "admin";
                echo "admin";
            } else {
                $_SESSION["rol"] = "usuario";
                echo "exito";
            }
            
            exit();
        } else {
            echo "Contraseña incorrecta";
        }
    } else {
        echo "Usuario no encontrado";
    }
}
?>