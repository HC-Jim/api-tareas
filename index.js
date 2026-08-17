// ---------------------------------------------------------------------------
// Backend de Tareas — Node.js + Express + Supabase (PostgreSQL)
//
// Contiene dos tipos de operaciones:
//   1) CRUD sobre la base de datos (GET / POST / PUT / DELETE).
//   2) "Operaciones internas": lógica del servidor sobre esos datos
//      (estadísticas, acciones en lote) que no son un simple CRUD.
// ---------------------------------------------------------------------------

const express = require("express");
const supabase = require("./supabaseClient");

const app = express();
app.use(express.json());

// Nombre de la tabla en Supabase.
const TABLA = "tareas";

// ---------------------------------------------------------------------------
// Info de la API.
// ---------------------------------------------------------------------------
app.get("/", (req, res) => {
  res.json({
    mensaje: "Backend de Tareas con Supabase 🚀",
    endpoints: {
      listar: "GET /tareas",
      obtener: "GET /tareas/:id",
      crear: "POST /tareas",
      actualizar: "PUT /tareas/:id",
      borrar: "DELETE /tareas/:id",
      estadisticas: "GET /tareas/estadisticas (operación interna)",
      completarTodas: "POST /tareas/completar-todas (operación interna)",
    },
  });
});

// ===========================================================================
// OPERACIONES INTERNAS
// Van ANTES de las rutas con /:id para que Express no confunda
// "estadisticas" con un id.
// ===========================================================================

// GET /tareas/estadisticas — calcula un resumen en el servidor.
app.get("/tareas/estadisticas", async (req, res) => {
  const { data, error } = await supabase.from(TABLA).select("completada");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  const total = data.length;
  const completadas = data.filter((t) => t.completada).length;
  const pendientes = total - completadas;
  const porcentaje = total === 0 ? 0 : Math.round((completadas / total) * 100);

  res.json({ total, completadas, pendientes, porcentajeCompletado: porcentaje });
});

// POST /tareas/completar-todas — marca todas las pendientes como completadas.
app.post("/tareas/completar-todas", async (req, res) => {
  const { data, error } = await supabase
    .from(TABLA)
    .update({ completada: true })
    .eq("completada", false)
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json({ mensaje: "Tareas actualizadas", actualizadas: data.length });
});

// ===========================================================================
// CRUD
// ===========================================================================

// GET /tareas — lista todas.
app.get("/tareas", async (req, res) => {
  const { data, error } = await supabase
    .from(TABLA)
    .select("*")
    .order("id", { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /tareas/:id — una tarea por id.
app.get("/tareas/:id", async (req, res) => {
  const { data, error } = await supabase
    .from(TABLA)
    .select("*")
    .eq("id", req.params.id)
    .single();

  // PGRST116 = no encontró filas.
  if (error && error.code === "PGRST116") {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /tareas — crea una.  Body: { "titulo": "..." }
app.post("/tareas", async (req, res) => {
  const { titulo } = req.body;

  if (!titulo || titulo.trim() === "") {
    return res.status(400).json({ error: "El campo 'titulo' es obligatorio" });
  }

  const { data, error } = await supabase
    .from(TABLA)
    .insert({ titulo })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PUT /tareas/:id — actualiza.  Body: { "titulo"?, "completada"? }
app.put("/tareas/:id", async (req, res) => {
  const { titulo, completada } = req.body;

  const cambios = {};
  if (titulo !== undefined) cambios.titulo = titulo;
  if (completada !== undefined) cambios.completada = completada;

  if (Object.keys(cambios).length === 0) {
    return res.status(400).json({ error: "Nada que actualizar" });
  }

  const { data, error } = await supabase
    .from(TABLA)
    .update(cambios)
    .eq("id", req.params.id)
    .select()
    .single();

  if (error && error.code === "PGRST116") {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// DELETE /tareas/:id — borra.
app.delete("/tareas/:id", async (req, res) => {
  const { data, error } = await supabase
    .from(TABLA)
    .delete()
    .eq("id", req.params.id)
    .select()
    .single();

  if (error && error.code === "PGRST116") {
    return res.status(404).json({ error: "Tarea no encontrada" });
  }
  if (error) return res.status(500).json({ error: error.message });
  res.json({ mensaje: "Tarea borrada", tarea: data });
});

// ---------------------------------------------------------------------------
// Arranque.
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
