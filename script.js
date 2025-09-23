// Sistema de Inventario - JavaScript

// Datos iniciales del inventario
let inventario = [
    {codigo: 1, nombre: "ORDEN DE TRABAJO", area: "OFICINA", cantidad: 7, cantidadMinima: 5, unidad: "LIBRETAS", precio: "", ubicacion: "ALMACEN", proveedor: "ADOSA", contacto: "844-10-1187", fecha: "22/08/2025"},
    {codigo: 2, nombre: "HOJAS DE COLORES", area: "OFICINA", cantidad: 2, cantidadMinima: 3, unidad: "PAQUETES", precio: "", ubicacion: "ALMACEN", proveedor: "ADOSA", contacto: "844-10-1187", fecha: "22/08/2025"},
    {codigo: 3, nombre: "SOBRES TAMAÑO CARTA", area: "OFICINA", cantidad: 1, cantidadMinima: 2, unidad: "PAQUETE", precio: "", ubicacion: "ALMACEN", proveedor: "ADOSA", contacto: "844-10-1187", fecha: "22/08/2025"},
    {codigo: 19, nombre: "POST-IT", area: "OFICINA", cantidad: 5, cantidadMinima: 3, unidad: "PAQUETES", precio: "", ubicacion: "ALMACEN", proveedor: "ADOSA", contacto: "844-10-1187", fecha: "22/08/2025"},
    {codigo: 22, nombre: "PLUMAS NEGRAS", area: "OFICINA", cantidad: 3, cantidadMinima: 2, unidad: "CAJAS", precio: "", ubicacion: "ALMACEN", proveedor: "ADOSA", contacto: "844-10-1187", fecha: "22/08/2025"},
    {codigo: 33, nombre: "FABULOSO", area: "LIMPIEZA", cantidad: 6, cantidadMinima: 4, unidad: "GARRAFAS", precio: "", ubicacion: "SOTANO", proveedor: "PROQUIMSA", contacto: "844-135-2105", fecha: "25/08/2025"},
    {codigo: 34, nombre: "CLORO", area: "LIMPIEZA", cantidad: 5, cantidadMinima: 3, unidad: "GARRAFAS", precio: "", ubicacion: "SOTANO", proveedor: "PROQUIMSA", contacto: "844-135-2105", fecha: "25/08/2025"},
    {codigo: 49, nombre: "FAROS TRASEROS DE CAMION", area: "TALLER", cantidad: 2, cantidadMinima: 2, unidad: "PZ", precio: "", ubicacion: "ALMACEN", proveedor: "AYCO", contacto: "", fecha: "26/08/2025"},
    {codigo: 60, nombre: "ARRANCADOR", area: "TALLER", cantidad: 38, cantidadMinima: 10, unidad: "PZ", precio: "", ubicacion: "ALMACEN", proveedor: "", contacto: "", fecha: "26/08/2025"},
    {codigo: 94, nombre: "FOCOS H7 24V", area: "TALLER", cantidad: 30, cantidadMinima: 15, unidad: "PZ", precio: "", ubicacion: "ALMACEN", proveedor: "", contacto: "", fecha: "03/09/2025"}
];

// Variable para el siguiente código disponible
let nextCode = Math.max(...inventario.map(item => item.codigo)) + 1;

// Datos de proveedores
let proveedores = [
    {id: 1, nombre: "ADOSA", rfc: "ADO123456789", telefono: "844-10-1187", email: "ventas@adosa.com", direccion: "Av. Principal 123", contacto: "Juan Pérez"},
    {id: 2, nombre: "PROQUIMSA", rfc: "PRO987654321", telefono: "844-135-2105", email: "contacto@proquimsa.com", direccion: "Calle Industrial 456", contacto: "María García"},
    {id: 3, nombre: "AYCO", rfc: "AYC456789123", telefono: "844-555-0123", email: "info@ayco.com", direccion: "Zona Industrial 789", contacto: "Carlos López"}
];

// Variable para el siguiente ID de proveedor
let nextProviderId = Math.max(...proveedores.map(p => p.id)) + 1;

