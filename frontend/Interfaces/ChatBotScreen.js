import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useAzureBot } from './useAzureBot';

const ChatBotScreen = () => {
    const { messages, enviarMensaje } = useAzureBot();
    const [inputText, setInputText] = useState('');

    const handleSend = () => {
        if (inputText.trim()) {
            enviarMensaje(inputText);
            setInputText('');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={90}
        >
            <FlatList
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={[styles.messageBubble, item.sender === 'bot' ? styles.botBubble : styles.userBubble]}>
                        <Text style={styles.messageText}>{item.text}</Text>
                    </View>
                )}
                inverted
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Escribe tu mensaje..."
                    value={inputText}
                    onChangeText={setInputText}
                />
                <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                    <Text style={styles.sendButtonText}>Enviar</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

export default ChatBotScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f2f2f2', padding: 30, justifyContent: 'flex-end' },
    messageBubble: { padding: 10, borderRadius: 8, marginVertical: 4, maxWidth: '80%' },
    botBubble: { backgroundColor: '#ececec', alignSelf: 'flex-start' },
    userBubble: { backgroundColor: '#007AFF', alignSelf: 'flex-end' },
    messageText: { color: '#fff' },
    inputContainer: { flexDirection: 'row', padding: 10, alignItems: 'center' },
    textInput: { flex: 1, backgroundColor: '#fff', borderRadius: 8, paddingHorizontal: 10, height: 50 },
    sendButton: { marginLeft: 10, backgroundColor: '#007AFF', borderRadius: 8, padding: 10 },
    sendButtonText: { color: '#fff', fontWeight: 'bold' },
});