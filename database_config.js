// Configuración de Base de Datos PostgreSQL
// Sistema de Almacén

const { Pool } = require('pg');

// Configuración de conexión a PostgreSQL Railway
const dbConfig = {
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:VsSTUIDZQfFqDBwBshBjZcjqxoPRPoTF@postgres.railway.internal:5432/railway',
    ssl: { rejectUnauthorized: false }, // Railway requiere SSL
    max: 20, // Máximo número de conexiones en el pool
    idleTimeoutMillis: 30000, // Tiempo de espera antes de cerrar conexiones inactivas
    connectionTimeoutMillis: 2000, // Tiempo de espera para establecer conexión
};

// Crear pool de conexiones
const pool = new Pool(dbConfig);

// Función para ejecutar consultas
async function query(text, params) {
    const client = await pool.connect();
    try {
        const result = await client.query(text, params);
        return result;
    } catch (error) {
        console.error('Error en consulta SQL:', error);
        throw error;
    } finally {
        client.release();
    }
}

// Función para probar la conexión
async function testConnection() {
    try {
        const result = await query('SELECT NOW() as current_time');
        console.log('✅ Conexión a PostgreSQL exitosa:', result.rows[0].current_time);
        return true;
    } catch (error) {
        console.error('❌ Error de conexión a PostgreSQL:', error.message);
        return false;
    }
}

// Funciones específicas para el sistema de almacén

// ============================================
// FUNCIONES PARA PRODUCTOS
// ============================================

async function getAllProducts() {
    const queryText = `
        SELECT 
            p.codigo,
            p.nombre,
            p.area,
            p.cantidad,
            p.minima as cantidad_minima,
            p.unidad,
            p.precio_compra,
            p.ubicacion,
            p.fecha_entrada,
            EXTRACT(DAYS FROM (CURRENT_DATE - p.fecha_entrada)) as dias_en_stock,
            CASE 
                WHEN p.cantidad <= p.minima THEN 'STOCK BAJO'
                ELSE 'OK'
            END as estado_stock,
            prov.nombre as proveedor_nombre,
            prov.telefono as proveedor_telefono,
            prov.email as proveedor_email,
            prov.contacto as contacto_proveedor
        FROM productos p
        LEFT JOIN proveedores prov ON p.proveedor_id = prov.id
        ORDER BY p.codigo ASC
    `;
    const result = await query(queryText);
    return result.rows;
}

async function getProductByCode(codigo) {
    const queryText = `
        SELECT 
            p.codigo,
            p.nombre,
            p.area,
            p.cantidad,
            p.minima as cantidad_minima,
            p.unidad,
            p.precio_compra,
            p.ubicacion,
            p.fecha_entrada,
            EXTRACT(DAYS FROM (CURRENT_DATE - p.fecha_entrada)) as dias_en_stock,
            CASE 
                WHEN p.cantidad <= p.minima THEN 'STOCK BAJO'
                ELSE 'OK'
            END as estado_stock,
            prov.nombre as proveedor_nombre,
            prov.telefono as proveedor_telefono,
            prov.email as proveedor_email,
            prov.contacto as contacto_proveedor
        FROM productos p
        LEFT JOIN proveedores prov ON p.proveedor_id = prov.id
        WHERE p.codigo = $1
    `;
    const result = await query(queryText, [codigo]);
    return result.rows[0];
}

async function createProduct(productData) {
    const {
        codigo, nombre, area, cantidad, cantidad_minima, unidad,
        precio_compra, ubicacion, proveedor_id
    } = productData;
    
    const queryText = `
        INSERT INTO productos (codigo, nombre, area, cantidad, minima, unidad, 
                             precio_compra, ubicacion, proveedor_id, fecha_entrada)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_DATE)
        RETURNING *
    `;
    
    const result = await query(queryText, [
        codigo, nombre, area, cantidad, cantidad_minima, unidad,
        precio_compra, ubicacion, proveedor_id
    ]);
    
    return result.rows[0];
}

