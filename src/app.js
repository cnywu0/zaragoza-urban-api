require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const { initCron } = require('./jobs/scheduler');
const { getWeatherBikeCorrelation, getAirQualityAnomaly } = require('./services/analyticsService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// DB Helpers locales para los endpoints
const DB_FILE = path.join(__dirname, '../data_storage.json');
const readDB = () => {
    if (!fs.existsSync(DB_FILE)) return [];
    try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8')); } catch { return []; }
};
const getLatest = (src) => {
    const data = readDB().filter(d => d.source === src);
    return data.length ? data[data.length - 1] : null;
};

// --- ENDPOINTS ---

app.get('/api/weather/current', (req, res) => {
    const data = readDB().filter(d => d.source === 'OpenWeather').pop();
    data ? res.json(data) : res.status(404).json({error: "Cargando..."});
});

app.get('/api/environment/current', (req, res) => {
    const data = getLatest('EnvironmentSensors');
    data ? res.json(data) : res.status(404).json({error: "Cargando..."});
});

app.get('/api/traffic/current', (req, res) => {
    const data = getLatest('TomTomTraffic');
    data ? res.json(data) : res.status(404).json({error: "Cargando..."});
});

app.get('/api/bizi/current', (req, res) => {
    const data = getLatest('ZaragozaBizi');
    data ? res.json(data) : res.status(404).json({error: "Cargando..."});
});

app.get('/api/parking/current', (req, res) => {
    const data = getLatest('ZaragozaParking');
    data ? res.json(data) : res.status(404).json({error: "Cargando..."});
});

// Analytics
app.get('/api/analytics/correlation', (req, res) => res.json(getWeatherBikeCorrelation()));
app.get('/api/analytics/anomaly', (req, res) => res.json(getAirQualityAnomaly()));

// --- ARRANQUE ---
app.listen(PORT, () => {
    console.log(`🚀 Servidor listo en: http://localhost:${PORT}`);
    initCron();
});