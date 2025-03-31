import { Router } from "express";
import mysql from "mysql2/promise";

const router = Router();

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "inscripciones",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

router.post("/", async (req, res) => {
    try {
        console.log("Datos recibidos en el servidor:", req.body);
        const { nombre, apellido, dni, email, como_te_enteraste, charla, fecha } = req.body;
        const id = req.body.id || generarUUID(); // Usar ID proporcionado o generar uno nuevo

        const camposRequeridos = { nombre, apellido, dni, email, como_te_enteraste, charla, fecha };
        const camposFaltantes = Object.entries(camposRequeridos)
            .filter(([_, valor]) => valor === undefined || valor === null || valor === "")
            .map(([clave]) => clave);

        if (camposFaltantes.length > 0) {
            console.log("Campos faltantes:", camposFaltantes);
            return res.status(400).json({
                error: "Campos obligatorios faltantes",
                campos: camposFaltantes
            });
        }

        const conexion = await pool.getConnection();

        try {
            await conexion.beginTransaction();

            // Insertar participante
            const insertarParticipante = await conexion.execute(
                "INSERT INTO expo_registro (id, nombre, apellido, dni, email, como_te_enteraste) VALUES (?, ?, ?, ?, ?, ?)",
                [id, nombre, apellido, dni, email, como_te_enteraste]
            );
            console.log("Participante registrado:", insertarParticipante);

            // Verificar si la charla ya existe por su ID
            const [charlasExistentes]: any = await conexion.execute(
                "SELECT id, capacidad_maxima, participantes FROM charlas WHERE id = ?",
                [charla]
            );

            let idCharla = charla;

            if (!charlasExistentes || charlasExistentes.length === 0) {
                // La charla no existe, creamos una nueva con los datos básicos
                idCharla = generarUUID();
                const nombreCharla = `Charla ${idCharla.substring(0, 8)}`;
                const capacidadMaxima = 50; // Capacidad por defecto

                await conexion.execute(
                    "INSERT INTO charlas (id, nombre, capacidad_maxima, horario, participantes, descripcion) VALUES (?, ?, ?, ?, ?, ?)",
                    [idCharla, nombreCharla, capacidadMaxima, '12:00:00', 0, 'Charla creada automáticamente']
                );

                console.log(`Charla nueva creada con ID: ${idCharla}`);
            } else {
                const charlaExistente = charlasExistentes[0];

                if (charlaExistente.participantes >= charlaExistente.capacidad_maxima) {
                    throw new Error("La charla está llena");
                }
            }

            // Actualizamos el contador de participantes
            await conexion.execute(
                "UPDATE charlas SET participantes = participantes + 1 WHERE id = ?",
                [idCharla]
            );

            // Relacionamos el usuario con la charla
            await conexion.execute(
                "INSERT INTO registro_charlas (registro_id, charla_id) VALUES (?, ?)",
                [id, idCharla]
            );

            await conexion.commit();
            console.log("Transacción completada exitosamente");
            res.status(201).json({
                mensaje: "Inscripción guardada correctamente",
                id,
                idCharla
            });

        } catch (error: any) {
            await conexion.rollback();
            console.error("Error en la transacción:", error.message);
            throw error;
        } finally {
            conexion.release();
        }

    } catch (error: any) {
        console.error("Error general:", error);
        res.status(500).json({
            error: "Error al procesar la inscripción",
            mensaje: error.message
        });
    }
});

// Endpoint para obtener todas las charlas
router.get("/charlas", async (req, res) => {
    try {
        const conexion = await pool.getConnection();

        try {
            const [charlas] = await conexion.query("SELECT id, nombre, horario, capacidad_maxima, participantes, descripcion FROM charlas");
            res.status(200).json(charlas);
        } finally {
            conexion.release();
        }
    } catch (error: any) {
        console.error("Error al obtener charlas:", error);
        res.status(500).json({
            error: "Error al obtener charlas",
            mensaje: error.message
        });
    }
});

function generarUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export default router;