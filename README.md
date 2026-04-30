# Ejemplo de Backend para PostgreSQL usando .NET y FastAPI

## Ejecución

1. Levantar la base de datos:

   ```bash
   docker compose up -d
   ```

2. Conexión a la base de datos:

   ```text
   postgresql://postgres:postgres@localhost:5432/postgres
   ```

3. Semillas y CSV

- El script `db/init.sql` solo crea las tablas y los índices, no inserta datos. Para precargar datos, puede ejecutar manualmente el SQL de inserción o usar un script que lea `db/games.csv` y lo inserte en la base de datos o importar el CSV desde el IDE.

## .NET (ASP.NET Core)

1. Crear el proyecto backend-dotnet:

   ```bash
   dotnet new webapi -n DotnetBackend
   cd DotnetBackend
   ```

2. Añadir el proveedor de Postgres para EF Core:

   ```bash
   dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
   ```

3. Configurar la cadena de conexión en `appsettings.json`:

   ```json
   "ConnectionStrings": {
       "DefaultConnection": "Host=localhost;Port=5432;Database=postgres;Username=postgres;Password=postgres"
   }
   ```

4. Crear `Models/Game.cs` y `Data/GamesContext.cs` (un `DbContext` con `DbSet<Game>`). Use `Guid` o `int` según el esquema en `db/init.sql`.

5. Añadir el controlador `Controllers/GamesController.cs` con los endpoints de consulta de catálogo:
   - `GET /api/games` — listar (soportar búsqueda con query param `q` y paginación)
   - `GET /api/games/{id}` — obtener por id

6. Migraciones y creación de la base de datos:

   ```bash
   dotnet tool install --global dotnet-ef  # si no tiene dotnet-ef
   dotnet ef migrations add InitialCreate
   dotnet ef database update
   ```

7. Ejecutar la API:

   ```bash
   dotnet run
   ```

## Python (FastAPI)

1. Crear el entorno virtual e instalar dependencias:

   ```bash
   python -m venv venv
   source venv/bin/activate
   pip install fastapi uvicorn sqlmodel psycopg2-binary python-dotenv
   ```

2. Usar `SQLModel` para definir el modelo `Game`:
   - `Game` debe incluir los campos `id`, `rawg_id`, `title`, `slug`, `release_date`, `cover_url` y `rating`.
   - Si quiere separar esquemas, puede definir clases para creación/lectura/actualización, pero no es obligatorio para la guía.

3. Configurar la cadena de conexión en una variable de entorno:

   ```text
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
   ```

4. Crear la conexión y las tablas con `SQLModel`:
   - Crear un `engine` con `create_engine(DATABASE_URL)`.
   - Ejecutar `SQLModel.metadata.create_all(engine)` al iniciar la app.

5. Implementar los mismos endpoints de consulta de catálogo que en `.NET`:
   - `GET /api/games` — listar juegos, con `q`, `limit` y `offset`
   - `GET /api/games/{id}` — obtener un juego por id

6. Ejecutar el servidor:

   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

7. Si quiere precargar datos, leer `db/games.csv` desde un script aparte y crear registros usando la sesión de `sqlmodel`.

Nota: en FastAPI el backend debe devolver exactamente el mismo esquema que `.NET` para que el frontend no tenga que cambiar su forma de consumo.

## API común para ambos backends

Las dos opciones deben devolver la misma estructura para que el frontend funcione igual con una u otra.

Rutas esperadas:

- `GET /api/games`
- `GET /api/games/{id}`

La librería personal usa una API aparte y sí requiere CRUD:

- `GET /api/library`
- `POST /api/library`
- `PUT /api/library/{id}`
- `DELETE /api/library/{id}`

Esquema esperado por el frontend:

- `id`: string
- `rawg_id`: integer o null
- `title`: string o null
- `slug`: string o null
- `release_date`: string o null
- `cover_url`: string o null
- `rating`: number o null

## Frontend (Vue)

1. Entrar a la carpeta del frontend:

   ```bash
   cd frontend-vue
   ```

2. Instalar dependencias:

   ```bash
   pnpm install
   ```

3. Ejecutar el servidor de desarrollo:

   ```bash
   pnpm dev
   ```
