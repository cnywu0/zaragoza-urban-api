const axios = require('axios');
const { canFetch } = require('../utils/requestLimiter');

const fetchParking = async () => {
    if (!canFetch('ZaragozaParking')) return null;

    try {
        console.log('🅿️ Consultando Parkings...');
        const url = 'https://www.zaragoza.es/sede/servicio/urbanismo-infraestructuras/equipamiento/aparcamiento-publico.json?rows=50';
        
        const response = await axios.get(url, { headers: { 'Accept': 'application/json' } });

        if (!response.data || !response.data.result) return null;

        const rawList = response.data.result;
        
        const parkings = rawList.map((p) => {
            const total = parseInt(p.plazas) || 0;
            const libres = parseInt(p.libres) || 0;
            // Corrección de datos erróneos (libres > total)
            const free = libres > total ? total : libres; 
            
            let occupancy = 0;
            if (total > 0) occupancy = ((total - free) / total) * 100;

            return {
                id: p.id,
                name: p.title,
                spots_total: total,
                spots_free: free,
                occupancy_percentage: parseFloat(occupancy.toFixed(1))
            };
        });

        // Filtrar vacíos
        const validParkings = parkings.filter(p => p.spots_total > 0);
        
        // Calcular media ciudad
        const avg = validParkings.reduce((sum, p) => sum + p.occupancy_percentage, 0) / validParkings.length || 0;

        console.log(`   🅿️ Ocupación media: ${avg.toFixed(1)}%`);

        return {
            source: 'ZaragozaParking',
            timestamp: new Date(),
            total_parkings: validParkings.length,
            average_occupancy: parseFloat(avg.toFixed(1)),
            parkings: validParkings
        };

    } catch (error) {
        console.error('❌ Error Parking:', error.message);
        return null;
    }
};

module.exports = { fetchParking };