/**
 * Calcula los días que un producto ha estado en stock
 * @param {string} fecha - Fecha en formato DD/MM/YYYY
 * @returns {string} Días en stock o "N/A"
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
 * @param {string} area - Nombre del área
 * @returns {string} HTML del badge
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
 * Renderiza la tabla con los datos proporcionados
 * @param {Array} data - Array de productos a mostrar
 */
function renderTable(data = inventario) {
    const tbody = document.getElementById('tableBody');
    if (!tbody) {
        console.error('Elemento tableBody no encontrado');
        return;
    }
    
    tbody.innerHTML = '';
    
    data.forEach(item => {
        const cantidadMinima = item.cantidadMinima || 2; // Usar cantidad mínima personalizada o 2 por defecto
        const isLowStock = item.cantidad <= cantidadMinima;
        const alerta = isLowStock ? '<i class="fas fa-exclamation-triangle"></i> STOCK BAJO' : '<i class="fas fa-check-circle"></i> OK';
        const diasStock = calcularDiasEnStock(item.fecha);
        
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
            <td class="price-cell">${formatDisplayCurrency(item.precio)}</td>
            <td>${item.ubicacion}</td>
            <td>${item.proveedor}</td>
            <td>${item.contacto}</td>
            <td>${item.fecha}</td>
            <td class="${isLowStock ? 'alerta' : ''}">${alerta}</td>
            <td>${diasStock}</td>
            <td>
                <button class="btn" onclick="editItem(${item.codigo})" style="background: #2196F3; color: white; padding: 3px 8px; margin-right: 5px;"><i class="fas fa-edit"></i></button>
                <button class="btn" onclick="removeItem(${item.codigo})" style="background: #f44336; color: white; padding: 3px 8px;"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    updateStats(data);
}


/**
 * Edita un producto existente
 * @param {number} codigo - Código del producto a editar
 */
function editItem(codigo) {
    const item = inventario.find(item => item.codigo === codigo);
    if (!item) return;
    
    // Llenar el formulario de agregar con los datos del producto
    document.getElementById('newNombre').value = item.nombre;
    document.getElementById('newArea').value = item.area;
    document.getElementById('newCantidad').value = item.cantidad;
    document.getElementById('newCantidadMinima').value = item.cantidadMinima || 2;
    document.getElementById('newUnidad').value = item.unidad;
    document.getElementById('newPrecio').value = item.precio || '';
    
    // Buscar el proveedor por nombre y seleccionarlo
    const proveedorSelect = document.getElementById('newProveedor');
    for (let option of proveedorSelect.options) {
        if (option.textContent === item.proveedor) {
            proveedorSelect.value = option.value;
            break;
        }
    }
    
    // Cambiar el botón de agregar por actualizar
    const addButton = document.querySelector('.add-form .btn[onclick="addProduct()"]');
    if (addButton) {
        addButton.innerHTML = '<i class="fas fa-save"></i> Actualizar';
        addButton.onclick = () => updateProduct(codigo);
    }
    
    // Mostrar el formulario
    const addForm = document.getElementById('addForm');
    if (addForm.classList.contains('hidden')) {
        toggleAddForm();
    }
    
    // Scroll al formulario
    addForm.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Actualiza un producto existente
 * @param {number} codigo - Código del producto a actualizar
 */
function updateProduct(codigo) {
    const item = inventario.find(item => item.codigo === codigo);
    if (!item) return;
    
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
    
    // Obtener información del proveedor seleccionado
    let proveedorNombre = "";
    let proveedorContacto = "";
    
    if (proveedorId) {
        const proveedor = proveedores.find(p => p.id === parseInt(proveedorId));
        if (proveedor) {
            proveedorNombre = proveedor.nombre;
            proveedorContacto = proveedor.telefono || "";
        }
    }
    
    // Actualizar los datos del producto
    item.nombre = nombre;
    item.area = area || 'OFICINA';
    item.cantidad = cantidad;
    item.cantidadMinima = cantidadMinima;
    item.unidad = unidad || 'PZ';
    item.precio = precio || '';
    item.proveedor = proveedorNombre;
    item.contacto = proveedorContacto;
    
    // Limpiar formulario
    const formFields = ['newNombre', 'newCantidad', 'newCantidadMinima', 'newUnidad', 'newPrecio'];
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) field.value = '';
    });
    
    // Restaurar valor por defecto para cantidad mínima
    document.getElementById('newCantidadMinima').value = '2';
    
    // Restaurar el botón de agregar
    const updateButton = document.querySelector('.add-form .btn[onclick*="updateProduct"]');
    if (updateButton) {
        updateButton.innerHTML = '<i class="fas fa-check"></i> Agregar';
        updateButton.onclick = addProduct;
    }
    
    // Cerrar formulario
    toggleAddForm();
    
    // Actualizar la tabla
    renderTable(getCurrentFilteredData());
    
    // Guardar en localStorage
    saveToLocalStorage();
    
    // Mostrar mensaje de éxito
    showNotification('Producto actualizado exitosamente', 'success');
}

