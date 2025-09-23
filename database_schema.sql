-- Sistema de Almacén - Esquema de Base de Datos PostgreSQL
-- Conexión: postgresql://postgres:VsSTUIDZQfFqDBwBshBjZcjqxoPRPoTF@postgres.railway.internal:5432/railway

-- Crear la base de datos si no existe (opcional)
-- CREATE DATABASE almacen_system;

-- Conectar a la base de datos
-- \c almacen_system;

-- ============================================
-- TABLA 1: PROVEEDORES
-- ============================================
CREATE TABLE IF NOT EXISTS proveedores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    rfc VARCHAR(20),
    telefono VARCHAR(20),
    email VARCHAR(255),
    direccion TEXT,
    contacto VARCHAR(255),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comentarios para la tabla proveedores
COMMENT ON TABLE proveedores IS 'Tabla para almacenar información de proveedores';
COMMENT ON COLUMN proveedores.id IS 'Identificador único del proveedor';
COMMENT ON COLUMN proveedores.nombre IS 'Nombre del proveedor';
COMMENT ON COLUMN proveedores.rfc IS 'RFC del proveedor';
COMMENT ON COLUMN proveedores.telefono IS 'Teléfono de contacto';
COMMENT ON COLUMN proveedores.email IS 'Correo electrónico';
COMMENT ON COLUMN proveedores.direccion IS 'Dirección del proveedor';
COMMENT ON COLUMN proveedores.contacto IS 'Persona de contacto';
COMMENT ON COLUMN proveedores.activo IS 'Estado del proveedor (activo/inactivo)';

