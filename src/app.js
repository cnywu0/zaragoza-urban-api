require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

// --- IMPORTS DE SERVICIOS ---
// Nota: Como vamos a cambiar los servicios a JS, los importamos así:
const { fetchOpenWeather, fetchAEMET } = require('./services/weatherService');
const { fetchTraffic } = require('./services/trafficService');
const { fetchBizi } = require('./services/biziService');
const { fetchEnvironment } = require('./services/environmentService');
const { fetchParking } = require('./services/parkingService');
const { saveToJSON } = require('./utils/jsonDB');

// --- IMPORTS ANALYTICS ---
const { getWeatherBikeCorrelation, getAirQualityAnomaly } = require('./services/analyticsService');

const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

const DB_FILE = path.join(__dirname, '../data_storage.json');

// --- HELPER LECTURA ---
const readDB = () => {
    if (!fs.existsSync(DB_FILE)) return [];
    try {
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    } catch (error) {
        return [];
    }
};

const getLatest = (sourceName) => {
    const data = readDB();
    // Filtramos y cogemos el último
    const filtered = data.filter(d => d.source === sourceName);
    return filtered.length > 0 ? filtered[filtered.length - 1] : null;
};

// ==========================================
// RUTAS API
// ==========================================

// Clima
app.get('/api/weather/current', (req, res) => {
    const data = readDB();
    const result = data.filter(d => d.source === 'OpenWeather' || d.source === 'AEMET').pop();
    result ? res.json(result) : res.status(404).json({ error: "Cargando datos..." });
});

// Medio Ambiente
app.get('/api/environment/current', (req, res) => {
    const result = getLatest('EnvironmentSensors');
    result ? res.json(result) : res.status(404).json({ error: "Cargando datos..." });
});

// Tráfico
app.get('/api/traffic/current', (req, res) => {
    const data = readDB();
    const result = data.filter(d => d.source === 'TomTomTraffic' || d.source === 'ZaragozaTraffic').pop();
    result ? res.json(result) : res.status(404).json({ error: "Cargando datos..." });
});

// Bicis
app.get('/api/bizi/current', (req, res) => {
    const result = getLatest('ZaragozaBizi');
    result ? res.json(result) : res.status(404).json({ error: "Cargando datos..." });
});

// Parking
app.get('/api/parking/current', (req, res) => {
    const result = getLatest('ZaragozaParking');
    result ? res.json(result) : res.status(404).json({ error: "Cargando datos..." });
});

// Analytics
app.get('/api/analytics/correlation', (req, res) => {
    const analysis = getWeatherBikeCorrelation();
    res.json(analysis);
});

app.get('/api/analytics/anomaly', (req, res) => {
    const analysis = getAirQualityAnomaly();
    res.json(analysis);
});

// ==========================================
// CRON JOB
// ==========================================
const runTask = async () => {
    console.log(`⚡ [CRON] Recolectando datos: ${new Date().toLocaleTimeString()}`);
    
    try {
        const [ow, aemet, traffic, bizi, env, park] = await Promise.all([
            fetchOpenWeather(),
            fetchAEMET(),
            fetchTraffic(),
            fetchBizi(),
            fetchEnvironment(),
            fetchParking()
        ]);

        if (ow) saveToJSON(ow);
        if (aemet) saveToJSON(aemet);
        if (traffic) saveToJSON(traffic);
        if (bizi) saveToJSON(bizi);
        if (env) saveToJSON(env);
        if (park) saveToJSON(park);
    } catch (error) {
        console.error("Error en Cron:", error);
    }
};

cron.schedule('*/30 * * * *', runTask);

// ==========================================
// ARRANQUE
// ==========================================
app.listen(PORT, () => {
    console.log(`🚀 Servidor JS escuchando en: http://localhost:${PORT}`);
    runTask(); 
});