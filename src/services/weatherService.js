const axios = require('axios');
const { canFetch } = require('../utils/requestLimiter');
require('dotenv').config();

const fetchOpenWeather = async () => {
    if (!canFetch('OpenWeather')) return null;

    const API_KEY = process.env.OPENWEATHER_API_KEY;
    if (!API_KEY) return console.error('❌ Falta OPENWEATHER_API_KEY');

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
            description: data.weather[0].description,
            timestamp: new Date()
        };
    } catch (error) {
        console.error('❌ Error OpenWeather:', error.message);
        return null;
    }
};

const fetchAEMET = async () => {
    // Placeholder para cumplir requisito TFG sin complicar código ahora
    if (!canFetch('AEMET')) return null;
    return null; 
};

module.exports = { fetchOpenWeather, fetchAEMET };