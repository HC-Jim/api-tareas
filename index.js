// ---------------------------------------------------------------------------
// API de Tareas (CRUD) — Node.js + Express
// Aprende los métodos HTTP: GET, POST, PUT, DELETE
// ---------------------------------------------------------------------------

const express = require("express");

const app = express();

// Middleware: permite leer JSON del cuerpo (body) de las peticiones POST/PUT.
app.use(express.json());

// ---------------------------------------------------------------------------
// "Base de datos" en memoria.
// Ojo: al reiniciar el servidor se pierde. Sirve para aprender; más adelante
// lo cambias por una base de datos real (SQLite, Postgres, MongoDB...).
// ---------------------------------------------------------------------------
let tareas = [
  { id: 1, titulo: "Aprender HTTP", completada: false },
  { id: 2, titulo: "Crear mi primera API", completada: true },
];
let siguienteId = 3;

// ---------------------------------------------------------------------------
// Rutas
// ---------------------------------------------------------------------------

// Ruta de bienvenida / salud del servidor.
app.get("/", (req, res) => {
  res.json({
    mensaje: "API de Tareas funcionando 🚀",
    endpoints: {
      listar: "GET /tareas",
      obtener: "GET /tareas/:id",
      crear: "POST /tareas",
      actualizar: "PUT /tareas/:id",
      borrar: "DELETE /tareas/:id",
    },
  });
});

// GET /tareas — devuelve todas las tareas.
app.get("/tareas", (req, res) => {
  res.json(tareas);
});

// GET /tareas/:id — devuelve una tarea por su id.
app.get("/tareas/:id", (req, res) => {
  const id = Number(req.params.id);
  const tarea = tareas.find((t) => t.id === id);

  if (!tarea) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }
  res.json(tarea);
});

// POST /tareas — crea una tarea nueva.
// Body esperado: { "titulo": "texto" }
app.post("/tareas", (req, res) => {
  const { titulo } = req.body;

  if (!titulo || titulo.trim() === "") {
    return res.status(400).json({ error: "El campo 'titulo' es obligatorio" });
  }

  const nueva = { id: siguienteId++, titulo, completada: false };
  tareas.push(nueva);

  // 201 = creado correctamente.
  res.status(201).json(nueva);
});

// PUT /tareas/:id — actualiza una tarea existente.
// Body opcional: { "titulo": "...", "completada": true/false }
app.put("/tareas/:id", (req, res) => {
  const id = Number(req.params.id);
  const tarea = tareas.find((t) => t.id === id);

  if (!tarea) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }

  const { titulo, completada } = req.body;
  if (titulo !== undefined) tarea.titulo = titulo;
  if (completada !== undefined) tarea.completada = completada;

  res.json(tarea);
});

// DELETE /tareas/:id — borra una tarea.
app.delete("/tareas/:id", (req, res) => {
  const id = Number(req.params.id);
  const indice = tareas.findIndex((t) => t.id === id);

  if (indice === -1) {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }

  const [borrada] = tareas.splice(indice, 1);
  res.json({ mensaje: "Tarea borrada", tarea: borrada });
});

// ---------------------------------------------------------------------------
// Arranque del servidor.
// process.env.PORT lo asigna el proveedor (Render, Railway...) automáticamente.
// En local usará el 3000.
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