/**
 * Elimina un producto del inventario
 * @param {number} codigo - Código del producto a eliminar
 */
function removeItem(codigo) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        inventario = inventario.filter(item => item.codigo !== codigo);
        renderTable(getCurrentFilteredData());
        
        // Guardar en localStorage
        saveToLocalStorage();
    }
}

/**
 * Actualiza las estadísticas mostradas en la barra de herramientas
 * @param {Array} data - Datos para calcular estadísticas
 */
function updateStats(data) {
    const total = data.length;
    const lowStock = data.filter(item => {
        const cantidadMinima = item.cantidadMinima || 2;
        return item.cantidad <= cantidadMinima;
    }).length;
    const okStock = total - lowStock;
    
    const totalElement = document.getElementById('totalItems');
    const lowStockElement = document.getElementById('lowStock');
    const okStockElement = document.getElementById('okStock');
    
    if (totalElement) totalElement.textContent = total;
    if (lowStockElement) lowStockElement.textContent = lowStock;
    if (okStockElement) okStockElement.textContent = okStock;
}

/**
 * Obtiene los datos filtrados según los criterios actuales
 * @returns {Array} Datos filtrados
 */
function getCurrentFilteredData() {
    const searchBox = document.getElementById('searchBox');
    const areaFilter = document.getElementById('areaFilter');
    
    if (!searchBox || !areaFilter) {
        return inventario;
    }
    
    const searchTerm = searchBox.value.toLowerCase();
    const areaFilterValue = areaFilter.value;
    
    return inventario.filter(item => {
        const matchesSearch = item.nombre.toLowerCase().includes(searchTerm) || 
                            item.codigo.toString().includes(searchTerm);
        const matchesArea = !areaFilterValue || item.area === areaFilterValue;
        return matchesSearch && matchesArea;
    });
}

/**
 * Muestra/oculta el formulario de agregar producto
 */
function toggleAddForm() {
    const form = document.getElementById('addForm');
    if (form) {
        form.classList.toggle('hidden');
        
        // Si se está mostrando, enfocar el primer campo
        if (!form.classList.contains('hidden')) {
            setTimeout(() => {
                const nombreField = document.getElementById('newNombre');
                if (nombreField) nombreField.focus();
            }, 100);
        }
    }
}

/**
 * Agrega un nuevo producto al inventario
 */
function addProduct() {
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
    
    // Obtener información del proveedor seleccionado
    let proveedorNombre = "";
    let proveedorContacto = "";
    
    if (proveedorId) {
        const proveedor = proveedores.find(p => p.id === parseInt(proveedorId));
        if (proveedor) {
            proveedorNombre = proveedor.nombre;
            proveedorContacto = proveedor.telefono || "";
        }
    }
    
    const hoy = new Date();
    const fecha = `${hoy.getDate().toString().padStart(2, '0')}/${(hoy.getMonth() + 1).toString().padStart(2, '0')}/${hoy.getFullYear()}`;
    
    const nuevoProducto = {
        codigo: nextCode++,
        nombre: nombre,
        area: area || 'OFICINA',
        cantidad: cantidad,
        cantidadMinima: cantidadMinima,
        unidad: unidad || 'PZ',
        precio: precio || "",
        ubicacion: "ALMACEN",
        proveedor: proveedorNombre,
        contacto: proveedorContacto,
        fecha: fecha
    };
    
    inventario.push(nuevoProducto);
    renderTable();
    
    // Limpiar formulario
    const formFields = ['newNombre', 'newCantidad', 'newCantidadMinima', 'newUnidad', 'newPrecio', 'newProveedor'];
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) field.value = '';
    });
    
    // Restaurar valor por defecto para cantidad mínima
    document.getElementById('newCantidadMinima').value = '2';
    
    toggleAddForm();
    
    // Guardar en localStorage
    saveToLocalStorage();
    
    // Mostrar mensaje de éxito
    showNotification('Producto agregado exitosamente', 'success');
}

