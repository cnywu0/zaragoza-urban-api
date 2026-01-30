const axios = require('axios');
const { canFetch } = require('../utils/requestLimiter');
require('dotenv').config();

const fetchTraffic = async () => {
    if (!canFetch('TomTomTraffic')) return null;

    const API_KEY = process.env.TOMTOM_API_KEY;
    if (!API_KEY) {
        console.error('❌ Falta TOMTOM_API_KEY en .env');
        return null;
    }

    try {
        console.log('🚗 Consultando TomTom Traffic (Zaragoza)...');
        // Coordenadas Bounding Box de Zaragoza
        const BBOX = '-0.975,41.605,-0.800,41.700';
        const url = `https://api.tomtom.com/traffic/services/5/incidentDetails?key=${API_KEY}&bbox=${BBOX}&fields={incidents{type,geometry{type,coordinates},properties{iconCategory,magnitudeOfDelay,events{description},from,to}}}`;
        
        const response = await axios.get(url);

        if (!response.data || !response.data.incidents) return null;

        const rawIncidents = response.data.incidents;

        // Traducir códigos de TomTom a texto
        const getCategory = (code) => {
            const categories = {
                1: "Accidente", 6: "Incidencia", 9: "Obras", 11: "Atasco"
            };
            return categories[code] || "Incidencia Tráfico";
        };

        const incidents = rawIncidents.map((item) => {
            return {
                streetName: `${item.properties.from || '?'} -> ${item.properties.to || '?'}`,
                type: getCategory(item.properties.iconCategory),
                description: item.properties.events ? item.properties.events[0].description : "",
                severity: item.properties.magnitudeOfDelay === 2 ? "Moderada" : "Normal",
                coordinates: item.geometry.coordinates[0] // [lon, lat]
            };
        });

        console.log(`   ✅ TomTom: ${incidents.length} incidencias encontradas.`);

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