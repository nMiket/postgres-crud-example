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

## Guía detallada para ejecutar el proyecto localmente (primera vez)

### 1) Dependencias requeridas

- **Git**
- **Python 3.12+** (con `venv` y `pip`)
- **Node.js 20+** y **npm**
- **PostgreSQL 15+** (o Docker con Docker Compose)
- (Opcional) **Docker Desktop** / motor Docker + plugin `docker compose`

### 2) Clonar el repositorio

```bash
git clone https://github.com/nMiket/postgres-crud-example.git
cd postgres-crud-example
```

### 3) Configurar base de datos PostgreSQL

Este proyecto incluye `db/init.sql` con el esquema completo.

#### Opción A (recomendada): usar Docker Compose para PostgreSQL

Desde la raíz del repositorio:

```bash
docker compose up -d db
```

Esto crea un contenedor PostgreSQL con:

- host: `localhost`
- puerto: `5432`
- base de datos: `barbershop_db`
- usuario: `admin`
- contraseña: `password123`

> Puedes sobrescribir estos valores con variables de entorno (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`) antes de ejecutar `docker compose up`.

`db/init.sql` se monta en `/docker-entrypoint-initdb.d/init.sql` y se ejecuta automáticamente en la **primera** inicialización del volumen.

#### Opción B: PostgreSQL local (sin Docker)

1. Crea una base de datos vacía (por ejemplo, `barbershop_db`).
2. Ejecuta el script de esquema:

```bash
psql -h localhost -U admin -d barbershop_db -f db/init.sql
```

### 4) Configurar y ejecutar backend (FastAPI)

```bash
cd fastapi-backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Archivo de configuración:

- `fastapi-backend/.env`
  - `DATABASE_URL=postgresql://admin:password123@localhost:5432/barbershop_db`

Iniciar API:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Verificación rápida:

- API base: `http://localhost:8000/api`
- Swagger: `http://localhost:8000/docs`

### 5) Configurar y ejecutar frontend (Vue 3 + Vite)

En otra terminal:

```bash
cd frontend-vue
npm install
cp .env.example .env
npm run dev
```

Archivo de configuración:

- `frontend-vue/.env`
  - `VITE_API_URL=http://localhost:8000/api`

La app de Vite mostrará la URL local (normalmente `http://localhost:5173`).

### 6) Inicialización / migraciones de base de datos

- El proyecto **no usa Alembic** en la estructura actual.
- La inicialización del esquema se hace con `db/init.sql` (Docker o ejecución manual).
- Además, en el arranque del backend se ejecuta `SQLModel.metadata.create_all(...)`, que crea tablas faltantes según los modelos.

### 7) Flujo recomendado de arranque diario

1. Inicia PostgreSQL (`docker compose up -d db` o tu instancia local).
2. Arranca backend (`uvicorn ...` en `fastapi-backend`).
3. Arranca frontend (`npm run dev` en `frontend-vue`).

### 8) ¿Qué hace Docker Compose en este repositorio?

- `docker-compose.yml` actual solo define el servicio **db** (PostgreSQL).
- El backend FastAPI y frontend Vue se ejecutan localmente con Python/Node (no hay `Dockerfile` para esos servicios en este repositorio).

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
