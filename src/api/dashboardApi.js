export const getEstadisticas = async () => {
    const res = await fetch('/api/dashboard');
    return res.json();
};

export const getNotifs = async () => {
    const res = await fetch('/api/dashboard/notifs');
    return res.json();
};