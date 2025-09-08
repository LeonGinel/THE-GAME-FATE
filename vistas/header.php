<!-- Importar las fuentes usadas en la web -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">


<header class="head">
    <!-- <div class="head1">
        <nav class="head_nav">
            <button class="head_btn-menu">
                <img class=" head_menu-hamburguesa" src="../multimedia/iconos/menu_hamburguesa.webp" alt="menu hamburguesa">
            </button>

            <ul class="head_menu">
                <li><a href="">Juegos</a></li>
                <li><a href="">Novedades</a></li>
                <li><a href="">Mejor valorados</a></li>
                <li><a href="">Más jugados</a></li>
                <li><a href="">Gotys</a></li>
                <li><a href="">Obras maestras</a></li>
                <li><a href="">Sobrevalorados</a></li>
            </ul>
        </nav>
    </div> -->
    <div class="head1">
        <h1>THE GAME FATE</h1>

        <a class="head_btn-logo" href="home.php"><img class="head_logo-principal" src="../multimedia/logos/logo_principal.webp" alt="Logo"></a>

        <form action="ficha_juego.php" method="GET" class="head_buscador-formulario">
            <div class="head_contenedor-buscador">
                <input type="text" name="buscador" placeholder="Buscar" class="head_barra-buscador">
                <button type="submit" class="head_btn-lupa">
                    <img class="head_icono-lupa" src="../multimedia/iconos/lupa.png" alt="Buscar">
                </button>
            </div>
            
            <div class="resultados_busqueda_tiempo_real"></div>
        </form>
    </div>
    
    <div class="head2">
         <?php if (isset($_SESSION["usuario"])): ?>
            <div class="head2_bienvenido">
                <span class="head_usuario">Bienvenido, <?php echo ($_SESSION["usuario"]); ?> </span>
                <div class="head2-btns">
                    <a class="head_btn-perfil" href="perfil_usuario.php?id_usuario=<?php echo $_SESSION['id_usuario'];?>">
                    <img src="../multimedia/iconos/perfil.png" alt="perfil" class="perfil"></a>
                    <a class="head_btn-logout" href="../app/cerrar_sesion.php">Cerrar sesión</a>
                </div>
            </div>

        <?php else: ?>

            <div class="head2_btns-login">
                <a class="head_btn-login" href="registro_login.php?modo=login">Inicia sesión</a>
                <a class="head_btn-registro" href="registro_login.php?modo=registro">Regístrate</a>
            </div>
           
        <?php endif; ?>
    </div>
   
    <div class="head3"></div>
    <div class="head4"></div>

    <script src="../js/header.js"></script>

</header>