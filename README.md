# 🏙️ Zaragoza Urban Brain

<div align="center">

![Estado](https://img.shields.io/badge/Estado-Activo-success)
![Versión](https://img.shields.io/badge/Versión-1.0.0-blue)
![Node](https://img.shields.io/badge/Node.js-v18+-green)
![Licencia](https://img.shields.io/badge/Licencia-ISC-yellow)

**Plataforma de Monitorización Urbana en Tiempo Real para Zaragoza**

[Características](#-características) • [Instalación](#-instalación) • [Uso](#-uso) • [API](#-documentación-api) • [Estructura](#-estructura-del-proyecto)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Capturas de Pantalla](#-capturas-de-pantalla)
- [Tecnologías](#-tecnologías-utilizadas)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Base de Datos](#-configuración-de-base-de-datos)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Documentación API](#-documentación-api)
- [Servicios Integrados](#-servicios-integrados)
- [Sistema de Análisis](#-sistema-de-análisis-inteligente)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)
- [Contacto](#-contacto)

---

## 🎯 Descripción

**Zaragoza Urban Brain** es una plataforma web de monitorización integral urbana que recopila, procesa y visualiza datos en tiempo real sobre diversos aspectos de la ciudad de Zaragoza:

- 🌤️ **Meteorología** (temperatura, humedad, viento)
- 🍃 **Calidad del aire** (PM2.5, PM10, NO2)
- ☀️ **Radiación solar y UV**
- 🌼 **Niveles de polen**
- 🚗 **Tráfico en tiempo real** (incidencias y retenciones)
- 🚲 **Disponibilidad de bicicletas Bizi**
- 🅿️ **Ocupación de parkings públicos**
- 🚧 **Obras y afecciones viarias**

El sistema utiliza un dashboard interactivo con mapa georreferenciado, actualizaciones automáticas cada 15 minutos mediante un cronjob, y un sistema de análisis inteligente que detecta anomalías y patrones.

---

## ✨ Características

### 🎨 **Interfaz de Usuario**
- Dashboard oscuro y moderno inspirado en Gemini Dark
- Diseño responsive con grid layout de 3 columnas
- Mapa interactivo con Leaflet.js y capas Esri Dark Gray
- Visualización en tiempo real de todos los datos urbanos
- Indicadores de estado con colores semánticos (verde/amarillo/rojo)

### 🔄 **Sistema de Recolección Automática**
- Cronjob programado cada 15 minutos
- Recolección paralela de 6 fuentes de datos diferentes
- Sistema de rate limiting para respetar límites de APIs
- Fallback con datos simulados cuando las APIs no están disponibles
- Almacenamiento persistente en PostgreSQL

### 🧠 **Análisis Inteligente**
- Detección de anomalías en calidad del aire
- Análisis de correlación entre clima y uso de bicicletas
- Alertas automáticas cuando se superan umbrales

### 🗺️ **Visualización Geoespacial**
- Marcadores de incidencias de tráfico en tiempo real
- Estaciones Bizi con estado visual (disponible/vacía)
- Ubicación de obras y afecciones viarias
- Leyenda interactiva y tooltips informativos

---

## 📸 Capturas de Pantalla

### Dashboard Principal

![Dashboard Principal](./public/images/dashboard-main.png)

**Características visibles:**
- Panel izquierdo con meteorología, calidad del aire y polen
- Mapa central con todos los marcadores georreferenciados
- Panel derecho con análisis, parking, Bizi y tráfico

---

### Mapa Interactivo

![Mapa Interactivo](./public/images/map-view.png)

**Elementos del mapa:**
- 🔴 Incidencias de tráfico (rojo)
- 🚧 Obras activas (emoji naranja)
- 🟢 Estaciones Bizi con bicis disponibles (verde)
- ⚪ Estaciones Bizi vacías (gris)

---

### Sección de Análisis

![Análisis Urbano](./public/images/analytics-panel.png)

**Análisis mostrado:**
- Detección de anomalías en PM2.5
- Correlación clima/bicicletas
- Estado de alerta visual

---

## 🛠️ Tecnologías Utilizadas

### Backend
- **Node.js** v18+ - Runtime de JavaScript
- **Express.js** v5.2.1 - Framework web
- **PostgreSQL** - Base de datos relacional
- **node-cron** - Programación de tareas
- **Axios** - Cliente HTTP para APIs
- **dotenv** - Gestión de variables de entorno

### Frontend
- **HTML5/CSS3** - Estructura y estilos
- **JavaScript (Vanilla)** - Lógica del cliente
- **Leaflet.js** v1.9.4 - Mapas interactivos
- **Google Fonts** - Inter & JetBrains Mono

### APIs Externas
- **OpenWeather API** - Datos meteorológicos
- **TomTom Traffic API** - Información de tráfico
- **Ayuntamiento de Zaragoza APIs** - Bizi, parkings, obras
- **Supabase PostgreSQL** - Base de datos en la nube

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 18 o superior)
- **npm** (viene con Node.js)
- **PostgreSQL** (local o en la nube, ej: Supabase)
- **Git** (para clonar el repositorio)

### Verificar instalaciones:

```bash
node --version   # Debería mostrar v18.x.x o superior
npm --version    # Debería mostrar v9.x.x o superior
git --version    # Debería mostrar v2.x.x o superior
```

---

## 🚀 Instalación

### Paso 1: Clonar el Repositorio

```bash
git clone https://github.com/cnywu0/zaragoza-urban-api.git
cd zaragoza-urban-api
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

Esto instalará todas las dependencias listadas en `package.json`:
- axios
- cors
- dotenv
- express
- node-cron
- pg

### Paso 3: Configurar Variables de Entorno

Copia el archivo de ejemplo y edítalo con tus credenciales:

```bash
cp .env.example .env
```

Edita el archivo `.env` y completa las siguientes variables:

```env
# Configuración del servidor
PORT=3000

# APIs externas (obtén tus claves gratuitas)
OPENWEATHER_API_KEY=tu_clave_aqui
AEMET_API_KEY=tu_clave_aqui
TOMTOM_API_KEY=tu_clave_aqui

# Base de datos PostgreSQL
DATABASE_URL=postgresql://usuario:contraseña@host:puerto/basedatos
```

---

## 🔑 Configuración

### Obtener Claves de API (GRATIS)

#### 1. OpenWeather API
1. Regístrate en [OpenWeatherMap](https://home.openweathermap.org/users/sign_up)
2. Ve a [API Keys](https://home.openweathermap.org/api_keys)
3. Copia tu clave y pégala en `.env`

#### 2. TomTom Traffic API
1. Crea una cuenta en [TomTom Developer Portal](https://developer.tomtom.com/)
2. Ve a tu Dashboard
3. Crea una nueva aplicación
4. Copia la clave de API y pégala en `.env`

#### 3. AEMET (Opcional)
1. Regístrate en [AEMET OpenData](https://opendata.aemet.es/centrodedescargas/inicio)
2. Solicita tu API Key
3. Recibirás la clave por email

**Nota:** Las APIs del Ayuntamiento de Zaragoza (Bizi, Parking, Obras) son públicas y no requieren clave.

---

## 🗄️ Configuración de Base de Datos

### Opción 1: Supabase (Recomendado - Gratis)

1. Crea una cuenta en [Supabase](https://supabase.com)
2. Crea un nuevo proyecto
3. Ve a Settings → Database
4. Copia la "Connection String" (modo Pooling)
5. Pégala en `.env` como `DATABASE_URL`

### Opción 2: PostgreSQL Local

```bash
# Instalar PostgreSQL
sudo apt-get install postgresql  # Linux
brew install postgresql          # macOS

# Crear base de datos
createdb zaragoza_urban_db
```

### Crear Tablas

Ejecuta el siguiente SQL en tu base de datos:

```sql
-- Tabla de logs meteorológicos
CREATE TABLE weather_logs (
    id SERIAL PRIMARY KEY,
    temp DECIMAL(5,2),
    humidity INTEGER,
    wind_speed DECIMAL(5,2),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de calidad del aire y medio ambiente
CREATE TABLE environment_logs (
    id SERIAL PRIMARY KEY,
    pm25 DECIMAL(5,2),
    pm10 DECIMAL(5,2),
    no2 DECIMAL(5,2),
    uv_index DECIMAL(3,1),
    radiation DECIMAL(6,2),
    pollen_grass INTEGER DEFAULT 0,
    pollen_olive INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de tráfico
CREATE TABLE traffic_logs (
    id SERIAL PRIMARY KEY,
    total_incidents INTEGER,
    severity_summary TEXT,
    incidents_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Bizi
CREATE TABLE bizi_logs (
    id SERIAL PRIMARY KEY,
    total_available INTEGER,
    stations_active INTEGER,
    stations_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de parking
CREATE TABLE parking_logs (
    id SERIAL PRIMARY KEY,
    avg_occupancy DECIMAL(5,2),
    total_parkings INTEGER,
    parking_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de obras
CREATE TABLE works_logs (
    id SERIAL PRIMARY KEY,
    active_works INTEGER,
    works_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_weather_created ON weather_logs(created_at DESC);
CREATE INDEX idx_environment_created ON environment_logs(created_at DESC);
CREATE INDEX idx_traffic_created ON traffic_logs(created_at DESC);
CREATE INDEX idx_bizi_created ON bizi_logs(created_at DESC);
CREATE INDEX idx_parking_created ON parking_logs(created_at DESC);
CREATE INDEX idx_works_created ON works_logs(created_at DESC);
```

---

## 🎮 Uso

### Modo Desarrollo (con auto-reload)

```bash
npm run dev
```

Este comando usa `nodemon` para reiniciar automáticamente el servidor cuando detecta cambios.

### Modo Producción

```bash
npm start
```

### Acceder a la Aplicación

Abre tu navegador y visita:

```
http://localhost:3000
```

### Verificar que Funciona

Deberías ver en la consola:

```
🚀 Server en http://localhost:3000
🕰️ Cronjob DB iniciado.
⚡ [CRON] Recolectando... [hora actual]
🌤️ Consultando OpenWeather...
🚗 Consultando TomTom...
🚲 Consultando Bizi...
🍃 Consultando Medio Ambiente...
🅿️ Consultando Parkings...
🚧 Consultando Obras...
   💾 [DB] Weather guardado.
   💾 [DB] Environment guardado.
   ...
```

---

## 📁 Estructura del Proyecto

```
zaragoza-urban-api/
│
├── 📄 .env                      # Variables de entorno (NO subir a Git)
├── 📄 .env.example              # Ejemplo de variables de entorno
├── 📄 .gitignore                # Archivos ignorados por Git
├── 📄 LICENSE                   # Licencia del proyecto
├── 📄 package.json              # Dependencias y scripts
├── 📄 package-lock.json         # Versiones exactas de dependencias
├── 📄 README.md                 # Este archivo
├── 📄 request_logs.json         # Logs de rate limiting (auto-generado)
│
├── 📁 node_modules/             # Dependencias (auto-generado)
│
├── 📁 public/                   # Archivos estáticos del frontend
│   ├── 📄 index.html            # Página principal
│   ├── 📁 css/
│   │   └── 📄 styles.css        # Estilos del dashboard
│   └── 📁 js/
│       └── 📄 dashboard.js      # Lógica del frontend y mapa
│
└── 📁 src/                      # Código fuente del backend
    ├── 📄 app.js                # Servidor Express y endpoints API
    │
    ├── 📁 jobs/
    │   └── 📄 scheduler.js      # Cronjob de recolección automática
    │
    ├── 📁 services/             # Servicios de recolección de datos
    │   ├── 📄 analyticsService.js    # Análisis y detección de anomalías
    │   ├── 📄 biziService.js         # Servicio Bizi (bicicletas)
    │   ├── 📄 environmentService.js  # Calidad aire/polen/radiación
    │   ├── 📄 parkingService.js      # Estado de parkings públicos
    │   ├── 📄 trafficService.js      # Tráfico e incidencias (TomTom)
    │   ├── 📄 weatherService.js      # Meteorología (OpenWeather)
    │   └── 📄 worksService.js        # Obras y afecciones viarias
    │
    └── 📁 utils/                # Utilidades y helpers
        ├── 📄 db.js             # Conexión y operaciones con PostgreSQL
        └── 📄 requestLimiter.js # Sistema de rate limiting
```

---

## 🌐 Documentación API

La API REST proporciona endpoints para consultar los datos más recientes de cada categoría.

### Base URL
```
http://localhost:3000/api
```

### Endpoints Principales

#### 1. Meteorología

**GET** `/api/weather/current`

Retorna los datos meteorológicos más recientes.

**Respuesta:**
```json
{
  "temperature": 12.5,
  "humidity": 65,
  "wind_speed": 3.2,
  "description": "cielo claro",
  "timestamp": "2025-02-03T10:30:00.000Z"
}
```

---

#### 2. Medio Ambiente

**GET** `/api/environment/current`

Retorna calidad del aire, radiación solar y niveles de polen.

**Respuesta:**
```json
{
  "air_quality": {
    "pm2_5": 8.5,
    "pm10": 15.2,
    "no2": 5.3
  },
  "solar": {
    "uv_index": 2.1,
    "radiation": 245.8
  },
  "pollen": {
    "grass": 0,
    "olive": 0,
    "birch": 5,
    "mugwort": 0
  }
}
```

---

#### 3. Tráfico

**GET** `/api/traffic/current`

Retorna incidencias de tráfico en tiempo real.

**Respuesta:**
```json
{
  "total_incidents": 3,
  "incidents": [
    {
      "streetName": "Paseo Independencia -> Gran Vía",
      "type": "Incidencia",
      "description": "Retención",
      "severity": "Leve",
      "coordinates": [-0.8891, 41.6488]
    }
  ]
}
```

---

#### 4. Bizi (Bicicletas)

**GET** `/api/bizi/current`

Retorna disponibilidad de bicicletas Bizi.

**Respuesta:**
```json
{
  "total_bikes_available": 487,
  "stations": [
    {
      "id": 1,
      "address": "Plaza España",
      "bikes_available": 12,
      "coordinates": [-0.8891, 41.6488]
    }
  ]
}
```

---

#### 5. Parking

**GET** `/api/parking/current`

Retorna ocupación de parkings públicos.

**Respuesta:**
```json
{
  "average_occupancy": 72.5,
  "parkings": [
    {
      "name": "Pza. España",
      "spots_total": 400,
      "spots_free": 85,
      "occupancy_percentage": 78.8
    }
  ]
}
```

---

#### 6. Obras

**GET** `/api/works/current`

Retorna obras y afecciones viarias activas.

**Respuesta:**
```json
{
  "works": [
    {
      "id": "1234",
      "title": "Obras en Calle Mayor",
      "description": "Renovación de aceras",
      "link": "https://www.zaragoza.es/...",
      "coordinates": [-0.8891, 41.6488]
    }
  ]
}
```

---

#### 7. Análisis - Anomalías

**GET** `/api/analytics/anomaly`

Detecta anomalías en la calidad del aire.

**Respuesta:**
```json
{
  "type": "anomaly",
  "target": "PM2.5",
  "current_value": 18.2,
  "threshold": 15,
  "status": "ALERT",
  "message": "⚠️ Alerta: Aire sucio (18.2 µg/m³)."
}
```

---

#### 8. Análisis - Correlaciones

**GET** `/api/analytics/correlation`

Analiza patrones entre clima y uso de bicicletas.

**Respuesta:**
```json
{
  "type": "correlation",
  "analysis": "Impacto Lluvia vs Bici",
  "result": {
    "conclusion": "📉 El uso de Bizi cae un 18% con lluvia ligera."
  }
}
```

---

## 🔌 Servicios Integrados

### 1. **weatherService.js**
- Consulta OpenWeather API cada 10 minutos
- Obtiene temperatura, humedad, velocidad del viento y descripción
- Datos en español para Zaragoza

### 2. **trafficService.js**
- Integración con TomTom Traffic API cada 15 minutos
- Bbox configurado para Zaragoza: `[-0.975, 41.605, -0.800, 41.700]`
- Clasifica incidencias por severidad (Grave/Leve)

### 3. **biziService.js**
- Consulta API pública del Ayuntamiento cada 5 minutos
- Filtra estaciones con coordenadas válidas (evita `[0,0]`)
- Obtiene hasta 300 estaciones activas

### 4. **parkingService.js**
- Consulta datos de parkings públicos
- Calcula porcentaje de ocupación automáticamente
- Fallback con simulación si la API falla

### 5. **worksService.js**
- Obtiene obras y accidentes de tráfico cada 60 minutos
- Filtra por distancia (500m) y coordenadas válidas

### 6. **environmentService.js**
- Simula sensores de calidad del aire, radiación UV y polen
- Preparado para integrar APIs reales en el futuro
- Valores ajustados por temporada (invierno)

### 7. **analyticsService.js**
- **Detección de anomalías:** Alerta si PM2.5 > 15 µg/m³
- **Análisis de correlación:** Estudia impacto del clima en Bizi
- Base para futuros modelos de ML

---

## 🧠 Sistema de Análisis Inteligente

### Detección de Anomalías

El sistema monitoriza continuamente la calidad del aire:

```javascript
// Umbral de alerta
if (pm2_5 > 15) {
  status = "ALERT"
  message = "⚠️ Alerta: Aire sucio"
}
```

### Análisis de Patrones

Estudia correlaciones históricas:
- Uso de bicicletas vs condiciones meteorológicas
- Ocupación de parkings vs eventos en la ciudad
- Preparado para machine learning futuro

---

## 🛡️ Sistema de Rate Limiting

El archivo `requestLimiter.js` controla la frecuencia de llamadas a APIs externas:

| API | Intervalo Mínimo |
|-----|------------------|
| OpenWeather | 10 minutos |
| TomTom Traffic | 15 minutos |
| Zaragoza Bizi | 5 minutos |
| Environment Sensors | 30 minutos |
| Zaragoza Parking | 10 minutos |
| Zaragoza Works | 60 minutos |

Esto previene:
- ❌ Exceder límites de APIs gratuitas
- ❌ Consumo innecesario de recursos
- ❌ Bloqueos por rate limiting

---

## 🎨 Personalización

### Cambiar Tema Visual

Edita las variables CSS en `public/css/styles.css`:

```css
:root {
    --bg-body: #131314;          /* Fondo principal */
    --bg-card: #1e1f20;          /* Fondo de cards */
    --text-primary: #e3e3e3;     /* Texto principal */
    --accent-blue: #a8c7fa;      /* Acento azul */
    --success: #6dd58c;          /* Verde éxito */
    --warning: #fdc365;          /* Naranja advertencia */
    --danger: #f28b82;           /* Rojo peligro */
}
```

### Modificar Intervalo del Cronjob

Edita `src/jobs/scheduler.js`:

```javascript
// Cada 15 minutos (por defecto)
cron.schedule('*/15 * * * *', runTask);

// Alternativas:
// Cada 5 minutos:  '*/5 * * * *'
// Cada hora:       '0 * * * *'
// Cada día a las 6am: '0 6 * * *'
```

### Añadir Nuevas Fuentes de Datos

1. Crea un nuevo servicio en `src/services/`
2. Añade función de fetch con rate limiting
3. Crea tabla en PostgreSQL
4. Actualiza `scheduler.js` para incluir el nuevo servicio
5. Añade endpoint en `app.js`
6. Actualiza el frontend en `dashboard.js`

---

## 📊 Monitorización

### Logs en Consola

El sistema muestra logs detallados:

```
⚡ [CRON] Recolectando... 10:45:30
🌤️ Consultando OpenWeather...
   ✅ OpenWeather: 12.5°C
🚗 Consultando TomTom...
   ✅ TomTom: 3 incidencias.
🚲 Consultando Bizi...
   🚲 137 estaciones activas y 487 bicis libres.
   💾 [DB] Bizi guardado.
```

### Archivo de Rate Limiting

`request_logs.json` registra la última consulta a cada API:

```json
{
  "OpenWeather": "2025-02-03T10:45:30.000Z",
  "TomTomTraffic": "2025-02-03T10:45:31.000Z",
  "ZaragozaBizi": "2025-02-03T10:45:32.000Z"
}
```

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to database"

**Causa:** URL de base de datos incorrecta o PostgreSQL no iniciado.

**Solución:**
1. Verifica que `DATABASE_URL` en `.env` sea correcto
2. Si usas PostgreSQL local: `sudo service postgresql start`
3. Si usas Supabase: verifica que el proyecto esté activo

---

### Error: "OpenWeather API error: 401"

**Causa:** Clave de API incorrecta o no activada.

**Solución:**
1. Verifica que `OPENWEATHER_API_KEY` en `.env` sea correcto
2. Espera 10 minutos tras crear la clave (activación automática)
3. Verifica en [OpenWeather Dashboard](https://home.openweathermap.org/api_keys)

---

### El mapa aparece negro

**Causa:** Problema con los tiles de Esri o zoom excesivo.

**Solución:**
Ya está solucionado en el código con `maxNativeZoom: 16`. Si persiste:
1. Limpia caché del navegador (Ctrl + Shift + R)
2. Verifica conexión a internet
3. Prueba otro proveedor de tiles en `dashboard.js`

---

### No aparecen estaciones Bizi

**Causa:** API de Zaragoza caída o filtro de coordenadas.

**Solución:**
1. Verifica en consola si hay error de red
2. El código filtra coordenadas `[0,0]` (estaciones de prueba)
3. Comprueba que `rows=300` en `biziService.js`

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Para contribuir:

### Flujo de Trabajo

1. **Fork** el repositorio
2. Crea una **rama** para tu feature:
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. **Commit** tus cambios:
   ```bash
   git commit -m "✨ Añadir nueva funcionalidad"
   ```
4. **Push** a tu rama:
   ```bash
   git push origin feature/nueva-funcionalidad
   ```
5. Abre un **Pull Request**

### Convenciones de Código

- Usa español para comentarios y variables
- Sigue el estilo de código existente
- Añade comentarios explicativos
- Prueba antes de hacer commit

### Ideas para Contribuir

- 🌍 Añadir soporte para otras ciudades
- 📱 Mejorar responsive en móviles
- 📈 Implementar gráficos históricos con Chart.js
- 🤖 Integrar modelos de machine learning
- 🔔 Sistema de notificaciones push
- 🌐 Internacionalización (i18n)

---

## 📜 Licencia

Este proyecto está bajo la Licencia **ISC**.

```
Copyright (c) 2025 [Nicolas Blasco]

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.
```

Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 📧 Contacto

**Desarrollador:** cnywu0

- 🐙 GitHub: [@cnywu0](https://github.com/cnywu0)
- 📧 Email: nicolaslol22@gmail.com
- 🌐 Web: [nblascodev.vercel.app](https://nblascodev.vercel.app/)

**Proyecto:** [github.com/cnywu0/zaragoza-urban-api](https://github.com/cnywu0/zaragoza-urban-api)

---

## 🙏 Agradecimientos

Este proyecto utiliza datos de:

- [OpenWeatherMap](https://openweathermap.org/) - Datos meteorológicos
- [TomTom](https://www.tomtom.com/) - Información de tráfico
- [Ayuntamiento de Zaragoza](https://www.zaragoza.es/sede/portal/datos-abiertos/) - Datos abiertos (Bizi, Parking, Obras)
- [Leaflet.js](https://leafletjs.com/) - Librería de mapas
- [Esri](https://www.esri.com/) - Tiles de mapa oscuro

---

## 📅 Roadmap

### Versión 1.1 (Q2 2025)
- [ ] Gráficos históricos con Chart.js
- [ ] Exportar datos a CSV/JSON
- [ ] Sistema de alertas por email
- [ ] PWA (Progressive Web App)

### Versión 1.2 (Q3 2025)
- [ ] Predicciones con Machine Learning
- [ ] API pública documentada con Swagger
- [ ] Dashboard de administración
- [ ] Tests automatizados (Jest)

### Versión 2.0 (Q4 2025)
- [ ] Soporte multi-ciudad
- [ ] App móvil nativa (React Native)
- [ ] Integración con redes sociales
- [ ] Sistema de gamificación

---

## 📚 Documentación Adicional

### Scripts NPM Disponibles

```bash
npm start       # Inicia el servidor en producción
npm run dev     # Inicia con nodemon (auto-reload)
```

### Variables de Entorno

| Variable | Tipo | Obligatoria | Descripción |
|----------|------|-------------|-------------|
| `PORT` | Number | No (3000) | Puerto del servidor |
| `OPENWEATHER_API_KEY` | String | Sí | Clave API OpenWeather |
| `TOMTOM_API_KEY` | String | Sí | Clave API TomTom |
| `AEMET_API_KEY` | String | No | Clave API AEMET (futuro) |
| `DATABASE_URL` | String | Sí | URL conexión PostgreSQL |

---

<div align="center">

**⭐ Si te ha gustado este proyecto, dale una estrella en GitHub ⭐**

Hecho con ❤️ por [Nicolas Blasco](https://github.com/cnywu0)

[⬆ Volver arriba](#-zaragoza-urban-brain)

</div>
