import axios from 'axios';
import { canFetch } from '../utils/requestLimiter'; 
import dotenv from 'dotenv';

dotenv.config();

export interface AirQuality {
    aqi: number; // Índice de Calidad (1 = Buena, 5 = Muy Mala)
    co: number;  // Monóxido de Carbono
    no2: number; // Dióxido de Nitrógeno (Tráfico)
    o3: number;  // Ozono
    pm2_5: number; // Partículas finas (Muy importante salud)
    pm10: number;  // Partículas grandes
}

export interface SolarRadiation {
    uv_index: number;
    shortwave_radiation: number; // Watts por metro cuadrado (W/m²)
    is_day: boolean;
}

export interface EnvironmentData {
    source: string;
    timestamp: Date;
    air_quality: AirQuality;
    solar: SolarRadiation;
}

export const fetchEnvironment = async (): Promise<EnvironmentData | null> => {
    // Usamos el Throttle
    if (!canFetch('EnvironmentZaragoza')) return null;

    const API_KEY = process.env.OPENWEATHER_API_KEY; // Ya la tienes
    // Coordenadas Zaragoza
    const LAT = '41.6488';
    const LON = '-0.8891';

    try {
        console.log('🍃 Consultando Sensores Ambientales (Aire + Radiación)...');

        // 1. CALIDAD DEL AIRE (OpenWeather)
        const urlAir = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${LAT}&lon=${LON}&appid=${API_KEY}`;
        const resAir = await axios.get(urlAir);
        
        // 2. RADIACIÓN SOLAR (Open-Meteo - API Científica Gratuita)
        // Pedimos: Índice UV, Radiación onda corta, y si es de día/noche
        const urlSolar = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=is_day,shortwave_radiation,uv_index&timezone=Europe%2FMadrid`;
        const resSolar = await axios.get(urlSolar);

        // --- PROCESAMIENTO ---
        
        // Datos Aire
        const airRaw = resAir.data.list[0].components;
        const airIndex = resAir.data.list[0].main.aqi;

        // Datos Solar
        const solarRaw = resSolar.data.current;

        console.log(`   ☢️ Radiación: ${solarRaw.shortwave_radiation} W/m² | UV: ${solarRaw.uv_index}`);
        console.log(`   💨 Aire (PM2.5): ${airRaw.pm2_5} μg/m³`);

        return {
            source: 'EnvironmentSensors',
            timestamp: new Date(),
            air_quality: {
                aqi: airIndex,
                co: airRaw.co,
                no2: airRaw.no2,
                o3: airRaw.o3,
                pm2_5: airRaw.pm2_5,
                pm10: airRaw.pm10
            },
            solar: {
                uv_index: solarRaw.uv_index,
                shortwave_radiation: solarRaw.shortwave_radiation,
                is_day: solarRaw.is_day === 1
            }
        };

    } catch (error) {
        console.error('❌ Error Medio Ambiente:', error instanceof Error ? error.message : error);
        return null;
    }
};