/**
 * Ordena la tabla por la columna especificada
 * @param {number} columnIndex - Índice de la columna a ordenar
 */
function sortTable(columnIndex) {
    const table = document.getElementById('inventoryTable');
    if (!table) return;
    
    const tbody = table.getElementsByTagName('tbody')[0];
    if (!tbody) return;
    
    const rows = Array.from(tbody.rows);
    
    rows.sort((a, b) => {
        let aVal = a.cells[columnIndex].textContent.trim();
        let bVal = b.cells[columnIndex].textContent.trim();
        
        // Si es numérico, comparar como números
        if (!isNaN(aVal) && !isNaN(bVal)) {
            return parseFloat(aVal) - parseFloat(bVal);
        }
        
        return aVal.localeCompare(bVal);
    });
    
    rows.forEach(row => tbody.appendChild(row));
}

/**
 * Muestra el resumen por área
 */
function showSummary() {
    const summaryBox = document.getElementById('summaryBox');
    const summaryContent = document.getElementById('summaryContent');
    
    if (!summaryBox || !summaryContent) return;
    
    const areas = {};
    inventario.forEach(item => {
        if (!areas[item.area]) {
            areas[item.area] = { total: 0, stockBajo: 0 };
        }
        areas[item.area].total++;
        const cantidadMinima = item.cantidadMinima || 2;
        if (item.cantidad <= cantidadMinima) areas[item.area].stockBajo++;
    });
    
    let html = '<table style="width: 100%;"><tr><th>Área</th><th>Total Productos</th><th>Stock Bajo</th><th>Porcentaje OK</th></tr>';
    
    for (const [area, stats] of Object.entries(areas)) {
        const porcentajeOk = ((stats.total - stats.stockBajo) / stats.total * 100).toFixed(1);
        html += `<tr>
            <td>${getAreaBadge(area)}</td>
            <td>${stats.total}</td>
            <td>${stats.stockBajo}</td>
            <td>${porcentajeOk}%</td>
        </tr>`;
    }
    
    html += '</table>';
    summaryContent.innerHTML = html;
    summaryBox.classList.toggle('hidden');
}

/**
 * Exporta los datos a un archivo CSV optimizado para Excel
 */
