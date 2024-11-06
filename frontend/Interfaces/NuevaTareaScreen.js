import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

const NuevaTareaScreen = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [tasks, setTasks] = useState([]); // Estado para almacenar tareas
    const [subtasks, setSubtasks] = useState([
        { id: 1, text: 'Subtarea 1', completed: false },
        { id: 2, text: 'Subtarea 2', completed: false },
        { id: 3, text: 'Subtarea 3', completed: false },
    ]);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const toggleSubtask = (id) => {
        setSubtasks((prevSubtasks) =>
            prevSubtasks.map((subtask) =>
                subtask.id === id ? { ...subtask, completed: !subtask.completed } : subtask
            )
        );
    };

    const saveTask = () => {
        if (title.trim() === '' || description.trim() === '') {
            Alert.alert("Error", "Por favor completa todos los campos");
            return;
        }

        const newTask = { title, description, deadline, subtasks };
        setTasks([...tasks, newTask]);
        setTitle('');
        setDescription('');
        setDeadline('');
        setSubtasks(subtasks.map(subtask => ({ ...subtask, completed: false })));
        Alert.alert("Tarea guardada", "La tarea se ha guardado exitosamente.");
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const date = selectedDate.toLocaleDateString();
            setDeadline(date);
        }
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
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Añade fecha límite</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <TextInput
                            placeholder="Añade fecha límite"
                            style={[styles.input, styles.inputWithIcon]}
                            value={deadline}
                            editable={false}
                        />
                    </TouchableOpacity>
                </View>

                {showDatePicker && (
                    <DateTimePicker
                        value={new Date()}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}

                <View>
                    {subtasks.map((subtask) => (
                        <View key={subtask.id} style={styles.subtaskContainer}>
                            <TouchableOpacity
                                onPress={() => toggleSubtask(subtask.id)}
                                style={styles.checkboxContainer}
                            >
                                {subtask.completed && (
                                    <Ionicons name="checkmark" size={20} color="white" />
                                )}
                            </TouchableOpacity>
                            <Text style={styles.subtaskText}>{subtask.text}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity style={styles.addButton} onPress={() => {/* handle add subtask */}}>
                        <Text style={styles.buttonText}>Añade subtarea</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveTaskButton} onPress={saveTask}>
                        <Text style={styles.buttonText}>Guardar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

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
        backgroundColor: '#019863',
        marginRight: 10,
    },
    subtaskText: { color: '#1C160C', fontSize: 16 },
    footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
    addButton: {
        backgroundColor: '#F4EFE6',
        padding: 10,
        borderRadius: 20,
    },
    saveTaskButton: {
        backgroundColor: '#019863',
        padding: 10,
        borderRadius: 20,
    },
    buttonText: { color: '#FFFFFF', fontWeight: 'bold' },
});

export default NuevaTareaScreen;