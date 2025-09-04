<?php require_once "../app/sesion.php"; ?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Next Level</title>

    <link rel="stylesheet" href="../css/generales.css">
    <link rel="stylesheet" href="../css/header.css">
    <link rel="stylesheet" href="../css/index.css">
    <link rel="stylesheet" href="../css/footer.css">
</head>
<body>
    <div class="wrapper">
        <?php require_once "header.php"; ?>

        <main>
            <div class="contenedor_principal">

    <!----------------------------------------------- FORMULARIO ------------------------------------------------>
                <form action="filtrar_juegos.php" method="GET" class="formulario" name="formulario" id="formulario">
                    <h2 class="fila1">¿A qué quieres jugar hoy?</h2>

                    <div class="fila2">
                        <div class="buscador">
                            <input type="text" name="nombre_juego" id="nombre_juego" placeholder="Buscar juego..." class="barra_buscador">
                        </div>

                        <div class="multi">
                            <input type="checkbox" name="multi" id="multi">
                            <label for="multi" class="btn_multi"></label>
                        </div>
                    </div>
                    
                    <div class="fila3">
                        <div class="genero">
                            <select name="generos" class="generos" id="generos">
                                <option value="genero" selected disabled>Género</option>
                            </select>
                        </div>
                        
                        <div class="plataforma">
                            <select name="plataformas" class="plataformas" id="plataformas">
                                <option value="plataforma" selected disabled>Plataforma</option>
                            </select>
                        </div>

                        <div class="goty">
                            <input type="checkbox" name="goty" id="goty">
                            <label for="goty" class="btn_goty"></label>
                        </div>
                    </div>
                    
                    <div class="fila4">
                        <div class="duracion">
                            <label class="label_duracion" for="duracion_minima">Duración:</label>
                            <div class="selectores_duracion">
                                <input type="number" class="minimo" id="duracion_minima" min="0" max="500" step="1" placeholder="min.">
                                <input type="number" class="maximo" id="duracion_maxima" min="0" max="500" step="1" placeholder="max.">
                            </div>
                        </div>
                        
                        <div class="lanzamiento">
                            <label class="label_lanzamiento" for="año_minimo">Lanzamiento:</label>
                            <div class="selectores_lanzamiento">
                                <select name="año_minimo" class="minimo" id="año_minimo">
                                    <option value="desde" selected disabled>Desde:</option>
                                </select>
                                <select name="año_maximo" class="maximo" id="año_maximo">
                                    <option value="hasta" selected disabled>Hasta:</option>
                                </select>
                            </div>
                        </div>

                        <div class="obra_maestra">
                            <input type="checkbox" name="obra_maestra" id="obra_maestra">
                            <label for="obra_maestra" class="btn_obra_maestra"></label>
                        </div>
                    </div>

                    <div class="fila5">
                        <label for="estrella_5">Valoración:</label>

                        <div class="estrellas">
                            <input type="radio" id="estrella_5" name="estrellas" value="5">
                            <label for="estrella_5"><img src="../multimedia/iconos/estrella_llena.png" alt="5_estrellas" class="estrella"></label>

                            <input type="radio" id="estrella_4" name="estrellas" value="4">
                            <label for="estrella_4"><img src="../multimedia/iconos/estrella_llena.png" alt="4_estrellas" class="estrella"></label>

                            <input type="radio" id="estrella_3" name="estrellas" value="3">
                            <label for="estrella_3"><img src="../multimedia/iconos/estrella_llena.png" alt="3_estrellas" class="estrella"></label>

                            <input type="radio" id="estrella_2" name="estrellas" value="2">
                            <label for="estrella_2"><img src="../multimedia/iconos/estrella_llena.png" alt="2_estrellas" class="estrella"></label>

                            <input type="radio" id="estrella_1" name="estrellas" value="1">
                            <label for="estrella_1"><img src="../multimedia/iconos/estrella_llena.png" alt="1_estrellas" class="estrella"></label>
                        </div>
                    </div>

                    <div class="fila6">
                        <button type="submit" class="btn_buscar">Buscar</button>
                    </div>
                </form>

    <!----------------------------------------------- RESULTADOS DE BUSQUEDA ------------------------------------------------>
                <section id="seccion_resultados">

                </section>

    <!----------------------------------------------- CARRUSEL ------------------------------------------------>
                <div class="carrusel" id="top_rated">
                    <h2>TOP RATED</h2>
                    <button class="carrusel_btn carrusel_btn-izq"><img src="../multimedia/iconos/flecha_izq.png" alt="izq"></button>
                    <div class="contenedor_carrusel">
                        <ul class="lista_carrusel"></ul>
                    </div>
                    <button class="carrusel_btn carrusel_btn-dcha"><img src="../multimedia/iconos/flecha_dcha.png" alt="dcha"></button>
                </div>

                <div class="carrusel carrusel_2" id="novedades">
                    <h2>NOVEDADES</h2>
                    <button class="carrusel_btn carrusel_btn-izq"><img src="../multimedia/iconos/flecha_izq.png" alt="izq"></button>
                    <div class="contenedor_carrusel">
                        <ul class="lista_carrusel"></ul>
                    </div>
                    <button class="carrusel_btn carrusel_btn-dcha"><img src="../multimedia/iconos/flecha_dcha.png" alt="dcha"></button>
                </div>
            </div>
        </main>

        <?php require_once "footer.php"; ?>

        <script src="../js/index.js"></script>
        <script src="../js/index_carrusel.js"></script>
        <script src="../js/index_formulario.js"></script>
        <script src="../js/index_formulario_resultados.js"></script>
        
    </div>
</body>
</html>