const axios = require('axios');
const { canFetch } = require('../utils/requestLimiter');
require('dotenv').config();

const fetchOpenWeather = async () => {
    if (!canFetch('OpenWeather')) return null;
    try {
        console.log('🌤️ Consultando OpenWeather...');
        const apiKey = process.env.OPENWEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=Zaragoza,es&units=metric&lang=es&appid=${apiKey}`;
        const res = await axios.get(url);
        return {
            source: 'OpenWeather',
            temperature: res.data.main.temp,
            humidity: res.data.main.humidity,
            wind_speed: res.data.wind.speed,
            description: res.data.weather[0].description,
            timestamp: new Date()
        };
    } catch (e) { console.error('Error OpenWeather:', e.message); return null; }
};
module.exports = { fetchOpenWeather };