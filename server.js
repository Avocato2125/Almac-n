// Servidor Express.js para Sistema de Almacén
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const db = require('./database_config');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname)));

// ============================================
// RUTAS PARA PRODUCTOS
// ============================================

// Obtener todos los productos
app.get('/api/productos', async (req, res) => {
    try {
        const productos = await db.getAllProducts();
        res.json({
            success: true,
            data: productos,
            count: productos.length
        });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Obtener producto por código
app.get('/api/productos/:codigo', async (req, res) => {
    try {
        const { codigo } = req.params;
        const producto = await db.getProductByCode(codigo);
        
        if (!producto) {
            return res.status(404).json({
                success: false,
                error: 'Producto no encontrado'
            });
        }
        
        res.json({
            success: true,
            data: producto
        });
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Crear nuevo producto
app.post('/api/productos', async (req, res) => {
    try {
        const productoData = req.body;
        const nuevoProducto = await db.createProduct(productoData);
        
        res.status(201).json({
            success: true,
            data: nuevoProducto,
            message: 'Producto creado exitosamente'
        });
    } catch (error) {
        console.error('Error al crear producto:', error);
        
        if (error.code === '23505') { // Violación de clave única
            res.status(400).json({
                success: false,
                error: 'El código del producto ya existe'
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Error interno del servidor'
            });
        }
    }
});

// Actualizar producto
app.put('/api/productos/:codigo', async (req, res) => {
    try {
        const { codigo } = req.params;
        const updateData = req.body;
        
        const productoActualizado = await db.updateProduct(codigo, updateData);
        
        if (!productoActualizado) {
            return res.status(404).json({
                success: false,
                error: 'Producto no encontrado'
            });
        }
        
        res.json({
            success: true,
            data: productoActualizado,
            message: 'Producto actualizado exitosamente'
        });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Eliminar producto (soft delete)
app.delete('/api/productos/:codigo', async (req, res) => {
    try {
        const { codigo } = req.params;
        const productoEliminado = await db.deleteProduct(codigo);
        
        if (!productoEliminado) {
            return res.status(404).json({
                success: false,
                error: 'Producto no encontrado'
            });
        }
        
        res.json({
            success: true,
            message: 'Producto eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Buscar productos
app.get('/api/productos/search/:term', async (req, res) => {
    try {
        const { term } = req.params;
        const productos = await db.searchProducts(term);
        
        res.json({
            success: true,
            data: productos,
            count: productos.length
        });
    } catch (error) {
        console.error('Error al buscar productos:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Filtrar productos por área
app.get('/api/productos/area/:area', async (req, res) => {
    try {
        const { area } = req.params;
        const productos = await db.filterProductsByArea(area);
        
        res.json({
            success: true,
            data: productos,
            count: productos.length
        });
    } catch (error) {
        console.error('Error al filtrar productos:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// ============================================
// RUTAS PARA PROVEEDORES
// ============================================

// Obtener todos los proveedores
app.get('/api/proveedores', async (req, res) => {
    try {
        const proveedores = await db.getAllProviders();
        res.json({
            success: true,
            data: proveedores,
            count: proveedores.length
        });
    } catch (error) {
        console.error('Error al obtener proveedores:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Obtener proveedor por ID
app.get('/api/proveedores/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const proveedor = await db.getProviderById(id);
        
        if (!proveedor) {
            return res.status(404).json({
                success: false,
                error: 'Proveedor no encontrado'
            });
        }
        
        res.json({
            success: true,
            data: proveedor
        });
    } catch (error) {
        console.error('Error al obtener proveedor:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Crear nuevo proveedor
app.post('/api/proveedores', async (req, res) => {
    try {
        const proveedorData = req.body;
        const nuevoProveedor = await db.createProvider(proveedorData);
        
        res.status(201).json({
            success: true,
            data: nuevoProveedor,
            message: 'Proveedor creado exitosamente'
        });
    } catch (error) {
        console.error('Error al crear proveedor:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Actualizar proveedor
app.put('/api/proveedores/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        
        const proveedorActualizado = await db.updateProvider(id, updateData);
        
        if (!proveedorActualizado) {
            return res.status(404).json({
                success: false,
                error: 'Proveedor no encontrado'
            });
        }
        
        res.json({
            success: true,
            data: proveedorActualizado,
            message: 'Proveedor actualizado exitosamente'
        });
    } catch (error) {
        console.error('Error al actualizar proveedor:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Eliminar proveedor (soft delete)
app.delete('/api/proveedores/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const proveedorEliminado = await db.deleteProvider(id);
        
        if (!proveedorEliminado) {
            return res.status(404).json({
                success: false,
                error: 'Proveedor no encontrado'
            });
        }
        
        res.json({
            success: true,
            message: 'Proveedor eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar proveedor:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// ============================================
// RUTAS PARA SALIDAS
// ============================================

// Obtener todas las salidas
app.get('/api/salidas', async (req, res) => {
    try {
        const salidas = await db.getAllOutputs();
        res.json({
            success: true,
            data: salidas,
            count: salidas.length
        });
    } catch (error) {
        console.error('Error al obtener salidas:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Crear nueva salida
app.post('/api/salidas', async (req, res) => {
    try {
        const salidaData = req.body;
        
        // Verificar que el producto existe y tiene stock suficiente
        const producto = await db.getProductByCode(salidaData.codigo_producto);
        if (!producto) {
            return res.status(404).json({
                success: false,
                error: 'Producto no encontrado'
            });
        }
        
        if (producto.cantidad < salidaData.cantidad) {
            return res.status(400).json({
                success: false,
                error: 'Stock insuficiente'
            });
        }
        
        // Crear la salida
        const nuevaSalida = await db.createOutput(salidaData);
        
        // Actualizar el stock del producto
        const nuevoStock = producto.cantidad - salidaData.cantidad;
        await db.updateProduct(salidaData.codigo_producto, { cantidad: nuevoStock });
        
        res.status(201).json({
            success: true,
            data: nuevaSalida,
            message: 'Salida registrada exitosamente'
        });
    } catch (error) {
        console.error('Error al crear salida:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Eliminar salida
app.delete('/api/salidas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const salidaEliminada = await db.deleteOutput(id);
        
        if (!salidaEliminada) {
            return res.status(404).json({
                success: false,
                error: 'Salida no encontrada'
            });
        }
        
        res.json({
            success: true,
            message: 'Salida eliminada exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar salida:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// ============================================
// RUTAS PARA ESTADÍSTICAS
// ============================================

// Obtener estadísticas
app.get('/api/estadisticas', async (req, res) => {
    try {
        const estadisticas = await db.getStatistics();
        const productosStockBajo = await db.getLowStockProducts();
        
        res.json({
            success: true,
            data: {
                estadisticas_areas: estadisticas,
                productos_stock_bajo: productosStockBajo
            }
        });
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// Obtener siguiente código de producto
app.get('/api/next-code', async (req, res) => {
    try {
        const nextCode = await db.getNextProductCode();
        res.json({
            success: true,
            data: { nextCode }
        });
    } catch (error) {
        console.error('Error al obtener siguiente código:', error);
        res.status(500).json({
            success: false,
            error: 'Error interno del servidor'
        });
    }
});

// ============================================
// RUTAS DE SALUD DEL SISTEMA
// ============================================

// Verificar estado de la base de datos
app.get('/api/health', async (req, res) => {
    try {
        const isConnected = await db.testConnection();
        res.json({
            success: true,
            status: 'healthy',
            database: isConnected ? 'connected' : 'disconnected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            status: 'unhealthy',
            error: error.message
        });
    }
});

// Ruta principal - servir la aplicación web
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Manejo de errores 404
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Ruta no encontrada'
    });
});

// Manejo de errores globales
app.use((error, req, res, next) => {
    console.error('Error no manejado:', error);
    res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
    });
});

// Iniciar servidor
async function startServer() {
    try {
        // Probar conexión a la base de datos
        const isConnected = await db.testConnection();
        if (!isConnected) {
            console.error('❌ No se pudo conectar a la base de datos');
            process.exit(1);
        }
        
        app.listen(PORT, () => {
            console.log(`🚀 Servidor iniciado en puerto ${PORT}`);
            console.log(`📊 Panel web: http://localhost:${PORT}`);
            console.log(`🔗 API: http://localhost:${PORT}/api`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar servidor:', error);
        process.exit(1);
    }
}

// Manejo de cierre graceful
process.on('SIGINT', async () => {
    console.log('\n🛑 Cerrando servidor...');
    await db.closePool();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Cerrando servidor...');
    await db.closePool();
    process.exit(0);
});

// Iniciar el servidor
startServer();
