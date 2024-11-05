import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, Animated, TouchableWithoutFeedback, StyleSheet, Dimensions, FlatList, Modal, TextInput, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const TaskManagementScreen = ({navigation}) => {
    const [tasks, setTasks] = useState([
        { id: '1', category: 'Hoy', title: 'Tarea 1', description: 'Ecuaciones Diferenciales - Ecuaciones Exactas', status: '1 de 4', color: '#A8E6CF' },
        { id: '2', category: 'Hoy', title: 'Tarea 2', description: 'Administración de Base de Datos - Comandos', status: '1 de 4', color: '#FF8B94' },
        { id: '3', category: 'Hoy', title: 'Tarea 3', description: 'Taller de Investigación - Documentación', status: '1 de 4', color: '#FFD3B6' },
        { id: '4', category: 'Mañana', title: 'Tarea 4', description: 'Lorem ipsum dolor sit amet', status: '1 de 4', color: '#AECBFA' },
    ]);
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '', color: '#A8E6CF' });

    const slideAnim = useRef(new Animated.Value(-width)).current;

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

    const [isChatbotVisible, setChatbotVisible] = useState(false);

    const toggleChatbot = () => {
        setChatbotVisible(!isChatbotVisible);
    };
    const toggleModal = () => setModalVisible(!isModalVisible);

    const addTask = () => {
        setTasks([...tasks, { id: Date.now().toString(), category: 'Hoy', ...newTask, status: '1 de 4' }]);
        setNewTask({ title: '', description: '', color: '#A8E6CF' });
        toggleModal();
    };

    const deleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={toggleSidebar}>
                    <Ionicons name="menu" size={width * 0.06} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Gestión de tareas</Text>
                <TouchableOpacity onPress={toggleModal}>
                    <Ionicons name="add-circle" size={width * 0.06} color="black" />
                </TouchableOpacity>
            </View>

            {/* Overlay cuando el sidebar esté visible */}
            {isSidebarVisible && (
                <TouchableWithoutFeedback onPress={toggleSidebar}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>
            )}

            {/* Sidebar animado */}
            <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
                <View style={styles.profileContainer}>
                    <Image
                        source={{ uri: 'https://your-image-url.com' }} // Reemplaza con la URL de tu imagen
                        style={styles.profileImage}
                    />
                    <Text style={styles.profileName}>Lionel Andrés</Text>
                    <Text style={styles.profileSurname}>Messi Cuccittini</Text>
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
                <TouchableOpacity style={styles.drawerItem}>
                    <Ionicons name="log-out-outline" size={24} color="red" />
                    <Text style={[styles.drawerText, { color: 'red' }]}>Cerrar sesión</Text>
                </TouchableOpacity>
            </Animated.View>

            {/* Sección de tareas */}
            <Text style={styles.sectionTitle}>Hoy</Text>
            <FlatList
                data={tasks.filter(task => task.category === 'Hoy')}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={[styles.taskContainer, { backgroundColor: item.color }]}>
                        <View style={styles.statusContainer}>
                            <Text style={styles.statusText}>{`Status\n${item.status}`}</Text>
                        </View>
                        <View style={styles.taskInfo}>
                            <Text style={styles.taskTitle}>{item.title}</Text>
                            <Text style={styles.taskDescription}>{item.description}</Text>
                        </View>
                        <TouchableOpacity onPress={() => deleteTask(item.id)}>
                            <Ionicons name="trash-outline" size={width * 0.05} color="black" />
                        </TouchableOpacity>
                    </View>
                )}
            />

            <Text style={styles.sectionTitle}>Mañana</Text>
            <FlatList
                data={tasks.filter(task => task.category === 'Mañana')}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={[styles.taskContainer, { backgroundColor: item.color }]}>
                        <View style={styles.statusContainer}>
                            <Text style={styles.statusText}>{`Status\n${item.status}`}</Text>
                        </View>
                        <View style={styles.taskInfo}>
                            <Text style={styles.taskTitle}>{item.title}</Text>
                            <Text style={styles.taskDescription}>{item.description}</Text>
                        </View>
                        <TouchableOpacity onPress={() => deleteTask(item.id)}>
                            <Ionicons name="trash-outline" size={width * 0.05} color="black" />
                        </TouchableOpacity>
                    </View>
                )}
            />

            {/* Botón de soporte */}
            <TouchableOpacity style={styles.supportIcon} onPress={() => navigation.navigate("ChatBot")}>
            <Ionicons name="chatbubble-ellipses" size={24} color="white" />
        </TouchableOpacity>

            {/* Modal para agregar tareas */}
            <Modal visible={isModalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <TextInput
                        placeholder="Título de la tarea"
                        value={newTask.title}
                        onChangeText={(text) => setNewTask({ ...newTask, title: text })}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Descripción de la tarea"
                        value={newTask.description}
                        onChangeText={(text) => setNewTask({ ...newTask, description: text })}
                        style={styles.input}
                    />

                    <TouchableOpacity onPress={addTask} style={styles.addButton}>
                        <Text style={styles.addButtonText}>Agregar Tarea</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleModal} style={styles.cancelButton}>
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default TaskManagementScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F2',
    },
    header: {
        flexDirection: 'row',
        padding: height * 0.02,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: width * 0.05,
        fontWeight: 'bold',
    },
    sidebar: {
        position: 'absolute',
        width: '70%',
        height: '100%',
        backgroundColor: '#f2f2f2',
        padding: width * 0.04,
        zIndex: 2,
    },
    overlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1,
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: height * 0.04,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 10,
    },
    profileName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    profileSurname: {
        fontSize: 14,
        color: '#666',
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    drawerText: {
        fontSize: 16,
        marginLeft: 10,
    },
    sectionTitle: {
        fontSize: width * 0.04,
        fontWeight: 'bold',
        padding: width * 0.03,
    },
    taskContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: width * 0.04,
        marginHorizontal: width * 0.02,
        borderRadius: 10,
        marginBottom: height * 0.01,
    },
    statusContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusText: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    taskInfo: {
        flex: 1,
        paddingHorizontal: width * 0.04,
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    taskDescription: {
        fontSize: 14,
        color: '#666',
    },
    supportIcon: {
        position: 'absolute',
        bottom: height * 0.04,
        right: width * 0.05,
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 30,
        zIndex: 10,
    },
    modalContainer: {
        flex: 1,
        padding: width * 0.05,
        justifyContent: 'center',
        backgroundColor: '#FFF',
    },
    input: {
        padding: width * 0.04,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        marginBottom: height * 0.02,
    },
    addButton: {
        backgroundColor: '#007AFF',
        padding: height * 0.02,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: height * 0.02,
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#007AFF',
        fontSize: 16,
    },
});