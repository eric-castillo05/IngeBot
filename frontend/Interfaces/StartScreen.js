import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const StartScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/Logo.png')}
                style={styles.logoImage}  // Cambié el nombre del estilo
            />
            <Text style={styles.tagline}></Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Empecemos")} // Debe coincidir con el nombre registrado
            >
                <Text style={styles.buttonText}>INICIA</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#001f38',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImage:{
        width:350,
        height:350,
        resizeMode:'contain',
        marginTop: 100,
    },
    logoText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#7cd6f9',
        marginBottom: 10,
        letterSpacing: 5,
    },
    tagline: {
        fontSize: 16,
        color: '#a8bfc9',
        marginBottom: 250,
        textAlign: 'bottom',
    },
    button: {
        backgroundColor: '#a4dcff',
        paddingVertical: 15,
        paddingHorizontal: 180,
        borderRadius: 20,
    },
    buttonText: {
        fontSize: 18,
        color: '#001f38',
        fontWeight: 'bold',
    },
});


export default StartScreen;
