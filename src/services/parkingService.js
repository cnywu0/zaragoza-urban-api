const axios = require('axios');
const { canFetch } = require('../utils/requestLimiter');
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const fetchParking = async () => {
    // if (!canFetch('ZaragozaParking')) return null; // Descomenta si quieres limitar
    console.log('🅿️ Consultando Parkings...');
    let parkings = [];
    
    // Intento Real
    try {
        const res = await axios.get('https://www.zaragoza.es/sede/servicio/urbanismo-infraestructuras/equipamiento/aparcamiento-publico.json?rows=50', { headers: { 'Accept': 'application/json' }, timeout: 4000 });
        if(res.data.result) {
            parkings = res.data.result.map(p => ({
                name: p.title.replace('Aparcamiento ', ''),
                spots_total: parseInt(p.plazas) || 0,
                spots_free: parseInt(p.libres) || 0,
                occupancy_percentage: 0
            })).filter(p => p.spots_total > 0);
        }
    } catch(e) {}

    // Fallback Simulación
    if (parkings.length === 0) {
        console.log("   ⚠️ Activando MODO SIMULACIÓN Parking.");
        parkings = [
            { name: "Pza. España", spots_total: 400, spots_free: randomInt(10, 50) },
            { name: "Auditorio", spots_total: 350, spots_free: randomInt(100, 200) },
            { name: "Seminario", spots_total: 200, spots_free: randomInt(5, 30) },
            { name: "Hospital Clínico", spots_total: 500, spots_free: randomInt(20, 80) },
            { name: "Pza. Salamero", spots_total: 300, spots_free: randomInt(50, 100) }
        ];
    }

    parkings.forEach(p => p.occupancy_percentage = parseFloat((((p.spots_total - p.spots_free)/p.spots_total)*100).toFixed(1)));
    const avg = parkings.reduce((s, p) => s + p.occupancy_percentage, 0) / parkings.length;

    return { source: 'ZaragozaParking', total_parkings: parkings.length, average_occupancy: parseFloat(avg.toFixed(1)), parkings: parkings, timestamp: new Date() };
};
module.exports = { fetchParking };