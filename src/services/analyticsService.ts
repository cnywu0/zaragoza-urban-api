import fs from 'fs';
import path from 'path';

const DB_FILE = path.join(__dirname, '../../data_storage.json');

// Helper para leer datos
const readDB = () => {
    if (!fs.existsSync(DB_FILE)) return [];
    try {
        return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    } catch { return []; }
};

// --- 1. CORRELACIÓN: CLIMA vs MOVILIDAD ---
// Compara el uso de Bicis cuando hace "Buen tiempo" vs "Mal tiempo"
export const getWeatherBikeCorrelation = () => {
    const data = readDB();
    
    // Filtramos solo los registros que nos interesan
    const weatherLogs = data.filter((d: any) => d.source === 'OpenWeather');
    const biziLogs = data.filter((d: any) => d.source === 'ZaragozaBizi');

    // Necesitamos datos de ambos tipos para comparar
    if (weatherLogs.length < 5 || biziLogs.length < 5) {
        return { message: "Insuficientes datos para calcular correlaciones (Espera unas horas)" };
    }

    // Definimos "Mal tiempo" como: Lluvia, Nieve o Temperatura < 5ºC
    // Definimos "Buen tiempo" como: Cielo despejado/nubes y Temperatura > 10ºC
    
    let badWeatherBikes = [];
    let goodWeatherBikes = [];

    // Algoritmo simple: Emparejamos por hora aproximada
    // (Recorremos los registros de clima y buscamos un registro de bizi cercano en el tiempo)
    for (const w of weatherLogs) {
        const wTime = new Date(w.timestamp).getTime();
        
        // Buscamos el registro de bizi más cercano (menos de 30 min de diferencia)
        const closestBizi = biziLogs.find((b: any) => Math.abs(new Date(b.timestamp).getTime() - wTime) < 30 * 60 * 1000);

        if (closestBizi) {
            const isBadWeather = w.description.includes('lluvia') || w.description.includes('nieve') || w.temperature < 5;
            const isGoodWeather = w.temperature > 10 && !isBadWeather;

            if (isBadWeather) badWeatherBikes.push(closestBizi.total_bikes_available);
            if (isGoodWeather) goodWeatherBikes.push(closestBizi.total_bikes_available);
        }
    }

    // Calculamos medias
    const average = (arr: number[]) => arr.length ? arr.reduce((a, b) => a + b) / arr.length : 0;

    const avgBad = average(badWeatherBikes);
    const avgGood = average(goodWeatherBikes);

    return {
        analysis: "Impacto del Clima en uso de Bizi",
        samples_analyzed: badWeatherBikes.length + goodWeatherBikes.length,
        result: {
            avg_bikes_available_bad_weather: Math.round(avgBad),
            avg_bikes_available_good_weather: Math.round(avgGood),
            conclusion: avgBad > avgGood 
                ? "Hay MÁS bicis libres cuando hace mal tiempo (La gente no las usa)." 
                : "No se detecta correlación clara todavía o hace buen tiempo."
        }
    };
};

// --- 2. DETECCIÓN DE ANOMALÍAS (CALIDAD AIRE) ---
// Detecta si la contaminación actual se dispara respecto a la media histórica
export const getAirQualityAnomaly = () => {
    const data = readDB();
    const airLogs = data.filter((d: any) => d.source === 'EnvironmentSensors');

    if (airLogs.length === 0) return { error: "Sin datos de aire" };

    // Obtenemos el último dato (Actual)
    const current = airLogs[airLogs.length - 1];
    const currentPM25 = current.air_quality.pm2_5;

    // Calculamos la media de TODOS los registros anteriores
    const totalPM25 = airLogs.reduce((sum: number, log: any) => sum + log.air_quality.pm2_5, 0);
    const averagePM25 = totalPM25 / airLogs.length;

    // Umbral de Anomalía: Si supera la media en un 50%
    const isAnomaly = currentPM25 > (averagePM25 * 1.5);

    return {
        analysis: "Detección de Anomalías en Aire (PM2.5)",
        current_level: currentPM25,
        historical_average: parseFloat(averagePM25.toFixed(2)),
        diff_percentage: parseFloat(((currentPM25 - averagePM25) / averagePM25 * 100).toFixed(1)) + "%",
        is_anomalous: isAnomaly,
        alert_level: isAnomaly ? "⚠️ ALERTA: Contaminación inusualmente alta" : "✅ Niveles normales respecto a la media"
    };
};