import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import StartScreen from "./Interfaces/StartScreen";
import EmpecemosScreen from "./Interfaces/EmpecemosScreen";
import SignIn from "./Interfaces/SignIn";
import SignUp from "./Interfaces/SignUp";
import MainScreen from "./Interfaces/MainScreen";
import ChatBotScreen from "./Interfaces/ChatBotScreen";
import NuevaTareaScreen from "./Interfaces/NuevaTareaScreen";

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: true, // Oculta el encabezado en todas las pantallas
                }}
            >
                <Stack.Screen name="Start" component={StartScreen} />
                <Stack.Screen name="Empecemos" component={EmpecemosScreen} />
                <Stack.Screen name="SignIn" component={SignIn} />
                <Stack.Screen name="SignUp" component={SignUp} />
                <Stack.Screen name="Main" component={MainScreen} />
                <Stack.Screen name="ChatBot" component={ChatBotScreen} />
                <Stack.Screen name="NuevaTarea" component={NuevaTareaScreen} />

            </Stack.Navigator>
        </NavigationContainer>
    );
}


