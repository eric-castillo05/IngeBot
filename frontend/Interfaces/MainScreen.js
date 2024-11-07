import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, TouchableWithoutFeedback, StyleSheet, Dimensions, FlatList, Modal, TextInput, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const TaskManagementScreen = ({ navigation }) => {
    const [tasks, setTasks] = useState([]);
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', color: '#A8E6CF' });
    const [uid, setUid] = useState(null);

    const slideAnim = useRef(new Animated.Value(-width)).current;

    useEffect(() => {
        // Obtener el UID del usuario desde AsyncStorage
        const loadUid = async () => {
            try {
                const storedUid = await AsyncStorage.getItem('userUID');
                if (storedUid) {
                    setUid(storedUid);
                } else {
                    Alert.alert("Error", "UID no encontrado.");
                }
            } catch (error) {
                Alert.alert("Error", "No se pudo obtener el UID del usuario.");
            }
        };

        loadUid();
    }, []);

    useEffect(() => {
        const fetchTasks = async () => {
            if (uid) {
                try {
                    console.log("UID cargado:", uid); // Verifica si el UID se ha cargado
                    const response = await fetch(`http://192.168.0.106:5000/tasks/${uid}/get_all`);

                    // Revisa el estado de la respuesta
                    if (response.ok) {
                        const tasksData = await response.json();
                        console.log("Tareas recibidas del servidor:", tasksData); // Verifica los datos recibidos
                        setTasks(tasksData);
                    } else {
                        console.log("Error en la respuesta del servidor", response.status); // Agrega el estado de error
                        Alert.alert('', 'No se encontraron tareas');
                    }
                } catch (error) {
                    Alert.alert('Error', 'No se pudo obtener las tareas');
                    console.error("Error en fetchTasks:", error); // Muestra el error exacto
                }
            }
        };

        fetchTasks();
    }, [uid]); // Asegúrate de que fetchTasks se ejecute cuando userUID esté cargado


    const handleSignOut = async () => {
        Alert.alert(
            'Cerrar sesión',
            '¿Estás seguro de que quieres cerrar sesión?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Aceptar',
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem('userUID');
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Empecemos' }], // Reemplaza 'Empecemos' con el nombre de tu pantalla de inicio de sesión
                            });
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo cerrar sesión');
                        }
                    },
                },
            ]
        );
    };


    const toggleSidebar = () => {
        if (isSidebarVisible) {
            Animated.timing(slideAnim, {
                toValue: -width,
                duration: 300,
                useNativeDriver: true,
            }).start(() => setSidebarVisible(false));
        } else {
            setSidebarVisible(true);
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

    const toggleModal = () => setModalVisible(!isModalVisible);

    const addTask = () => {
        setTasks([...tasks, { id: Date.now().toString(), category: 'Hoy', ...newTask, status: '1 de 4' }]);
        setNewTask({ title: '', description: '', color: '#A8E6CF' });
        toggleModal();
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
        return;
    };



    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={toggleSidebar}>
                    <Ionicons name="menu" size={width * 0.06} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Gestión de tareas</Text>
                <TouchableOpacity onPress={() => navigation.navigate('NuevaTarea')}>
                    <Ionicons name="add-circle" size={width * 0.06} color="black" />
                </TouchableOpacity>
            </View>

            {isSidebarVisible && (
                <TouchableWithoutFeedback onPress={toggleSidebar}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>
            )}

            <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
                <View style={styles.profileContainer}>
                    <Image
                        source={{ uri: 'https://your-image-url.com' }}
                        style={styles.profileImage}
                    />
                    <Text style={styles.profileName}>Nombre Usuario</Text>
                </View>

                <TouchableOpacity style={styles.drawerItem}>
                    <Ionicons name="settings-outline" size={24} color="black" />
                    <Text style={styles.drawerText}>Configuración</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.drawerItem} onPress={handleSignOut}>
                    <Ionicons name="log-out-outline" size={24} color="red" />
                    <Text style={[styles.drawerText, { color: 'red' }]}>Cerrar sesión</Text>
                </TouchableOpacity>

            </Animated.View>

            <Text style={styles.sectionTitle}>Hoy</Text>
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={[styles.taskContainer]}>
                        <Text style={styles.taskTitle}>{item.title}</Text>
                        <TouchableOpacity onPress={() => deleteTask(item.id)}>
                            <Ionicons name="trash-outline" size={width * 0.05} color="black" />
                        </TouchableOpacity>
                    </View>
                )}
            />


            <TouchableOpacity style={styles.supportIcon} onPress={() => navigation.navigate("ChatBot")}>
                <Ionicons name="chatbubble-ellipses" size={24} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default TaskManagementScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F2F2' },
    header: { flexDirection: 'row', padding: height * 0.02, alignItems: 'center', justifyContent: 'space-between' },
    headerTitle: { fontSize: width * 0.05, fontWeight: 'bold' },
    sidebar: { position: 'absolute', width: '70%', height: '100%', backgroundColor: '#f2f2f2', padding: width * 0.04, zIndex: 2 },
    overlay: { position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 1 },
    profileContainer: { alignItems: 'center', marginBottom: height * 0.04 },
    profileImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 10 },
    drawerItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10 },
    drawerText: { fontSize: 16, marginLeft: 10 },
    sectionTitle: { fontSize: width * 0.04, fontWeight: 'bold', padding: width * 0.03 },
    taskContainer: { backgroundColor: '#007AFF' ,flexDirection: 'row', alignItems: 'center', padding: width * 0.04, marginHorizontal: width * 0.02, borderRadius: 10, marginBottom: height * 0.01 },
    taskTitle: { fontSize: 16, fontWeight: 'bold', flex: 1, color: 'white' },
    supportIcon: { position: 'absolute', bottom: height * 0.04, right: width * 0.05, backgroundColor: '#007AFF', padding: 15, borderRadius: 30 },
});
