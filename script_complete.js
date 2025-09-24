// Sistema de Inventario - JavaScript con Base de Datos PostgreSQL

// Configuración de la API
const API_BASE_URL = 'http://localhost:3000/api';

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
async function loadDataFromDatabase() {
    try {
        // Cargar productos
        const productosResponse = await fetch(`${API_BASE_URL}/productos`);
        const productosData = await productosResponse.json();
        inventario = productosData.success ? productosData.data : [];
        
        // Cargar proveedores
        const proveedoresResponse = await fetch(`${API_BASE_URL}/proveedores`);
        const proveedoresData = await proveedoresResponse.json();
        proveedores = proveedoresData.success ? proveedoresData.data : [];
        
        // Cargar salidas
        const salidasResponse = await fetch(`${API_BASE_URL}/salidas`);
        const salidasData = await salidasResponse.json();
        salidas = salidasData.success ? salidasData.data : [];
        
        // Obtener siguiente código
        const nextCodeResponse = await fetch(`${API_BASE_URL}/next-code`);
        const nextCodeData = await nextCodeResponse.json();
        nextCode = nextCodeData.success ? nextCodeData.data.nextCode : 1;
        
        console.log('Datos cargados desde la base de datos:', {
            productos: inventario.length,
            proveedores: proveedores.length,
            salidas: salidas.length
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

// ===== FUNCIONES DE UTILIDAD =====

/**
 * Calcula los días que un producto ha estado en stock
 */
function calcularDiasEnStock(fecha) {
    if (!fecha) return "N/A";
    
    try {
        const [dia, mes, año] = fecha.split('/');
        const fechaEntrada = new Date(año, mes - 1, dia);
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
function renderTable(data = inventario) {
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
            <td>${item.unidad}</td>
            <td class="price-cell">${formatDisplayCurrency(item.precio_compra || item.precio)}</td>
            <td>${item.ubicacion}</td>
            <td>${item.proveedor_nombre || item.proveedor}</td>
            <td>${item.proveedor_telefono || item.contacto}</td>
            <td>${item.fecha_entrada || item.fecha}</td>
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
 * Agrega un nuevo producto
 */
async function addProduct() {
    const nombre = document.getElementById('newNombre')?.value?.trim();
    const area = document.getElementById('newArea')?.value;
    const cantidad = parseInt(document.getElementById('newCantidad')?.value) || 0;
    const cantidadMinima = parseInt(document.getElementById('newCantidadMinima')?.value) || 2;
    const unidad = document.getElementById('newUnidad')?.value?.trim();
    const precio = document.getElementById('newPrecio')?.value?.trim();
    const proveedorId = document.getElementById('newProveedor')?.value;
    
    if (!nombre) {
        alert('Por favor ingresa el nombre del producto');
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
            precio_compra: precio ? parseFloat(precio) : null,
            ubicacion: 'ALMACEN',
            proveedor_id: proveedorId ? parseInt(proveedorId) : null
        };
        
        await addProductToDatabase(productData);
        
        // Recargar datos desde la base de datos
        await loadDataFromDatabase();
        
        // Actualizar interfaz
        renderTable();
        updateStats();
        
        // Limpiar formulario
        clearAddForm();
        toggleAddForm();
        
        alert('✅ Producto agregado exitosamente');
        
    } catch (error) {
        console.error('Error al agregar producto:', error);
        alert('❌ Error al agregar producto: ' + error.message);
    }
}

/**
 * Elimina un producto
 */
async function removeItem(codigo) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        try {
            await deleteProductFromDatabase(codigo);
            
            // Recargar datos desde la base de datos
            await loadDataFromDatabase();
            
            // Actualizar interfaz
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
 * Obtiene los datos filtrados actuales
 */
function getCurrentFilteredData() {
    const searchTerm = document.getElementById('searchBox')?.value?.toLowerCase() || '';
    const areaFilter = document.getElementById('areaFilter')?.value || '';
    
    let filtered = inventario;
    
    if (searchTerm) {
        filtered = filtered.filter(item => 
            item.nombre.toLowerCase().includes(searchTerm) ||
            item.codigo.toString().includes(searchTerm)
        );
    }
    
    if (areaFilter) {
        filtered = filtered.filter(item => item.area === areaFilter);
    }
    
    return filtered;
}

/**
 * Limpia la búsqueda
 */
function clearSearch() {
    const searchBox = document.getElementById('searchBox');
    const areaFilter = document.getElementById('areaFilter');
    
    if (searchBox) searchBox.value = '';
    if (areaFilter) areaFilter.value = '';
    
    renderTable();
    if (searchBox) searchBox.focus();
}

/**
 * Exporta los datos a CSV
 */
function exportData() {
    const data = getCurrentFilteredData();
    const headers = ['Código', 'Nombre', 'Área', 'Cantidad', 'Mínima', 'Unidad', 'Precio', 'Ubicación', 'Proveedor', 'Contacto', 'Fecha', 'Estado', 'Días en Stock'];
    
    let csv = headers.join(',') + '\n';
    
    data.forEach(item => {
        const cantidadMinima = item.cantidad_minima || item.cantidadMinima || 2;
        const isLowStock = item.cantidad <= cantidadMinima;
        const estado = isLowStock ? 'STOCK BAJO' : 'OK';
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
            item.fecha_entrada || item.fecha,
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
 * Inicializa la aplicación
 */
async function initializeApp() {
    try {
        // Cargar datos desde la base de datos
        await loadDataFromDatabase();
        
        // Renderizar tabla inicial
        renderTable();
        
        // Actualizar selector de proveedores
        updateProviderSelect();
        
        // Configurar event listeners
        const searchBox = document.getElementById('searchBox');
        const areaFilter = document.getElementById('areaFilter');
        
        if (searchBox) {
            searchBox.addEventListener('input', () => {
                renderTable(getCurrentFilteredData());
            });
        }
        
        if (areaFilter) {
            areaFilter.addEventListener('change', () => {
                renderTable(getCurrentFilteredData());
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
        
        console.log('Sistema de Inventario inicializado correctamente con base de datos');
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        alert('Error al conectar con la base de datos. Verifica que el servidor esté ejecutándose en http://localhost:3000');
    }
}

// Funciones placeholder para compatibilidad
function editItem(codigo) {
    alert('Función de edición en desarrollo');
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
