import type { WeatherAlert } from './LandingPage';
import './LandingPage.scss';

export default function WeatherSection() {

    const MOCK_ALERTS: WeatherAlert[] = [
        { id: "1", title: "Chuva forte com risco de alagamentos", severity: "extreme", area: "Vale do Sinos e Grande Porto Alegre", issued: "Hoje, 14:00" },
        { id: "2", title: "Ventos de até 80 km/h", severity: "severe", area: "Litoral Gaúcho", issued: "Hoje, 12:30" },
        { id: "3", title: "Risco de deslizamentos em encostas", severity: "moderate", area: "Serra Gaúcha", issued: "Hoje, 09:00" },
    ];

    return (
        <section className="weather section section--dark" id="alertas">
            <div className="container">
            <div className="section-header section-header--light">
                <span className="section-tag section-tag--light">Clima e alertas</span>
                <h2 className="section-title">Alertas ativos<br />agora no RS</h2>
            </div>
            <div className="weather__layout">
                <div className="weather__alerts">
                {MOCK_ALERTS.map(a => (
                    <div key={a.id} className={`alert-card alert-card--${a.severity}`}>
                    <div className="alert-card__left">
                        <span className="alert-card__icon">
                        {a.severity === "extreme" ? "🚨" : a.severity === "severe" ? "⚠️" : "ℹ️"}
                        </span>
                    </div>
                    <div className="alert-card__body">
                        <strong>{a.title}</strong>
                        <span>{a.area}</span>
                        <small>Emitido: {a.issued}</small>
                    </div>
                    <div className={`alert-card__sev alert-card__sev--${a.severity}`}>
                        {a.severity === "extreme" ? "EXTREMO" : a.severity === "severe" ? "SEVERO" : "MODERADO"}
                    </div>
                    </div>
                ))}
                </div>
                <div className="weather__forecast">
                <div className="forecast-card">
                    <h3>Previsão 5 dias — Porto Alegre</h3>
                    <div className="forecast__days">
                    {[
                        { day: "Hoje", icon: "⛈️", high: 21, low: 15, rain: 92 },
                        { day: "Qui", icon: "🌧️", high: 18, low: 13, rain: 80 },
                        { day: "Sex", icon: "🌦️", high: 22, low: 14, rain: 55 },
                        { day: "Sáb", icon: "🌤️", high: 26, low: 16, rain: 20 },
                        { day: "Dom", icon: "☀️", high: 28, low: 17, rain: 10 },
                    ].map(d => (
                        <div key={d.day} className="forecast__day">
                        <span className="forecast__label">{d.day}</span>
                        <span className="forecast__icon">{d.icon}</span>
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
            </div>
        </section>
    );
}