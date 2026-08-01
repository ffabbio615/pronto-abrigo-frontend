import { useEffect, useState } from 'react';
import type { WeatherAlert } from './LandingPage';
import './LandingPage.scss';

type Weather = {
    "location": {
        "name": string, //Endereço
        "region": string, //Estado
        "country": string, //País
        "tz_id": string, //Onde está localizado o Fuso horário
        "localtime": string
    },
    "current": {
        "last_updated": string,
        "temp_c": number,
        "is_day": number,
        "condition": {
            "text": string, //Condição atual do clima (Nublado, ensolarado, etc)
            "icon": string, //url do ícone de condição do clima
            "code": number
        },
        "wind_kph": number,
        "humidity": number, //Porcentagem de umidade
        "feelslike_c": number,
        "windchill_c": number, //Sensação térmica
        "heatindex_c": number, //Sensação de calor
        "uv": number, //Índice UV, que vai da escala 0 a 2 (Baixo) | 3 a 5 (Moderado) | 6 a 7 (Alto) | 8 a 10 (Muito Alto) | 11+ (Extremo)
        "gust_kph": number, //Rajadas de vento repentino. 0 – 39 km/h (Normal) | 40 – 69 km/h (Moderada) | 70 – 99 km/h (Severa) | 100+ km/h (Extrema)
        "will_it_rain": number,
        "chance_of_rain": number
    },
    "forecast": {
        "forecastday": [{
            "date": string,
            "day": {
                "daily_chance_of_rain": number,
                "maxtemp_c": number,
                "mintemp_c": number,
                "condition": {
                    "icon": string,
                    "text": string
                },
                "totalprecip_mm": number //O quanto irá chover no dia na região. 0–30 mm (Fraca) | 30–50 mm (Moderada) | 50–80 mm (Severa) | +80 mm (Alto risco/extremo)
            }
        }]
    }
}

// type Wheather = {
//     "location": {
//         "name": "Rio De Janeiro",
//         "region": "Rio de Janeiro",
//         "country": "Brazil",
//         "tz_id": "America/Sao_Paulo", //Onde está localizado o Fuso horário
//         "localtime": "2026-05-22 16:34"
//     },
//     "current": {
//         "last_updated": "2026-05-22 16:30",
//         "temp_c": 21.1,
//         "is_day": 1,
//         "condition": {
//             "text": "Overcast", //Condição atual do clima (Nublado, ensolarado, etc)
//             "icon": "//cdn.weatherapi.com/weather/64x64/day/122.png", //url do ícone de condição do clima
//             "code": 1009
//         },
//         "wind_kph": 6.8,
//         "humidity": 88, //Porcentagem de umidade
//         "feelslike_c": 21.1,
//         "windchill_c": 20.8, //Sensação térmica
//         "heatindex_c": 20.8, //Sensação de calor
//         "uv": 0.4, //Índice UV, que vai da escala 0 a 2 (Baixo) | 3 a 5 (Moderado) | 6 a 7 (Alto) | 8 a 10 (Muito Alto) | 11+ (Extremo)
//         "gust_kph": 9.4, //Rajadas de vento repentino com média que duram menos de 20 segundos
//         "will_it_rain": 1,
//         "chance_of_rain": 71
//     }
// }

