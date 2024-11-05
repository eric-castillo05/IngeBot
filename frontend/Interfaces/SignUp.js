    import { useState } from 'react';
    import { View, Text, StyleSheet, TextInput,ScrollView, TouchableOpacity,TouchableWithoutFeedback, StatusBar,Keyboard ,Alert, Image } from 'react-native';
    import {Ionicons} from "@expo/vector-icons";
    import * as ImagePicker from 'expo-image-picker';

    const SignUp = ({ navigation }) => {
        const [name, setName] = useState('');
        const [middle_name, setmiddle_name] = useState('');
        const [last_name, setLast_name] = useState('');
        const [email, setEmail] = useState('');
        const [control_number, setControl_Number] = useState('');
        const [password, setPassword] = useState('');
        const [confirmPassword, setConfirmPassword] = useState('');
        const [image, setImage] = useState(null);

        const handleSignUp = async () => {
            if (password !== confirmPassword) {
                Alert.alert('Error', 'Las contraseñas no coinciden');
                return;
            }

            const registrationData = new FormData();
            registrationData.append('first_name', name);
            registrationData.append('last_name', last_name);
            registrationData.append('middle_name', middle_name);
            registrationData.append('email', email);
            registrationData.append('control_number', control_number);
            registrationData.append('password', password);

            // Solo agrega la imagen si se ha seleccionado una
            if (image) {
                registrationData.append('image', {
                    uri: image.uri,
                    name: 'profile.jpg',
                    type: 'image/jpeg'
                });
            }

            try {
                const response = await fetch('http://192.168.0.106:5000/users/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    body: registrationData,
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

        const pickImage = async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.cancelled) {
                setImage(result.assets[0]); // Selecciona la primera imagen de los resultados, si usa `assets`
            }
        };
        const generateEmail = (controlNumber) => {
            return `L${controlNumber}@zacatepec.tecnm.mx`;
        };

        const handleControlNumberChange = (value) => {
            setControl_Number(value);
            setEmail(generateEmail(value)); // Genera el correo y lo guarda por separado
        };

        return (
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <View style={styles.container}>
                        <View style={styles.circleBottomL}></View>
                        <View style={styles.circleBottomR}></View>
                        <View style={styles.circleTopR}></View>
                        <View style={styles.circleTopRR}></View>

                        {/*
                        <Ionicons
                            name="arrow-back"
                            size={30}
                            color="black"
                            style={styles.backIcon}
                            onPress={() => navigation.goBack()}
                        />
                        */}
                        <StatusBar barStyle="dark-content" />
                        <Text style={styles.title}>Sign Up</Text>
                        <Text style={styles.subtitle}>Hola! Únete</Text>


                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Nombre"
                                placeholderTextColor="#8c8c8c"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Segundo Nombre"
                                placeholderTextColor="#8c8c8c"
                                value={middle_name}
                                onChangeText={setmiddle_name}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Apellido"
                                placeholderTextColor="#8c8c8c"
                                value={last_name}
                                onChangeText={setLast_name}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Número de Control"
                            placeholderTextColor="#8c8c8c"
                            value={control_number}
                            onChangeText={handleControlNumberChange}
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
                        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                            <Text style={styles.imageButtonText}>📷 Seleccionar Imagen</Text>
                        </TouchableOpacity>

                        {image && (
                            <Image
                                source={{ uri: image.uri }}
                                style={{ width: 200, height: 200, borderRadius: 10, marginBottom: 20, alignSelf: 'center' , marginTop: 20}}
                            />
                        )}

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleSignUp}
                        >
                            <Text style={styles.buttonText}>SIGN-UP</Text>
                        </TouchableOpacity>
                    </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            );
    };

    const styles = StyleSheet.create({
        scrollContainer: {
            flexGrow: 1,
            justifyContent: 'center',
        },
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
            marginTop: 50,
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
        imageButton: {
            backgroundColor: '#DFDFDF',
            borderRadius: 25,
            paddingVertical: 15,
            alignItems: 'center',
            marginTop: 20,
        },
        imageButtonText: {
            color: '#002540',
            fontSize: 16,
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

