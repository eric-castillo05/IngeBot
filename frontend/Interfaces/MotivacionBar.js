import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const MotivationalBar = () => {
    const [message, setMessage] = useState('');
    const [isVisibleFlag, setIsVisibleFlag] = useState(1); // Flag para controlar visibilidad (0: no mostrar, 1: mostrar)
    const slideAnim = useRef(new Animated.Value(-width)).current;

    const showMessage = async () => {
        if (isVisibleFlag === 1) {  // Solo mostrar si el flag es 1
            try {
                const response = await fetch('http://10.177.59.49:5000/motivational-message');
                const data = await response.json();
                console.log("Mensaje recibido:", data.message);
                setMessage(data.message);

                // Mostrar la barra con animación
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }).start();

                // Ocultar después de 3 segundos
                setTimeout(() => {
                    Animated.timing(slideAnim, {
                        toValue: -width,
                        duration: 500,
                        useNativeDriver: true,
                    }).start();
                }, 3000);
            } catch (error) {
                console.error("Error al obtener el mensaje motivacional:", error);
            }
        }
    };

    useEffect(() => {
        const interval = setInterval(showMessage, 10000); // Llamada cada 10 segundos
        return () => clearInterval(interval);
    }, [isVisibleFlag]); // Se ejecuta cada vez que cambia `isVisibleFlag`

    return isVisibleFlag === 1 ? (
        <Animated.View style={[styles.notificationBar, { transform: [{ translateX: slideAnim }] }]}>
            <Text style={styles.notificationText}>{message || "Mensaje predeterminado"}</Text>
        </Animated.View>
    ) : null;
};

const styles = StyleSheet.create({
    notificationBar: {
        position: 'absolute',
        top: 0,
        width: '100%',
        padding: 10,
        backgroundColor: '#007AFF',
        alignItems: 'center',
        zIndex: 10,
    },
    notificationText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default MotivationalBar;
