// Script para probar la conexión a PostgreSQL
const db = require('./database_config');

async function testDatabaseConnection() {
    console.log('🔍 Probando conexión a PostgreSQL...\n');
    
    try {
        // Probar conexión básica
        console.log('1. Probando conexión básica...');
        const isConnected = await db.testConnection();
        
        if (!isConnected) {
            throw new Error('No se pudo conectar a la base de datos');
        }
        
        // Probar consulta de productos
        console.log('2. Probando consulta de productos...');
        const productos = await db.getAllProducts();
        console.log(`   ✅ Productos encontrados: ${productos.length}`);
        
        // Probar consulta de proveedores
        console.log('3. Probando consulta de proveedores...');
        const proveedores = await db.getAllProviders();
        console.log(`   ✅ Proveedores encontrados: ${proveedores.length}`);
        
        // Probar consulta de salidas
        console.log('4. Probando consulta de salidas...');
        const salidas = await db.getAllOutputs();
        console.log(`   ✅ Salidas encontradas: ${salidas.length}`);
        
        // Probar estadísticas
        console.log('5. Probando estadísticas...');
        const estadisticas = await db.getStatistics();
        console.log(`   ✅ Estadísticas por área: ${estadisticas.length}`);
        
        // Probar siguiente código
        console.log('6. Probando siguiente código...');
        const nextCode = await db.getNextProductCode();
        console.log(`   ✅ Siguiente código: ${nextCode}`);
        
        console.log('\n🎉 ¡Todas las pruebas pasaron exitosamente!');
        console.log('✅ La base de datos está configurada correctamente');
        
    } catch (error) {
        console.error('\n❌ Error en las pruebas:', error.message);
        console.error('💡 Verifica que:');
        console.error('   - La base de datos esté ejecutándose');
        console.error('   - Las credenciales sean correctas');
        console.error('   - Las tablas estén creadas (ejecuta database_schema.sql)');
        process.exit(1);
    } finally {
        await db.closePool();
    }
}

// Ejecutar las pruebas
testDatabaseConnection();
