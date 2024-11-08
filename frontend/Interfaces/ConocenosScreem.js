import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AboutScreen = ({navigation}) => {
    return (
        <View style={styles.container}>
            <Ionicons
                name="arrow-back"
                size={30}
                color="black"
                style={styles.backIcon}
                onPress={() => navigation.goBack()}
            />
            {/* Header Image */}
            <Image
                source={require('../assets/conocenosfoto.png')}
                style={styles.headerImage}
            />

            {/* Title */}
            <Text style={styles.title}>Sobre Nosotros</Text>

            {/* Description */}
            <Text style={styles.description}>
                Creemos que todos los estudiantes pueden encontrar el éxito en la escuela. Nuestra aplicación está diseñada para ayudarle a mantenerse organizado y al tanto de sus tareas.
            </Text>

            {/* Support Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Soporte</Text>
                <Text style={styles.sectionText}>Estamos aquí para ayudarte, desde preparar tu primera.</Text>
            </View>

            {/* Transparency Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Transparencia</Text>
                <Text style={styles.sectionText}>Trabajamos constantemente para crear el mejor producto posible para usted.</Text>
            </View>

            {/* Privacy Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Privacidad</Text>
                <Text style={styles.sectionText}>Tus datos son tuyos y sólo tuyos. Nunca lo vendemos ni lo compartimos con terceros.</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',

    },
    backIcon: {
        position: 'absolute',
        top: 60,
        left: 20,
    },
    headerImage: {
        width: '100%',
        height: 200,
        borderRadius: 0,
        marginTop: 100,
        padding: 0,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    description: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    section: {
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingHorizontal: 20,
    },
    sectionText: {
        fontSize: 16,
        color: '#666',
        paddingHorizontal: 20,
    },
});

export default AboutScreen;
