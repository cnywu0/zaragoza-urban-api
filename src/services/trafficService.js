const axios = require('axios');
const { canFetch } = require('../utils/requestLimiter');
require('dotenv').config();

const fetchTraffic = async () => {
    if (!canFetch('TomTomTraffic')) return null;

    const API_KEY = process.env.TOMTOM_API_KEY;
    if (!API_KEY) return console.error('❌ Falta TOMTOM_API_KEY');

    try {
        console.log('🚗 Consultando TomTom Traffic...');
        const BBOX = '-0.975,41.605,-0.800,41.700'; // Zaragoza Box
        const url = `https://api.tomtom.com/traffic/services/5/incidentDetails?key=${API_KEY}&bbox=${BBOX}&fields={incidents{type,geometry{type,coordinates},properties{iconCategory,magnitudeOfDelay,events{description},from,to}}}`;
        
        const response = await axios.get(url);
        if (!response.data || !response.data.incidents) return null;

        const incidents = response.data.incidents.map((item) => ({
            type: item.properties.iconCategory === 6 ? "Incidencia" : "Tráfico",
            description: item.properties.events ? item.properties.events[0].description : "Retención",
            coordinates: item.geometry.coordinates[0]
        }));

        console.log(`   ✅ TomTom: ${incidents.length} incidencias.`);
        return {
            source: 'TomTomTraffic',
            timestamp: new Date(),
            total_incidents: incidents.length,
            incidents: incidents
        };
    } catch (error) {
        console.error('❌ Error TomTom:', error.message);
        return null;
    }
};

module.exports = { fetchTraffic };