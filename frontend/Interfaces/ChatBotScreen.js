import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Button, Text } from 'react-native';
import { DirectLine } from 'botframework-directlinejs';

const ChatbotScreen = () => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const directLine = new DirectLine({
        secret: 'BHmYkbaAC2c.kSwdWbpySdHMRvsHGSJakyjwjD_SF4fgu-AF3wEugMw' // Reemplaza con tu clave de Direct Line
    });

    useEffect(() => {
        const subscription = directLine.activity$
            .subscribe(activity => {
                if (activity.from.id !== 'user') {
                    setMessages(prevMessages => [...prevMessages, { text: activity.text, isUser: false }]);
                }
            });

        return () => subscription.unsubscribe(); // Limpia la suscripción
    }, []);

    const sendMessage = () => {
        if (message.trim() !== '') {
            setMessages([...messages, { text: message, isUser: true }]);
            directLine.postActivity({
                from: { id: 'user', name: 'User' },
                type: 'message',
                text: message
            }).subscribe(
                () => setMessage(''),
                error => console.error('Error enviando mensaje:', error)
            );
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.chatContainer}>
                {messages.map((msg, index) => (
                    <View key={index} style={[styles.messageContainer, msg.isUser ? styles.userMessage : styles.botMessage]}>
                        <Text style={styles.messageText}>{msg.text}</Text>
                    </View>
                ))}
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Type your message"
                />
                <Button title="Send" onPress={sendMessage} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    chatContainer: {
        flex: 1,
        width: '100%',
        padding: 16,
        overflow: 'scroll'
    },
    messageContainer: {
        padding: 12,
        borderRadius: 8,
        marginVertical: 4
    },
    userMessage: {
        backgroundColor: '#DCF8C6',
        alignSelf: 'flex-end'
    },
    botMessage: {
        backgroundColor: '#F0F0F0',
        alignSelf: 'flex-start'
    },
    messageText: {
        fontSize: 16
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8
    },
    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginRight: 8
    }
});

export default ChatbotScreen;
