const axios = require('axios');
const { canFetch } = require('../utils/requestLimiter');
require('dotenv').config();

const fetchEnvironment = async () => {
    // Throttle: Para no saturar
    if (!canFetch('EnvironmentSensors')) return null;

    const API_KEY = process.env.OPENWEATHER_API_KEY;
    const LAT = '41.6488'; // Zaragoza
    const LON = '-0.8891';

    try {
        console.log('🍃 Consultando Medio Ambiente (Aire + Radiación + Polen)...');

        // 1. URL Calidad del Aire (OpenWeather)
        const urlAir = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${LAT}&lon=${LON}&appid=${API_KEY}`;
        
        // 2. URL Radiación Y POLEN (Open-Meteo)
        // Pedimos: UV, Radiación, y pólenes clave (Gramíneas, Olivo, Abedul, etc.)
        const urlSolar = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=is_day,shortwave_radiation,uv_index,alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen&timezone=Europe%2FMadrid`;

        // Peticiones en paralelo
        const [resAir, resSolar] = await Promise.all([
            axios.get(urlAir),
            axios.get(urlSolar)
        ]);
        
        // Procesar datos
        const airRaw = resAir.data.list[0].components;
        const meteo = resSolar.data.current;

        console.log(`   🌼 Polen Gramíneas: ${meteo.grass_pollen} | Olivo: ${meteo.olive_pollen}`);

        return {
            source: 'EnvironmentSensors',
            timestamp: new Date(),
            // Aire
            air_quality: {
                pm2_5: airRaw.pm2_5,
                pm10: airRaw.pm10,
                no2: airRaw.no2,
                aqi: resAir.data.list[0].main.aqi
            },
            // Sol
            solar: {
                uv_index: meteo.uv_index,
                radiation: meteo.shortwave_radiation,
                is_day: meteo.is_day === 1
            },
            // Polen (NUEVO)
            pollen: {
                grass: meteo.grass_pollen,    // Gramíneas (El más importante en Zaragoza)
                olive: meteo.olive_pollen,    // Olivo
                birch: meteo.birch_pollen,    // Abedul
                mugwort: meteo.mugwort_pollen // Artemisa
            }
        };

    } catch (error) {
        console.error('❌ Error Environment:', error.message);
        return null;
    }
};

module.exports = { fetchEnvironment };