# API de Tareas 🚀

API REST sencilla (CRUD) hecha con **Node.js + Express** para aprender a
crear peticiones HTTP y APIs consumibles.

## Requisitos

- [Node.js](https://nodejs.org) 18 o superior.

## Correr en local

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## Endpoints

| Método | Ruta          | Qué hace                    |
|--------|---------------|-----------------------------|
| GET    | `/`           | Info de la API              |
| GET    | `/tareas`     | Lista todas las tareas      |
| GET    | `/tareas/:id` | Obtiene una tarea           |
| POST   | `/tareas`     | Crea una tarea              |
| PUT    | `/tareas/:id` | Actualiza una tarea         |
| DELETE | `/tareas/:id` | Borra una tarea             |

Prueba los endpoints con el archivo `peticiones.http` (extensión **REST Client**
de VS Code) o con **Postman** / `curl`.

Ejemplo con curl:

```bash
curl http://localhost:3000/tareas
curl -X POST http://localhost:3000/tareas -H "Content-Type: application/json" -d "{\"titulo\":\"Nueva tarea\"}"
```

## Desplegar en Render (gratis)

1. Sube este proyecto a un repositorio de **GitHub**.
2. Entra a https://render.com y crea una cuenta (puedes usar tu cuenta de GitHub).
3. Botón **New +** → **Web Service** → conecta tu repositorio.
4. Configura:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
5. **Create Web Service**. En unos minutos tendrás una URL pública
   tipo `https://api-tareas.onrender.com`.

> Nota: en el plan gratis el servicio se "duerme" tras 15 min sin uso.
> La primera petición después de dormir tarda unos segundos en responder.
