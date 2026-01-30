const axios = require('axios');
const { canFetch } = require('../utils/requestLimiter');
require('dotenv').config();

const fetchEnvironment = async () => {
    if (!canFetch('EnvironmentSensors')) return null;

    const API_KEY = process.env.OPENWEATHER_API_KEY;
    const LAT = '41.6488';
    const LON = '-0.8891';

    try {
        console.log('🍃 Consultando Sensores Ambientales (Aire + Sol)...');

        // 1. CALIDAD DEL AIRE (OpenWeather)
        const urlAir = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${LAT}&lon=${LON}&appid=${API_KEY}`;
        
        // 2. RADIACIÓN SOLAR (Open-Meteo - Gratis)
        const urlSolar = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=is_day,shortwave_radiation,uv_index&timezone=Europe%2FMadrid`;

        // Ejecutar las dos a la vez
        const [resAir, resSolar] = await Promise.all([
            axios.get(urlAir),
            axios.get(urlSolar)
        ]);
        
        // Procesar Aire
        const airRaw = resAir.data.list[0].components;
        const airIndex = resAir.data.list[0].main.aqi;

        // Procesar Sol
        const solarRaw = resSolar.data.current;

        console.log(`   ☢️ UV: ${solarRaw.uv_index} | PM2.5: ${airRaw.pm2_5}`);

        return {
            source: 'EnvironmentSensors',
            timestamp: new Date(),
            air_quality: {
                aqi: airIndex,
                co: airRaw.co,
                no2: airRaw.no2,
                o3: airRaw.o3,
                pm2_5: airRaw.pm2_5, // Lo más importante para salud
                pm10: airRaw.pm10
            },
            solar: {
                uv_index: solarRaw.uv_index,
                shortwave_radiation: solarRaw.shortwave_radiation,
                is_day: solarRaw.is_day === 1
            }
        };

    } catch (error) {
        console.error('❌ Error Medio Ambiente:', error.message);
        return null;
    }
};

module.exports = { fetchEnvironment };