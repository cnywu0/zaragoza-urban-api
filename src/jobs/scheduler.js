const cron = require('node-cron');
const db = require('../utils/db');
const weather = require('../services/weatherService');
const traffic = require('../services/trafficService');
const bizi = require('../services/biziService');
const env = require('../services/environmentService');
const parking = require('../services/parkingService');
const works = require('../services/worksService');

const runTask = async () => {
    console.log(`⚡ [CRON] Recolectando... ${new Date().toLocaleTimeString()}`);
    try {
        const [ow, tr, bz, en, pk, wk] = await Promise.all([
            weather.fetchOpenWeather(), traffic.fetchTraffic(), bizi.fetchBizi(),
            env.fetchEnvironment(), parking.fetchParking(), works.fetchWorks()
        ]);

        if (ow) await db.saveWeather(ow);
        if (tr) await db.saveTraffic(tr);
        if (bz) await db.saveBizi(bz);
        if (en) await db.saveEnvironment(en);
        if (pk) await db.saveParking(pk);
        if (wk) await db.saveWorks(wk);
        
    } catch (error) { console.error("❌ Error Cron:", error); }
};

const initCron = () => {
    console.log('🕰️ Cronjob DB iniciado.');
    cron.schedule('*/15 * * * *', runTask);
    runTask();
};
module.exports = { initCron };