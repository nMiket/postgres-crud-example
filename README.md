# Ejemplo de Backend para PostgreSQL usando .NET y FastAPI

Un proyecto fullstack que demuestra CRUD y consultas contra PostgreSQL usando dos backends diferentes (.NET 10 y FastAPI) y un frontend Vue 3 con TypeScript.

## Tecnologías

- **Backend 1**: .NET 10 (ASP.NET Core) con Entity Framework Core
- **Backend 2**: Python 3 (FastAPI) con SQLModel
- **Frontend**: Vue 3 + TypeScript + Vite + Tailwind CSS
- **Base de datos**: PostgreSQL 15+ (docker)
- **Herramientas**: Docker Compose, pnpm, dotnet CLI

## Estructura del Proyecto

```bash
postgres-crud-example/
├── DotnetBackend/              # Backend ASP.NET Core
│   ├── Controllers/            # Endpoints HTTP (GamesController.cs, LibraryController.cs)
│   ├── Models/                 # Entidades de dominio (Game.cs, UserGame.cs)
│   ├── Data/                   # DbContext y configuración de EF Core
│   ├── Migrations/             # Migraciones de EF Core
│   ├── Properties/             # Configuración de inicio (launchSettings.json)
│   ├── appsettings.json        # Configuración de producción
│   ├── appsettings.Development.json  # Configuración de desarrollo
│   └── Program.cs              # Punto de entrada, configuración de servicios
├── fastapi-backend/            # Backend FastAPI (alternativo)
│   ├── app/
│   │   ├── controllers/        # Rutas HTTP (games_controller.py, library_controller.py)
│   │   ├── models/             # Esquemas Pydantic y SQLModel
│   │   ├── db.py               # Conexión y sesión de base de datos
│   │   └── main.py             # App FastAPI y CORS
│   ├── main.py                 # Entry point (uvicorn)
│   ├── requirements.txt         # Dependencias de Python
│   └── .env                    # Variables de entorno
├── frontend-vue/               # Frontend Vue 3
│   ├── src/
│   │   ├── components/         # Componentes Vue reutilizables
│   │   ├── composables/        # Composables (hooks) de lógica de negocio
│   │   ├── views/              # Páginas principales
│   │   ├── router/             # Rutas y navegación
│   │   ├── lib/                # Utilidades (api.ts, etc.)
│   │   ├── styles/             # Estilos CSS globales
│   │   ├── App.vue             # Componente raíz2
│   │   └── main.ts             # Punto de entrada
│   ├── index.html              # Plantilla HTML
│   ├── package.json            # Dependencias de Node.js
│   ├── vite.config.ts          # Configuración de Vite
│   ├── tsconfig.json           # Configuración de TypeScript
│   ├── tailwind.config.js       # Configuración de Tailwind CSS
│   ├── .env                    # Variables de entorno (VITE_API_URL)
│   └── .env.example            # Plantilla de variables de entorno
├── db/
│   ├── init.sql                # Scripts de creación de tablas e índices
│   └── games.csv               # Datos de ejemplo
├── docker-compose.yml          # Configuración de servicios (PostgreSQL)
└── README.md                   # Este archivo
```

## Inicio Rápido

1. Levantar la base de datos:

   ```bash
   docker compose up -d
   ```

2. Configuración de la base de datos:

   **Conexión**:

   ```text
   postgresql://postgres:postgres@localhost:5432/postgres
   ```

   **Puerto**: 5432
   **Usuario**: postgres
   **Contraseña**: postgres
   **Base de datos**: postgres

3. Precargar datos:

   El script `db/init.sql` solo crea las tablas e índices, no inserta datos. Para precargar datos desde `db/games.csv`:
   - Ejecutar manualmente el SQL de inserción en un cliente SQL
   - O importar el CSV desde su IDE de base de datos
   - O crear un script que lea el CSV y lo inserte mediante la API

## .NET (ASP.NET Core)

### Requisitos previos

