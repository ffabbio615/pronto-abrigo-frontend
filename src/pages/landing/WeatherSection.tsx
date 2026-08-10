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
                                <h3>Previsão para 3 dias - {weather && `${weather.location.region}`} <br/> {weather && `${weather.location.name}`}</h3>
                                <div className="forecast__days">
                                    { weather ?
                                    weather.forecast.forecastday.map((d, index) => (
                                        <div key={d.date} className="forecast__day">
                                        <span className="forecast__label">{weekDays[index]}</span>
                                        <img className="forecast__icon" src={d.day.condition.icon}/>
                                        <span className="forecast__temp">{d.day.maxtemp_c.toFixed(0)}°<em>{d.day.mintemp_c.toFixed(0)}°</em></span>
                                        <div className="forecast__rain-bar">
                                            <div className="forecast__rain-fill" style={{ width: `${d.day.daily_chance_of_rain.toFixed(0)}%` }} />
                                        </div>
                                        <span className="forecast__rain-pct">{d.day.daily_chance_of_rain.toFixed(0)}%</span>
                                        </div>
                                    ))
                                    : <p>Não foi possível buscar dados climáticos para a sua região.</p>
                                }
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