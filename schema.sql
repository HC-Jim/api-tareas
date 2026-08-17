-- ---------------------------------------------------------------------------
-- Tabla "tareas" para el backend.
-- Cópialo y ejecútalo en Supabase → panel del proyecto → SQL Editor → New query.
-- ---------------------------------------------------------------------------

create table if not exists tareas (
  id          bigint generated always as identity primary key,
  titulo      text not null,
  completada  boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Datos de ejemplo (opcional).
insert into tareas (titulo, completada) values
  ('Aprender HTTP', false),
  ('Crear mi primera API', true);