- .NET 10 SDK ([descargar](https://dotnet.microsoft.com/download))
- dotnet CLI (incluido en el SDK)

### Instalación de dependencias

El archivo `DotnetBackend.csproj` define todas las dependencias. Al ejecutar cualquier comando dotnet, las dependencias se descargan automáticamente:

```bash
cd DotnetBackend
dotnet restore  # Descarga explícitamente los paquetes
```

**Paquetes principales** (ya incluidos en el proyecto):

- `Npgsql.EntityFrameworkCore.PostgreSQL` — Proveedor de EF Core para PostgreSQL
- `Microsoft.EntityFrameworkCore.Design` — Herramientas de diseño para migraciones
- `Microsoft.AspNetCore.OpenApi` — Soporte para OpenAPI/Swagger

Para añadir nuevos paquetes:

```bash
dotnet add package NombrePaquete              # Añade la última versión
dotnet add package NombrePaquete --version 10.0.0  # Versión específica
dotnet remove package NombrePaquete           # Elimina un paquete
dotnet list package                           # Lista paquetes instalados
```

### Estructura y patrones

- **Controllers/** — Endpoints HTTP, validaciones y mapeo de solicitudes
- **Models/** — Entidades de dominio, representan las tablas de BD
- **Data/GamesContext.cs** — DbContext de EF Core, configura el mapeo entidad-tabla
- **Migrations/** — Versionado de cambios en el esquema de la BD
- **appsettings.json** — Configuración global (cadena de conexión, logging, etc.)
- **Program.cs** — Bootstrapping: servicios, middleware, y rutas

### Setup inicial

1. Entrar a la carpeta:

   ```bash
   cd DotnetBackend
   ```

2. Restaurar dependencias:

   ```bash
   dotnet restore
   ```

3. Configurar la cadena de conexión en `appsettings.Development.json`:

   ```json
   {
     "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Port=5432;Database=postgres;Username=postgres;Password=postgres"
     },
     "Logging": {
       "LogLevel": {
         "Default": "Information"
       }
     }
   }
   ```

4. Crear migraciones y aplicarlas:

   ```bash
   dotnet tool install --global dotnet-ef  # Si no lo tiene instalado
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```

5. Ejecutar el servidor de desarrollo:

   ```bash
   dotnet run
   ```

   El servidor estará disponible en `https://localhost:5272` (HTTPS) e `http://localhost:5273` (HTTP).

### Gestión de migraciones

Cuando cambia un modelo de datos:

```bash
dotnet ef migrations add DescripcionDelCambio
dotnet ef database update                      # Aplicar la migración
dotnet ef database update NombrePrevioMigracion  # Revertir a una migración anterior
dotnet ef migrations remove                    # Eliminar la última migración sin aplicar
```

### Compilación y publicación

```bash
dotnet build                                   # Compilar en modo Debug
dotnet build -c Release                        # Compilar en modo Release
dotnet publish -c Release -o ./publish         # Publicar (genera un paquete autodesplegable)
```

## Python (FastAPI)

### Requisitos previos

- Python 3.9+ ([descargar](https://www.python.org/downloads/))
- pip (gestor de paquetes, incluido con Python)
- Recomendado: usar entorno virtual

### Instalación de dependencias

El archivo `requirements.txt` lista todas las dependencias. Para instalar:

```bash
cd fastapi-backend

# Crear entorno virtual (una sola vez)
python -m venv venv

# Activar el entorno
source venv/bin/activate          # En Linux/macOS
venv\Scripts\activate             # En Windows

# Instalar dependencias
pip install -r requirements.txt
```

**Paquetes principales**:

- `fastapi` — Framework web asincrónico
- `uvicorn` — Servidor ASGI para ejecutar FastAPI
- `sqlmodel` — ORM (SQLAlchemy + Pydantic)
- `psycopg2-binary` — Adaptador PostgreSQL para Python
- `python-dotenv` — Carga variables de entorno desde `.env`

Para añadir nuevos paquetes y actualizar `requirements.txt`:

```bash
pip install NombrePaquete
pip freeze > requirements.txt      # Actualiza el archivo de dependencias
```

Para actualizar paquetes existentes:

```bash
pip install --upgrade NombrePaquete
pip list                           # Ver versiones instaladas
```

### Estructura y patrones

- **app/controllers/** — Rutas HTTP definidas con decoradores `@app.get()`, `@app.post()`
- **app/models/** — Esquemas Pydantic para validación y modelos SQLModel para la BD
- **app/db.py** — Configuración de conexión, sesión y utilidades de BD
- **app/main.py** — Instancia de FastAPI y configuración (CORS, etc.)
- **main.py** — Punto de entrada para iniciar el servidor con uvicorn
- **.env** — Variables de entorno (DATABASE_URL, etc.)

### Setup inicial

1. Entrar a la carpeta:

   ```bash
   cd fastapi-backend
   ```

2. Crear y activar entorno virtual:

   ```bash
   python -m venv venv
   source venv/bin/activate          # Linux/macOS
   # o
   venv\Scripts\activate             # Windows
   ```

3. Instalar dependencias:

   ```bash
   pip install -r requirements.txt
   ```

4. Configurar variables de entorno en `.env`:

   ```text
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
   ```

5. Ejecutar el servidor de desarrollo:

   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   El servidor estará disponible en `http://localhost:8000`.
   - Documentación interactiva (Swagger): `http://localhost:8000/docs`
   - Documentación alternativa (ReDoc): `http://localhost:8000/redoc`

### Gestión de dependencias en desarrollo

Si añade un paquete nuevo, actualice `requirements.txt`:

```bash
pip install NuevoPaquete
pip freeze > requirements.txt
```

Para reproducir el entorno en otra máquina:

```bash
pip install -r requirements.txt
```

Para limpiar la caché de pip y reinstalar:

```bash
pip install --force-reinstall --no-cache-dir -r requirements.txt
```

### Ejecución con diferentes configuraciones

```bash
# Desarrollo (con auto-reload)
uvicorn main:app --reload --port 8000

# Producción (sin auto-reload, con workers)
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4

# Con logging más verboso
uvicorn main:app --reload --log-level debug
```

## API común para ambos backends

### Descripción

Los dos backends (.NET y FastAPI) implementan la misma API para que el frontend funcione indistintamente con uno u otro. El esquema de respuesta es idéntico en ambos.

### Endpoints de catálogo

#### `GET /api/games`

Lista los juegos con búsqueda y paginación opcionales.

**Parámetros de consulta**:

- `q` (string, opcional) — Búsqueda por título o slug
- `limit` (number, opcional) — Número de registros por página (default: 10)
- `offset` (number, opcional) — Número de registros a saltar (default: 0)

**Ejemplo**:

```bash
GET /api/games?q=zelda&limit=20&offset=0
```

**Respuesta** (200 OK):

```json
[
  {
    "id": "uuid o número",
    "rawgId": 3498,
    "title": "The Legend of Zelda: Breath of the Wild",
    "slug": "the-legend-of-zelda-breath-of-the-wild",
    "releaseDate": "2017-03-03",
    "coverUrl": "https://media.rawg.io/media/games/xxx/xxx.jpg",
    "rating": 4.5
  }
]
```

#### `GET /api/games/{id}`

Obtiene un juego específico por su ID.

**Parámetros de ruta**:

- `id` (string o number) — ID único del juego

**Ejemplo**:

```bash
GET /api/games/550e8400-e29b-41d4-a716-446655440000
```

**Respuesta** (200 OK):

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "rawgId": 3498,
  "title": "The Legend of Zelda: Breath of the Wild",
  "slug": "the-legend-of-zelda-breath-of-the-wild",
  "releaseDate": "2017-03-03",
  "coverUrl": "https://media.rawg.io/media/games/xxx/xxx.jpg",
  "rating": 4.5
}
```

### Endpoints de librería personal

La librería personal permite al usuario guardar sus juegos favoritos y proporciona CRUD completo.

#### `GET /api/library`

Lista los juegos en la librería del usuario.

**Respuesta** (200 OK):

```json
[
  {
    "id": "uuid",
    "gameId": "550e8400-e29b-41d4-a716-446655440000",
    "status": "owned" // o "wishlist"
  }
]
```

#### `POST /api/library`

Añade un juego a la librería del usuario.

**Body** (application/json):

```json
{
  "gameId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "owned"
}
```

**Respuesta** (201 Created):

```json
{
  "id": "uuid-nuevo",
  "gameId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "owned"
}
```

#### `PUT /api/library/{id}`

Actualiza un juego en la librería.

**Body** (application/json):

```json
{
  "status": "wishlist"
}
```

**Respuesta** (200 OK):

```json
{
  "id": "uuid",
  "gameId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "wishlist"
}
```

#### `DELETE /api/library/{id}`

Elimina un juego de la librería.

**Respuesta** (204 No Content): (sin body)

### Esquema de entidad esperado

Tanto .NET como FastAPI deben devolver este esquema (los nombres de propiedades pueden variar según camelCase/snake_case, pero la estructura es igual):

| Campo         | Tipo            | Descripción                     |
| ------------- | --------------- | ------------------------------- |
| `id`          | string o number | Identificador único             |
| `rawgId`      | number o null   | ID de la base de datos RAWG     |
| `title`       | string o null   | Nombre del juego                |
| `slug`        | string o null   | URL-friendly identifier         |
| `releaseDate` | string o null   | Fecha de lanzamiento (ISO 8601) |
| `coverUrl`    | string o null   | URL de la portada               |
| `rating`      | number o null   | Calificación promedio           |

## Frontend (Vue)

### Requisitos previos

- Node.js 20.19+ o 22.12+ ([descargar](https://nodejs.org/))
- pnpm 9+ ([guía de instalación](https://pnpm.io/installation))

### Instalación de dependencias

El archivo `package.json` define todas las dependencias. Para instalar:

```bash
cd frontend-vue
pnpm install
```

**Paquetes principales**:

- `vue` — Framework progresivo
- `vue-router` — Enrutador oficial de Vue
- `pinia` — Gestor de estado (almacén reactivo)
- `vite` — Bundler y servidor de desarrollo ultra rápido
- `tailwindcss` — Framework CSS utilitario
- `typescript` — Tipado estático para JavaScript
- `eslint` — Linter y validador de código
- `prettier` — Formateador de código

Para añadir nuevos paquetes:

```bash
pnpm add NombrePaquete              # Añade la última versión
pnpm add -D NombrePaquete           # Añade como dependencia de desarrollo
pnpm remove NombrePaquete           # Elimina un paquete
pnpm list                           # Lista paquetes instalados
```

### Estructura y patrones

- **src/components/** — Componentes Vue reutilizables (botones, formularios, etc.)
- **src/views/** — Páginas principales (vistas completas)
- **src/router/** — Configuración de rutas y navegación
- **src/composables/** — Composables (hooks) para lógica reutilizable
- **src/lib/** — Funciones y utilidades (api.ts para llamadas HTTP)
- **src/styles/** — Hojas de estilo globales
- **vite.config.ts** — Configuración del bundler
- **tsconfig.json** — Configuración de TypeScript
- **tailwind.config.js** — Configuración de Tailwind CSS
- **.env** — Variables de entorno (VITE_API_URL)

### Setup inicial

1. Entrar a la carpeta:

   ```bash
   cd frontend-vue
   ```

2. Revisar el archivo de entorno:

   El archivo [.env](.env) ya incluye un valor por defecto para desarrollo local:

   ```text
   VITE_API_URL=http://localhost:5272/api
   ```

   Ajuste `VITE_API_URL` si su backend no corre en ese puerto.

3. Instalar dependencias:

   ```bash
   pnpm install
   ```

4. Ejecutar el servidor de desarrollo:

   ```bash
   pnpm dev
   ```

   El servidor estará disponible en `http://localhost:5173` (u otro puerto disponible).

### Scripts de desarrollo

```bash
pnpm dev              # Inicia el servidor de desarrollo con hot-reload
pnpm build            # Compila para producción (output en dist/)
pnpm preview          # Previsualiza la versión compilada
pnpm type-check       # Valida tipos TypeScript sin compilar
pnpm lint             # Ejecuta linters (eslint, oxlint)
pnpm lint:eslint      # Solo eslint
pnpm lint:oxlint      # Solo oxlint (linter Rust, más rápido)
pnpm format           # Formatea código con Prettier
```

### Variables de entorno

Las variables de entorno con prefijo `VITE_` están disponibles en el código:

```typescript
// src/lib/api.ts
const apiUrl = import.meta.env.VITE_API_URL;

// También disponible en tiempo de compilación
if (import.meta.env.DEV) {
  console.log("En desarrollo");
}
```

**Variables disponibles**:

- `VITE_API_URL` — URL base de la API del backend (ej: `http://localhost:5272/api`)

### Flujo de desarrollo

1. Editar componentes en `src/`
2. El servidor Vite detecta cambios y recarga automáticamente (HMR)
3. Revisar cambios en navegador en `http://localhost:5173`
4. Antes de hacer commit: ejecutar `pnpm lint` y `pnpm type-check`
5. Compilar para producción con `pnpm build`

### Compilación y publicación

```bash
# Compilar para producción
pnpm build

# Previsualizar la compilación localmente
pnpm preview

# Los archivos compilados están en dist/
```

El output de `dist/` puede desplegarse en cualquier servidor web estático (Netlify, Vercel, AWS S3, etc.).

## Base de datos (PostgreSQL)

### Configuración con Docker Compose

El archivo `docker-compose.yml` define un servicio PostgreSQL listo para desarrollo:

```yaml
services:
  postgres:
    image: postgres:15-alpine
    container_name: postgres_db
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: postgres
    volumes:
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql
```

### Operaciones básicas

**Iniciar PostgreSQL**:

```bash
docker compose up -d
```

**Conectarse a la base de datos** (desde la máquina host):

```bash
psql postgresql://postgres:postgres@localhost:5432/postgres
```

**Ver logs del contenedor**:

```bash
docker compose logs -f postgres
```

**Detener PostgreSQL**:

```bash
docker compose down
```

**Eliminar volúmenes** (borra la BD completamente):

```bash
docker compose down -v
```

### Esquema de base de datos

El script `db/init.sql` crea las tablas al iniciar el contenedor:

```sql
CREATE TABLE games (
  id UUID PRIMARY KEY,
  rawg_id INTEGER,
  title VARCHAR(255),
  slug VARCHAR(255),
  release_date DATE,
  cover_url VARCHAR(512),
  rating DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_games (
  id UUID PRIMARY KEY,
  game_id UUID REFERENCES games(id),
  status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_games_title ON games(title);
CREATE INDEX idx_games_slug ON games(slug);
```

### Importar datos desde CSV

El archivo `db/games.csv` contiene juegos de ejemplo. Para importarlos:

**Opción 1: Desde psql**:

```bash
psql -U postgres -h localhost -d postgres -c "COPY games (id, rawg_id, title, slug, release_date, cover_url, rating) FROM STDIN WITH (FORMAT csv, HEADER);" < db/games.csv
```

**Opción 2: Script de Python**:

```python
import csv
import psycopg2

with open('db/games.csv') as f:
    reader = csv.DictReader(f)
    # Conectar a la BD e insertar registros
```

**Opción 3: IDE SQL** (DBeaver, pgAdmin, etc.):

1. Abrir la herramienta gráfica
2. Conectar a `localhost:5432`
3. Navegar a tabla `games`
4. Importar CSV como datos

## Flujo de desarrollo completo

### Opción 1: Usar .NET backend

```bash
# Terminal 1: Inicia PostgreSQL
docker compose up -d

# Terminal 2: Inicia el backend .NET
cd DotnetBackend
dotnet run

# Terminal 3: Inicia el frontend Vue
cd frontend-vue
pnpm install
pnpm dev
```

Accede a `http://localhost:5173`.

### Opción 2: Usar FastAPI backend

```bash
# Terminal 1: Inicia PostgreSQL
docker compose up -d

# Terminal 2: Inicia el backend FastAPI
cd fastapi-backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Terminal 3: Inicia el frontend Vue (cambiar VITE_API_URL)
cd frontend-vue
# Editar .env: VITE_API_URL=http://localhost:8000/api
pnpm install
pnpm dev
```

Accede a `http://localhost:5173`.

## Solución de problemas

### "Error de conexión a PostgreSQL"

**Causa**: El contenedor no está corriendo.

**Solución**:

```bash
docker compose up -d
docker compose ps  # Verificar que el contenedor esté UP
```

### "VITE_API_URL undefined en el frontend"

**Causa**: Falta el archivo `.env` o está mal configurado.

**Solución**:

```bash
cd frontend-vue
cat .env  # Verificar que existe y tiene VITE_API_URL
```

### "Port already in use" (Puerto ya en uso)

**Solución para cambiar puertos**:

- **.NET**: Editar `Properties/launchSettings.json`
- **FastAPI**: `uvicorn main:app --port 9000`
- **Vue**: `pnpm dev -- --port 5174`
- **PostgreSQL**: Cambiar puerto en `docker-compose.yml`

### "Migraciones de EF Core fallidas"

**Solución**:

```bash
cd DotnetBackend
dotnet ef database drop --force  # Resetear BD
dotnet ef database update         # Recrear desde 0
```

## Notas importantes

- **Ambos backends deben devolver el mismo esquema** para que el frontend funcione sin cambios
- **Variables de entorno**: Nunca commitear archivos `.env` con credenciales reales. Usar `.env.example` como plantilla
- **Migraciones en EF Core**: Crear una migración después de cada cambio de modelo
- **Hot reload**: Ambos dev servers (Vite y dotnet/uvicorn) soportan recarga automática
- **CORS**: Los backends deben permitir solicitudes desde `http://localhost:5173` en desarrollo
