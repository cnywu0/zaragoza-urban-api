import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import fs from 'fs';
import path from 'path';

// --- IMPORTS DE SERVICIOS (SENSORES) ---
import { fetchOpenWeather, fetchAEMET } from './services/weatherService';
import { fetchTraffic } from './services/trafficService'; // TomTom
import { fetchBizi } from './services/biziService';
import { fetchEnvironment } from './services/environmentService';
import { fetchParking } from './services/parkingService';

// --- IMPORTS DE SERVICIOS (INTELIGENCIA) ---
import { getWeatherBikeCorrelation, getAirQualityAnomaly } from './services/analyticsService';

import { saveToJSON } from './utils/jsonDB';

// ==========================================
// CONFIGURACIÓN
// ==========================================
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); 
app.use(express.json());

// [IMPORTANTE] Servir el Frontend (Dashboard)
// La carpeta public está un nivel arriba de src (../public)
app.use(express.static(path.join(__dirname, '../public')));

// Ruta del archivo de base de datos
const DB_FILE = path.join(__dirname, '../data_storage.json');

// --- HELPER PARA LEER LA BASE DE DATOS ---
const readDB = () => {
    if (!fs.existsSync(DB_FILE)) return [];
    try {
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    } catch (error) {
        return [];
    }
};

const getLatest = (sourceName: string) => {
    const data = readDB();
    return data.filter((d: any) => d.source === sourceName).pop();
};

// ==========================================
// 1. API ENDPOINTS - DATOS EN TIEMPO REAL
// ==========================================

// Clima
app.get('/api/weather/current', (req, res) => {
    const data = readDB();
    const result = data.filter((d: any) => d.source === 'OpenWeather' || d.source === 'AEMET').pop();
    result ? res.json(result) : res.status(404).json({error: "Cargando datos..."});
});

// Medio Ambiente (Aire + Radiación)
app.get('/api/environment/current', (req, res) => {
    const result = getLatest('EnvironmentSensors');
    result ? res.json(result) : res.status(404).json({error: "Cargando datos..."});
});

// Tráfico (TomTom)
app.get('/api/traffic/current', (req, res) => {
    const result = readDB().filter((d: any) => d.source === 'TomTomTraffic' || d.source === 'ZaragozaTraffic').pop();
    result ? res.json(result) : res.status(404).json({error: "Cargando datos..."});
});

// Movilidad (Bicis)
app.get('/api/bizi/current', (req, res) => {
    const result = getLatest('ZaragozaBizi');
    result ? res.json(result) : res.status(404).json({error: "Cargando datos..."});
});

// Parking
app.get('/api/parking/current', (req, res) => {
    const result = getLatest('ZaragozaParking');
    result ? res.json(result) : res.status(404).json({error: "Cargando datos..."});
});

// Historial (Debug)
app.get('/api/history', (req, res) => {
    res.json(readDB().reverse());
});

// ==========================================
// 2. API ENDPOINTS - INTELIGENCIA URBANA (Analytics)
// ==========================================

// Correlación: ¿Afecta el clima al uso de Bicis?
app.get('/api/analytics/correlation', (req, res) => {
    const analysis = getWeatherBikeCorrelation();
    res.json(analysis);
});

// Anomalías: ¿Está el aire más sucio de lo normal?
app.get('/api/analytics/anomaly', (req, res) => {
    const analysis = getAirQualityAnomaly();
    res.json(analysis);
});

// ==========================================
// 3. TAREAS PROGRAMADAS (CRON JOB)
// ==========================================
const runTask = async () => {
    console.log(`⚡ [CRON] Recolectando datos urbanos: ${new Date().toLocaleTimeString()}`);
    
    // Ejecutamos los 5 recolectores en paralelo
    const [ow, aemet, traffic, bizi, env, park] = await Promise.all([
        fetchOpenWeather(),
        fetchAEMET(),
        fetchTraffic(),
        fetchBizi(),
        fetchEnvironment(),
        fetchParking()
    ]);

    // Guardamos resultados
    if (ow) saveToJSON(ow);
    if (aemet) saveToJSON(aemet);
    if (traffic) saveToJSON(traffic);
    if (bizi) saveToJSON(bizi);
    if (env) saveToJSON(env);
    if (park) saveToJSON(park);
};

// Programamos el cron para ejecutarse cada 30 minutos
cron.schedule('*/30 * * * *', runTask);

// ==========================================
// ARRANQUE DEL SERVIDOR
// ==========================================
app.listen(PORT, () => {
    console.log('------------------------------------------------');
    console.log(`🚀 Servidor TFG escuchando en: http://localhost:${PORT}`);
    console.log('📊 Dashboard disponible en navegador');
    console.log('🧠 Módulos de Inteligencia activos (/api/analytics)');
    console.log('------------------------------------------------');
    
    // Ejecución inicial segura
    runTask();
});