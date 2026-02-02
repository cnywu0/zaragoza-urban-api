const cron = require('node-cron');
const { saveToJSON } = require('../utils/jsonDB');

const { fetchOpenWeather, fetchAEMET } = require('../services/weatherService');
const { fetchTraffic } = require('../services/trafficService');
const { fetchBizi } = require('../services/biziService');
const { fetchEnvironment } = require('../services/environmentService');
const { fetchParking } = require('../services/parkingService');

const runTask = async () => {
    console.log(`⚡ [CRON] Ejecutando recolección: ${new Date().toLocaleTimeString()}`);
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
    } catch (e) { console.error("Error Cron:", e); }
};

const initCron = () => {
    console.log('🕰️ Cronjob iniciado (Cada 15 min).');
    cron.schedule('*/15 * * * *', runTask);
    runTask(); // Ejecución inicial
};

module.exports = { initCron };