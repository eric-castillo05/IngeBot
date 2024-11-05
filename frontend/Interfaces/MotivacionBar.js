import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const MotivationalBar = () => {
    const [message, setMessage] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const slideAnim = useRef(new Animated.Value(-width)).current;

    const showMessage = async () => {
        try {
            const response = await fetch('http://192.168.0.106:5000/motivational-message');
            const data = await response.json();
            setMessage(data.message);

            setIsVisible(true);
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start();

            setTimeout(() => {
                Animated.timing(slideAnim, {
                    toValue: -width,
                    duration: 500,
                    useNativeDriver: true,
                }).start(() => setIsVisible(false));
            }, 3000);
        } catch (error) {
            console.error("Error al obtener el mensaje motivacional:", error);
        }
    };

    useEffect(() => {
        const interval = setInterval(showMessage, 10000); // Llamada cada 10 segundos
        return () => clearInterval(interval);
    }, []);

    return isVisible ? (
        <Animated.View style={[styles.notificationBar, { transform: [{ translateX: slideAnim }] }]}>
            <Text style={styles.notificationText}>{message}</Text>
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