async function updateProduct(codigo, updateData) {
    const fields = [];
    const values = [];
    let paramCount = 1;
    
    // Mapear cantidad_minima a minima para coincidir con el esquema
    if (updateData.cantidad_minima !== undefined) {
        updateData.minima = updateData.cantidad_minima;
        delete updateData.cantidad_minima;
    }
    
    Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
            fields.push(`${key} = $${paramCount}`);
            values.push(updateData[key]);
            paramCount++;
        }
    });
    
    values.push(codigo);
    const queryText = `
        UPDATE productos 
        SET ${fields.join(', ')}
        WHERE codigo = $${paramCount}
        RETURNING *
    `;
    
    const result = await query(queryText, values);
    return result.rows[0];
}

async function deleteProduct(codigo) {
    const queryText = 'DELETE FROM productos WHERE codigo = $1 RETURNING *';
    const result = await query(queryText, [codigo]);
    return result.rows[0];
}

// ============================================
// FUNCIONES PARA PROVEEDORES
// ============================================

async function getAllProviders() {
    const queryText = 'SELECT * FROM proveedores ORDER BY nombre ASC';
    const result = await query(queryText);
    return result.rows;
}

async function getProviderById(id) {
    const queryText = 'SELECT * FROM proveedores WHERE id = $1';
    const result = await query(queryText, [id]);
    return result.rows[0];
}

async function createProvider(providerData) {
    const { nombre, rfc, telefono, email, contacto } = providerData;
    
    const queryText = `
        INSERT INTO proveedores (nombre, rfc, telefono, email, contacto)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `;
    
    const result = await query(queryText, [nombre, rfc, telefono, email, contacto]);
    return result.rows[0];
}

async function updateProvider(id, updateData) {
    const fields = [];
    const values = [];
    let paramCount = 1;
    
    Object.keys(updateData).forEach(key => {
        if (updateData[key] !== undefined) {
            fields.push(`${key} = $${paramCount}`);
            values.push(updateData[key]);
            paramCount++;
        }
    });
    
    values.push(id);
    const queryText = `
        UPDATE proveedores 
        SET ${fields.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
    `;
    
    const result = await query(queryText, values);
    return result.rows[0];
}

async function deleteProvider(id) {
    const queryText = 'DELETE FROM proveedores WHERE id = $1 RETURNING *';
    const result = await query(queryText, [id]);
    return result.rows[0];
}

// ============================================
// FUNCIONES PARA SALIDAS
// ============================================

async function getAllOutputs() {
    const queryText = `
        SELECT 
            s.id,
            s.fecha,
            s.producto_codigo as codigo_producto,
            p.nombre as nombre_producto,
            s.cantidad,
            p.unidad,
            s.responsable,
            s.area_destino,
            s.observaciones,
            s.cantidad as stock_anterior,
            (p.cantidad + s.cantidad) as stock_restante
        FROM salidas s
        LEFT JOIN productos p ON s.producto_codigo = p.codigo
        ORDER BY s.fecha DESC
    `;
    const result = await query(queryText);
    return result.rows;
}

async function createOutput(outputData) {
    const {
        codigo_producto, cantidad, responsable, area_destino, observaciones
    } = outputData;
    
    const queryText = `
        INSERT INTO salidas (producto_codigo, cantidad, responsable, area_destino, observaciones)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `;
    
    const result = await query(queryText, [
        codigo_producto, cantidad, responsable, area_destino, observaciones
    ]);
    
    return result.rows[0];
}

async function deleteOutput(id) {
    const queryText = 'DELETE FROM salidas WHERE id = $1 RETURNING *';
    const result = await query(queryText, [id]);
    return result.rows[0];
}

// ============================================
// FUNCIONES PARA ESTADÍSTICAS
// ============================================

async function getStatistics() {
    const queryText = `
        SELECT 
            area,
            COUNT(*) as total_productos,
            SUM(cantidad) as total_cantidad,
            SUM(CASE WHEN cantidad <= minima THEN 1 ELSE 0 END) as productos_stock_bajo,
            AVG(EXTRACT(DAYS FROM (CURRENT_DATE - fecha_entrada))) as promedio_dias_stock
        FROM productos
        GROUP BY area
        ORDER BY area
    `;
    const result = await query(queryText);
    return result.rows;
}

