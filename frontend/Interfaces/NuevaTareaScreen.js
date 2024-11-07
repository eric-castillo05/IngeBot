import React, {useEffect, useState} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NuevaTareaScreen = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [subtasks, setSubtasks] = useState([]);
    const [newSubtaskText, setNewSubtaskText] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [userUID, setUserUID] = useState('');

    useEffect(() => {
        const fetchUserUID = async () => {
            const uid = await AsyncStorage.getItem('userUID');
            if (uid) {
                setUserUID(uid);
            } else {
                Alert.alert('Error', 'No se pudo obtener el identificador del usuario');
            }
        };
        fetchUserUID();
    }, []);

    const saveTask = async () => {
        if (title.trim() === '' || description.trim() === '' || !deadline) {
            Alert.alert("Error", "Por favor completa todos los campos");
            return;
        }

        const newTask = {
            title,
            description,
            due_date: deadline,
            priority,
            uid: userUID,  // Usa el userUID obtenido en el efecto
            subtasks,
        };

        try {
            const response = await fetch('http://192.168.0.106:5000/tasks/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTask),
            });

            if (response.ok) {
                setTitle('');
                setDescription('');
                setDeadline('');
                setPriority('Medium');
                setSubtasks([]);
                Alert.alert("Tarea guardada", "La tarea se ha guardado exitosamente.");
                navigation.goBack();
            } else {
                Alert.alert("Error", "No se pudo guardar la tarea");
            }
        } catch (error) {
            console.error('Error guardando tarea:', error);
            Alert.alert("Error", "Ocurrió un problema al intentar guardar la tarea");
        }
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const year = selectedDate.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;
            setDeadline(formattedDate);
        }
    };

    const addSubtask = () => {
        if (newSubtaskText.trim() !== '') {
            setSubtasks([...subtasks, { id: Date.now().toString(), text: newSubtaskText, completed: false }]);
            setNewSubtaskText('');
        }
    };

    const toggleSubtask = (id) => {
        setSubtasks((prevSubtasks) =>
            prevSubtasks.map((subtask) =>
                subtask.id === id ? { ...subtask, completed: !subtask.completed } : subtask
            )
        );
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Ionicons
                        name="arrow-back"
                        size={30}
                        color="black"
                        style={styles.backIcon}
                        onPress={() => navigation.goBack()}
                    />
                    <Text style={styles.title}>Nueva Tarea</Text>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Título</Text>
                    <TextInput
                        placeholder="Título"
                        style={styles.input}
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Descripción</Text>
                    <TextInput
                        placeholder="Descripción"
                        style={styles.input}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={3}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Añade fecha límite</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                        <Text style={styles.dateButtonText}>{deadline ? deadline : 'Seleccionar fecha'}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={new Date()}
                            mode="date"
                            display="default"
                            onChange={handleDateChange}
                        />
                    )}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Prioridad</Text>
                    <Picker
                        selectedValue={priority}
                        onValueChange={(itemValue) => setPriority(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Alta" value="High" />
                        <Picker.Item label="Media" value="Medium" />
                        <Picker.Item label="Baja" value="Low" />
                    </Picker>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Subtareas</Text>
                    <TextInput
                        placeholder="Añadir subtarea"
                        style={styles.input}
                        value={newSubtaskText}
                        onChangeText={setNewSubtaskText}
                        onSubmitEditing={addSubtask}
                    />
                    <TouchableOpacity style={styles.addButton} onPress={addSubtask}>
                        <Text style={styles.buttonText}>Añadir Subtarea</Text>
                    </TouchableOpacity>
                    <View>
                        {subtasks.map((subtask) => (
                            <View key={subtask.id} style={styles.subtaskContainer}>
                                <TouchableOpacity
                                    onPress={() => toggleSubtask(subtask.id)}
                                    style={[
                                        styles.checkboxContainer,
                                        subtask.completed && { backgroundColor: '#019863' },
                                    ]}
                                >
                                    {subtask.completed && <Ionicons name="checkmark" size={20} color="white" />}
                                </TouchableOpacity>
                                <Text
                                    style={[
                                        styles.subtaskText,
                                        subtask.completed && { textDecorationLine: 'line-through' },
                                    ]}
                                >
                                    {subtask.text}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.saveTaskButton} onPress={saveTask}>
                        <Text style={styles.buttonText}>Guardar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};
const styles = StyleSheet.create({
    scrollContainer: { flexGrow: 1, justifyContent: 'center' },
    container: { flex: 1, backgroundColor: '#FFFFFF', padding: 20, paddingTop: 40 },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, alignSelf: 'center' , marginTop: 40, marginRight: 130},
    backIcon: {marginRight: 110},
    title: { color: '#1C160C', fontSize: 20, fontWeight: 'bold', alignSelf: 'center' },
    inputGroup: { marginBottom: 20 },
    label: { color: '#1C160C', fontSize: 16, marginBottom: 5 },
    input: {
        borderWidth: 1,
        borderColor: '#E9DFCE',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        paddingHorizontal: 15,
        height: 50,
        color: '#1C160C',
    },
    date: { width: '100%', height: 50, backgroundColor: '#FFFFFF', borderRadius: 8, marginRight: 20,},
    inputWithIcon: { paddingRight: 40 },
    subtaskContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
    checkboxContainer: {
        width: 24,
        height: 24,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#E9DFCE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    subtaskText: {
        color: '#1C160C',
        fontSize: 16,
        flex: 1,
    },
    footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
    addButton: {
        backgroundColor: '#F4EFE6',
        padding: 10,
        borderRadius: 20,
        marginTop: 10,
    },
    saveTaskButton: {
        backgroundColor: '#019863',
        padding: 10,
        borderRadius: 20,
    },

    buttonText: { color: '#FFFFFF', fontWeight: 'bold' },
    dateButton: {
        borderWidth: 1,
        borderColor: '#E9DFCE',
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        paddingHorizontal: 15,
        height: 50,
        justifyContent: 'center',
    },
    dateButtonText: {
        color: '#1C160C',
        fontSize: 16,
    },

});

export default NuevaTareaScreen;
