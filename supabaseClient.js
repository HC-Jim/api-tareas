// ---------------------------------------------------------------------------
// Cliente de Supabase.
// Lee las credenciales del archivo .env y crea una única conexión reutilizable.
// ---------------------------------------------------------------------------

require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const { SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env;

// Si faltan las credenciales, avisamos claro y cerramos: mejor fallar temprano.
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error(
    "❌ Faltan credenciales. Copia .env.example a .env y rellena " +
      "SUPABASE_URL y SUPABASE_SERVICE_KEY."
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false },
});

module.exports = supabase;
