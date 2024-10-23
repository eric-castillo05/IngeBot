import React, { useRef } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet } from 'react-native';

const CircleTransition = () => {
    // Referencias para las animaciones
    const circle1Anim = useRef(new Animated.Value(0)).current;
    const circle2Anim = useRef(new Animated.Value(0)).current;

    const startTransition = () => {
        // Animación para ambos círculos
        Animated.parallel([
            Animated.timing(circle1Anim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(circle2Anim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            })
        ]).start();
    };

    const circle1Style = {
        transform: [
            {
                translateX: circle1Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 150], // Mueve el círculo 150px
                }),
            },
            {
                translateY: circle1Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 150], // Mueve el círculo 150px
                }),
            },
        ],
    };

    const circle2Style = {
        transform: [
            {
                translateX: circle2Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -150], // Mueve el círculo -150px
                }),
            },
            {
                translateY: circle2Anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -150], // Mueve el círculo -150px
                }),
            },
        ],
    };

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.circle, circle1Style]} />
            <Animated.View style={[styles.circle, styles.circle2, circle2Style]} />

            <TouchableOpacity style={styles.button} onPress={startTransition}>
                <View style={styles.buttonText}>Iniciar Transición</View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circle: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#007BFF',
    },
    circle2: {
        backgroundColor: '#FF5733',
    },
    button: {
        marginTop: 50,
        padding: 10,
        backgroundColor: '#000',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default CircleTransition;
