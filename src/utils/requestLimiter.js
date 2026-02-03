const fs = require('fs');
const path = require('path');
const LOG_FILE = path.join(__dirname, '../../request_logs.json');
const LIMITS = { 'OpenWeather': 10, 'TomTomTraffic': 15, 'ZaragozaBizi': 5, 'EnvironmentSensors': 30, 'ZaragozaParking': 10, 'ZaragozaWorks': 60 };

const canFetch = (sourceName) => {
    let logs = {};
    if (fs.existsSync(LOG_FILE)) {
        try { logs = JSON.parse(fs.readFileSync(LOG_FILE)); } catch (e) {}
    }
    const last = logs[sourceName] ? new Date(logs[sourceName]) : new Date(0);
    const diffMins = (new Date() - last) / 1000 / 60;
    
    if (diffMins < LIMITS[sourceName]) return false;
    
    logs[sourceName] = new Date();
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
    return true;
};

module.exports = { canFetch };