export function parseHoursToMinutes(value) {
    if (!value) return 0;

    let s = value.trim().replace(',', '.');

    // hh:mm
    if (s.includes(':')) {
        const [h, m] = s.split(':').map(Number);
        return h * 60 + m;
    }

    // hh.mm
    if (s.includes('.')) {
        let [h, m] = s.split('.').map(Number);

        if (m >= 60) {
            h += Math.floor(m / 60);
            m = m % 60;
        }

        return h * 60 + m;
    }

    // plain number = hours
    if (!isNaN(s)) {
        return Number(s) * 60;
    }

    return 0;
}

export function formatMinutesToHColonMM(totalMinutes) {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}:${String(m).padStart(2, '0')}`;
}
