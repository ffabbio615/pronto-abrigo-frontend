import { useEffect, useState } from "react";

    function getTimeRemaining(endDate: string | Date) {
        const total = new Date(endDate).getTime() - new Date().getTime();

        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / (1000 * 60 * 60)) % 24);

        return {
            total,
            hours,
            minutes,
            seconds,
        };
    }


    export function useCountdown(endDate: string | Date) {
    const [time, setTime] = useState(getTimeRemaining(endDate));

    useEffect(() => {
        const interval = setInterval(() => {
        const updated = getTimeRemaining(endDate);

        if (updated.total <= 0) {
            clearInterval(interval);
            setTime({ total: 0, hours: 0, minutes: 0, seconds: 0 });
        } else {
            setTime(updated);
        }
        }, 1000);

        return () => clearInterval(interval);
    }, [endDate]);

    return time;
    }