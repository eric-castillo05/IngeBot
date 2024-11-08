import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, TouchableWithoutFeedback, StyleSheet, Dimensions, FlatList, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const TaskManagementScreen = ({ navigation }) => {
    const [tasks, setTasks] = useState([]);
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const [uid, setUid] = useState(null);
    const [userName, setUserName] = useState('');


    const slideAnim = useRef(new Animated.Value(-width)).current;

    useEffect(() => {
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

    const fetchUserData = async () => {
        if (uid) {
            try {
                const response = await fetch(`http://192.168.0.106:5000//users/${uid}/personal_data`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.user) {
                        // Asumiendo que "user" contiene un campo "name"
                        setUserName(data.user.displayName);
                    } else {
                        Alert.alert('Error', 'No se encontró el nombre del usuario');
                    }
                } else {
                    Alert.alert('Error', 'No se pudo obtener los datos del usuario');
                }
            } catch (error) {
                Alert.alert('Error', 'Hubo un problema al obtener los datos del usuario');
                console.error("Error en fetchUserData:", error);
            }
        }
    };


    useEffect(() => {
        fetchUserData(); // Llama a esta función cada vez que se cargue el UID
    }, [uid]);

    const fetchTasks = async () => {
        if (uid) {
            try {
                const response = await fetch(`http://192.168.0.106:5000/tasks/${uid}/get_all`);
                if (response.ok) {
                    const tasksData = await response.json();
                    const formattedTasks = tasksData.map(task => ({ id: task.id, ...task.data }));
                    setTasks(formattedTasks);
                    console.log("Tareas obtenidas:", formattedTasks);
                }
            } catch (error) {
                Alert.alert('Error', 'No se pudo obtener las tareas');
                console.error("Error en fetchTasks:", error);
            }
        }
    };
   useEffect(() => {
        fetchTasks();
    }, [uid]);

    const PriorityColor = (priority) => {
        switch (priority.toLowerCase()) {  // Convertimos el valor a minúsculas para evitar problemas de mayúsculas
            case 'high': return '#ff4d4d';
            case 'medium': return '#ffc500';
            case 'low': return '#6BCB77';
            default: return '#A8E6CF';  // Color por defecto en caso de que la prioridad no coincida
        }
    };


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


    const deleteTask = async (id) => {
        console.log("ID de la tarea a eliminar:", id);  // Verificar que el ID esté llegando
        try {
            const response = await fetch(`http://192.168.0.106:5000/tasks/delete`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ uid, task_id: id })
            });

            if (response.ok) {
                // Filtra la tarea eliminada del estado 'tasks'
                setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
                console.log("Tarea eliminada con éxito");
            } else {
                Alert.alert('Error', 'No se pudo eliminar la tarea en el servidor.');
            }
        } catch (error) {
            Alert.alert('Error', 'Hubo un problema al intentar eliminar la tarea.');
            console.error("Error en deleteTask:", error);
        }
    };

    const groupTasksByWeek = (tasks) => {
        const startOfWeek = moment().startOf('week'); // Inicio de esta semana
        const endOfWeek = moment().endOf('week'); // Fin de esta semana
        const startOfNextWeek = moment().add(1, 'week').startOf('week'); // Inicio de la próxima semana
        const endOfNextWeek = moment().add(1, 'week').endOf('week'); // Fin de la próxima semana

        return {
            thisWeek: tasks.filter(task => {
                const dueDate = moment(task.due_date[0], 'DD/MM/YYYY');
                return dueDate.isBetween(startOfWeek, endOfWeek, null, '[]');
            }),
            nextWeek: tasks.filter(task => {
                const dueDate = moment(task.due_date[0], 'DD/MM/YYYY');
                return dueDate.isBetween(startOfNextWeek, endOfNextWeek, null, '[]');
            }),
            upcoming: tasks.filter(task => {
                const dueDate = moment(task.due_date[0], 'DD/MM/YYYY');
                return dueDate.isAfter(endOfNextWeek);
            }),
        };
    };

    const groupedTasks = groupTasksByWeek(tasks);

    // Función de renderizado de tarea para mantener limpio el componente principal
    const renderTask = (task) => (
        <TouchableOpacity
            onPress={() => navigation.navigate('Subtask', { taskId: task.id })}
            style={[styles.taskContainer, { backgroundColor: PriorityColor(task.priority) }]}
        >
            <AnimatedCircularProgress
                size={50}
                width={5}
                fill={task.progress}
                tintColor="#00e0ff"
                backgroundColor="#3d5875"
                style={styles.progressCircle}
            />
            <View style={{ flex: 1 }}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskDescription}>{task.description}</Text>
                <Text style={styles.dueDate}>{`Due: ${task.due_date}`}</Text>
            </View>
            <TouchableOpacity onPress={() => deleteTask(task.id)}>
                <Ionicons name="trash-outline" size={width * 0.05} color="black" />
            </TouchableOpacity>
        </TouchableOpacity>
    );


    useEffect(() => {
        const interval = setInterval(() => {
            fetchTasks(); // Llama a fetchTasks cada segundo
        }, 10000); // 1000 ms = 1 segundo

        return () => clearInterval(interval); // Limpia el intervalo al desmontar
    }, [uid]);

    useEffect(() => {
        fetchTasks();
    }, [uid]);




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
                    <Text style={styles.profileName}>{userName}</Text>
                </View>

                <TouchableOpacity style={styles.drawerItem}>
                    <Ionicons name="settings-outline" size={24} color="black" />
                    <Text style={styles.drawerText}>Configuración</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.drawerItem}>
                    <Ionicons name="shield-checkmark-outline" size={24} color="black" />
                    <Text style={styles.drawerText}>Privacidad y seguridad</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.drawerItem}>
                    <Ionicons name="information-circle-outline" size={24} color="black" />
                    <Text style={styles.drawerText}>Conócenos</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.drawerItem} onPress={handleSignOut}>
                    <Ionicons name="log-out-outline" size={24} color="red" />
                    <Text style={[styles.drawerText, { color: 'red' }]}>Cerrar sesión</Text>
                </TouchableOpacity>

            </Animated.View>

            {/* Tareas de Esta Semana */}
            <Text style={styles.sectionTitle}>Esta Semana</Text>
            <FlatList
                data={groupedTasks.thisWeek}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => renderTask(item)}
            />

            {/* Tareas de Próxima Semana */}
            <Text style={styles.sectionTitle}>Próxima Semana</Text>
            <FlatList
                data={groupedTasks.nextWeek}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => renderTask(item)}
            />

            {/* Tareas Próximamente */}
            <Text style={styles.sectionTitle}>Próximamente</Text>
            <FlatList
                data={groupedTasks.upcoming}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => renderTask(item)}
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
    taskContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: width * 0.04,
        marginHorizontal: width * 0.02,
        borderRadius: 10,
        marginBottom: height * 0.01,
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    taskDescription: {
        fontSize: 14,
        color: 'white',
    },
    dueDate: {
        fontSize: 12,
        color: '#090909',
    },
    progressCircle: {
        marginRight: width * 0.05,  // Adjust margin as needed
    },
    supportIcon: { position: 'absolute', bottom: height * 0.04, right: width * 0.05, backgroundColor: '#007AFF', padding: 15, borderRadius: 30 },
});
