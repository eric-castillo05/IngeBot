import React from 'react';
import { View, Text, StyleSheet, Keyboard, TextInput, TouchableOpacity, StatusBar, TouchableWithoutFeedback, Alert } from 'react-native';
import { useState } from 'react';
import {Ionicons} from "@expo/vector-icons";

const SignUp = ({navigation}) => {
    const [correo, setCorreo] = useState(''); // Cambiar por el nombre de la variable que se usará en el backend
    const [NumCtl, setNum] = useState(''); // Cambiar por el nombre de la variable que se usará en el backend
    const [password, setPassword] = useState(''); // Cambiar por el nombre de la variable que se usará en el backend
    const [confirmPassword, setConfirmPassword] = useState(''); // Cambiar por el nombre de la variable que se usará en el backend

    const handleSignUp = async () => {
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Las contraseñas no coinciden');
            return;
        }
        const registrationData = {
            correo,
            NumCtl,
            password
        };
        try {
            const response = await fetch('http://backend_aldo_y_eric/registro', { // Cambiar por la URL abckend
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registrationData),
            });

            if (response.status === 201) {
                Alert.alert('Registro exitoso', 'Tu cuenta ha sido creada correctamente');
                navigation.navigate('SignIn');
            } else {
                const errorData = await response.json();
                Alert.alert('Error en el registro', errorData.message || 'Hubo un problema con tu registro');
            }
        } catch (error) {
            Alert.alert('Error', 'Error en la conexión al servidor');
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
                    <Text style={styles.title}>Sign Up</Text>
                    <Text style={styles.subtitle}>Hola! Únete</Text>


                    <View style={styles.inputContainer}>
                        <Text style={styles.icon}>📧</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Correo Institucional"
                            placeholderTextColor="#8c8c8c"
                            value={correo}
                            onChangeText={setCorreo}
                            keyboardType="email-address"
                        />
                    </View>


                    <View style={styles.inputContainer}>
                        <Text style={styles.icon}>#️⃣</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Número de Control"
                            placeholderTextColor="#8c8c8c"
                            value={NumCtl}
                            onChangeText={setNum}
                            keyboardType="numeric"
                        />
                    </View>


                    <View style={styles.inputContainer}>
                        <Text style={styles.icon}>🔑</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Contraseña"
                            placeholderTextColor="#8c8c8c"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>


                    <View style={styles.inputContainer}>
                        <Text style={styles.icon}>🔑</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirmar contraseña"
                            placeholderTextColor="#8c8c8c"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                        />
                    </View>


                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSignUp}
                    >
                        <Text style={styles.buttonText}>SIGN-UP</Text>
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
        fontSize: 52,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 150,
        alignSelf: 'left',
    },
    subtitle: {
        fontSize: 18,
        color: '#8c8c8c',
        marginTop: 30,
        alignSelf: 'left',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#DFDFDF',
        borderRadius: 25,
        paddingHorizontal: 20,
        marginTop: 30,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
        elevation: 3,
    },
    icon: {
        fontSize: 18,
        marginRight: 10,
        color: '#8c8c8c',
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#000',
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
    }
});

export default SignUp;

