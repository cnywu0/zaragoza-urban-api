const cron = require('node-cron');
const { saveToJSON } = require('../utils/jsonDB');

// Importamos todos los servicios
const { fetchOpenWeather, fetchAEMET } = require('../services/weatherService');
const { fetchTraffic } = require('../services/trafficService');
const { fetchBizi } = require('../services/biziService');
const { fetchEnvironment } = require('../services/environmentService');
const { fetchParking } = require('../services/parkingService');
const { fetchWorks } = require('../services/worksService'); // <--- NUEVO IMPORT

const runTask = async () => {
    console.log(`⚡ [CRON] Ejecutando recolección: ${new Date().toLocaleTimeString()}`);
    
    try {
        // Ejecutamos todo en paralelo
        const [ow, aemet, traffic, bizi, env, park, works] = await Promise.all([
            fetchOpenWeather(),
            fetchAEMET(),
            fetchTraffic(),
            fetchBizi(),
            fetchEnvironment(),
            fetchParking(),
            fetchWorks() // <--- NUEVA LLAMADA
        ]);

        // Guardamos lo que haya llegado
        if (ow) saveToJSON(ow);
        if (aemet) saveToJSON(aemet);
        if (traffic) saveToJSON(traffic);
        if (bizi) saveToJSON(bizi);
        if (env) saveToJSON(env);
        if (park) saveToJSON(park);
        if (works) saveToJSON(works); // <--- NUEVO GUARDADO
        
    } catch (error) {
        console.error("❌ Error crítico en el Job:", error);
    }
};

const initCron = () => {
    console.log('🕰️ Job de recolección iniciado (Cada 15 min).');
    cron.schedule('*/15 * * * *', runTask);
    runTask();
};

module.exports = { initCron };