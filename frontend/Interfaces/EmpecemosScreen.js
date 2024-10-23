import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EmpecemosScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>

            <View style={styles.circleTop}></View>
            <View style={styles.circleBottom}></View>

            <Ionicons
                name="arrow-back"
                size={30}
                color="black"
                style={styles.backIcon}
                onPress={() => navigation.goBack()}
            />

            <Text style={styles.title}>Empecemos</Text>
            <Text style={styles.subtitle}>Empieza por hacer Sign-In o Sign-Up</Text>

            <Image
                source={require('../assets/Bot.png')}
                style={styles.robotImage}
            />

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.buttonText}>SIGN-UP</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.signInButton]} onPress={() => navigation.navigate('SignIn')}>
                <Text style={styles.buttonText}>SIGN-IN</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    backIcon: {
        position: 'absolute',
        top: 90,
        left: 20,
    },
    title: {
        fontSize: 52,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 150,
        textAlign: 'left',
    },
    subtitle: {
        fontSize: 16,
        color: '#808080',
        marginTop: 20,
        textAlign: 'left',
    },
    robotImage: {
        width: 400,
        height: 300,
        resizeMode: 'contain',
        marginTop: 60,
        alignSelf: 'center',
    },
    button: {
        backgroundColor: '#F4F4F4',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 55,
        width: '80%',
        alignSelf: 'center',
    },
    signInButton: {
        backgroundColor: '#F4F4F4',
    },
    buttonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
    },
    circleTop: {
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: 200,
        backgroundColor: '#002540',
        bottom: -100,
        left: -100,
        zIndex: -1,
    },
    circleBottom: {
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: 200,
        backgroundColor: '#97E4FF',
        bottom: -150,
        right: -100,
        zIndex: -1, // Asegura que el círculo esté detrás
    },
});

export default EmpecemosScreen;
