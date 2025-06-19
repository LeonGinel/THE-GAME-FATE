-- Creo la base de datos
CREATE DATABASE IF NOT EXISTS videojuegos;
-- Uso la base de datos
USE videojuegos;

-- DROP DATABASE videojuegos;
-- DELETE FROM usuarios;
-- ALTER TABLE usuarios AUTO_INCREMENT = 1;


-- Creo las tablas con sus atributos(columnas) y tipos
CREATE TABLE IF NOT EXISTS usuarios (
	id_usuario INT AUTO_INCREMENT PRIMARY KEY,
	usuario VARCHAR(50) UNIQUE NOT NULL,
	email VARCHAR(100) UNIQUE NOT NULL,
	contraseña VARCHAR(255) NOT NULL,
	imagen_perfil VARCHAR(255) DEFAULT '../multimedia/imagenes/default_avatar.png',
	admin BOOLEAN DEFAULT FALSE
); 

CREATE TABLE IF NOT EXISTS juegos (
	id_juego INT AUTO_INCREMENT PRIMARY KEY,
	id_rawg INT UNIQUE,  -- Para evitar duplicados con la API RAWG
	titulo VARCHAR(100) NOT NULL,
	portada VARCHAR(150) NOT NULL DEFAULT "../multimedia/imagenes/img_no_disponible.png",
	desarrolladora VARCHAR(100) NOT NULL DEFAULT "Desconocido",
	lanzamiento YEAR NULL,
	valoracion_media DECIMAL(3,1) DEFAULT 0.0 NOT NULL,
	duracion INT NULL,
	descripcion TEXT DEFAULT "No se dispone de descripción en estos momentos.",
	multijugador BOOLEAN DEFAULT FALSE,
	goty BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS generos (
	id_genero INT AUTO_INCREMENT PRIMARY KEY,
	genero VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS plataformas (
	id_plataforma INT AUTO_INCREMENT PRIMARY KEY,
	plataforma VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS juegos_generos (
	id_juego INT,
	id_genero INT,
	PRIMARY KEY (id_juego, id_genero),
	FOREIGN KEY (id_juego) REFERENCES juegos(id_juego) ON DELETE CASCADE,
	FOREIGN KEY (id_genero) REFERENCES generos(id_genero) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS juegos_plataformas (
	id_juego INT,
	id_plataforma INT,
	PRIMARY KEY (id_juego, id_plataforma),
	FOREIGN KEY (id_juego) REFERENCES juegos(id_juego) ON DELETE CASCADE,
	FOREIGN KEY (id_plataforma) REFERENCES plataformas(id_plataforma) ON DELETE CASCADE
);

CREATE TABLE top_juegos (
    id_usuario INT NOT NULL,
    id_juego INT NOT NULL,
    posicion INT NOT NULL,
    PRIMARY KEY (id_usuario, posicion),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE, 
    FOREIGN KEY (id_juego) REFERENCES juegos(id_juego) ON DELETE CASCADE 
);

CREATE TABLE IF NOT EXISTS reviews (
	id_review INT AUTO_INCREMENT PRIMARY KEY,
	id_usuario INT NOT NULL,
	id_juego INT NOT NULL,
	puntuacion TINYINT NOT NULL CHECK (puntuacion BETWEEN 0 AND 5),
	critica TEXT NOT NULL,
	etiqueta_obra_maestra BOOLEAN DEFAULT FALSE,
	etiqueta_sobrevalorado BOOLEAN DEFAULT FALSE,
	fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
	FOREIGN KEY (id_juego) REFERENCES juegos(id_juego) ON DELETE CASCADE,
	CHECK (NOT (etiqueta_obra_maestra AND etiqueta_sobrevalorado))
);

-- Introduzco el Admin en la bbdd
INSERT INTO usuarios (usuario, email, contraseña) VALUES ("admin", "admin@gmail.com", SHA2("U0alianza!", 256)) ;

-- Transformo a ADMIN el usuario admin
UPDATE usuarios SET admin = TRUE WHERE usuario = 'admin';

-- Inserto los premios GOTY
UPDATE juegos
SET goty = TRUE
WHERE titulo IN (
    'Madden NFL 2004',
    'Grand Theft Auto: San Andreas',
    'Resident Evil 4',
    'The Elder Scrolls IV: Oblivion',
    'BioShock',
    'Grand Theft Auto IV',
    'Uncharted 2: Among Thieves',
    'Red Dead Redemption',
    'The Elder Scrolls V: Skyrim',
    'The Walking Dead: The Game',
    'Grand Theft Auto V',
    'Dragon Age: Inquisition',
    'The Witcher 3: Wild Hunt',
    'Overwatch',
    'The Legend of Zelda: Breath of the Wild',
    'God of War',
    'Sekiro: Shadows Die Twice',
    'The Last of Us Part II',
    'It Takes Two',
    'Elden Ring',
    'Baldur\'s Gate III',
    'Astro Bot'
);

SELECT * FROM juegos;