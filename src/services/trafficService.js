const axios = require('axios');
const { canFetch } = require('../utils/requestLimiter');
require('dotenv').config();

const fetchTraffic = async () => {
    if (!canFetch('TomTomTraffic')) return null;
    try {
        console.log('🚗 Consultando TomTom...');
        const url = `https://api.tomtom.com/traffic/services/5/incidentDetails?key=${process.env.TOMTOM_API_KEY}&bbox=-0.975,41.605,-0.800,41.700&fields={incidents{type,geometry{type,coordinates},properties{iconCategory,magnitudeOfDelay,events{description},from,to}}}`;
        const res = await axios.get(url);
        if(!res.data.incidents) return null;

        const incidents = res.data.incidents.map(i => ({
            streetName: `${i.properties.from || 'Zaragoza'} -> ${i.properties.to || 'Zaragoza'}`,
            type: "Incidencia",
            description: i.properties.events ? i.properties.events[0].description : "Retención",
            severity: i.properties.magnitudeOfDelay > 2 ? "Grave" : "Leve",
            coordinates: i.geometry.coordinates[0]
        }));
        
        console.log(`   ✅ TomTom: ${incidents.length} incidencias.`);
        return { source: 'TomTomTraffic', total_incidents: incidents.length, incidents: incidents, timestamp: new Date() };
    } catch (e) { console.error('Error TomTom:', e.message); return null; }
};
module.exports = { fetchTraffic };