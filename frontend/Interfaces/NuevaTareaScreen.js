import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const NuevaTareaScreen = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [subtasks, setSubtasks] = useState([
        { id: 1, text: 'Subtarea 1', completed: false },
        { id: 2, text: 'Subtarea 2', completed: false },
        { id: 3, text: 'Subtarea 3', completed: false },
    ]);

    const toggleSubtask = (id) => {
        setSubtasks((prevSubtasks) =>
            prevSubtasks.map((subtask) =>
                subtask.id === id ? { ...subtask, completed: !subtask.completed } : subtask
            )
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.closeButton}>X</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Nueva Tarea</Text>
                <TouchableOpacity onPress={() => {/* handle save task */}}>
                    <Text style={styles.saveButton}>✔</Text>
                </TouchableOpacity>
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
                <TextInput
                    placeholder="Añade fecha límite"
                    style={[styles.input, styles.inputWithIcon]}
                    value={deadline}
                    onChangeText={setDeadline}
                />
            </View>

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
                <TouchableOpacity style={styles.saveTaskButton} onPress={() => {/* handle save task */}}>
                    <Text style={styles.buttonText}>Guardar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF', padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10 },
    closeButton: { color: '#1C160C', fontSize: 24 },
    title: { color: '#1C160C', fontSize: 20, fontWeight: 'bold' },
    saveButton: { color: '#1C160C', fontSize: 24 },
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
