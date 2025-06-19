<?php

// Conectar a la base de datos
require_once '../conexion/conexion_bbdd.php';

// Verificar disponibilidad de email o usuario con GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $tipo = $_GET['tipo'];
    $valor = $_GET['valor'];

    // Determinar la consulta según el tipo de verificación
    if ($tipo === "email") {
        $sql = "SELECT COUNT(*) FROM usuarios WHERE email = '$valor'";
    } elseif ($tipo === "usuario") {
        $sql = "SELECT COUNT(*) FROM usuarios WHERE usuario = '$valor'";
    } else {
        exit;
    }

    $resultado = mysqli_query($conexion, $sql);
    $fila = mysqli_fetch_row($resultado);

    echo json_encode(["disponible" => $fila[0] == 0]); // Respuesta JSON
    exit;
}

// Registro de usuario con POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $usuario = $_POST['usuario'];
    $contraseña = password_hash($_POST['contraseña'], PASSWORD_DEFAULT);
    
    // Insertar el usuario en la base de datos
    $sql = "INSERT INTO usuarios (email, usuario, contraseña) VALUES ('$email', '$usuario', '$contraseña')";
    $resultado = mysqli_query($conexion, $sql);

    echo $resultado ? "Usuario registrado correctamente." : "Error al registrar el usuario.";
}

// Cerramos la conexión
$conexion->close(); 

?>
