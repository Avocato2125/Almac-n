// Sistema de Inventario - JavaScript con Base de Datos PostgreSQL

// Configuración de la API - Rutas relativas para funcionar en cualquier entorno
const API_BASE_URL = '/api';

// Variables globales para datos
let inventario = [];
let proveedores = [];
let salidas = [];
let nextCode = 1;
let nextProviderId = 1;
let nextOutputId = 1;

// ===== FUNCIONES PARA CONECTAR CON LA API =====

/**
 * Carga todos los datos desde la base de datos
 */
async function loadDataFromDatabase(filters = {}) {
    try {
        // Construir URL con parámetros de consulta
        const url = new URL(`${API_BASE_URL}/productos`, window.location.origin);
        if (filters.search) url.searchParams.append('search', filters.search);
        if (filters.area) url.searchParams.append('area', filters.area);
        
        // Cargar productos con filtros
        const productosResponse = await fetch(url.toString());
        const productosData = await productosResponse.json();
        inventario = productosData.success ? productosData.data : [];
        
        // Cargar proveedores (solo si no hay filtros, para evitar cargas innecesarias)
        if (!filters.search && !filters.area) {
            const proveedoresResponse = await fetch(`${API_BASE_URL}/proveedores`);
            const proveedoresData = await proveedoresResponse.json();
            proveedores = proveedoresData.success ? proveedoresData.data : [];
        }
        
        // Cargar salidas (solo si no hay filtros, para evitar cargas innecesarias)
        if (!filters.search && !filters.area) {
            const salidasResponse = await fetch(`${API_BASE_URL}/salidas`);
            const salidasData = await salidasResponse.json();
            salidas = salidasData.success ? salidasData.data : [];
        }
        
        // Obtener siguiente código (solo si no hay filtros)
        if (!filters.search && !filters.area) {
            const nextCodeResponse = await fetch(`${API_BASE_URL}/next-code`);
            const nextCodeData = await nextCodeResponse.json();
            nextCode = nextCodeData.success ? nextCodeData.data.nextCode : 1;
        }
        
        console.log('Datos cargados desde la base de datos:', {
            productos: inventario.length,
            proveedores: proveedores.length,
            salidas: salidas.length,
            filtros: filters
        });
        
    } catch (error) {
        console.error('Error al cargar datos desde la base de datos:', error);
        throw error;
    }
}

/**
 * Agrega un producto a la base de datos
 */
async function addProductToDatabase(productData) {
    try {
        const response = await fetch(`${API_BASE_URL}/productos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData)
        });
        
        const result = await response.json();
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.error || 'Error al agregar producto');
        }
    } catch (error) {
        console.error('Error al agregar producto:', error);
        throw error;
    }
}

/**
 * Actualiza un producto en la base de datos
 */
async function updateProductInDatabase(codigo, updateData) {
    try {
        const response = await fetch(`${API_BASE_URL}/productos/${codigo}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData)
        });
        
        const result = await response.json();
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.error || 'Error al actualizar producto');
        }
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        throw error;
    }
}

/**
 * Elimina un producto de la base de datos
 */
async function deleteProductFromDatabase(codigo) {
    try {
        const response = await fetch(`${API_BASE_URL}/productos/${codigo}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        if (result.success) {
            return true;
        } else {
            throw new Error(result.error || 'Error al eliminar producto');
        }
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        throw error;
    }
}

/**
 * Agrega un proveedor a la base de datos
 */
async function addProviderToDatabase(providerData) {
    try {
        const response = await fetch(`${API_BASE_URL}/proveedores`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(providerData)
        });
        
        const result = await response.json();
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.error || 'Error al agregar proveedor');
        }
    } catch (error) {
        console.error('Error al agregar proveedor:', error);
        throw error;
    }
}

/**
 * Agrega una salida a la base de datos
 */
async function addOutputToDatabase(outputData) {
    try {
        const response = await fetch(`${API_BASE_URL}/salidas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(outputData)
        });
        
        const result = await response.json();
        if (result.success) {
            return result.data;
        } else {
            throw new Error(result.error || 'Error al agregar salida');
        }
    } catch (error) {
        console.error('Error al agregar salida:', error);
        throw error;
    }
}

/**
 * Elimina una salida de la base de datos
 */
async function deleteOutputFromDatabase(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/salidas/${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        if (result.success) {
            return true;
        } else {
            throw new Error(result.error || 'Error al eliminar salida');
        }
    } catch (error) {
        console.error('Error al eliminar salida:', error);
        throw error;
    }
}

/**
 * Elimina un proveedor de la base de datos
 */
async function deleteProviderFromDatabase(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/proveedores/${id}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        if (result.success) {
            return true;
        } else {
            throw new Error(result.error || 'Error al eliminar proveedor');
        }
    } catch (error) {
        console.error('Error al eliminar proveedor:', error);
        throw error;
    }
}

// ===== FUNCIONES DE UTILIDAD =====

/**
 * Retrasa la ejecución de una función hasta que haya pasado un tiempo sin que se llame.
 * Útil para optimizar búsquedas y evitar demasiadas peticiones a la API.
 */
function debounce(func, delay = 300) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

/**
 * Formatea una fecha ISO a formato DD/MM/YYYY
 */
