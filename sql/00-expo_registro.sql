DROP TABLE IF EXISTS registro_charlas;
DROP TABLE IF EXISTS inscriptos;
DROP TABLE IF EXISTS charlas;

CREATE TABLE inscriptos (
    id VARCHAR(36) PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    dni VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    como_te_enteraste ENUM(
        'Redes sociales',
        'Amigos',
        'Email',
        'Página web',
        'Otros'
    ) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE charlas (
    id VARCHAR(36) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    capacidad_maxima INT NOT NULL,
    horario TIME NOT NULL,
    participantes INT DEFAULT 0,
    descripcion TEXT,
    CONSTRAINT chk_capacidad CHECK (capacidad_maxima > 0)
);

CREATE TABLE registro_charlas (
    registro_id VARCHAR(36),
    charla_id VARCHAR(36),
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (registro_id, charla_id),
    FOREIGN KEY (registro_id) REFERENCES inscriptos(id) ON DELETE CASCADE,
    FOREIGN KEY (charla_id) REFERENCES charlas(id) ON DELETE CASCADE
);

/*
CREATE INDEX idx_registro_charlas_registro ON registro_charlas(registro_id);
CREATE INDEX idx_registro_charlas_charla ON registro_charlas(charla_id);
*/