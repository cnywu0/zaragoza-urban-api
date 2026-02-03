const axios = require('axios');
const { canFetch } = require('../utils/requestLimiter');

const fetchBizi = async () => {
    // Si quieres forzar la recarga para probar, comenta esta línea temporalmente
    if (!canFetch('ZaragozaBizi')) return null;

    try {
        console.log('🚲 Consultando Bizi...');
        
        // 1. CAMBIO AQUÍ: Subimos de rows=130 a rows=300 👇
        const url = 'https://www.zaragoza.es/sede/servicio/urbanismo-infraestructuras/estacion-bicicleta.json?rows=300';
        
        const res = await axios.get(url, { headers: { 'Accept': 'application/json' }});
        
        if(!res.data.result) return null;
        
        const stations = res.data.result.map(s => ({
            id: s.id,
            address: s.title,
            bikes_available: parseInt(s.anclajesDisponibles) || 0,
            coordinates: s.geometry.coordinates
        }));
        
        // 2. FILTRO DE SEGURIDAD:
        // A veces hay estaciones de prueba con coordenadas [0,0]. Las quitamos para que no salgan en el mar.
        const validStations = stations.filter(s => s.coordinates && s.coordinates[0] !== 0);

        const total = validStations.reduce((sum, s) => sum + s.bikes_available, 0);
        console.log(`   🚲 ${validStations.length} estaciones activas y ${total} bicis libres.`);

        return { 
            source: 'ZaragozaBizi', 
            total_stations: validStations.length, 
            total_bikes_available: total, 
            stations: validStations, // Devolvemos la lista filtrada
            timestamp: new Date() 
        };

    } catch (e) { 
        console.error('Error Bizi:', e.message); 
        return null; 
    }
};

module.exports = { fetchBizi };