const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../../data_storage.json');

const readDB = () => {
    if (!fs.existsSync(DB_FILE)) return [];
    try {
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    } catch { return []; }
};

// 1. CORRELACIÓN: CLIMA vs BICIS
const getWeatherBikeCorrelation = () => {
    const data = readDB();
    const weatherLogs = data.filter(d => d.source === 'OpenWeather');
    const biziLogs = data.filter(d => d.source === 'ZaragozaBizi');

    if (weatherLogs.length < 5 || biziLogs.length < 5) {
        return { status: "loading", message: "Recopilando datos (necesarios min 5 ciclos)..." };
    }

    let badWeatherBikes = [];
    let goodWeatherBikes = [];

    weatherLogs.forEach(w => {
        // Busca dato de bici cercano en tiempo
        const wTime = new Date(w.timestamp).getTime();
        const match = biziLogs.find(b => Math.abs(new Date(b.timestamp).getTime() - wTime) < 1800000); // 30 mins

        if (match) {
            const isBad = w.description.includes('lluvia') || w.temperature < 10;
            if (isBad) badWeatherBikes.push(match.total_bikes_available);
            else goodWeatherBikes.push(match.total_bikes_available);
        }
    });

    const avg = arr => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
    const avgBad = Math.round(avg(badWeatherBikes));
    const avgGood = Math.round(avg(goodWeatherBikes));

    return {
        type: "correlation",
        analysis: "Clima vs Uso Bizi",
        result: {
            bikes_available_bad_weather: avgBad,
            bikes_available_good_weather: avgGood,
            conclusion: avgBad > avgGood ? "La gente NO usa la bici con mal tiempo (Más bicis libres)" : "No hay impacto claro"
        }
    };
};

// 2. ANOMALÍA: AIRE
const getAirQualityAnomaly = () => {
    const data = readDB();
    const airLogs = data.filter(d => d.source === 'EnvironmentSensors');

    if (airLogs.length === 0) return { error: "Sin datos" };

    const current = airLogs[airLogs.length - 1].air_quality.pm2_5;
    const total = airLogs.reduce((sum, log) => sum + log.air_quality.pm2_5, 0);
    const avg = total / airLogs.length;

    const isAnomaly = current > (avg * 1.5); // Si supera un 50% la media

    return {
        type: "anomaly",
        target: "PM2.5",
        current: current,
        average: parseFloat(avg.toFixed(2)),
        is_alert: isAnomaly,
        message: isAnomaly ? "⚠️ ALERTA: Contaminación Alta" : "✅ Aire Normal"
    };
};

module.exports = { getWeatherBikeCorrelation, getAirQualityAnomaly };