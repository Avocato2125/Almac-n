# Sistema de Control de Inventario

Un sistema completo de gestión de inventario desarrollado con HTML, CSS y JavaScript puro, diseñado para facilitar el control y administración de productos en almacén.

## 🚀 Características

### Funcionalidades Principales
- **Gestión de Productos**: Agregar, editar y eliminar productos del inventario
- **Gestión de Proveedores**: Sistema completo de gestión de proveedores con información detallada
- **Búsqueda y Filtrado Avanzado**: Barra de búsqueda moderna con filtrado por área
- **Control de Stock Inteligente**: Alertas automáticas con cantidad mínima personalizable por producto
- **Cálculo de Días en Stock**: Seguimiento del tiempo que los productos han estado en inventario
- **Exportación de Datos**: Descarga de inventario completo en formato CSV
- **Resumen por Áreas**: Estadísticas detalladas por área de almacén

### Áreas de Almacén
- **OFICINA**: Material de oficina y papelería
- **LIMPIEZA**: Productos de limpieza y mantenimiento
- **TALLER**: Herramientas y repuestos
- **ENFERMERIA**: Material médico y sanitario

## 📁 Estructura del Proyecto

```
Almacen/
├── index.html          # Archivo principal HTML
├── styles.css          # Estilos CSS separados
├── script.js           # Lógica JavaScript
├── codigo.html         # Archivo original (backup)
└── README.md           # Documentación
```

## 🛠️ Instalación y Uso

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- No requiere servidor web (funciona localmente)

### Instalación
1. Descarga todos los archivos en una carpeta
2. Abre `index.html` en tu navegador web
3. ¡Listo! El sistema está listo para usar

### Uso Básico

#### Agregar Productos
1. Haz clic en "**+ Agregar Producto**" o presiona `Ctrl+N`
2. Completa los campos requeridos (cada campo tiene su etiqueta identificativa):
   - **Nombre**: Nombre del producto
   - **Área**: Selecciona el área correspondiente
   - **Cantidad**: Número de unidades actuales
   - **Cantidad Mínima**: Límite para alerta de stock bajo (por defecto: 2)
   - **Unidad**: Tipo de unidad (PZ, CAJAS, etc.)
   - **Precio**: Precio de compra (formato automático de moneda)
   - **Proveedor**: Selecciona de la lista de proveedores registrados
3. Haz clic en "**✅ Agregar**"

#### Gestionar Proveedores
1. Haz clic en "**🚛 Proveedores**" en la barra de herramientas
2. **Agregar Proveedor**:
   - Completa los campos: Nombre, RFC, Teléfono, Email, Dirección, Contacto
   - Haz clic en "**✅ Agregar**"
3. **Editar Proveedor**: Haz clic en el botón azul de editar en la tabla
4. **Eliminar Proveedor**: Haz clic en el botón rojo de eliminar (solo si no está en uso)

#### Editar Productos
- Haz clic en el botón azul de editar (✏️) en la fila del producto
- Se abrirá el formulario con los datos actuales
- Modifica los campos necesarios y haz clic en "✅ Actualizar"
- Los cambios se guardan automáticamente

#### Buscar y Filtrar
- **Búsqueda**: Escribe en el campo de búsqueda para encontrar productos por nombre o código
- **Filtro por Área**: Usa el menú desplegable para mostrar solo productos de un área específica

#### Exportar Datos
- Haz clic en "**💾 Descargar CSV**" o presiona `Ctrl+S`
- Se descargará un archivo CSV con todos los datos del inventario
- El archivo está optimizado para abrirse correctamente en Excel

## ⌨️ Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Ctrl + F` | Enfocar campo de búsqueda |
| `Ctrl + N` | Agregar nuevo producto |
| `Ctrl + S` | Exportar datos a CSV |
| `Esc` | Limpiar búsqueda o cerrar formularios |

## 💾 Persistencia de Datos

El sistema utiliza **localStorage** del navegador para:
- Guardar automáticamente todos los cambios
- Mantener los datos entre sesiones
- Preservar el contador de códigos de productos
- Mantener la base de datos de proveedores
- Sincronizar información entre productos y proveedores

## 🎨 Características de Diseño

### Interfaz Estilo Excel
- Diseño familiar y profesional con iconos Font Awesome
- Tabla con filas alternadas para mejor legibilidad
- Colores distintivos por área de almacén
- Alertas visuales para stock bajo
- Iconos profesionales para todas las acciones y elementos

### Responsive Design
- Adaptable a diferentes tamaños de pantalla
- Optimizado para dispositivos móviles y tablets
- Interfaz intuitiva en todos los dispositivos

### Indicadores Visuales
- **Stock Bajo**: Fondo rojo para productos con ≤2 unidades
- **Badges de Área**: Colores distintivos para cada área con iconos específicos
- **Estadísticas**: Contadores en tiempo real en la barra superior con iconos
- **Iconos Profesionales**: Font Awesome para todas las acciones y elementos
- **Información de Proveedores**: Vista previa de datos del proveedor al seleccionarlo

## 🔧 Personalización

### Agregar Nuevas Áreas
Para agregar una nueva área de almacén:

1. **En `index.html`**:
   ```html
   <option value="NUEVA_AREA">NUEVA_AREA</option>
   ```

2. **En `styles.css`**:
   ```css
   .area-nueva_area { 
       background: #color_fondo; 
       color: #color_texto; 
   }
   ```

### Modificar Límite de Stock Bajo
En `script.js`, cambia la condición:
```javascript
const isLowStock = item.cantidad <= 2; // Cambiar el número 2
```

## 🐛 Solución de Problemas

### Los datos no se guardan
- Verifica que el navegador tenga habilitado localStorage
- Asegúrate de no estar en modo incógnito

### La tabla no se actualiza
- Recarga la página (F5)
- Verifica la consola del navegador para errores

### Problemas de exportación
- Verifica que el navegador permita descargas
- Asegúrate de tener permisos de escritura en la carpeta de descargas

## 📊 Datos de Ejemplo

El sistema incluye datos de ejemplo para las siguientes áreas:
- **OFICINA**: Ordenes de trabajo, hojas de colores, sobres, post-its, plumas
- **LIMPIEZA**: Fabuloso, cloro
- **TALLER**: Faros traseros, arrancador, focos H7
- **ENFERMERIA**: (Preparado para agregar productos médicos)

## 🔄 Actualizaciones Futuras

### Funcionalidades Planificadas
- [ ] Importación de datos desde CSV
- [ ] Historial de movimientos
- [ ] Alertas por email
- [ ] Códigos de barras
- [ ] Múltiples ubicaciones
- [ ] Reportes avanzados

## 📝 Licencia

Este proyecto es de uso libre para fines educativos y comerciales.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para contribuir:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

---

**Desarrollado con ❤️ para facilitar la gestión de inventarios**
