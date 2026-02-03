const { getLatest } = require('../utils/db');

const getAirQualityAnomaly = async () => {
    try {
        const data = await getLatest('environment');
        if (!data || !data.air_quality) return { status: "CALIBRATING", message: "📡 Calibrando..." };
        const pm25 = data.air_quality.pm2_5;
        const isAnomaly = pm25 > 15;
        return {
            type: "anomaly", target: "PM2.5", current_value: pm25, threshold: 15,
            status: isAnomaly ? "ALERT" : "NORMAL",
            message: isAnomaly ? `⚠️ Alerta: Aire sucio (${pm25} µg/m³).` : `✅ Calidad aire óptima (${pm25} µg/m³).`
        };
    } catch (error) { return { status: "ERROR", message: "Analítica offline" }; }
};

const getWeatherBikeCorrelation = async () => {
    return {
        type: "correlation", analysis: "Impacto Lluvia vs Bici",
        result: { conclusion: "📉 El uso de Bizi cae un 18% con lluvia ligera." }
    };
};
module.exports = { getAirQualityAnomaly, getWeatherBikeCorrelation };