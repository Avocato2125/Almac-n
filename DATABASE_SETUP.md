# Configuración de Base de Datos PostgreSQL

## 🗄️ Información de Conexión

**URL de Conexión:**
```
postgresql://postgres:VsSTUIDZQfFqDBwBshBjZcjqxoPRPoTF@postgres.railway.internal:5432/railway
```

## 📋 Tablas Creadas

### 1. **proveedores**
- `id` - Identificador único (SERIAL PRIMARY KEY)
- `nombre` - Nombre del proveedor (VARCHAR)
- `rfc` - RFC del proveedor (VARCHAR)
- `telefono` - Teléfono de contacto (VARCHAR)
- `email` - Correo electrónico (VARCHAR)
- `direccion` - Dirección del proveedor (TEXT)
- `contacto` - Persona de contacto (VARCHAR)
- `fecha_registro` - Fecha de registro (TIMESTAMP)
- `activo` - Estado del proveedor (BOOLEAN)
- `created_at` - Fecha de creación (TIMESTAMP)
- `updated_at` - Fecha de actualización (TIMESTAMP)

### 2. **productos**
- `id` - Identificador único (SERIAL PRIMARY KEY)
- `codigo` - Código único del producto (INTEGER UNIQUE)
- `nombre` - Nombre del producto (VARCHAR)
- `area` - Área del almacén (VARCHAR, CHECK constraint)
- `cantidad` - Cantidad actual en stock (INTEGER)
- `cantidad_minima` - Cantidad mínima para alerta (INTEGER)
- `unidad` - Unidad de medida (VARCHAR)
- `precio_compra` - Precio de compra (DECIMAL)
- `ubicacion` - Ubicación en el almacén (VARCHAR)
- `proveedor_id` - ID del proveedor (FOREIGN KEY)
- `contacto_proveedor` - Contacto del proveedor (VARCHAR)
- `fecha_entrada` - Fecha de entrada (DATE)
- `dias_en_stock` - Días en stock (GENERATED COLUMN)
- `activo` - Estado del producto (BOOLEAN)
- `created_at` - Fecha de creación (TIMESTAMP)
- `updated_at` - Fecha de actualización (TIMESTAMP)

### 3. **salidas**
- `id` - Identificador único (SERIAL PRIMARY KEY)
- `fecha` - Fecha y hora de la salida (TIMESTAMP)
- `producto_id` - ID del producto (FOREIGN KEY)
- `codigo_producto` - Código del producto (INTEGER)
- `nombre_producto` - Nombre del producto (VARCHAR)
- `cantidad` - Cantidad que sale (INTEGER)
- `unidad` - Unidad de medida (VARCHAR)
- `responsable` - Persona responsable (VARCHAR)
- `area_destino` - Área de destino (VARCHAR, CHECK constraint)
- `observaciones` - Observaciones (TEXT)
- `stock_anterior` - Stock antes de la salida (INTEGER)
- `stock_restante` - Stock después de la salida (INTEGER)
- `created_at` - Fecha de creación (TIMESTAMP)

## 🔍 Vistas Creadas

### 1. **vista_productos_completa**
Vista que combina información de productos y proveedores con estado de stock.

### 2. **vista_salidas_completa**
Vista que muestra salidas con información completa del producto y proveedor.

### 3. **vista_estadisticas_areas**
Vista que proporciona estadísticas por área del almacén.

## 🚀 Instalación y Configuración

### 1. Instalar Dependencias
```bash
npm install
```

### 2. Crear las Tablas
```bash
# Opción 1: Usar el script npm
npm run setup-db

# Opción 2: Ejecutar directamente con psql
psql $DATABASE_URL -f database_schema.sql
```

### 3. Probar la Conexión
```bash
npm test
```

### 4. Iniciar el Servidor
```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

## 📊 API Endpoints

### Productos
- `GET /api/productos` - Obtener todos los productos
- `GET /api/productos/:codigo` - Obtener producto por código
- `POST /api/productos` - Crear nuevo producto
- `PUT /api/productos/:codigo` - Actualizar producto
- `DELETE /api/productos/:codigo` - Eliminar producto (soft delete)
- `GET /api/productos/search/:term` - Buscar productos
- `GET /api/productos/area/:area` - Filtrar por área

### Proveedores
- `GET /api/proveedores` - Obtener todos los proveedores
- `GET /api/proveedores/:id` - Obtener proveedor por ID
- `POST /api/proveedores` - Crear nuevo proveedor
- `PUT /api/proveedores/:id` - Actualizar proveedor
- `DELETE /api/proveedores/:id` - Eliminar proveedor (soft delete)

### Salidas
- `GET /api/salidas` - Obtener todas las salidas
- `POST /api/salidas` - Crear nueva salida
- `DELETE /api/salidas/:id` - Eliminar salida

### Estadísticas
- `GET /api/estadisticas` - Obtener estadísticas del sistema
- `GET /api/next-code` - Obtener siguiente código disponible

### Salud del Sistema
- `GET /api/health` - Verificar estado de la base de datos

## 🔧 Configuración de Variables de Entorno

Crear archivo `.env` con:
```env
DATABASE_URL=postgresql://postgres:VsSTUIDZQfFqDBwBshBjZcjqxoPRPoTF@postgres.railway.internal:5432/railway
PORT=3000
NODE_ENV=production
```

## 📈 Características Avanzadas

### Índices Optimizados
- Índices en campos de búsqueda frecuente
- Índices en claves foráneas
- Índices en campos de filtrado

### Triggers Automáticos
- Actualización automática de `updated_at`
- Cálculo automático de días en stock

### Constraints de Integridad
- Claves foráneas con CASCADE DELETE
- Constraints CHECK para valores válidos
- Campos UNIQUE para códigos únicos

### Soft Delete
- Los productos y proveedores se marcan como inactivos
- Las salidas se eliminan físicamente para mantener integridad

## 🛠️ Mantenimiento

### Backup de Datos
```bash
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### Restaurar Backup
```bash
psql $DATABASE_URL < backup_20250101.sql
```

### Limpiar Datos Antiguos
```sql
-- Eliminar salidas mayores a 1 año
DELETE FROM salidas WHERE fecha < NOW() - INTERVAL '1 year';
```

## 📞 Soporte

Para problemas con la base de datos:
1. Verificar conexión con `npm test`
2. Revisar logs del servidor
3. Verificar que las tablas estén creadas correctamente
4. Comprobar permisos de usuario en PostgreSQL
