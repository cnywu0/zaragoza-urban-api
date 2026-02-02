const fs = require('fs');
const path = require('path');

const LOG_FILE = path.join(__dirname, '../../request_logs.json');
const WAIT_TIME = 15 * 60 * 1000; // 15 minutos entre llamadas a la misma API

const canFetch = (sourceName) => {
    let logs = {};
    if (fs.existsSync(LOG_FILE)) {
        try {
            logs = JSON.parse(fs.readFileSync(LOG_FILE, 'utf-8'));
        } catch (e) { logs = {}; }
    }

    const lastTime = logs[sourceName];
    const now = Date.now();

    // Si hace menos tiempo del permitido, bloqueamos
    if (lastTime && (now - lastTime) < WAIT_TIME) {
        console.log(`🛡️ Throttle: [${sourceName}] espera...`);
        return false;
    }

    // Actualizamos la hora y permitimos
    logs[sourceName] = now;
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
    return true;
};

module.exports = { canFetch };