const axios = require('axios');
const { canFetch } = require('../utils/requestLimiter');

const fetchBizi = async () => {
    if (!canFetch('ZaragozaBizi')) return null;

    try {
        console.log('🚲 Consultando Bizi Zaragoza...');
        const url = 'https://www.zaragoza.es/sede/servicio/urbanismo-infraestructuras/estacion-bicicleta.json?rows=130';
        
        // Zaragoza a veces pide headers específicos para devolver JSON limpio
        const response = await axios.get(url, { headers: { 'Accept': 'application/json' } });

        if (!response.data || !response.data.result) return null;

        const rawStations = response.data.result;
        
        const stations = rawStations.map((s) => ({
            id: s.id,
            address: s.title,
            bikes_available: parseInt(s.bicisDisponibles) || 0,
            anchors_available: parseInt(s.anclajesDisponibles) || 0,
            coordinates: s.geometry && s.geometry.coordinates ? s.geometry.coordinates : [0, 0]
        }));

        const totalBikes = stations.reduce((sum, st) => sum + st.bikes_available, 0);
        console.log(`   🚲 ${totalBikes} bicis disponibles en total.`);

        return {
            source: 'ZaragozaBizi',
            timestamp: new Date(),
            total_stations: stations.length,
            total_bikes_available: totalBikes,
            stations: stations
        };

    } catch (error) {
        console.error('❌ Error Bizi:', error.message);
        return null;
    }
};

module.exports = { fetchBizi };