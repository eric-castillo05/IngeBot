import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';

const SubtaskScreen = ({ route, navigation }) => {
    const { taskId } = route.params;
    const [subtasks, setSubtasks] = useState([]);

    useEffect(() => {
        const fetchSubtasks = async () => {
            try {
                const response = await fetch(`http://192.168.0.106:5000/tasks/${taskId}/subtasks`);
                if (response.ok) {
                    const data = await response.json();
                    setSubtasks(data);
                } else {
                }
            } catch (error) {
            }
        };
        fetchSubtasks();
    }, [taskId]);

    const renderSubtask = ({ item }) => (
        <View style={styles.subtaskContainer}>
            <Text style={styles.subtaskTitle}>{item.title}</Text>
            <Text style={styles.subtaskDescription}>{item.description}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Subtareas de la Tarea</Text>
            <FlatList
                data={subtasks}
                keyExtractor={(item) => item.id}
                renderItem={renderSubtask}
            />
        </View>
    );
};

export default SubtaskScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F2F2', padding: 20 },
    header: { fontSize: 20, fontWeight: 'bold', marginTop: 40, alignSelf: 'center' },
    subtaskContainer: { padding: 15, marginBottom: 10, backgroundColor: '#fff', borderRadius: 5 },
    subtaskTitle: { fontSize: 16, fontWeight: 'bold' },
    subtaskDescription: { fontSize: 14, color: '#666' },
});
