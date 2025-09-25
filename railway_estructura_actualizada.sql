-- =============================================
-- ESTRUCTURA ACTUALIZADA DE BASE DE DATOS
-- Sistema de Inventario - Railway PostgreSQL
-- =============================================

-- Eliminar tablas existentes si existen (para recrear con nueva estructura)
DROP TABLE IF EXISTS salidas CASCADE;
DROP TABLE IF EXISTS productos CASCADE;
DROP TABLE IF EXISTS proveedores CASCADE;

-- =============================================
-- TABLA: proveedores
-- =============================================
CREATE TABLE proveedores (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    rfc VARCHAR(50),
    telefono VARCHAR(20),
    email VARCHAR(255),
    contacto VARCHAR(255),
    direccion TEXT,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLA: productos
-- =============================================
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    area VARCHAR(100) DEFAULT 'OFICINA',
    cantidad INTEGER DEFAULT 0,
    minima INTEGER DEFAULT 2,
    unidad VARCHAR(20) DEFAULT 'PZ',
    factor_conversion INTEGER DEFAULT 1,
    precio_compra DECIMAL(10,2),
    ubicacion VARCHAR(255) DEFAULT 'ALMACEN',
    proveedor_id INTEGER REFERENCES proveedores(id) ON DELETE SET NULL,
    fecha_entrada DATE DEFAULT CURRENT_DATE,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TABLA: salidas
-- =============================================
CREATE TABLE salidas (
    id SERIAL PRIMARY KEY,
    producto_codigo VARCHAR(50) NOT NULL REFERENCES productos(codigo) ON DELETE CASCADE,
    cantidad INTEGER NOT NULL,
    responsable VARCHAR(255) NOT NULL,
    area_destino VARCHAR(100) NOT NULL,
    observaciones TEXT,
    fecha_salida TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =============================================
CREATE INDEX idx_productos_codigo ON productos(codigo);
CREATE INDEX idx_productos_area ON productos(area);
CREATE INDEX idx_productos_proveedor ON productos(proveedor_id);
CREATE INDEX idx_salidas_producto ON salidas(producto_codigo);
CREATE INDEX idx_salidas_fecha ON salidas(fecha_salida);

-- =============================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- =============================================

-- Proveedores de ejemplo
INSERT INTO proveedores (nombre, rfc, telefono, email, contacto, direccion) VALUES
('Distribuidora Industrial SA', 'DIN123456789', '555-0123', 'ventas@disindustrial.com', 'Juan Pérez', 'Av. Industrial 123, CDMX'),
('Suministros Médicos del Norte', 'SMN987654321', '555-0456', 'compras@medicos.com', 'Ana García', 'Calle Salud 456, Monterrey'),
('Tecnología y Sistemas', 'TYS456789123', '555-0789', 'info@techsys.com', 'Carlos López', 'Blvd. Tecnológico 789, Guadalajara');

-- Productos de ejemplo con nuevos campos
INSERT INTO productos (codigo, nombre, area, cantidad, minima, unidad, factor_conversion, precio_compra, ubicacion, proveedor_id) VALUES
('001', 'Tornillos Hexagonales M6', 'TALLER', 50, 20, 'CAJA', 100, 250.00, 'ALMACEN-A1', 1),
('002', 'Jeringas Desechables 5ml', 'ENFERMERIA', 25, 10, 'PAQUETE', 50, 180.00, 'FARMACIA-B2', 2),
('003', 'Papel Bond Carta', 'OFICINA', 100, 30, 'PZ', 1, 8.50, 'OFICINA-C1', 3),
('004', 'Guantes Látex Talla M', 'ENFERMERIA', 15, 5, 'CAJA', 200, 320.00, 'FARMACIA-B1', 2),
('005', 'Cables USB Tipo-C', 'SISTEMAS', 8, 3, 'PAQUETE', 10, 150.00, 'SISTEMAS-D1', 3);

-- Salidas de ejemplo
INSERT INTO salidas (producto_codigo, cantidad, responsable, area_destino, observaciones) VALUES
('001', 2, 'Miguel Hernández', 'TALLER', 'Reparación urgente equipo #15'),
('002', 5, 'Dra. Patricia Ruiz', 'ENFERMERIA', 'Aplicación de vacunas'),
('003', 20, 'Secretaria Admin', 'OFICINA', 'Documentos fin de mes');

-- =============================================
-- VERIFICACIÓN DE ESTRUCTURA
-- =============================================

-- Verificar que las tablas se crearon correctamente
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name IN ('proveedores', 'productos', 'salidas')
ORDER BY table_name, ordinal_position;

-- Contar registros insertados
SELECT 
    (SELECT COUNT(*) FROM proveedores) AS total_proveedores,
    (SELECT COUNT(*) FROM productos) AS total_productos,
    (SELECT COUNT(*) FROM salidas) AS total_salidas;

-- =============================================
-- COMENTARIOS SOBRE NUEVOS CAMPOS
-- =============================================

/*
NUEVOS CAMPOS AGREGADOS:

1. TABLA proveedores:
   - direccion: Campo de texto para la dirección completa del proveedor

2. TABLA productos:
   - factor_conversion: Campo entero para especificar cuántas piezas contiene cada unidad
     * Para PZ = 1 (una pieza es una pieza)
     * Para CAJA = número de piezas por caja (ej: 100)
     * Para PAQUETE = número de piezas por paquete (ej: 50)
   
EJEMPLOS DE USO:

Producto: Tornillos M6
- unidad: 'CAJA'
- factor_conversion: 100
- cantidad: 5
= 5 cajas × 100 piezas = 500 piezas totales

Producto: Jeringas
- unidad: 'PAQUETE' 
- factor_conversion: 50
- cantidad: 10
= 10 paquetes × 50 piezas = 500 jeringas totales

CÁLCULOS AUTOMÁTICOS:
- Stock real en piezas = cantidad × factor_conversion
- Alertas de stock mínimo basadas en piezas reales
- Control preciso de inventario por unidad de compra vs unidad base
*/