function formatearFecha(fechaISO) {
    if (!fechaISO) return "N/A";
    
    try {
        // Si ya está en formato DD/MM/YYYY, devolverla tal como está
        if (fechaISO.includes('/')) {
            return fechaISO;
        }
        
        // Convertir de formato ISO (YYYY-MM-DD) a DD/MM/YYYY
        const fecha = new Date(fechaISO);
        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const año = fecha.getFullYear();
        
        return `${dia}/${mes}/${año}`;
    } catch (error) {
        console.error('Error al formatear fecha:', error);
        return "N/A";
    }
}

/**
 * Calcula los días que un producto ha estado en stock
 */
function calcularDiasEnStock(fecha) {
    if (!fecha) return "N/A";
    
    try {
        let fechaEntrada;
        
        // Si la fecha está en formato ISO (YYYY-MM-DD)
        if (fecha.includes('-')) {
            fechaEntrada = new Date(fecha);
        } 
        // Si la fecha está en formato DD/MM/YYYY
        else if (fecha.includes('/')) {
            const [dia, mes, año] = fecha.split('/');
            fechaEntrada = new Date(año, mes - 1, dia);
        } 
        else {
            return "N/A";
        }
        
        const hoy = new Date();
        const diferencia = Math.floor((hoy - fechaEntrada) / (1000 * 60 * 60 * 24));
        return diferencia >= 0 ? diferencia + " días" : "N/A";
    } catch (error) {
        console.error('Error al calcular días en stock:', error);
        return "N/A";
    }
}

/**
 * Genera el HTML para el badge del área
 */
function getAreaBadge(area) {
    const className = `area-${area.toLowerCase()}`;
    const iconMap = {
        'OFICINA': 'fas fa-building',
        'LIMPIEZA': 'fas fa-broom',
        'TALLER': 'fas fa-tools',
        'ENFERMERIA': 'fas fa-user-md'
    };
    const icon = iconMap[area] || 'fas fa-warehouse';
    return `<span class="area-badge ${className}"><i class="${icon}"></i>${area}</span>`;
}

/**
 * Formatea un valor como moneda para mostrar
 */
