# Sistema de Control de Inventario

Sistema completo de gestión de inventario con funcionalidades avanzadas de control de stock, proveedores y salidas de productos, con base de datos PostgreSQL y API REST.

## 🚀 Características Principales

- **Gestión de Productos**: CRUD completo con base de datos PostgreSQL
- **Control de Stock**: Monitoreo de cantidades y alertas de stock bajo
- **Gestión de Proveedores**: Base de datos completa de proveedores
- **Registro de Salidas**: Control detallado con transacciones atómicas
- **Búsqueda Avanzada**: Filtros por área y búsqueda en tiempo real
- **Exportación de Datos**: Exportar inventario y salidas a CSV
- **Interfaz Responsiva**: Diseño moderno y profesional
- **Base de Datos**: PostgreSQL con Railway
- **API REST**: Backend con Express.js y transacciones

## 🏗️ Arquitectura

### Frontend
- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos y responsivos
- **JavaScript ES6+**: Lógica del cliente con actualizaciones optimistas
- **Font Awesome**: Iconografía profesional

### Backend
- **Node.js**: Runtime de JavaScript
- **Express.js**: Framework web
- **PostgreSQL**: Base de datos relacional
- **Railway**: Plataforma de despliegue

### Base de Datos
- **Tabla `productos`**: Inventario completo
- **Tabla `proveedores`**: Información de proveedores
- **Tabla `salidas`**: Historial de salidas
- **Transacciones**: Operaciones atómicas para integridad

## 🚀 Instalación y Uso

### Desarrollo Local

#### Requisitos
- Node.js 16+
- PostgreSQL (Railway)
- Navegador web moderno

#### Instalación
```bash
# Clonar el repositorio
git clone <tu-repositorio>
cd sistema-inventario

# Instalar dependencias
npm install

# Iniciar servidor
npm start
```

#### Uso Local
1. Ejecuta `npm start` para iniciar el servidor
2. Abre `index.html` en tu navegador
3. El sistema se conectará automáticamente a la base de datos

### Producción (Railway)

#### Despliegue
1. Conecta tu repositorio a Railway
2. Railway detectará automáticamente el proyecto Node.js
3. La base de datos PostgreSQL ya está configurada
4. El sistema se desplegará automáticamente

#### Configuración Automática
- **URL de API**: Se adapta automáticamente al dominio de Railway
- **Base de Datos**: Conecta automáticamente a PostgreSQL
- **Archivos Estáticos**: Se sirven automáticamente
- **CSP**: Configurado para funcionar en cualquier entorno

## ⌨️ Atajos de Teclado

- **Ctrl + F**: Enfocar barra de búsqueda
- **Ctrl + N**: Agregar nuevo producto
- **Ctrl + S**: Exportar datos a CSV
- **Escape**: Limpiar búsqueda o cerrar formularios

## 🎯 Áreas de Destino Disponibles

- **OFICINA**: Material de oficina y administrativo
- **LIMPIEZA**: Productos de limpieza y mantenimiento
- **TALLER**: Herramientas y materiales técnicos
- **ENFERMERIA**: Material médico y sanitario

## 🔧 Estructura del Proyecto

```
sistema-inventario/
├── index.html              # Página principal
├── styles.css              # Estilos CSS
├── script_complete.js      # Lógica JavaScript del cliente
├── server.js               # Servidor Express.js
├── database_config.js      # Configuración de PostgreSQL
├── package.json            # Dependencias Node.js
├── railway.json            # Configuración de Railway
├── railway_setup.sql       # Script de base de datos
└── README.md               # Documentación
```

## 🛡️ Seguridad y Rendimiento

### Transacciones Atómicas
- Operaciones "todo o nada" para salidas
- Integridad garantizada de los datos
- Rollback automático en caso de errores

### Actualizaciones Optimistas
- Interfaz responsiva sin recargas
- Actualizaciones locales instantáneas
- Sincronización automática con la base de datos

### Content Security Policy
- CSP configurado para seguridad
- Compatible con desarrollo y producción
- Permite recursos necesarios de forma segura

## 🚀 Características Técnicas

- **API REST**: Endpoints para CRUD completo
- **Transacciones**: Operaciones atómicas con PostgreSQL
- **Optimizaciones**: Actualizaciones locales para mejor rendimiento
- **Responsive**: Funciona en desktop y móvil
- **Escalable**: Arquitectura preparada para crecimiento

## 📄 Licencia

MIT License