import axios from 'axios';
import dotenv from 'dotenv';
import { canFetch } from '../utils/requestLimiter'; // Importamos el policía

dotenv.config();

export interface WeatherData {
    source: string;
    location: string;
    temperature: number;
    humidity: number;
    wind_speed?: number;
    description?: string;
    timestamp: Date;
}

// --- OPENWEATHER ---
export const fetchOpenWeather = async (): Promise<WeatherData | null> => {
    // 1. CHEQUEO DE SEGURIDAD
    if (!canFetch('OpenWeather')) return null; 

    try {
        console.log('🌍 Conectando con OpenWeather...');
        const LAT = '41.6488';
        const LON = '-0.8891';
        const API_KEY = process.env.OPENWEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric&lang=es`;

        const response = await axios.get(url);
        const data = response.data;

        return {
            source: 'OpenWeather',
            location: 'Zaragoza',
            temperature: data.main.temp,
            humidity: data.main.humidity,
            wind_speed: data.wind.speed * 3.6,
            description: data.weather[0].description,
            timestamp: new Date()
        };
    } catch (error) {
        console.error('❌ Error OpenWeather:', error instanceof Error ? error.message : error);
        return null;
    }
};

// --- AEMET ---
export const fetchAEMET = async (): Promise<WeatherData | null> => {
    // 1. CHEQUEO DE SEGURIDAD
    if (!canFetch('AEMET')) return null;

    try {
        console.log('🇪🇸 Conectando con AEMET...');
        const API_KEY = process.env.AEMET_API_KEY;
        const url = `https://opendata.aemet.es/opendata/api/observacion/convencional/datos/estacion/9434?api_key=${API_KEY}`;

        const resInicial = await axios.get(url);
        if (resInicial.data.estado !== 200) throw new Error("AEMET status error");
        
        const dataUrl = resInicial.data.datos;
        const resDatos = await axios.get(dataUrl);
        const datosReales = resDatos.data[resDatos.data.length - 1];

        return {
            source: 'AEMET',
            location: 'Zaragoza (Aeropuerto)',
            temperature: datosReales.ta, 
            humidity: datosReales.hr,
            wind_speed: datosReales.vv ? datosReales.vv * 3.6 : 0,
            description: 'Datos estación oficial',
            timestamp: new Date(datosReales.fint)
        };

    } catch (error) {
        console.error('❌ Error AEMET:', error instanceof Error ? error.message : error);
        return null;
    }
};