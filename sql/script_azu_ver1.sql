/* clave:  bd99d7eed4d83d35c3c1a47a68fa0c7ee2df675d206b66cb

 IP:   usuario: admin     http://159.89.185.31/phpmyadmin */



DROP TABLE IF EXISTS inscripciones;
DROP TABLE IF EXISTS inscripciones_charlas;
DROP TABLE IF EXISTS charlas;
DROP TABLE IF EXISTS como_te_enteraste; 

/*inscripciones*/
CREATE TABLE inscripciones (
    id VARCHAR(36) PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    dni VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    como_te_enteraste INT NOT NULL, 
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


/*insertar una inscripcion correctamente*/ 
    INSERT INTO inscripciones (id, nombre, apellido, dni, email, como_te_enteraste) 
    VALUES ('123e4567-e89b-12d3-a456-426614174000', 'Azul', 'Oviedo', '12345678', 'azul@example.com', 1000);


/* charlas */ 
CREATE TABLE charlas (
    id VARCHAR(36) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    ALTER TABLE charlas MODIFY horario TIMESTAMP NOT NULL 
);


/* intertar charla correctamente*/
INSERT INTO charlas (id, nombre, horario) VALUES
(00, 'Programación', '2025-03-20 14:30:00' ),
(01, 'Durlock', '2025-03-20 15:30:00'),
(02, 'Pintura', '2025-03-20 16:30:00'),
(03, 'Ascensores', '2025-03-20 16:30:00'),
(04, 'Diseño gráfico', '2025-03-20 17:30:00' ),
(05, 'Diseño 3D', '2025-03-20 18:30:00'),
(06, 'Herrería', '2025-03-20 14:30:00'),
(07, 'Electronica', '2025-03-20 14:30:00');




/* como te enteraste */
CREATE TABLE como_te_enteraste (

    id INT PRIMARY KEY,
    descripcion VARCHAR (150) NOT INT 
);



/*insertar como te enteraste correctamente */
INSERT INTO como_te_enteraste (id, descripcion) VALUES
(1000,'Redes sociales'),
(1001, 'Amigxs'),
(1002,'Email'),
(1003, 'Página web de UOCRA'),
(1004, 'Soy ex alumnx');
(1005, 'Soy alumnx');
(1006, 'Represento una marca');




/* inscripciones a charlas */
CREATE TABLE inscripciones_charlas (
    registro_id VARCHAR(36),
    charla_id VARCHAR(36),
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (registro_id, charla_id),
    FOREIGN KEY (registro_id) REFERENCES inscripciones(id) ON DELETE CASCADE,
    FOREIGN KEY (charla_id) REFERENCES charlas(id, nombre) ON DELETE CASCADE
);


/* colaboradores */ 

    CREATE TABLE colaboradores (
    id VARCHAR(36),
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    entidad VARCHAR (50) NOT NULL,
    responsabilidad VARCHAR (50) NOT NULL,
    colabora_en_charla VARCHAR (36),
    PRIMARY KEY (id)
    FOREIGN KEY (colabora_en_charla) REFERENCES charlas(id) ON DELETE CASCADE
);
/* insertar colaborador correctamente*/

INSERT INTO colaboradores (id, nombre, apellido, entidad, responsabilidad, colabora_en_charla) VALUES
('00001', 'David', 'Gómez', 'Universidad X', 'Moderador', '2');
/* insertar un colaborador correctamente*/ 

INSERT INTO colaboradores (id, nombre, apellido, entidad, responsabilidad, charla_id) VALUES
('00001', 'David', 'Gómez', 'Universidad X', 'Moderador', '02'); */

/* inscriptos + charlas + comoteenteraste */ 
