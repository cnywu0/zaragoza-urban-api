const axios = require('axios');
const { canFetch } = require('../utils/requestLimiter');

// Helper para simulación
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

const fetchParking = async () => {
    // Para parking, permitimos checkear siempre para ver si la API revive, 
    // pero puedes descomentar esto:
    // if (!canFetch('ZaragozaParking')) return null;

    try {
        console.log('🅿️ Consultando Parkings...');
        const url = 'https://www.zaragoza.es/sede/servicio/urbanismo-infraestructuras/equipamiento/aparcamiento-publico.json?rows=50';
        
        let validParkings = [];
        try {
            const response = await axios.get(url, { headers: { 'Accept': 'application/json' }, timeout: 5000 });
            if (response.data && response.data.result) {
                validParkings = response.data.result
                    .map(p => ({
                        id: p.id,
                        name: p.title.replace('Aparcamiento ', ''),
                        spots_total: parseInt(p.plazas) || 0,
                        spots_free: parseInt(p.libres) || 0,
                        occupancy_percentage: 0 // Se calcula abajo
                    }))
                    .filter(p => p.spots_total > 0);
            }
        } catch (e) { console.log("   ⚠️ Fallo conexión parking, usando fallback."); }

        // MODO DEMO: Si no hay datos, inventamos datos realistas
        if (validParkings.length === 0) {
            console.log("   ⚠️ Activando MODO SIMULACIÓN Parking.");
            validParkings = [
                { id: 1, name: "Pza. España (Simulado)", spots_total: 400, spots_free: randomInt(20, 50), occupancy_percentage: 0 },
                { id: 2, name: "Auditorio (Simulado)", spots_total: 350, spots_free: randomInt(100, 200), occupancy_percentage: 0 },
                { id: 3, name: "Seminario (Simulado)", spots_total: 200, spots_free: randomInt(5, 30), occupancy_percentage: 0 }
            ];
        }

        // Calcular porcentajes
        validParkings.forEach(p => {
            const ocupadas = p.spots_total - p.spots_free;
            p.occupancy_percentage = parseFloat(((ocupadas / p.spots_total) * 100).toFixed(1));
        });

        const avg = validParkings.reduce((sum, p) => sum + p.occupancy_percentage, 0) / validParkings.length;
        console.log(`   🅿️ Ocupación media: ${avg.toFixed(1)}%`);

        return {
            source: 'ZaragozaParking',
            timestamp: new Date(),
            total_parkings: validParkings.length,
            average_occupancy: parseFloat(avg.toFixed(1)),
            parkings: validParkings
        };

    } catch (error) {
        console.error('❌ Error Parking Crítico:', error.message);
        return null;
    }
};

module.exports = { fetchParking };