function formatDisplayCurrency(value) {
    if (!value || value === '') return '';
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return '$' + num.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/**
 * Formatea un valor como moneda para input
 */
function formatCurrency(value) {
    if (!value) return '';
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return num.toFixed(2);
}

/**
 * Valida si un valor es una moneda válida
 */
function validateCurrency(value) {
    if (!value) return true;
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0;
}

// ===== FUNCIONES PRINCIPALES =====

/**
 * Renderiza la tabla con los datos proporcionados
 */
function renderTable() {
    const data = inventario;
    const tbody = document.getElementById('tableBody');
    if (!tbody) {
        console.error('Elemento tableBody no encontrado');
        return;
    }
    
    tbody.innerHTML = '';
    
    data.forEach(item => {
        const cantidadMinima = item.cantidad_minima || item.cantidadMinima || 2;
        const isLowStock = item.cantidad <= cantidadMinima;
        const alerta = isLowStock ? '<i class="fas fa-exclamation-triangle"></i> STOCK BAJO' : '<i class="fas fa-check-circle"></i> OK';
        const fechaFormateada = formatearFecha(item.fecha_entrada || item.fecha);
        const diasStock = calcularDiasEnStock(item.fecha_entrada || item.fecha);
        
        const row = document.createElement('tr');
        if (isLowStock) row.classList.add('stock-bajo');
        
        row.innerHTML = `
            <td>${item.codigo}</td>
            <td>${item.nombre}</td>
            <td>${getAreaBadge(item.area)}</td>
            <td>${item.cantidad}</td>
            <td style="text-align: center; font-weight: bold; color: ${isLowStock ? '#f44336' : '#4CAF50'};">
                <i class="fas fa-${isLowStock ? 'exclamation-triangle' : 'check-circle'}"></i> ${cantidadMinima}
            </td>
            <td>${item.unidad}${item.factor_conversion && item.factor_conversion > 1 ? ` (${item.factor_conversion} pz)` : ''}</td>
            <td class="price-cell">${formatDisplayCurrency(item.precio_compra || item.precio)}</td>
            <td>${item.ubicacion}</td>
            <td>${item.proveedor_nombre || item.proveedor}</td>
            <td>${item.proveedor_telefono || item.contacto}</td>
            <td>${fechaFormateada}</td>
            <td class="${isLowStock ? 'alerta' : ''}">${alerta}</td>
            <td>${diasStock}</td>
            <td>
                <button class="btn" onclick="editItem('${item.codigo}')" style="background: #2196F3; color: white; padding: 3px 8px; margin-right: 5px;"><i class="fas fa-edit"></i></button>
                <button class="btn" onclick="removeItem('${item.codigo}')" style="background: #f44336; color: white; padding: 3px 8px;"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    updateStats(data);
}

/**
 * Actualiza las estadísticas
 */
function updateStats(data = inventario) {
    const totalProductos = data.length;
    const totalCantidad = data.reduce((sum, item) => sum + item.cantidad, 0);
    const stockBajo = data.filter(item => {
        const cantidadMinima = item.cantidad_minima || item.cantidadMinima || 2;
        return item.cantidad <= cantidadMinima;
    }).length;
    
    const statsElement = document.getElementById('stats');
    if (statsElement) {
        statsElement.innerHTML = `
            <div class="stat-item">
                <i class="fas fa-boxes"></i>
                <span>Total Productos: ${totalProductos}</span>
            </div>
            <div class="stat-item">
                <i class="fas fa-cubes"></i>
                <span>Total Cantidad: ${totalCantidad}</span>
            </div>
            <div class="stat-item ${stockBajo > 0 ? 'alert' : ''}">
                <i class="fas fa-exclamation-triangle"></i>
                <span>Stock Bajo: ${stockBajo}</span>
            </div>
        `;
    }
}

/**
 * Agrega un nuevo producto (VERSIÓN OPTIMIZADA)
 */
async function addProduct() {
    const nombre = document.getElementById('newNombre')?.value?.trim();
    const area = document.getElementById('newArea')?.value;
    const cantidad = parseInt(document.getElementById('newCantidad')?.value) || 0;
    const cantidadMinima = parseInt(document.getElementById('newCantidadMinima')?.value) || 2;
    const unidad = document.getElementById('newUnidad')?.value?.trim();
    const factorConversion = document.getElementById('newFactorConversion')?.value;
    const precio = document.getElementById('newPrecio')?.value?.trim();
    const proveedorId = document.getElementById('newProveedor')?.value;
    
    if (!nombre) {
        alert('Por favor ingresa el nombre del producto');
        return;
    }
    
    // Validar factor de conversión para CAJA y PAQUETE
    if ((unidad === 'CAJA' || unidad === 'PAQUETE') && (!factorConversion || factorConversion <= 0)) {
        alert(`Por favor especifica cuántas piezas contiene cada ${unidad.toLowerCase()}`);
        return;
    }
    
    try {
        const productData = {
            codigo: nextCode.toString(),
            nombre: nombre,
            area: area || 'OFICINA',
            cantidad: cantidad,
            cantidad_minima: cantidadMinima,
            unidad: unidad || 'PZ',
            factor_conversion: (unidad === 'CAJA' || unidad === 'PAQUETE') ? parseInt(factorConversion) : 1,
            precio_compra: precio ? parseFloat(precio) : null,
            ubicacion: 'ALMACEN',
            proveedor_id: proveedorId ? parseInt(proveedorId) : null
        };
        
        // 1. Envía el nuevo producto a la base de datos
        const nuevoProducto = await addProductToDatabase(productData);
        
        // 2. ACTUALIZACIÓN LOCAL: Agrega el nuevo producto al array 'inventario'
        inventario.push(nuevoProducto);
        
        // 3. Obtiene el nuevo código para el siguiente producto
        const nextCodeResponse = await fetch(`${API_BASE_URL}/next-code`);
        const nextCodeData = await nextCodeResponse.json();
        nextCode = nextCodeData.success ? nextCodeData.data.nextCode : nextCode + 1;

        // 4. Renderiza la tabla con los datos locales ya actualizados
        renderTable(); // No es necesario pasarle datos, ya usa la variable global 'inventario'
        updateStats();
        
        // Limpiar y cerrar el formulario
        clearAddForm();
        toggleAddForm();
        
        alert('✅ Producto agregado exitosamente');
        
    } catch (error) {
        console.error('Error al agregar producto:', error);
        alert('❌ Error al agregar producto: ' + error.message);
    }
}

/**
 * Elimina un producto (VERSIÓN OPTIMIZADA)
 */
async function removeItem(codigo) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        try {
            // 1. Pide a la API que elimine el producto
            await deleteProductFromDatabase(codigo);
            
            // 2. ACTUALIZACIÓN LOCAL: Filtra el array 'inventario' para quitar el producto eliminado
            inventario = inventario.filter(item => item.codigo !== codigo);
            
            // 3. Renderiza la tabla con el array local actualizado
            renderTable();
            updateStats();
            
            alert('✅ Producto eliminado exitosamente');
            
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            alert('❌ Error al eliminar producto: ' + error.message);
        }
    }
}

/**
 * Alterna la visibilidad del formulario de agregar
 */
function toggleAddForm() {
    const form = document.getElementById('addForm');
    if (form) {
        form.classList.toggle('hidden');
        if (!form.classList.contains('hidden')) {
            // Enfocar el primer campo
            const firstInput = form.querySelector('input');
            if (firstInput) firstInput.focus();
        }
    }
}

/**
 * Limpia el formulario de agregar
 */
function clearAddForm() {
    const formFields = ['newNombre', 'newCantidad', 'newCantidadMinima', 'newUnidad', 'newPrecio', 'newProveedor'];
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.value = '';
        }
    });
    
    // Restablecer valores por defecto
    document.getElementById('newArea')?.setAttribute('value', 'OFICINA');
    document.getElementById('newCantidadMinima')?.setAttribute('value', '2');
    document.getElementById('newUnidad')?.setAttribute('value', 'PZ');
}

/**
 * Agrega un nuevo proveedor (VERSIÓN OPTIMIZADA)
 */
async function addProvider() {
    const nombre = document.getElementById('providerNombre')?.value?.trim();
    const rfc = document.getElementById('providerRFC')?.value?.trim();
    const telefono = document.getElementById('providerTelefono')?.value?.trim();
    const email = document.getElementById('providerEmail')?.value?.trim();
    const contacto = document.getElementById('providerContacto')?.value?.trim();
    const direccion = document.getElementById('providerDireccion')?.value?.trim();
    
    if (!nombre) {
        alert('Por favor ingresa el nombre del proveedor');
        return;
    }
    
    try {
        const providerData = {
            nombre: nombre,
            rfc: rfc,
            telefono: telefono,
            email: email,
            contacto: contacto,
            direccion: direccion
        };
        
        // 1. Envía el nuevo proveedor a la base de datos
        const nuevoProveedor = await addProviderToDatabase(providerData);
        
        // 2. ACTUALIZACIÓN LOCAL: Agrega el nuevo proveedor al array 'proveedores'
        proveedores.push(nuevoProveedor);
        
        // 3. Actualiza la interfaz
        updateProviderSelect();
        clearProviderForm();
        
        alert('✅ Proveedor agregado exitosamente');
        
    } catch (error) {
        console.error('Error al agregar proveedor:', error);
        alert('❌ Error al agregar proveedor: ' + error.message);
    }
}

/**
 * Actualiza el selector de proveedores
 */
function updateProviderSelect() {
    const select = document.getElementById('newProveedor');
    if (!select) return;
    
    select.innerHTML = '<option value="">Seleccionar proveedor...</option>';
    proveedores.forEach(proveedor => {
        const option = document.createElement('option');
        option.value = proveedor.id;
        option.textContent = proveedor.nombre;
        select.appendChild(option);
    });
}

/**
 * Actualiza la información del proveedor seleccionado
 */
function updateProviderInfo() {
    const select = document.getElementById('newProveedor');
    if (!select || !select.value) return;
    
    const providerId = parseInt(select.value);
    const proveedor = proveedores.find(p => p.id === providerId);
    
    if (proveedor) {
        // Mostrar información del proveedor seleccionado
        console.log('Proveedor seleccionado:', proveedor);
        // Podrías agregar aquí lógica para mostrar información adicional
        // Por ejemplo, en un tooltip o área de información
    }
}

/**
 * Obtiene los filtros actuales del formulario
 */
function getCurrentFilters() {
    const searchTerm = document.getElementById('searchBox')?.value?.trim() || '';
    const areaFilter = document.getElementById('areaFilter')?.value || '';
    
    const filters = {};
    if (searchTerm) filters.search = searchTerm;
    if (areaFilter) filters.area = areaFilter;
    
    return filters;
}

/**
 * Aplica filtros y recarga datos desde la API
 */
async function applyFilters() {
    const filters = getCurrentFilters();
    await loadDataFromDatabase(filters);
    renderTable();
    updateStats();
}

/**
 * Limpia la búsqueda
 */
async function clearSearch() {
    const searchBox = document.getElementById('searchBox');
    const areaFilter = document.getElementById('areaFilter');
    
    if (searchBox) searchBox.value = '';
    if (areaFilter) areaFilter.value = '';
    
    // Recargar todos los datos sin filtros
    await loadDataFromDatabase();
    renderTable();
    updateStats();
    if (searchBox) searchBox.focus();
}

/**
 * Exporta los datos a CSV
 */
function exportData() {
    const data = inventario; // Usar la variable global directamente
    const headers = ['Código', 'Nombre', 'Área', 'Cantidad', 'Mínima', 'Unidad', 'Precio', 'Ubicación', 'Proveedor', 'Contacto', 'Fecha', 'Estado', 'Días en Stock'];
    
    let csv = headers.join(',') + '\n';
    
    data.forEach(item => {
        const cantidadMinima = item.cantidad_minima || item.cantidadMinima || 2;
        const isLowStock = item.cantidad <= cantidadMinima;
        const estado = isLowStock ? 'STOCK BAJO' : 'OK';
        const fechaFormateada = formatearFecha(item.fecha_entrada || item.fecha);
        const diasStock = calcularDiasEnStock(item.fecha_entrada || item.fecha);
        
        const row = [
            item.codigo,
            `"${item.nombre}"`,
            item.area,
            item.cantidad,
            cantidadMinima,
            item.unidad,
            item.precio_compra || item.precio || '',
            item.ubicacion,
            `"${item.proveedor_nombre || item.proveedor}"`,
            item.proveedor_telefono || item.contacto || '',
            fechaFormateada,
            estado,
            diasStock
        ];
        csv += row.join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `inventario_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Muestra un resumen de productos por área
 */
function showSummary() {
    const areaGroups = {};
    let totalGeneral = 0;
    let totalValueGeneral = 0;
    
    // Agrupar productos por área
    inventario.forEach(item => {
        const area = item.area || 'SIN ÁREA';
        if (!areaGroups[area]) {
            areaGroups[area] = {
                total: 0,
                stockBajo: 0,
                valorTotal: 0
            };
        }
        
        areaGroups[area].total += parseInt(item.cantidad) || 0;
        totalGeneral += parseInt(item.cantidad) || 0;
        
        const precio = parseFloat(item.precio_compra) || 0;
        const cantidad = parseInt(item.cantidad) || 0;
        const valorArea = precio * cantidad;
        areaGroups[area].valorTotal += valorArea;
        totalValueGeneral += valorArea;
        
        const minima = parseInt(item.cantidad_minima) || parseInt(item.minima) || 2;
        if ((parseInt(item.cantidad) || 0) <= minima) {
            areaGroups[area].stockBajo++;
        }
    });
    
    // Crear HTML del resumen
    let summaryHTML = `
        <div style="background: white; border: 2px solid #007bff; border-radius: 8px; padding: 20px; margin: 20px; max-width: 600px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h3 style="color: #007bff; margin-top: 0; text-align: center;"><i class="fas fa-chart-bar"></i> Resumen por Área</h3>
            <div style="margin-bottom: 15px; padding: 10px; background: #f8f9fa; border-radius: 5px; text-align: center;">
                <strong>Total General: ${totalGeneral} productos | Valor Total: $${totalValueGeneral.toLocaleString('es-MX', {minimumFractionDigits: 2})}</strong>
            </div>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #007bff; color: white;">
                        <th style="padding: 8px; border: 1px solid #ddd;">Área</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Cantidad</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Stock Bajo</th>
                        <th style="padding: 8px; border: 1px solid #ddd;">Valor Total</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    // Agregar filas por área
    Object.keys(areaGroups).sort().forEach(area => {
        const group = areaGroups[area];
        const stockBajoStyle = group.stockBajo > 0 ? 'color: #dc3545; font-weight: bold;' : '';
        summaryHTML += `
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">${area}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${group.total}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: center; ${stockBajoStyle}">${group.stockBajo}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">$${group.valorTotal.toLocaleString('es-MX', {minimumFractionDigits: 2})}</td>
            </tr>
        `;
    });
    
    summaryHTML += `
                </tbody>
            </table>
            <div style="text-align: center; margin-top: 15px;">
                <button onclick="this.parentElement.parentElement.remove()" style="background: #6c757d; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                    <i class="fas fa-times"></i> Cerrar
                </button>
            </div>
        </div>
    `;
    
    // Mostrar el resumen
    const existingSummary = document.querySelector('[data-summary-modal]');
    if (existingSummary) {
        existingSummary.remove();
    }
    
    const summaryModal = document.createElement('div');
    summaryModal.setAttribute('data-summary-modal', 'true');
    summaryModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    summaryModal.innerHTML = summaryHTML;
    
    document.body.appendChild(summaryModal);
    
    // Cerrar al hacer clic fuera del modal
    summaryModal.addEventListener('click', (e) => {
        if (e.target === summaryModal) {
            summaryModal.remove();
        }
    });
}

/**
 * Ordena la tabla por la columna especificada
 */
function sortTable(columnIndex) {
    const table = document.getElementById('inventoryTable');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // Determinar dirección de ordenamiento
    const currentHeader = table.querySelector(`th:nth-child(${columnIndex + 1})`);
    const currentSort = currentHeader.getAttribute('data-sort') || 'none';
    const newSort = currentSort === 'asc' ? 'desc' : 'asc';
    
    // Limpiar indicadores de ordenamiento anteriores
    table.querySelectorAll('th').forEach(th => {
        th.removeAttribute('data-sort');
        th.innerHTML = th.innerHTML.replace(/<i class="fas fa-sort-(up|down)"><\/i>/g, '<i class="fas fa-sort"></i>');
    });
    
    // Establecer nuevo ordenamiento
    currentHeader.setAttribute('data-sort', newSort);
    const sortIcon = newSort === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
    currentHeader.innerHTML = currentHeader.innerHTML.replace(/fa-sort/, sortIcon);
    
    // Ordenar filas
    rows.sort((a, b) => {
        const cellA = a.cells[columnIndex].textContent.trim();
        const cellB = b.cells[columnIndex].textContent.trim();
        
        // Detectar si es número
        const numA = parseFloat(cellA.replace(/[^0-9.-]/g, ''));
        const numB = parseFloat(cellB.replace(/[^0-9.-]/g, ''));
        
        let comparison;
        if (!isNaN(numA) && !isNaN(numB)) {
            // Comparación numérica
            comparison = numA - numB;
        } else {
            // Comparación alfabética
            comparison = cellA.localeCompare(cellB, 'es', { numeric: true });
        }
        
        return newSort === 'asc' ? comparison : -comparison;
    });
    
    // Aplicar el ordenamiento
    rows.forEach(row => tbody.appendChild(row));
}

/**
 * Inicializa la aplicación (VERSIÓN OPTIMIZADA)
 */
async function initializeApp() {
    try {
        // Cargar datos desde la base de datos (solo una vez al inicio)
        await loadDataFromDatabase();
        
        // Renderizar tabla inicial
        renderTable();
        
        // Actualizar selector de proveedores
        updateProviderSelect();
        
        // Configurar event listeners
        setupEventListeners();
        
        console.log('Sistema de Inventario inicializado correctamente con base de datos');
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        alert('Error al conectar con la base de datos. Verifica que el servidor esté ejecutándose correctamente.');
    }
}

/**
 * Configura todos los event listeners (VERSIÓN OPTIMIZADA)
 */
function setupEventListeners() {
    const searchBox = document.getElementById('searchBox');
    const areaFilter = document.getElementById('areaFilter');
    
    if (searchBox) {
        // Envolvemos la llamada a applyFilters en nuestro debounce
        searchBox.addEventListener('input', debounce(() => {
            applyFilters();
        }, 300)); // Espera 300ms después de la última tecla antes de buscar
    }
    
    if (areaFilter) {
        areaFilter.addEventListener('change', () => {
            applyFilters();
        });
    }
    
    // Configurar atajos de teclado
    document.addEventListener('keydown', (e) => {
        // Ctrl + N para agregar producto
        if (e.ctrlKey && e.key === 'n') {
            e.preventDefault();
            toggleAddForm();
        }
        
        // Ctrl + S para exportar
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            exportData();
        }
        
        // Escape para cerrar formularios o limpiar búsqueda
        if (e.key === 'Escape') {
            const searchBox = document.getElementById('searchBox');
            const addForm = document.getElementById('addForm');
            const summaryBox = document.getElementById('summaryBox');
            const providerSection = document.getElementById('providerSection');
            
            // Si hay texto en la búsqueda, limpiarlo
            if (searchBox && searchBox.value.trim()) {
                clearSearch();
                return;
            }
            
            // Cerrar formularios abiertos
            if (addForm && !addForm.classList.contains('hidden')) {
                toggleAddForm();
            }
            
            if (summaryBox && !summaryBox.classList.contains('hidden')) {
                summaryBox.classList.add('hidden');
            }
            
            if (providerSection && !providerSection.classList.contains('hidden')) {
                providerSection.classList.add('hidden');
            }
        }
        
        // Ctrl + F para enfocar búsqueda
        if (e.ctrlKey && e.key === 'f') {
            e.preventDefault();
            const searchBox = document.getElementById('searchBox');
            if (searchBox) {
                searchBox.focus();
                searchBox.select();
            }
        }
    });
}

/**
 * Registra una salida de producto (VERSIÓN OPTIMIZADA)
 */
async function registerOutput() {
    const select = document.getElementById('outputProductSelect');
    const cantidad = parseInt(document.getElementById('outputCantidad').value);
    const responsable = document.getElementById('outputResponsable').value.trim();
    const areaDestino = document.getElementById('outputAreaDestino').value;
    const observaciones = document.getElementById('outputObservaciones').value.trim();
    
    // Validaciones
    if (!select.value) {
        alert('Por favor selecciona un producto');
        return;
    }
    
    if (!cantidad || cantidad <= 0) {
        alert('Por favor ingresa una cantidad válida');
        return;
    }
    
    if (!responsable) {
        alert('Por favor ingresa el nombre del responsable');
        return;
    }
    
    const codigo = select.value;
    const producto = inventario.find(item => item.codigo === codigo);
    
    if (!producto) {
        alert('Producto no encontrado');
        return;
    }
    
    if (cantidad > producto.cantidad) {
        alert(`No hay suficiente stock. Stock disponible: ${producto.cantidad} ${producto.unidad}`);
        return;
    }
    
    // Confirmar la salida
    const confirmacion = confirm(
        `¿Confirmar salida?\n\n` +
        `Producto: ${producto.nombre}\n` +
        `Cantidad: ${cantidad} ${producto.unidad}\n` +
        `Responsable: ${responsable}\n` +
        `Área destino: ${areaDestino}\n` +
        `Stock restante: ${producto.cantidad - cantidad} ${producto.unidad}`
    );
    
    if (!confirmacion) return;
    
    try {
        const outputData = {
            codigo_producto: codigo,
            cantidad: cantidad,
            responsable: responsable,
            area_destino: areaDestino,
            observaciones: observaciones
        };
        
        // 1. Envía la salida a la base de datos
        const nuevaSalida = await addOutputToDatabase(outputData);
        
        // 2. ACTUALIZACIÓN LOCAL: Agrega la nueva salida al array 'salidas'
        salidas.push(nuevaSalida);
        
        // 3. ACTUALIZACIÓN LOCAL: Actualiza el stock del producto en el array 'inventario'
        const productoIndex = inventario.findIndex(item => item.codigo === codigo);
        if (productoIndex !== -1) {
            inventario[productoIndex].cantidad -= cantidad;
        }
        
        // 4. Actualiza la interfaz
        renderTable();
        updateStats();
        
        // Limpiar formulario
        clearOutputForm();
        toggleOutputForm();
        
        alert('✅ Salida registrada exitosamente');
        
    } catch (error) {
        console.error('Error al registrar salida:', error);
        alert('❌ Error al registrar salida: ' + error.message);
    }
}

/**
 * Alterna la visibilidad del formulario de salidas
 */
function toggleOutputForm() {
    const form = document.getElementById('outputForm');
    if (form) {
        form.classList.toggle('hidden');
        if (!form.classList.contains('hidden')) {
            updateOutputProductSelect();
            const firstInput = form.querySelector('input');
            if (firstInput) firstInput.focus();
        }
    }
}

/**
 * Actualiza el selector de productos para salidas
 */
function updateOutputProductSelect() {
    const select = document.getElementById('outputProductSelect');
    if (!select) return;
    
    select.innerHTML = '<option value="">Seleccionar producto...</option>';
    inventario.forEach(producto => {
        if (producto.cantidad > 0) {
            const option = document.createElement('option');
            option.value = producto.codigo;
            option.textContent = `${producto.codigo} - ${producto.nombre} (Stock: ${producto.cantidad} ${producto.unidad})`;
            select.appendChild(option);
        }
    });
}

/**
 * Actualiza la información del producto seleccionado en el formulario de salidas
 */
function updateOutputProductInfo() {
    const select = document.getElementById('outputProductSelect');
    const infoDiv = document.getElementById('outputProductInfo');
    
    if (!select || !infoDiv) return;
    
    const codigo = select.value;
    const producto = inventario.find(item => item.codigo === codigo);
    
    if (producto) {
        infoDiv.innerHTML = `
            <div class="product-info">
                <strong>${producto.nombre}</strong><br>
                Stock disponible: <span class="stock-info">${producto.cantidad} ${producto.unidad}</span><br>
                Área: ${producto.area} | Ubicación: ${producto.ubicacion}
            </div>
        `;
        infoDiv.style.display = 'block';
    } else {
        infoDiv.style.display = 'none';
    }
}

/**
 * Limpia el formulario de salidas
 */
function clearOutputForm() {
    const formFields = ['outputProductSelect', 'outputCantidad', 'outputResponsable', 'outputAreaDestino', 'outputObservaciones'];
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.value = '';
        }
    });
    
    const infoDiv = document.getElementById('outputProductInfo');
    if (infoDiv) {
        infoDiv.style.display = 'none';
    }
}

/**
 * Alterna la visibilidad de la tabla de salidas
 */
function toggleOutputsTable() {
    const tableContainer = document.getElementById('outputsTableContainer');
    if (tableContainer) {
        tableContainer.classList.toggle('hidden');
        if (!tableContainer.classList.contains('hidden')) {
            renderOutputsTable();
        }
    }
}

/**
 * Renderiza la tabla de salidas
 */
function renderOutputsTable() {
    const tbody = document.getElementById('outputsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    salidas.forEach(salida => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="output-date">${salida.fecha}</td>
            <td class="output-product">${salida.codigo_producto} - ${salida.nombre_producto || 'Producto'}</td>
            <td class="output-quantity">${salida.cantidad} ${salida.unidad || 'PZ'}</td>
            <td class="output-responsible">${salida.responsable}</td>
            <td class="output-destination">${salida.area_destino}</td>
            <td class="output-observations">${salida.observaciones || '-'}</td>
            <td class="output-actions">
                <button class="btn" onclick="deleteOutput(${salida.id})" style="background: #f44336; color: white; padding: 3px 8px;">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * Elimina una salida (VERSIÓN OPTIMIZADA)
 */
async function deleteOutput(id) {
    if (confirm('¿Estás seguro de que quieres eliminar esta salida? El stock se restaurará.')) {
        try {
            // 1. Pide a la API que elimine la salida
            await deleteOutputFromDatabase(id);
            
            // 2. ACTUALIZACIÓN LOCAL: Encuentra y elimina la salida del array 'salidas'
            const salidaIndex = salidas.findIndex(s => s.id === id);
            if (salidaIndex !== -1) {
                const salida = salidas[salidaIndex];
                
                // 3. ACTUALIZACIÓN LOCAL: Restaura el stock del producto
                const productoIndex = inventario.findIndex(item => item.codigo === salida.producto_codigo);
                if (productoIndex !== -1) {
                    inventario[productoIndex].cantidad += salida.cantidad;
                }
                
                // 4. Elimina la salida del array local
                salidas.splice(salidaIndex, 1);
            }
            
            // 5. Actualiza la interfaz
            renderTable();
            renderOutputsTable();
            updateStats();
            
            alert('✅ Salida eliminada y stock restaurado');
            
        } catch (error) {
            console.error('Error al eliminar salida:', error);
            alert('❌ Error al eliminar salida: ' + error.message);
        }
    }
}

/**
 * Exporta los datos de salidas a CSV
 */
function exportOutputsData() {
    const headers = ['Fecha', 'Código Producto', 'Nombre Producto', 'Cantidad', 'Unidad', 'Responsable', 'Área Destino', 'Observaciones'];
    
    let csv = headers.join(',') + '\n';
    
    salidas.forEach(salida => {
        const row = [
            salida.fecha,
            salida.codigo_producto,
            `"${salida.nombre_producto || 'Producto'}"`,
            salida.cantidad,
            salida.unidad || 'PZ',
            `"${salida.responsable}"`,
            salida.area_destino,
            `"${salida.observaciones || ''}"`
        ];
        csv += row.join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `salidas_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * Limpia el formulario de proveedores
 */
function clearProviderForm() {
    const formFields = ['providerNombre', 'providerRFC', 'providerTelefono', 'providerEmail', 'providerContacto', 'providerDireccion'];
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.value = '';
        }
    });
}

/**
 * Alterna la visibilidad de la sección de proveedores
 */
function toggleProviderSection() {
    const section = document.getElementById('providerSection');
    if (section) {
        section.classList.toggle('hidden');
        if (!section.classList.contains('hidden')) {
            renderProvidersTable();
        }
    }
}

/**
 * Renderiza la tabla de proveedores
 */
function renderProvidersTable() {
    const tbody = document.getElementById('providersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    proveedores.forEach(proveedor => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${proveedor.nombre}</td>
            <td>${proveedor.rfc || '-'}</td>
            <td>${proveedor.telefono || '-'}</td>
            <td>${proveedor.email || '-'}</td>
            <td>${proveedor.contacto || '-'}</td>
            <td>${proveedor.direccion || '-'}</td>
            <td>
                <button class="btn" onclick="editProvider(${proveedor.id})" style="background: #2196F3; color: white; padding: 3px 8px; margin-right: 5px;">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn" onclick="removeProvider(${proveedor.id})" style="background: #f44336; color: white; padding: 3px 8px;">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * Elimina un proveedor (VERSIÓN OPTIMIZADA)
 */
async function removeProvider(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este proveedor?')) {
        try {
            // 1. Pide a la API que elimine el proveedor
            await deleteProviderFromDatabase(id);
            
            // 2. ACTUALIZACIÓN LOCAL: Filtra el array 'proveedores' para quitar el proveedor eliminado
            proveedores = proveedores.filter(p => p.id !== id);
            
            // 3. Actualiza la interfaz
            renderProvidersTable();
            updateProviderSelect();
            
            alert('✅ Proveedor eliminado exitosamente');
            
        } catch (error) {
            console.error('Error al eliminar proveedor:', error);
            alert('❌ Error al eliminar proveedor: ' + error.message);
        }
    }
}

// Funciones placeholder para compatibilidad
async function editItem(codigo) {
    const item = inventario.find(p => p.codigo === codigo);
    if (!item) {
        alert('Producto no encontrado');
        return;
    }
    
    const nuevoNombre = prompt('Nombre del producto:', item.nombre);
    if (nuevoNombre === null) return; // Usuario canceló
    
    const nuevaCantidad = prompt('Cantidad:', item.cantidad);
    if (nuevaCantidad === null) return; // Usuario canceló
    
    const cantidadNum = parseInt(nuevaCantidad);
    if (isNaN(cantidadNum) || cantidadNum < 0) {
        alert('Por favor ingresa una cantidad válida');
        return;
    }
    
    if (confirm(`¿Confirmar cambios?\nNombre: ${nuevoNombre}\nCantidad: ${cantidadNum}`)) {
        try {
            const updateData = {
                nombre: nuevoNombre.trim(),
                cantidad: cantidadNum
            };
            
            // Actualizar en la base de datos
            const response = await fetch(`${API_BASE_URL}/productos/${codigo}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });
            
            const result = await response.json();
            if (result.success) {
                // Actualización local optimista
                const itemIndex = inventario.findIndex(p => p.codigo === codigo);
                if (itemIndex !== -1) {
                    inventario[itemIndex] = { ...inventario[itemIndex], ...updateData };
                    renderTable();
                    updateStats();
                }
                alert('✅ Producto actualizado exitosamente');
            } else {
                throw new Error(result.error || 'Error al actualizar producto');
            }
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            alert('❌ Error al actualizar producto: ' + error.message);
        }
    }
}

async function editProvider(id) {
    const proveedor = proveedores.find(p => p.id === id);
    if (!proveedor) {
        alert('Proveedor no encontrado');
        return;
    }
    
    const nuevoNombre = prompt('Nombre del proveedor:', proveedor.nombre);
    if (nuevoNombre === null) return; // Usuario canceló
    
    const nuevoTelefono = prompt('Teléfono:', proveedor.telefono);
    if (nuevoTelefono === null) return; // Usuario canceló
    
    const nuevoEmail = prompt('Email:', proveedor.email);
    if (nuevoEmail === null) return; // Usuario canceló
    
    const nuevaDireccion = prompt('Dirección:', proveedor.direccion || '');
    if (nuevaDireccion === null) return; // Usuario canceló
    
    if (confirm(`¿Confirmar cambios?\nNombre: ${nuevoNombre}\nTeléfono: ${nuevoTelefono}\nEmail: ${nuevoEmail}\nDirección: ${nuevaDireccion}`)) {
        try {
            const updateData = {
                nombre: nuevoNombre.trim(),
                telefono: nuevoTelefono.trim(),
                email: nuevoEmail.trim(),
                direccion: nuevaDireccion.trim()
            };
            
            // Actualizar en la base de datos
            const response = await fetch(`${API_BASE_URL}/proveedores/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });
            
            const result = await response.json();
            if (result.success) {
                // Actualización local optimista
                const proveedorIndex = proveedores.findIndex(p => p.id === id);
                if (proveedorIndex !== -1) {
                    proveedores[proveedorIndex] = { ...proveedores[proveedorIndex], ...updateData };
                    renderProvidersTable();
                    updateProviderSelect();
                }
                alert('✅ Proveedor actualizado exitosamente');
            } else {
                throw new Error(result.error || 'Error al actualizar proveedor');
            }
        } catch (error) {
            console.error('Error al actualizar proveedor:', error);
            alert('❌ Error al actualizar proveedor: ' + error.message);
        }
    }
}

function editOutput(id) {
    alert('Función de edición de salidas en desarrollo');
}

/**
 * Muestra/oculta el campo de factor de conversión según la unidad seleccionada
 */
function toggleConversionField() {
    const unidad = document.getElementById('newUnidad')?.value;
    const conversionField = document.getElementById('conversionField');
    
    if (conversionField) {
        if (unidad === 'CAJA' || unidad === 'PAQUETE') {
            conversionField.style.display = 'block';
            document.getElementById('newFactorConversion').required = true;
        } else {
            conversionField.style.display = 'none';
            document.getElementById('newFactorConversion').required = false;
            document.getElementById('newFactorConversion').value = '';
        }
    }
}

// ============================================
// EXPOSICIÓN DE FUNCIONES GLOBALES
// ============================================

// Exponer todas las funciones necesarias al objeto global window
window.toggleAddForm = toggleAddForm;
window.addProduct = addProduct;
window.editItem = editItem;
window.removeItem = removeItem;
window.exportData = exportData;
window.showSummary = showSummary;
window.sortTable = sortTable;
window.clearSearch = clearSearch;
window.updateProviderInfo = updateProviderInfo;
window.toggleProviderSection = toggleProviderSection;
window.addProvider = addProvider;
window.editProvider = editProvider;
window.removeProvider = removeProvider;
window.toggleOutputForm = toggleOutputForm;
window.registerOutput = registerOutput;
window.toggleOutputsTable = toggleOutputsTable;
window.exportOutputsData = exportOutputsData;
window.editOutput = editOutput;
window.deleteOutput = deleteOutput;
window.toggleConversionField = toggleConversionField;

// ============================================
// INICIALIZACIÓN
// ============================================

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
