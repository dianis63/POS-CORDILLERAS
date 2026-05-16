export const enviarMensaje = async (mensaje) => {
    const res = await fetch('/api/chatbot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje }),
    });
    if (!res.ok) throw new Error('Error en chatbot');
    return res.json();
};