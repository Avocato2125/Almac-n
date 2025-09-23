// Configuración de Base de Datos PostgreSQL
// Sistema de Almacén

const { Pool } = require('pg');

// Configuración de conexión a PostgreSQL
const dbConfig = {
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:VsSTUIDZQfFqDBwBshBjZcjqxoPRPoTF@postgres.railway.internal:5432/railway',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
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
        SELECT * FROM vista_productos_completa
        ORDER BY codigo ASC
    `;
    const result = await query(queryText);
    return result.rows;
}

async function getProductByCode(codigo) {
    const queryText = 'SELECT * FROM vista_productos_completa WHERE codigo = $1';
    const result = await query(queryText, [codigo]);
    return result.rows[0];
}

async function createProduct(productData) {
    const {
        codigo, nombre, area, cantidad, cantidad_minima, unidad,
        precio_compra, ubicacion, proveedor_id, contacto_proveedor
    } = productData;
    
    const queryText = `
        INSERT INTO productos (codigo, nombre, area, cantidad, cantidad_minima, unidad, 
                             precio_compra, ubicacion, proveedor_id, contacto_proveedor, fecha_entrada)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, CURRENT_DATE)
        RETURNING *
    `;
    
    const result = await query(queryText, [
        codigo, nombre, area, cantidad, cantidad_minima, unidad,
        precio_compra, ubicacion, proveedor_id, contacto_proveedor
    ]);
    
    return result.rows[0];
}

async function updateProduct(codigo, updateData) {
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
    const queryText = 'UPDATE productos SET activo = FALSE WHERE codigo = $1 RETURNING *';
    const result = await query(queryText, [codigo]);
    return result.rows[0];
}

// ============================================
// FUNCIONES PARA PROVEEDORES
// ============================================

async function getAllProviders() {
    const queryText = 'SELECT * FROM proveedores WHERE activo = TRUE ORDER BY nombre ASC';
    const result = await query(queryText);
    return result.rows;
}

async function getProviderById(id) {
    const queryText = 'SELECT * FROM proveedores WHERE id = $1 AND activo = TRUE';
    const result = await query(queryText, [id]);
    return result.rows[0];
}

async function createProvider(providerData) {
    const { nombre, rfc, telefono, email, direccion, contacto } = providerData;
    
    const queryText = `
        INSERT INTO proveedores (nombre, rfc, telefono, email, direccion, contacto)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
    `;
    
    const result = await query(queryText, [nombre, rfc, telefono, email, direccion, contacto]);
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
    const queryText = 'UPDATE proveedores SET activo = FALSE WHERE id = $1 RETURNING *';
    const result = await query(queryText, [id]);
    return result.rows[0];
}

// ============================================
// FUNCIONES PARA SALIDAS
// ============================================

async function getAllOutputs() {
    const queryText = 'SELECT * FROM vista_salidas_completa ORDER BY fecha DESC';
    const result = await query(queryText);
    return result.rows;
}

async function createOutput(outputData) {
    const {
        producto_id, codigo_producto, nombre_producto, cantidad, unidad,
        responsable, area_destino, observaciones, stock_anterior, stock_restante
    } = outputData;
    
    const queryText = `
        INSERT INTO salidas (producto_id, codigo_producto, nombre_producto, cantidad, unidad,
                           responsable, area_destino, observaciones, stock_anterior, stock_restante)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
    `;
    
    const result = await query(queryText, [
        producto_id, codigo_producto, nombre_producto, cantidad, unidad,
        responsable, area_destino, observaciones, stock_anterior, stock_restante
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
    const queryText = 'SELECT * FROM vista_estadisticas_areas ORDER BY area';
    const result = await query(queryText);
    return result.rows;
}

async function getLowStockProducts() {
    const queryText = `
        SELECT * FROM vista_productos_completa 
        WHERE cantidad <= cantidad_minima 
        ORDER BY (cantidad - cantidad_minima) ASC
    `;
    const result = await query(queryText);
    return result.rows;
}

// ============================================
// FUNCIONES DE UTILIDAD
// ============================================

async function getNextProductCode() {
    const queryText = 'SELECT COALESCE(MAX(codigo), 0) + 1 as next_code FROM productos';
    const result = await query(queryText);
    return result.rows[0].next_code;
}

async function searchProducts(searchTerm) {
    const queryText = `
        SELECT * FROM vista_productos_completa 
        WHERE nombre ILIKE $1 OR codigo::text ILIKE $1
        ORDER BY codigo ASC
    `;
    const result = await query(queryText, [`%${searchTerm}%`]);
    return result.rows;
}

async function filterProductsByArea(area) {
    const queryText = 'SELECT * FROM vista_productos_completa WHERE area = $1 ORDER BY codigo ASC';
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
