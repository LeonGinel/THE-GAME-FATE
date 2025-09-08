<?php require_once "../app/sesion.php"; ?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>login</title>

    <link rel="stylesheet" href="../css/generales.css">
    <link rel="stylesheet" href="../css/header.css">
    <link rel="stylesheet" href="../css/footer.css">
    <link rel="stylesheet" href="../css/registro_login.css">

</head>
<body>
    <div class="wrapper">
        <?php require_once "header.php"; ?>

        <div class="fondo">
            <video autoplay loop muted playsinline>
                <source src="../multimedia/videos/fondo_login.webm" type="video/webm">
            </video>
        </div>

        <main>
            <div class="contenedor_principal">
                <form action="creacion_usuario.php" method="POST" name="formulario" class="formulario">
                    <h2 class="registro">REGISTRATE</h2>
                    <div class="email">
                        <input type="text" name="email" placeholder="Correo electrónico" required> *
                    </div>

                    <div class="error mensaje-email"></div>

                    <div class="usuario">
                        <input type="text" name="usuario" placeholder="Usuario" autocomplete="off" required> *
                    </div>

                    <div class="error mensaje-usuario"></div>

                    <div class="contraseña">
                        <input type="password" name="contraseña" placeholder="Contraseña" autocomplete="off" required> *
                        <button class="btn_mostrar-contraseña"><img src="../multimedia/iconos/ojo.webp" alt="mostrar"></button>
                    </div>

                    <div class="confirmar_contraseña">
                        <input type="password" name="confirmar_contraseña" placeholder="Confirma la contraseña" required> *
                    </div>

                    <div>
                        <div class="condiciones">
                            <input type="checkbox" class="condiciones_check" name="condiciones" value="1" required>
                            He leído y acepto la politica de privacidad y de participación
                        </div>
                    </div>
                    
                    <div class="crear_cuenta">
                        <button type="submit" class="btn_crear_cuenta">Crear cuenta</button>
                    </div>

                    <div class="login">
                        ¿Ya tienes cuenta? <button type="button" class="btn_registro_login">Inicia sesión</button> 
                    </div>
                </form>
            </div>
        </main>

        <?php require_once "footer.php"; ?>

        <script src="../js/registro_login.js"></script>
    </div>
</body>
</html>

