require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { initCron } = require('./jobs/scheduler');
const { getLatest } = require('./utils/db'); 
const { getWeatherBikeCorrelation, getAirQualityAnomaly } = require('./services/analyticsService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Endpoints DB
app.get('/api/weather/current', async (req, res) => { const d = await getLatest('weather'); d ? res.json(d) : res.status(404).json({error:"Cargando..."}); });
app.get('/api/environment/current', async (req, res) => { const d = await getLatest('environment'); d ? res.json(d) : res.status(404).json({error:"Cargando..."}); });
app.get('/api/traffic/current', async (req, res) => { const d = await getLatest('traffic'); d ? res.json(d) : res.status(404).json({error:"Cargando..."}); });
app.get('/api/bizi/current', async (req, res) => { const d = await getLatest('bizi'); d ? res.json(d) : res.status(404).json({error:"Cargando..."}); });
app.get('/api/parking/current', async (req, res) => { const d = await getLatest('parking'); d ? res.json(d) : res.status(404).json({error:"Cargando..."}); });
app.get('/api/works/current', async (req, res) => { const d = await getLatest('works'); d ? res.json(d) : res.status(404).json({error:"Cargando..."}); });

// Endpoints Analytics
app.get('/api/analytics/anomaly', async (req, res) => res.json(await getAirQualityAnomaly()));
app.get('/api/analytics/correlation', async (req, res) => res.json(await getWeatherBikeCorrelation()));

app.listen(PORT, () => {
    console.log(`🚀 Server en http://localhost:${PORT}`);
    initCron(); 
});