export default function WeatherSection() {

    const [weatherAPIStatus, setWeatherAPIStatus] = useState<"searching" | "found" | "error">("searching");
    const [weather, setWeather] = useState<Weather | null>(null);
    const weekDays: string[] = [];
    
    const getWeekday = () =>{
        for (let i = 0; i < 5; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            const day = date.toLocaleDateString("pt-BR", {
                weekday: "short"
            }).toUpperCase();
            
            weekDays.push(day);
        }
    }
    getWeekday();
    
    
    useEffect(() => {
        const weatherApiKey = import.meta.env.VITE_WEATHER_API_KEY;

        const getUserLocation = async () => {
            return new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
        };
    
        const fetchWeather = async (lat: number, lon: number) => {
    
            const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${lat},${lon}&days=5&alerts=yes&aqi=no`);

            if (!response.ok) {
                throw new Error("Erro ao buscar clima");
            }

            const data: Weather = await response.json();
            return data;
        };
        
        const loadWeather = async () => {
            try {
                const position = await getUserLocation();
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                setWeather(await fetchWeather(lat, lon));
                setWeatherAPIStatus("found");
            } catch (error) {
                console.error(error);
                setWeatherAPIStatus("error");
            }
        };

        loadWeather();
    },[]);

    const getWeatherDayInfo = (orderDay: number, item: "min" | "max" | "humidity" | "icon")=>{
        if(!weather) return;
        if(item === "min") return weather.forecast.forecastday[orderDay].day.mintemp_c.toFixed(0);
        if(item === "max") return weather.forecast.forecastday[orderDay].day.maxtemp_c.toFixed(0);
        if(item === "humidity") return weather.forecast.forecastday[orderDay].day.daily_chance_of_rain.toFixed(0);
        if(item === "icon") return weather.forecast.forecastday[orderDay].day.condition.icon;
    }

    const getWindAlert = () => {
        if(!weather) return;
        const gust_kph = weather.current.gust_kph;

        if (gust_kph >= 100) {
            return {
                level: "extreme",
                message: "Queda de árvores, danos estruturais e perigo elevado"
            };
        }

        if (gust_kph >= 70) {
            return {
                level: "severe",
                message: "Queda de galhos, risco para motos e destelhamentos"
            };
        }

        if (gust_kph >= 40) {
            return {
                level: "moderate",
                message: "Galhos balançando forte e objetos leves podem voar"
            };
        }

        return {
            level: "normal",
            message: "Vento comum, sem riscos relevantes"
        };
    };

    const getRainAlert = () => {
        if(!weather) return;
        const rain_mm = weather.forecast.forecastday[0].day.totalprecip_mm;

        if (rain_mm > 80) {
            return {
                level: "extreme",
                message: "Alto risco de alagamentos, enchentes e deslizamentos"
            };
        }

        if (rain_mm >= 50) {
            return {
                level: "severe",
                message: "Chuva intensa com risco de transtornos urbanos"
            };
        }

        if (rain_mm >= 30) {
            return {
                level: "moderate",
                message: "Possibilidade de pontos de alagamento"
            };
        }

        return {
            level: "normal",
            message: "Volume de chuva dentro do esperado"
        };
    };

    const getUVAlert = () => {
        if (!weather) return;

        const uv = weather.current.uv;

        if (uv >= 11) {
            return {
                level: "extreme",
                message: "Risco extremo de queimaduras e danos à pele em poucos minutos"
            };
        }

        if (uv >= 6) {
            return {
                level: "severe",
                message: "Alto índice UV com risco elevado sem proteção"
            };
        }

        if (uv >= 3) {
            return {
                level: "moderate",
                message: "Use proteção solar em exposições prolongadas"
            };
        }

        return {
            level: "normal",
            message: "Baixo risco de radiação UV"
        };
    };
    
    const MOCK_ALERTS: WeatherAlert[] = weather ? [
        {
            id: "1",
            title: getRainAlert()?.message || "",
            severity: getRainAlert()?.level || "normal",
            number: `${weather.forecast.forecastday[0].day.totalprecip_mm}mm`,
            issued: new Date(weather.location.localtime).toLocaleString("pt-BR")
        },
        {
            id: "2",
            title: getWindAlert()?.message || "",
            severity: getWindAlert()?.level || "normal",
            number: `${weather.current.gust_kph}km/h`,
            issued: new Date(weather.location.localtime).toLocaleString("pt-BR")
        },
        {
            id: "3",
            title: getUVAlert()?.message || "",
            severity: getUVAlert()?.level || "normal",
            number: `${weather.current.uv} UV`,
            issued: new Date(weather.location.localtime).toLocaleString("pt-BR")
        }
    ] : [];

    return (
        <section className="weather section section--dark" id="alertas">

                <div className="container">
                    <div className="section-header section-header--light">
                        <span className="section-tag section-tag--light">Clima e alertas</span>
                        <h2 className="section-title">Alertas ativos<br />agora na sua cidade</h2>
                    </div>
                    {/* LOADING */}
                    {weatherAPIStatus === "searching" ? (
                        <div className="loading-row">
                            <div className="skeleton skeleton--weather" />
                        </div>
                    ) : weatherAPIStatus === "found" ? (
                        <div className="weather__layout">
                            <div className="weather__alerts">
                                {MOCK_ALERTS.map(a => (
                                    <div key={a.id} className={`alert-card alert-card--${a.severity}`}>
                                    <div className="alert-card__left">
                                        <span className="alert-card__icon">
                                        {a.severity === "extreme" ? "🔴" : a.severity === "severe" ? "🟠" : a.severity === "moderate" ? "🟡" : "🟢"}
                                        </span>
                                    </div>
                                    <div className="alert-card__body">
                                        <strong>{a.title}</strong>
                                        <span>{a.number}</span>
                                        <small>Emitido: {a.issued}</small>
                                    </div>
                                    <div className={`alert-card__sev alert-card__sev--${a.severity}`}>
                                        {a.severity === "extreme" ? "EXTREMO" : a.severity === "severe" ? "SEVERO" : a.severity === "moderate" ? "MODERADO" : "NORMAL"}
                                    </div>
                                    </div>
                                ))}
                            </div>
                            <div className="weather__forecast">
                            <div className="forecast-card">
                                <h3>Previsão para 5 dias - {weather && `${weather.location.region}`} <br/> {weather && `${weather.location.name}`}</h3>
                                <div className="forecast__days">
                                {[
                                    { day: "HOJE", icon: getWeatherDayInfo(0, "icon"), high: getWeatherDayInfo(0, "max"), low: getWeatherDayInfo(0, "min"), rain: getWeatherDayInfo(0, "humidity") },
                                    { day: weekDays[1], icon: getWeatherDayInfo(1, "icon"), high: getWeatherDayInfo(1, "max"), low: getWeatherDayInfo(1, "min"), rain: getWeatherDayInfo(1, "humidity") },
                                    { day: weekDays[2], icon: getWeatherDayInfo(2, "icon"), high: getWeatherDayInfo(2, "max"), low: getWeatherDayInfo(2, "min"), rain: getWeatherDayInfo(2, "humidity") },
                                    { day: weekDays[3], icon: getWeatherDayInfo(3, "icon"), high: getWeatherDayInfo(3, "max"), low: getWeatherDayInfo(3, "min"), rain: getWeatherDayInfo(3, "humidity") },
                                    { day: weekDays[4], icon: getWeatherDayInfo(4, "icon"), high: getWeatherDayInfo(4, "max"), low: getWeatherDayInfo(4, "min"), rain: getWeatherDayInfo(4, "humidity") },
                                ].map(d => (
                                    <div key={d.day} className="forecast__day">
                                    <span className="forecast__label">{d.day}</span>
                                    <img className="forecast__icon" src={d.icon}/>
                                    <span className="forecast__temp">{d.high}°<em>{d.low}°</em></span>
                                    <div className="forecast__rain-bar">
                                        <div className="forecast__rain-fill" style={{ width: `${d.rain}%` }} />
                                    </div>
                                    <span className="forecast__rain-pct">{d.rain}%</span>
                                    </div>
                                ))}
                                </div>
                            </div>
                            </div>
                        </div>
                    ) :
                    <p className='weather-text-error'>O sistema não encontrou o clima para sua localidade! <br></br> Tente atualizar a página.</p>
                    } 
                </div>
        </section>
    );
}