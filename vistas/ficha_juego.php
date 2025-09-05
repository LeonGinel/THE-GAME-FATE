<?php require_once "../app/sesion.php"; ?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ficha técnica</title>

    <link rel="stylesheet" href="../css/generales.css">
    <link rel="stylesheet" href="../css/header.css">
    <link rel="stylesheet" href="../css/footer.css">
    <link rel="stylesheet" href="../css/ficha_juego.css">
</head>
<body>
    <div class="wrapper">
        <?php require_once "header.php"; ?>

        <main>
            <div class="contenedor_principal">
                <div class="informacion">
                    <div class="portada_valoracion">
                        <img src="" alt="" class="imagen_portada">
                        <img src="" alt="" class="imagen_valoracion">
                    </div>

                    <div class="datos_juego">
                        <h2 class="titulo"></h2>
                        <p class="desarrolladora"><strong>Desarrolladora: </strong><span></span></p>
                        <p class="lanzamiento"><strong>Lanzamiento: </strong><span></span></p>
                        <p class="genero"><strong>Género: </strong><span></span></p>
                        <p class="plataforma"><strong>Plataforma: </strong><span></span></p>
                        <p class="duracion"><strong>Duración: </strong><span></span></p>
                    </div>

                    <div class="premios">
                        <img src="" alt="premio Goty" class="goty">
                        <img src="" alt="Obra maestra" class="obra_maestra">
                        <img src="" alt="Sobrevalorado" class="sobrevalorado">
                    </div>
                </div>

                <div class="descripcion">
                    <h2 class="titulo">Descripción: </h2>
                    <p></p>
                </div>

                <section class="criticas">

                </section>
            </div>
        </main>

        <?php require_once "footer.php"; ?>

        <script src="../js/inactividad.js"></script>
        <script src="../js/ficha_juego.js"></script>
    </div>      
</body>
</html>