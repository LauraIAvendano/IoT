const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const PORT = 3000;

// Configurar CORS
app.use(cors());

// Configurar JSON middleware
app.use(express.json());

// Conectar a la base de datos SQLite
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
    } else {
        console.log('Conexión a la base de datos SQLite establecida.');
    }
});

// Crear la tabla si no existe
db.run(`
    CREATE TABLE IF NOT EXISTS food_levels (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        level INTEGER NOT NULL,
        timestamp TEXT NOT NULL
    );
`, (err) => {
    if (err) {
        console.error('Error al crear la tabla:', err.message);
    } else {
        console.log('Tabla food_levels creada o ya existe.');
        
        // Insertar un dato de prueba después de crear la tabla
        db.run("INSERT INTO food_levels (level, timestamp) VALUES (10, datetime('now'))", (err) => {
            if (err) {
                console.error('Error al insertar datos de prueba:', err.message);
            } else {
                console.log('Datos de prueba insertados correctamente.');
            }
        });
    }
});

// Ruta para obtener el nivel de comida
app.get('/getFoodLevel', (req, res) => {
    const query = 'SELECT * FROM food_levels ORDER BY timestamp DESC LIMIT 1';
    db.get(query, (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            if (row) {
                res.json({ message: row.level > 50 ? 'Nivel de comida suficiente' : 'Comida baja', level: row.level });
            } else {
                res.json({ message: 'No se encontraron datos de comida', level: 0 });
            }
        }
    });
});

// Ruta para enviar notificación (simulación)
app.post('/sendNotification', (req, res) => {
    // Aquí se puede agregar la lógica de notificación con Firebase o similar.
    res.json({ message: 'Notificación enviada (simulación)' });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