-- ============================================
-- TABLA 2: PRODUCTOS
-- ============================================
CREATE TABLE IF NOT EXISTS productos (
    id SERIAL PRIMARY KEY,
    codigo INTEGER UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    area VARCHAR(50) NOT NULL CHECK (area IN ('OFICINA', 'LIMPIEZA', 'TALLER', 'ENFERMERIA')),
    cantidad INTEGER NOT NULL DEFAULT 0,
    cantidad_minima INTEGER NOT NULL DEFAULT 2,
    unidad VARCHAR(50) NOT NULL DEFAULT 'PZ',
    precio_compra DECIMAL(10,2),
    ubicacion VARCHAR(100) DEFAULT 'ALMACEN',
    proveedor_id INTEGER REFERENCES proveedores(id) ON DELETE SET NULL,
    contacto_proveedor VARCHAR(255),
    fecha_entrada DATE NOT NULL DEFAULT CURRENT_DATE,
    dias_en_stock INTEGER GENERATED ALWAYS AS (
        EXTRACT(DAYS FROM (CURRENT_DATE - fecha_entrada))
    ) STORED,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comentarios para la tabla productos
COMMENT ON TABLE productos IS 'Tabla para almacenar información de productos del inventario';
COMMENT ON COLUMN productos.id IS 'Identificador único del producto';
COMMENT ON COLUMN productos.codigo IS 'Código único del producto';
COMMENT ON COLUMN productos.nombre IS 'Nombre del producto';
COMMENT ON COLUMN productos.area IS 'Área del almacén donde se encuentra';
COMMENT ON COLUMN productos.cantidad IS 'Cantidad actual en stock';
COMMENT ON COLUMN productos.cantidad_minima IS 'Cantidad mínima para alerta de stock bajo';
COMMENT ON COLUMN productos.unidad IS 'Unidad de medida (PZ, CAJAS, etc.)';
COMMENT ON COLUMN productos.precio_compra IS 'Precio de compra del producto';
COMMENT ON COLUMN productos.ubicacion IS 'Ubicación específica en el almacén';
COMMENT ON COLUMN productos.proveedor_id IS 'ID del proveedor (referencia)';
COMMENT ON COLUMN productos.contacto_proveedor IS 'Contacto del proveedor para este producto';
COMMENT ON COLUMN productos.fecha_entrada IS 'Fecha de entrada al inventario';
COMMENT ON COLUMN productos.dias_en_stock IS 'Días que el producto ha estado en stock';

-- ============================================
-- TABLA 3: SALIDAS
-- ============================================
CREATE TABLE IF NOT EXISTS salidas (
    id SERIAL PRIMARY KEY,
    fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    producto_id INTEGER REFERENCES productos(id) ON DELETE CASCADE,
    codigo_producto INTEGER NOT NULL,
    nombre_producto VARCHAR(255) NOT NULL,
    cantidad INTEGER NOT NULL,
    unidad VARCHAR(50) NOT NULL,
    responsable VARCHAR(255) NOT NULL,
    area_destino VARCHAR(50) NOT NULL CHECK (area_destino IN ('OFICINA', 'LIMPIEZA', 'TALLER', 'ENFERMERIA', 'VENTA', 'DESECHO', 'OTRO')),
    observaciones TEXT,
    stock_anterior INTEGER NOT NULL,
    stock_restante INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comentarios para la tabla salidas
COMMENT ON TABLE salidas IS 'Tabla para registrar todas las salidas de productos';
COMMENT ON COLUMN salidas.id IS 'Identificador único de la salida';
COMMENT ON COLUMN salidas.fecha IS 'Fecha y hora de la salida';
COMMENT ON COLUMN salidas.producto_id IS 'ID del producto (referencia)';
COMMENT ON COLUMN salidas.codigo_producto IS 'Código del producto';
COMMENT ON COLUMN salidas.nombre_producto IS 'Nombre del producto al momento de la salida';
COMMENT ON COLUMN salidas.cantidad IS 'Cantidad que sale del almacén';
COMMENT ON COLUMN salidas.unidad IS 'Unidad de medida';
COMMENT ON COLUMN salidas.responsable IS 'Persona responsable de la salida';
COMMENT ON COLUMN salidas.area_destino IS 'Área hacia donde se dirige el producto';
COMMENT ON COLUMN salidas.observaciones IS 'Observaciones o motivo de la salida';
COMMENT ON COLUMN salidas.stock_anterior IS 'Stock antes de la salida';
COMMENT ON COLUMN salidas.stock_restante IS 'Stock después de la salida';

-- ============================================
-- ÍNDICES PARA OPTIMIZAR CONSULTAS
-- ============================================

-- Índices para la tabla productos
CREATE INDEX IF NOT EXISTS idx_productos_codigo ON productos(codigo);
CREATE INDEX IF NOT EXISTS idx_productos_area ON productos(area);
CREATE INDEX IF NOT EXISTS idx_productos_cantidad ON productos(cantidad);
CREATE INDEX IF NOT EXISTS idx_productos_proveedor ON productos(proveedor_id);
CREATE INDEX IF NOT EXISTS idx_productos_fecha_entrada ON productos(fecha_entrada);

-- Índices para la tabla salidas
CREATE INDEX IF NOT EXISTS idx_salidas_fecha ON salidas(fecha);
CREATE INDEX IF NOT EXISTS idx_salidas_producto ON salidas(producto_id);
CREATE INDEX IF NOT EXISTS idx_salidas_codigo ON salidas(codigo_producto);
CREATE INDEX IF NOT EXISTS idx_salidas_responsable ON salidas(responsable);
CREATE INDEX IF NOT EXISTS idx_salidas_area_destino ON salidas(area_destino);

-- Índices para la tabla proveedores
CREATE INDEX IF NOT EXISTS idx_proveedores_nombre ON proveedores(nombre);
CREATE INDEX IF NOT EXISTS idx_proveedores_rfc ON proveedores(rfc);
CREATE INDEX IF NOT EXISTS idx_proveedores_activo ON proveedores(activo);

-- ============================================
-- TRIGGERS PARA ACTUALIZAR TIMESTAMPS
-- ============================================

-- Función para actualizar el campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at automáticamente
CREATE TRIGGER update_proveedores_updated_at BEFORE UPDATE ON proveedores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_productos_updated_at BEFORE UPDATE ON productos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VISTAS ÚTILES PARA REPORTES
-- ============================================

-- Vista para productos con información de proveedor
CREATE OR REPLACE VIEW vista_productos_completa AS
SELECT 
    p.id,
    p.codigo,
    p.nombre,
    p.area,
    p.cantidad,
    p.cantidad_minima,
    p.unidad,
    p.precio_compra,
    p.ubicacion,
    p.fecha_entrada,
    p.dias_en_stock,
    CASE 
        WHEN p.cantidad <= p.cantidad_minima THEN 'STOCK BAJO'
        ELSE 'OK'
    END as estado_stock,
    prov.nombre as proveedor_nombre,
    p.contacto_proveedor,
    prov.telefono as proveedor_telefono,
    prov.email as proveedor_email
FROM productos p
LEFT JOIN proveedores prov ON p.proveedor_id = prov.id
WHERE p.activo = TRUE;

-- Vista para salidas con información completa
CREATE OR REPLACE VIEW vista_salidas_completa AS
SELECT 
    s.id,
    s.fecha,
    s.codigo_producto,
    s.nombre_producto,
    s.cantidad,
    s.unidad,
    s.responsable,
    s.area_destino,
    s.observaciones,
    s.stock_anterior,
    s.stock_restante,
    p.area as area_producto,
    prov.nombre as proveedor_nombre
FROM salidas s
LEFT JOIN productos p ON s.producto_id = p.id
LEFT JOIN proveedores prov ON p.proveedor_id = prov.id
ORDER BY s.fecha DESC;

-- Vista para estadísticas por área
CREATE OR REPLACE VIEW vista_estadisticas_areas AS
SELECT 
    area,
    COUNT(*) as total_productos,
    SUM(cantidad) as total_cantidad,
    SUM(CASE WHEN cantidad <= cantidad_minima THEN 1 ELSE 0 END) as productos_stock_bajo,
    AVG(dias_en_stock) as promedio_dias_stock
FROM productos
WHERE activo = TRUE
GROUP BY area;

-- ============================================
-- DATOS INICIALES DE PRUEBA (OPCIONAL)
-- ============================================

-- Insertar proveedores de ejemplo
INSERT INTO proveedores (nombre, rfc, telefono, email, direccion, contacto) VALUES
('ADOSA', 'ADO123456789', '844-10-1187', 'ventas@adosa.com', 'Av. Principal 123', 'Juan Pérez'),
('PROQUIMSA', 'PRO987654321', '844-135-2105', 'contacto@proquimsa.com', 'Calle Industrial 456', 'María García'),
('AYCO', 'AYC456789123', '844-555-0123', 'info@ayco.com', 'Zona Industrial 789', 'Carlos López')
ON CONFLICT DO NOTHING;

-- Insertar productos de ejemplo
INSERT INTO productos (codigo, nombre, area, cantidad, cantidad_minima, unidad, precio_compra, ubicacion, proveedor_id, contacto_proveedor, fecha_entrada) VALUES
(1, 'ORDEN DE TRABAJO', 'OFICINA', 7, 5, 'LIBRETAS', 25.50, 'ALMACEN', 1, '844-10-1187', '2025-08-22'),
(2, 'HOJAS DE COLORES', 'OFICINA', 2, 3, 'PAQUETES', 15.75, 'ALMACEN', 1, '844-10-1187', '2025-08-22'),
(3, 'SOBRES TAMAÑO CARTA', 'OFICINA', 1, 2, 'PAQUETE', 8.90, 'ALMACEN', 1, '844-10-1187', '2025-08-22'),
(19, 'POST-IT', 'OFICINA', 5, 3, 'PAQUETES', 12.30, 'ALMACEN', 1, '844-10-1187', '2025-08-22'),
(22, 'PLUMAS NEGRAS', 'OFICINA', 3, 2, 'CAJAS', 45.00, 'ALMACEN', 1, '844-10-1187', '2025-08-22'),
(33, 'FABULOSO', 'LIMPIEZA', 6, 4, 'GARRAFAS', 85.50, 'SOTANO', 2, '844-135-2105', '2025-08-25'),
(34, 'CLORO', 'LIMPIEZA', 5, 3, 'GARRAFAS', 92.00, 'SOTANO', 2, '844-135-2105', '2025-08-25'),
(49, 'FAROS TRASEROS DE CAMION', 'TALLER', 2, 2, 'PZ', 150.00, 'ALMACEN', 3, '', '2025-08-26'),
(60, 'ARRANCADOR', 'TALLER', 38, 10, 'PZ', 75.00, 'ALMACEN', NULL, '', '2025-08-26'),
(94, 'FOCOS H7 24V', 'TALLER', 30, 15, 'PZ', 25.50, 'ALMACEN', NULL, '', '2025-09-03')
ON CONFLICT (codigo) DO NOTHING;

-- ============================================
-- CONSULTAS DE VERIFICACIÓN
-- ============================================

-- Verificar que las tablas se crearon correctamente
SELECT 'Tablas creadas exitosamente' as status;

-- Mostrar estructura de las tablas
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name IN ('proveedores', 'productos', 'salidas')
ORDER BY table_name, ordinal_position;
