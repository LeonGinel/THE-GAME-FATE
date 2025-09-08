<?php
require_once "../app/sesion.php";

// Si el usuario es "invitado" (no registrado), redirigir al login
if ($_SESSION["rol"] === "invitado") {
    header("Location: login.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Perfil de usuario</title>

    <link rel="stylesheet" href="../css/generales.css">
    <link rel="stylesheet" href="../css/header.css">
    <link rel="stylesheet" href="../css/footer.css">
    <link rel="stylesheet" href="../css/perfil_usuario.css">
</head>
<body>
    <div class="wrapper">
        <?php require_once "header.php"; ?>

        <main>
            <div class="contenedor_principal">
                <div class="contenedor_1">
                    <div class="informacion_usuario">
                        <div class="contenedor_imagen-perfil">
                            <img class="imagen_perfil" src="../multimedia/imagenes/default_avatar.png" alt="Imagen de perfil">
                            <input type="file" id="input_avatar" accept="image/*" style="display:none;">
                        </div>
                        
                        <h2 class="nombre_usuario">Usuario</h2>
                    </div>
                    
                    <!-- Top 3 Juegos -->
                    <section class="top_3">
                        <h2>Top 3</h2>
                        <div class="juego_1">
                            <div class="juego_1-corona">
                                <img src="../multimedia/imagenes/top1.png">
                            </div>
                            
                            <button class="btn_top" value="1">+</button>
                        </div>
                        <div class="buscador_top_1">
                            <input type="text" class="barra_busqueda_top" placeholder="Buscar juego..." autocomplete="off">
                            <div class="resultados_top"></div>
                        </div>

                        <div class="juego_2">
                            <div class="juego_2-corona">
                                <img src="../multimedia/imagenes/top2.png">
                            </div>
                
                            <button class="btn_top" value="2">+</button>
                        </div>
                        <div class="buscador_top_2">
                            <input type="text" class="barra_busqueda_top" placeholder="Buscar juego..." autocomplete="off">
                            <div class="resultados_top"></div>
                        </div>

                        <div class="juego_3">
                            <div class="juego_3-corona">
                                <img src="../multimedia/imagenes/top3.png">
                            </div>
                            
                            <button class="btn_top" value="3">+</button>
                        </div>
                        <div class="buscador_top_3">
                            <input type="text" class="barra_busqueda_top" placeholder="Buscar juego..." autocomplete="off">
                            <div class="resultados_top"></div>
                        </div>
                    </section>

                    <!--FORMULARIOS AÑADIR / MODIFICAR / ELIMINAR JUEGOS y USUARIOS DE LA BBDD (ADMIN) -->
                    <div class="contenedor_gestionar_juegos">
                        <!-- botones -->
                        <div class="contenedor_botones_gestionar_juegos">
                            <button class="btn_banear_usuario">
                                <img src="../multimedia/iconos/banear_usuario.png" alt="Banear usuario">
                            </button>

                            <button class="btn_modificar_juego">
                                <img src="../multimedia/iconos/editar.png" alt="Editar juego">
                            </button>

                            <button class="btn_introducir_juego">
                                <img src="../multimedia/iconos/añadir.png" alt="Añadir juego">
                            </button>

                            <button class="btn_borrar_juego">
                                <img src="../multimedia/iconos/eliminar.png" alt="Banear usuario">
                            </button>
                        </div>

                        <!-- formularios -->
                        <div class="contenedor_formularios_gestionar_juegos">

                            <!-- Formulario para eliminar Usuarios de la BBDD -->
                            <form method="POST" class="formulario_banear_usuario" name="formulario_banear_usuarios">
                                <div class="buscar_usuario">
                                    <input type="text" name="buscador_banear" class="buscador_banear" placeholder="Buscar usuario..." autocomplete="off" required>
                                    <div class="resultados_busqueda_usuarios"></div>
                                </div>

                                <div class="banear">
                                    <button class="btn_banear">Banear</button>
                                </div>
                            </form>

                            <!-- Formulario para modificar juego en la BBDD -->
                            <form method="GET" class="formulario_modificar_juego" name="formulario_modificar_juegos">
                                <div class="titulo">
                                    <input type="text" name="titulo" class="titulo_modificar" placeholder="Titulo..." autocomplete="off" required>
                                    <div class="resultados_busqueda_midificar_juegos"></div>
                                </div>

                                <div class="Portada">
                                    <input type="text" name="portada" class="portada_modificar" placeholder="Url Portada..." autocomplete="off">
                                </div>

                                <div class="desarrolladora">
                                    <input type="text" name="desarrolladora" class="desarrolladora_modificar" placeholder="Desarrolladora..." autocomplete="off">
                                </div>

                                <div class="plataforma">
                                    <div class="contenedor_plataformas_modificar"></div>
                                    <select name="plataformas" class="plataformas_modificar" id="plataformas_modificar">
                                        <option value="plataforma" selected disabled>Plataforma</option>
                                    </select>
                                </div>

                                <div class="genero">
                                    <div class="contenedor_generos_modificar"></div>
                                    <select name="generos" class="generos_modificar" id="generos_modificar">
                                        <option value="genero" selected disabled>Género</option>
                                    </select>
                                </div>

                                <div class="contenedor_lanzamiento">
                                    <select name="lanzamiento" class="lanzamiento_modificar" id="lanzamiento_modificar">
                                        <option value="lanzamiento" selected disabled>Lanzamiento</option>
                                    </select>
                                </div>

                                <div class="contenedor_duracion">
                                    <input type="number" class="duracion_modificar" id="duracion_modificar" min="0" max="500" step="1" placeholder="horas">
                                </div>

                                <div class="contenedor_descripcion">
                                    <textarea class="descripcion_modificar" name="descripcion" placeholder="Descripción..." rows="5"></textarea>
                                </div>

                                <div class="modificar">
                                    <button class="btn_modificar">Modificar</button>
                                </div>
                            </form>

                            <!-- Formulario para añadir juego a la BBDD -->
                            <form method="GET" class="formulario_introducir_juego" name="formulario_introducir_juego">
                            <div class="titulo">
                                    <input type="text" name="titulo" class="titulo_añadir" placeholder="Titulo..." autocomplete="off" required>
                                </div>

                                <div class="Portada">
                                    <input type="text" name="portada" class="portada_añadir" placeholder="Url Portada..." autocomplete="off">
                                </div>

                                <div class="desarrolladora">
                                    <input type="text" name="desarrolladora" class="desarrolladora_añadir" placeholder="Desarrolladora..." autocomplete="off">
                                </div>

                                <div class="plataforma">
                                    <div class="contenedor_plataformas_añadir"></div>
                                    <select name="plataformas" class="plataformas_añadir" id="plataformas_añadir">
                                        <option value="plataforma" selected disabled>Plataforma</option>
                                    </select>
                                </div>

                                <div class="genero">
                                    <div class="contenedor_generos_añadir"></div>
                                    <select name="generos" class="generos_añadir" id="generos_añadir">
                                        <option value="genero" selected disabled>Género</option>
                                    </select>
                                </div>

                                <div class="contenedor_lanzamiento">
                                    <select name="lanzamiento" class="lanzamiento_añadir" id="lanzamiento_añadir">
                                        <option value="lanzamiento" selected disabled>Lanzamiento</option>
                                    </select>
                                </div>

                                <div class="contenedor_duracion">
                                    <input type="number" class="duracion_añadir" id="duracion_añadir" min="0" max="500" step="1" placeholder="horas">
                                </div>

                                <div class="contenedor_descripcion">
                                    <textarea class="descripcion_añadir" name="descripcion" placeholder="Descripción..." rows="5"></textarea>
                                </div>

                                <div class="Introducir">
                                    <button class="btn_introducir">Añadir</button>
                                </div>
                            </form>

                            <!-- Formulario para eliminar juego de la BBDD -->
                            <form method="POST" class="formulario_eliminar_juego" name="formulario_eliminar_juego">
                                <div class="eliminar_juego">
                                    <input type="text" name="buscador_eliminar_juego" class="buscador_eliminar_juego" placeholder="Buscar juego..." autocomplete="off" required>
                                    <div class="resultados_busqueda_eliminar_juegos"></div>
                                </div>

                                <div class="borrar">
                                    <button class="btn_borrar">Eliminar</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                    
                <!-- APARTADO DE REVIEWS -->
                <div class="contenedor_2">
                    <button class="btn_agregar_juego">Agregar Juego</button>

                    <form method="GET" class="formulario_agregar_juego" name="formulario">
                        <div class="buscar_juego">
                            <input type="text" name="buscador" class="buscador" placeholder="Buscar juego..." autocomplete="off" required>
                            <div class="resultados_busqueda_formulario"></div>
                        </div>
                        
                        <div class="valoracion">
                            <label>Valoración:</label>
                            <div class="estrellas">
                                <input type="radio" id="estrella_5" name="estrella" value="5" required>
                                <label for="estrella_5"><img src="../multimedia/iconos/estrella_llena.png" alt="5_estrellas" class="estrella"></label>

                                <input type="radio" id="estrella_4" name="estrella" value="4">
                                <label for="estrella_4"><img src="../multimedia/iconos/estrella_llena.png" alt="4_estrellas" class="estrella"></label>

                                <input type="radio" id="estrella_3" name="estrella" value="3">
                                <label for="estrella_3"><img src="../multimedia/iconos/estrella_llena.png" alt="3_estrellas" class="estrella"></label>

                                <input type="radio" id="estrella_2" name="estrella" value="2">
                                <label for="estrella_2"><img src="../multimedia/iconos/estrella_llena.png" alt="2_estrellas" class="estrella"></label>

                                <input type="radio" id="estrella_1" name="estrella" value="1">
                                <label for="estrella_1"><img src="../multimedia/iconos/estrella_llena.png" alt="1_estrellas" class="estrella"></label>
                            </div>
                        </div>

                        <div class="critica">
                            <textarea class="critica_texto" name="critica" placeholder="Escribe una valoración personal..." rows="5"></textarea>
                        </div>
                        
                        <div class="etiquetas">
                            <div class="obra_maestra">
                                <input type="checkbox" name="obra_maestra" class="etiqueta_obra_maestra" id="etiqueta_obra_maestra" value="obra_maestra">
                                <label for="etiqueta_obra_maestra" class="btn_obra_maestra"></label>
                            </div>
                                
                            <div class="sobrevalorado">
                                <input type="checkbox" name="sobrevalorado" class="etiqueta_sobrevalorado" id="etiqueta_sobrevalorado" value="sobrevalorado">
                                <label for="etiqueta_sobrevalorado" class="btn_sobrevalorado"></label>
                            </div>     
                        </div>

                        <div class="guardar">
                            <button class="btn_guardar">Guardar</button>
                        </div>
                    </form>


    <!------------------------------------------- LISTA JUEGOS AGREGADOS -------------------------------------------->
                    <section class="lista_juegos_agregados">

                    </section>
                </div>   
            </div>  
        </main>

        <?php require_once "footer.php"; ?>

        <script src="../js/inactividad.js"></script>
        <script src="../js/perfil_usuario.js"></script>
    </div>
</body>
</html>