function exportData() {
    try {
        // BOM para UTF-8 (para que Excel reconozca correctamente los caracteres especiales)
        let csv = '\uFEFF';
        
        // Encabezados con formato mejorado
        csv += 'CODIGO,NOMBRE,AREA,CANTIDAD,CANTIDAD_MINIMA,UNIDAD,PRECIO_COMPRA,UBICACION,PROVEEDOR,CONTACTO,FECHA_ENTRADA,ALERTA,DIAS_EN_STOCK\n';
        
        inventario.forEach(item => {
            const cantidadMinima = item.cantidadMinima || 2;
            const alerta = item.cantidad <= cantidadMinima ? 'STOCK BAJO' : 'OK';
            const dias = calcularDiasEnStock(item.fecha);
            
            // Limpiar y formatear datos para Excel
            const codigo = item.codigo || '';
            const nombre = (item.nombre || '').replace(/"/g, '""'); // Escapar comillas
            const area = item.area || '';
            const cantidad = item.cantidad || 0;
            const unidad = (item.unidad || '').replace(/"/g, '""');
            const precio = item.precio || '';
            const ubicacion = (item.ubicacion || '').replace(/"/g, '""');
            const proveedor = (item.proveedor || '').replace(/"/g, '""');
            const contacto = (item.contacto || '').replace(/"/g, '""');
            const fecha = item.fecha || '';
            const diasStock = dias.replace(/"/g, '""');
            
            // Formato CSV con comillas para todos los campos de texto
            const precioFormateado = precio ? `"${precio}"` : '""';
            csv += `${codigo},"${nombre}","${area}",${cantidad},${cantidadMinima},"${unidad}",${precioFormateado},"${ubicacion}","${proveedor}","${contacto}","${fecha}","${alerta}","${diasStock}"\n`;
        });
        
        // Crear archivo con codificación UTF-8
        const blob = new Blob([csv], { 
            type: 'text/csv;charset=utf-8;' 
        });
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        
        // Nombre de archivo con fecha y hora
        const now = new Date();
        const fecha = now.toISOString().split('T')[0];
        const hora = now.toTimeString().split(' ')[0].replace(/:/g, '-');
        a.download = `Inventario_${fecha}_${hora}.csv`;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showNotification('Archivo Excel descargado exitosamente', 'success');
    } catch (error) {
        console.error('Error al exportar datos:', error);
        showNotification('Error al exportar datos', 'error');
    }
}

/**
 * Guarda los datos en localStorage
 */
function saveToLocalStorage() {
    try {
        localStorage.setItem('inventario', JSON.stringify(inventario));
        localStorage.setItem('nextCode', nextCode.toString());
    } catch (error) {
        console.error('Error al guardar en localStorage:', error);
    }
}

/**
 * Carga los datos desde localStorage
 */
function loadFromLocalStorage() {
    try {
        const savedInventario = localStorage.getItem('inventario');
        const savedNextCode = localStorage.getItem('nextCode');
        
        if (savedInventario) {
            inventario = JSON.parse(savedInventario);
        }
        
        if (savedNextCode) {
            nextCode = parseInt(savedNextCode);
        }
    } catch (error) {
        console.error('Error al cargar desde localStorage:', error);
    }
}

/**
 * Muestra una notificación al usuario
 * @param {string} message - Mensaje a mostrar
 * @param {string} type - Tipo de notificación ('success', 'error', 'info')
 */
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 4px;
        color: white;
        font-weight: bold;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    // Colores según el tipo
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#4CAF50';
            break;
        case 'error':
            notification.style.backgroundColor = '#f44336';
            break;
        default:
            notification.style.backgroundColor = '#2196F3';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

/**
 * Muestra/oculta la sección de gestión de proveedores
 */
function toggleProviderForm() {
    const providerSection = document.getElementById('providerSection');
    if (providerSection) {
        providerSection.classList.toggle('hidden');
        
        // Si se está mostrando, cargar la lista de proveedores
        if (!providerSection.classList.contains('hidden')) {
            renderProvidersTable();
            updateProviderSelect();
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
    
    proveedores.forEach(provider => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${provider.nombre}</td>
            <td>${provider.rfc || 'N/A'}</td>
            <td>${provider.telefono || 'N/A'}</td>
            <td>${provider.email || 'N/A'}</td>
            <td>${provider.contacto || 'N/A'}</td>
            <td>
                <button class="btn" onclick="editProvider(${provider.id})" style="background: #2196F3; color: white; padding: 3px 8px; margin-right: 5px;"><i class="fas fa-edit"></i></button>
                <button class="btn" onclick="deleteProvider(${provider.id})" style="background: #f44336; color: white; padding: 3px 8px;"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * Actualiza el selector de proveedores en el formulario de productos
 */
function updateProviderSelect() {
    const select = document.getElementById('newProveedor');
    if (!select) return;
    
    // Guardar el valor actual
    const currentValue = select.value;
    
    // Limpiar opciones existentes (excepto la primera)
    select.innerHTML = '<option value="">Seleccionar proveedor...</option>';
    
    // Agregar proveedores
    proveedores.forEach(provider => {
        const option = document.createElement('option');
        option.value = provider.id;
        option.textContent = provider.nombre;
        select.appendChild(option);
    });
    
    // Restaurar el valor seleccionado si existe
    if (currentValue) {
        select.value = currentValue;
    }
}

/**
 * Actualiza la información del proveedor seleccionado
 */
function updateProviderInfo() {
    const select = document.getElementById('newProveedor');
    const infoRow = document.getElementById('providerInfoRow');
    const infoDiv = document.getElementById('providerInfo');
    
    if (!select || !infoRow || !infoDiv) return;
    
    const providerId = parseInt(select.value);
    const provider = proveedores.find(p => p.id === providerId);
    
    if (provider) {
        infoDiv.innerHTML = `
            <strong><i class="fas fa-truck"></i> ${provider.nombre}</strong><br>
            <i class="fas fa-phone"></i> ${provider.telefono || 'N/A'} | 
            <i class="fas fa-envelope"></i> ${provider.email || 'N/A'}<br>
            <i class="fas fa-user"></i> ${provider.contacto || 'N/A'} | 
            <i class="fas fa-id-card"></i> ${provider.rfc || 'N/A'}
        `;
        infoRow.style.display = 'table-row';
    } else {
        infoRow.style.display = 'none';
    }
}

/**
 * Agrega un nuevo proveedor
 */
function addProvider() {
    const nombre = document.getElementById('providerNombre')?.value?.trim();
    const rfc = document.getElementById('providerRFC')?.value?.trim();
    const telefono = document.getElementById('providerTelefono')?.value?.trim();
    const email = document.getElementById('providerEmail')?.value?.trim();
    const direccion = document.getElementById('providerDireccion')?.value?.trim();
    const contacto = document.getElementById('providerContacto')?.value?.trim();
    
    if (!nombre) {
        alert('Por favor ingresa el nombre del proveedor');
        return;
    }
    
    // Verificar si ya existe un proveedor con el mismo nombre
    if (proveedores.some(p => p.nombre.toLowerCase() === nombre.toLowerCase())) {
        alert('Ya existe un proveedor con ese nombre');
        return;
    }
    
    const nuevoProveedor = {
        id: nextProviderId++,
        nombre: nombre,
        rfc: rfc || '',
        telefono: telefono || '',
        email: email || '',
        direccion: direccion || '',
        contacto: contacto || ''
    };
    
    proveedores.push(nuevoProveedor);
    renderProvidersTable();
    updateProviderSelect();
    clearProviderForm();
    
    // Guardar en localStorage
    saveProvidersToLocalStorage();
    
    showNotification('Proveedor agregado exitosamente', 'success');
}

/**
 * Limpia el formulario de proveedores
 */
function clearProviderForm() {
    const fields = ['providerNombre', 'providerRFC', 'providerTelefono', 'providerEmail', 'providerDireccion', 'providerContacto'];
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) field.value = '';
    });
}

/**
 * Edita un proveedor existente
 */
function editProvider(providerId) {
    const provider = proveedores.find(p => p.id === providerId);
    if (!provider) return;
    
    // Llenar el formulario con los datos del proveedor
    document.getElementById('providerNombre').value = provider.nombre;
    document.getElementById('providerRFC').value = provider.rfc;
    document.getElementById('providerTelefono').value = provider.telefono;
    document.getElementById('providerEmail').value = provider.email;
    document.getElementById('providerDireccion').value = provider.direccion;
    document.getElementById('providerContacto').value = provider.contacto;
    
    // Cambiar el botón de agregar por actualizar
    const addButton = document.querySelector('.provider-buttons .btn[onclick="addProvider()"]');
    if (addButton) {
        addButton.innerHTML = '<i class="fas fa-save"></i> Actualizar';
        addButton.onclick = () => updateProvider(providerId);
    }
    
    // Scroll al formulario
    document.querySelector('.provider-form').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Actualiza un proveedor existente
 */
function updateProvider(providerId) {
    const provider = proveedores.find(p => p.id === providerId);
    if (!provider) return;
    
    const nombre = document.getElementById('providerNombre')?.value?.trim();
    const rfc = document.getElementById('providerRFC')?.value?.trim();
    const telefono = document.getElementById('providerTelefono')?.value?.trim();
    const email = document.getElementById('providerEmail')?.value?.trim();
    const direccion = document.getElementById('providerDireccion')?.value?.trim();
    const contacto = document.getElementById('providerContacto')?.value?.trim();
    
    if (!nombre) {
        alert('Por favor ingresa el nombre del proveedor');
        return;
    }
    
    // Verificar si ya existe otro proveedor con el mismo nombre
    if (proveedores.some(p => p.id !== providerId && p.nombre.toLowerCase() === nombre.toLowerCase())) {
        alert('Ya existe otro proveedor con ese nombre');
        return;
    }
    
    // Actualizar los datos
    provider.nombre = nombre;
    provider.rfc = rfc || '';
    provider.telefono = telefono || '';
    provider.email = email || '';
    provider.direccion = direccion || '';
    provider.contacto = contacto || '';
    
    renderProvidersTable();
    updateProviderSelect();
    clearProviderForm();
    
    // Restaurar el botón de agregar
    const updateButton = document.querySelector('.provider-buttons .btn[onclick*="updateProvider"]');
    if (updateButton) {
        updateButton.innerHTML = '<i class="fas fa-check"></i> Agregar';
        updateButton.onclick = addProvider;
    }
    
    // Guardar en localStorage
    saveProvidersToLocalStorage();
    
    showNotification('Proveedor actualizado exitosamente', 'success');
}

/**
 * Elimina un proveedor
 */
function deleteProvider(providerId) {
    const provider = proveedores.find(p => p.id === providerId);
    if (!provider) return;
    
    // Verificar si el proveedor está siendo usado en productos
    const productosConProveedor = inventario.filter(item => item.proveedor === provider.nombre);
    if (productosConProveedor.length > 0) {
        alert(`No se puede eliminar el proveedor "${provider.nombre}" porque está siendo usado en ${productosConProveedor.length} producto(s).`);
        return;
    }
    
    if (confirm(`¿Estás seguro de eliminar el proveedor "${provider.nombre}"?`)) {
        proveedores = proveedores.filter(p => p.id !== providerId);
        renderProvidersTable();
        updateProviderSelect();
        
        // Guardar en localStorage
        saveProvidersToLocalStorage();
        
        showNotification('Proveedor eliminado exitosamente', 'success');
    }
}

/**
 * Guarda los proveedores en localStorage
 */
function saveProvidersToLocalStorage() {
    try {
        localStorage.setItem('proveedores', JSON.stringify(proveedores));
        localStorage.setItem('nextProviderId', nextProviderId.toString());
    } catch (error) {
        console.error('Error al guardar proveedores en localStorage:', error);
    }
}

/**
 * Carga los proveedores desde localStorage
 */
function loadProvidersFromLocalStorage() {
    try {
        const savedProveedores = localStorage.getItem('proveedores');
        const savedNextProviderId = localStorage.getItem('nextProviderId');
        
        if (savedProveedores) {
            proveedores = JSON.parse(savedProveedores);
        }
        
        if (savedNextProviderId) {
            nextProviderId = parseInt(savedNextProviderId);
        }
    } catch (error) {
        console.error('Error al cargar proveedores desde localStorage:', error);
    }
}

/**
 * Formatea el campo de precio como moneda
 * @param {HTMLInputElement} input - Campo de entrada
 */
function formatCurrency(input) {
    // Remover todo excepto números y punto decimal
    let value = input.value.replace(/[^\d.]/g, '');
    
    // Evitar múltiples puntos decimales
    const parts = value.split('.');
    if (parts.length > 2) {
        value = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Limitar a 2 decimales
    if (parts.length === 2 && parts[1].length > 2) {
        value = parts[0] + '.' + parts[1].substring(0, 2);
    }
    
    input.value = value;
}

/**
 * Valida y formatea el campo de precio al perder el foco
 * @param {HTMLInputElement} input - Campo de entrada
 */
function validateCurrency(input) {
    let value = input.value.trim();
    
    if (value === '') {
        input.value = '';
        return;
    }
    
    // Convertir a número
    const numValue = parseFloat(value);
    
    if (isNaN(numValue) || numValue < 0) {
        input.value = '';
        return;
    }
    
    // Formatear con 2 decimales
    input.value = numValue.toFixed(2);
}

/**
 * Formatea un número como moneda para mostrar
 * @param {string|number} value - Valor a formatear
 * @returns {string} Valor formateado como moneda
 */
function formatDisplayCurrency(value) {
    if (!value || value === '') return '';
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return '';
    
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(numValue);
}

/**
 * Limpia el campo de búsqueda
 */
function clearSearch() {
    const searchBox = document.getElementById('searchBox');
    if (searchBox) {
        searchBox.value = '';
        renderTable(getCurrentFilteredData());
        searchBox.focus();
    }
}

/**
 * Inicializa la aplicación
 */
function initializeApp() {
    // Cargar datos guardados
    loadFromLocalStorage();
    loadProvidersFromLocalStorage();
    
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
    
    console.log('Sistema de Inventario inicializado correctamente');
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
