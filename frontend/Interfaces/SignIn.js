import React, { useState } from 'react';
import { View, Text, StyleSheet, Keyboard, TextInput, TouchableOpacity, StatusBar, TouchableWithoutFeedback, Alert } from 'react-native';
import axios from 'axios';
import { CommonActions } from '@react-navigation/native';
import {Ionicons} from "@expo/vector-icons";

const SignIn = ({navigation}) => {
    const [NumCtl, setNum] = useState(''); // Cambiar por el nombre de la variable que se usará en el backend
    const [password, setPassword] = useState(''); // Cambiar por el nombre de la variable que se usará en el backend

    const handleSignIn = async () => {
        try {
            let response = await axios.post('http://', {
                NumCtl: NumCtl,  // Cambiar por el nombre de la variable que se usará en el backend
                password: password, // Cambiar por el nombre de la variable que se usará en el backend
            });
            if (response.status === 200) {
                Alert.alert('Login exitoso');
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{name: 'Estudiante'}],
                    })
                );
                return;
            }
        } catch (error) {
            if (error.response.status === 401) {
                Alert.alert('Número de control o contraseña incorrectos');
            } else {
                Alert.alert('Error inesperado');
            }
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <View style={styles.circleBottomL}></View>
                <View style={styles.circleBottomR}></View>
                <View style={styles.circleTopR}></View>
                <View style={styles.circleTopRR}></View>

                <Ionicons
                    name="arrow-back"
                    size={30}
                    color="black"
                    style={styles.backIcon}
                    onPress={() => navigation.goBack()}
                />
                <StatusBar barStyle="dark-content" />
                <Text style={styles.title}>Sign In</Text>
                <Text style={styles.subtitle}>Bienvenido de vuelta</Text>
                <View style={styles.iconContainer}>
                    <Text style={styles.icon}>👤</Text>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Num de Control"
                    placeholderTextColor="#8c8c8c"
                    value={NumCtl}
                    onChangeText={setNum}
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#8c8c8c"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleSignIn} // Cambiar por el nombre de la función
                >
                    <Text style={styles.buttonText}>SIGN-IN</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F2',
        paddingHorizontal: 20,
    },
    backIcon: {
        position: 'absolute',
        top: 90,
        left: 20,
    },
    title: {
        fontSize: 36,
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
    iconContainer: {
        backgroundColor: '#E6E6E6',
        borderRadius: 50,
        padding: 20,
        marginTop: 50,
        alignSelf: 'center',
    },
    icon: {
        fontSize: 50,
        color: '#333',
        alignSelf: 'center',
    },
    input: {
        width: '100%',
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        fontSize: 16,
        marginTop: 40,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
        elevation: 3,
    },
    button: {
        width: '100%',
        height: 60,
        backgroundColor: '#F4F4F4',
        borderRadius: 65,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 150,
    },
    buttonText: {
        color: '#090909',
        fontSize: 18,
        fontWeight: 'bold',
    },
    circleBottomL: {
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: 200,
        backgroundColor: '#002540',
        bottom: -100,
        left: -100,
        zIndex: -1,
    },
    circleBottomR: {
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: 200,
        backgroundColor: '#97E4FF',
        bottom: -150,
        right: -100,
        zIndex: -1, // Asegura que el círculo esté detrás
    },
    circleTopR: {
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: 300,
        backgroundColor: '#002540',
        top: -180,
        right: -250,
        zIndex: -1,
    },
    circleTopRR: {
        position: 'absolute',
        width: 400,
        height: 250,
        borderRadius: 300,
        backgroundColor: '#97E4FF',
        top: 50,
        right: -280,
        zIndex: -2,
    },
});

export default SignIn;
