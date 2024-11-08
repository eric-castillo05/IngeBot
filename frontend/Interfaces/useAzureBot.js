// useAzureBot.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const directLineSecret = 'TU_DIRECT_LINE_SECRET'; // Coloca tu clave Direct Line aquí
const directLineUrl = 'https://directline.botframework.com/v3/directline';

export const useAzureBot = () => {
    const [conversationId, setConversationId] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        iniciarConversacion();
    }, []);

    // Inicia una conversación con el bot
    const iniciarConversacion = async () => {
        try {
            const response = await axios.post(`${directLineUrl}/conversations`, {}, {
                headers: { Authorization: `Bearer ${directLineSecret}` },
            });
            setConversationId(response.data.conversationId);
        } catch (error) {
            console.error("Error iniciando la conversación:", error);
        }
    };

    // Enviar mensaje al bot
    const enviarMensaje = async (texto) => {
        if (!conversationId) return;

        const message = {
            type: 'message',
            from: { id: 'user1' },
            text: texto,
        };

        try {
            await axios.post(`${directLineUrl}/conversations/${conversationId}/activities`, message, {
                headers: { Authorization: `Bearer ${directLineSecret}` },
            });
            setMessages([...messages, { text: texto, sender: 'user' }]);
            obtenerMensajes();
        } catch (error) {
            console.error("Error enviando mensaje:", error);
        }
    };

    // Obtener respuestas del bot
    const obtenerMensajes = async () => {
        if (!conversationId) return;

        try {
            const response = await axios.get(`${directLineUrl}/conversations/${conversationId}/activities`, {
                headers: { Authorization: `Bearer ${directLineSecret}` },
            });

            // Filtra los mensajes del bot y actualiza el estado
            const botMessages = response.data.activities
                .filter(activity => activity.from.id !== 'user1')
                .map(activity => ({ text: activity.text, sender: 'bot' }));

            setMessages(prevMessages => [...prevMessages, ...botMessages]);
        } catch (error) {
            console.error("Error obteniendo mensajes:", error);
        }
    };

    return { messages, enviarMensaje };
};
export default useAzureBot;