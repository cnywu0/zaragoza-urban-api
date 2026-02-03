const { canFetch } = require('../utils/requestLimiter');
const random = (min, max) => parseFloat((Math.random() * (max - min) + min).toFixed(2));

const fetchEnvironment = async () => {
    if (!canFetch('EnvironmentSensors')) return null;
    console.log('🍃 Consultando Medio Ambiente...');
    
    // Simulamos sensores (o aquí iría la API real si la tuviéramos)
    // Valores bajos (invierno)
    return {
        source: 'EnvironmentSensors',
        timestamp: new Date(),
        air_quality: { pm2_5: random(5, 15), pm10: random(10, 25), no2: random(0, 10) },
        solar: { uv_index: random(1, 3), radiation: random(100, 300) },
        pollen: { grass: 0, olive: 0, birch: random(0, 10), mugwort: 0 }
    };
};
module.exports = { fetchEnvironment };