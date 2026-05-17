# Sistema de Gestión para Barbería

Proyecto fullstack para administrar barberías con PostgreSQL, un backend FastAPI y un frontend Vue 3.

## Tecnologías

- **Backend**: FastAPI + SQLModel
- **Frontend**: Vue 3 + TypeScript + Vite + Tailwind CSS
- **Base de datos**: PostgreSQL (Docker Compose)

## Estructura del proyecto

```bash
postgres-crud-example/
├── fastapi-backend/             # Backend FastAPI
│   ├── app/
│   │   ├── controllers/         # Endpoints HTTP
│   │   ├── models/              # Modelos SQLModel
│   │   ├── db.py                # Conexión a BD
│   │   └── main.py              # App FastAPI y CORS
│   ├── main.py                  # Entry point (uvicorn)
│   ├── requirements.txt         # Dependencias Python
│   └── .env.example             # Variables de entorno de ejemplo
├── frontend-vue/                # Frontend Vue 3
│   ├── src/
│   │   ├── components/
│   │   ├── composables/
│   │   ├── views/
│   │   └── router/
│   ├── .env.example             # VITE_API_URL
│   └── package.json
├── db/
│   └── init.sql                 # Tablas de barbería
├── docker-compose.yml           # PostgreSQL
└── README.md
```

## Inicio rápido

1. Levantar la base de datos:

   ```bash
   docker compose up -d
   ```

2. Backend FastAPI:

   ```bash
   cd fastapi-backend
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   cp .env.example .env
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

3. Frontend:

   ```bash
   cd frontend-vue
   npm install
   cp .env.example .env
   npm run dev
   ```

## API

Base URL: `http://localhost:8000/api`

Recursos disponibles (CRUD completo):

- **especialidades**: `/especialidades`
- **estado laboral**: `/estado-laboral`
- **barberos**: `/barberos`
- **clientes**: `/clientes`
- **servicios**: `/servicios`
- **estado cita**: `/estado-cita`
- **citas**: `/citas`
- **método pago**: `/metodo-pago`
- **facturas**: `/facturas`

Cada recurso soporta:

- `GET /recurso`
- `GET /recurso/{id}`
- `POST /recurso`
- `PUT /recurso/{id}`
- `DELETE /recurso/{id}`