async function getLowStockProducts() {
    const queryText = `
        SELECT 
            p.codigo,
            p.nombre,
            p.area,
            p.cantidad,
            p.minima as cantidad_minima,
            p.unidad,
            p.precio_compra,
            p.ubicacion,
            p.fecha_entrada,
            EXTRACT(DAYS FROM (CURRENT_DATE - p.fecha_entrada)) as dias_en_stock,
            CASE 
                WHEN p.cantidad <= p.minima THEN 'STOCK BAJO'
                ELSE 'OK'
            END as estado_stock,
            prov.nombre as proveedor_nombre,
            prov.telefono as proveedor_telefono,
            prov.email as proveedor_email,
            prov.contacto as contacto_proveedor
        FROM productos p
        LEFT JOIN proveedores prov ON p.proveedor_id = prov.id
        WHERE p.cantidad <= p.minima 
        ORDER BY (p.cantidad - p.minima) ASC
    `;
    const result = await query(queryText);
    return result.rows;
}

// ============================================
// FUNCIONES DE UTILIDAD
// ============================================

async function getNextProductCode() {
    const queryText = 'SELECT COALESCE(MAX(CAST(codigo AS INTEGER)), 0) + 1 as next_code FROM productos WHERE codigo ~ \'^[0-9]+$\'';
    const result = await query(queryText);
    return result.rows[0].next_code;
}

async function searchProducts(searchTerm) {
    const queryText = `
        SELECT 
            p.codigo,
            p.nombre,
            p.area,
            p.cantidad,
            p.minima as cantidad_minima,
            p.unidad,
            p.precio_compra,
            p.ubicacion,
            p.fecha_entrada,
            EXTRACT(DAYS FROM (CURRENT_DATE - p.fecha_entrada)) as dias_en_stock,
            CASE 
                WHEN p.cantidad <= p.minima THEN 'STOCK BAJO'
                ELSE 'OK'
            END as estado_stock,
            prov.nombre as proveedor_nombre,
            prov.telefono as proveedor_telefono,
            prov.email as proveedor_email,
            prov.contacto as contacto_proveedor
        FROM productos p
        LEFT JOIN proveedores prov ON p.proveedor_id = prov.id
        WHERE p.nombre ILIKE $1 OR p.codigo ILIKE $1
        ORDER BY p.codigo ASC
    `;
    const result = await query(queryText, [`%${searchTerm}%`]);
    return result.rows;
}

async function filterProductsByArea(area) {
    const queryText = `
        SELECT 
            p.codigo,
            p.nombre,
            p.area,
            p.cantidad,
            p.minima as cantidad_minima,
            p.unidad,
            p.precio_compra,
            p.ubicacion,
            p.fecha_entrada,
            EXTRACT(DAYS FROM (CURRENT_DATE - p.fecha_entrada)) as dias_en_stock,
            CASE 
                WHEN p.cantidad <= p.minima THEN 'STOCK BAJO'
                ELSE 'OK'
            END as estado_stock,
            prov.nombre as proveedor_nombre,
            prov.telefono as proveedor_telefono,
            prov.email as proveedor_email,
            prov.contacto as contacto_proveedor
        FROM productos p
        LEFT JOIN proveedores prov ON p.proveedor_id = prov.id
        WHERE p.area = $1
        ORDER BY p.codigo ASC
    `;
    const result = await query(queryText, [area]);
    return result.rows;
}

// Cerrar el pool de conexiones
async function closePool() {
    await pool.end();
}

// Exportar todas las funciones
module.exports = {
    // Configuración
    pool,
    testConnection,
    closePool,
    
    // Productos
    getAllProducts,
    getProductByCode,
    createProduct,
    updateProduct,
    deleteProduct,
    getNextProductCode,
    searchProducts,
    filterProductsByArea,
    
    // Proveedores
    getAllProviders,
    getProviderById,
    createProvider,
    updateProvider,
    deleteProvider,
    
    // Salidas
    getAllOutputs,
    createOutput,
    deleteOutput,
    
    // Estadísticas
    getStatistics,
    getLowStockProducts
};
