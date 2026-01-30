const axios = require('axios');
const { canFetch } = require('../utils/requestLimiter');
require('dotenv').config();

const fetchOpenWeather = async () => {
    // Throttle: Evita pedir datos si ya pedimos hace poco
    if (!canFetch('OpenWeather')) return null;

    const API_KEY = process.env.OPENWEATHER_API_KEY;
    if (!API_KEY) {
        console.error('❌ Falta OPENWEATHER_API_KEY en .env');
        return null;
    }

    try {
        console.log('🌤️ Consultando OpenWeather...');
        const city = 'Zaragoza,ES';
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric&lang=es`;

        const response = await axios.get(url);
        const data = response.data;

        return {
            source: 'OpenWeather',
            location: 'Zaragoza',
            temperature: data.main.temp,
            humidity: data.main.humidity,
            wind_speed: data.wind.speed,
            description: data.weather[0].description, // "cielo claro", "lluvia ligera"
            timestamp: new Date()
        };
    } catch (error) {
        console.error('❌ Error OpenWeather:', error.message);
        return null;
    }
};

const fetchAEMET = async () => {
    // Si no hay clave de AEMET, ignoramos silenciosamente
    if (!process.env.AEMET_API_KEY) return null;
    if (!canFetch('AEMET')) return null;

    try {
        console.log('🇪🇸 Consultando AEMET (Validación)...');
        // NOTA: AEMET requiere dos pasos (pedir URL -> descargar datos), 
        // para el TFG, si OpenWeather funciona, esto es opcional.
        // Devolvemos null por ahora para no complicar si no tienes la clave perfecta.
        return null; 
    } catch (error) {
        return null;
    }
};

module.exports = { fetchOpenWeather, fetchAEMET };