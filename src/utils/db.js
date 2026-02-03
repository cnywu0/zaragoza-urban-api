const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// --- GUARDAR (INSERTS) ---
const saveWeather = async (data) => {
    try {
        await pool.query('INSERT INTO weather_logs (temp, humidity, wind_speed, description) VALUES ($1, $2, $3, $4)', 
        [data.temperature, data.humidity, data.wind_speed, data.description]);
        console.log('   💾 [DB] Weather guardado.');
    } catch(e) { console.error("Error DB Weather:", e.message); }
};

const saveEnvironment = async (data) => {
    try {
        await pool.query('INSERT INTO environment_logs (pm25, pm10, no2, uv_index, radiation, pollen_grass, pollen_olive) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [data.air_quality.pm2_5, data.air_quality.pm10, data.air_quality.no2, data.solar.uv_index, data.solar.radiation, data.pollen.grass || 0, data.pollen.olive || 0]);
        console.log('   💾 [DB] Environment guardado.');
    } catch(e) { console.error("Error DB Environment:", e.message); }
};

const saveTraffic = async (data) => {
    try {
        const isSevere = data.incidents.some(i => i.severity === 'Grave');
        await pool.query('INSERT INTO traffic_logs (total_incidents, severity_summary, incidents_data) VALUES ($1, $2, $3)',
        [data.total_incidents, isSevere ? 'Alta' : 'Normal', JSON.stringify(data.incidents)]);
        console.log('   💾 [DB] Traffic guardado.');
    } catch(e) { console.error("Error DB Traffic:", e.message); }
};

const saveBizi = async (data) => {
    try {
        await pool.query('INSERT INTO bizi_logs (total_available, stations_active, stations_data) VALUES ($1, $2, $3)',
        [data.total_bikes_available, data.total_stations, JSON.stringify(data.stations)]);
        console.log('   💾 [DB] Bizi guardado.');
    } catch(e) { console.error("Error DB Bizi:", e.message); }
};

const saveParking = async (data) => {
    try {
        await pool.query('INSERT INTO parking_logs (avg_occupancy, total_parkings, parking_data) VALUES ($1, $2, $3)',
        [data.average_occupancy, data.total_parkings, JSON.stringify(data.parkings)]);
        console.log('   💾 [DB] Parking guardado.');
    } catch(e) { console.error("Error DB Parking:", e.message); }
};

const saveWorks = async (data) => {
    try {
        await pool.query('INSERT INTO works_logs (active_works, works_data) VALUES ($1, $2)',
        [data.count, JSON.stringify(data.works)]);
        console.log('   💾 [DB] Works guardado.');
    } catch(e) { console.error("Error DB Works:", e.message); }
};

// --- LEER (SELECTS) ---
const getLatest = async (table) => {
    try {
        const map = { 'weather': 'weather_logs', 'environment': 'environment_logs', 'traffic': 'traffic_logs', 'bizi': 'bizi_logs', 'parking': 'parking_logs', 'works': 'works_logs' };
        if (!map[table]) return null;
        
        const res = await pool.query(`SELECT * FROM ${map[table]} ORDER BY created_at DESC LIMIT 1`);
        if (res.rows.length === 0) return null;
        const row = res.rows[0];

        if (table === 'weather') return { temperature: row.temp, humidity: row.humidity, description: row.description, wind_speed: row.wind_speed, timestamp: row.created_at };
        if (table === 'environment') return { air_quality: { pm2_5: row.pm25, pm10: row.pm10, no2: row.no2 }, solar: { uv_index: row.uv_index, radiation: row.radiation }, pollen: { grass: row.pollen_grass, olive: row.pollen_olive, birch: 0, mugwort: 0 } };
        if (table === 'traffic') return { total_incidents: row.total_incidents, incidents: row.incidents_data };
        if (table === 'bizi') return { total_bikes_available: row.total_available, stations: row.stations_data };
        if (table === 'parking') return { average_occupancy: row.avg_occupancy, parkings: row.parking_data };
        if (table === 'works') return { works: row.works_data };
        
    } catch (err) { console.error(`❌ Error Lectura DB [${table}]:`, err.message); return null; }
};

module.exports = { saveWeather, saveEnvironment, saveTraffic, saveBizi, saveParking, saveWorks, getLatest };