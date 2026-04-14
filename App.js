import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

import BeginnerScreen from "./screens/BeginnerScreen";
import IntermediateScreen from "./screens/IntermediateScreen";
import ExpertScreen from "./screens/ExpertScreen";
import AdminScreen from "./screens/AdminScreen";

const Stack = createNativeStackNavigator();

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const login = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const userDoc = await getDoc(doc(db, "Users", uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role_id;
        setMessage(`Login successful! Role: ${role}`);

        // ✅ Navigate based on role
        if (role === "worker_beginner") navigation.replace("Beginner");
        else if (role === "worker_intermediate") navigation.replace("Intermediate");
        else if (role === "worker_expert") navigation.replace("Expert");
        else if (role === "admin") navigation.replace("Admin");
      } else {
        setMessage("Login successful, but no role found.");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <View style={{ flex:1, justifyContent:"center", padding:20 }}>
      <Text style={{ fontSize:20, marginBottom:20 }}>RBAC Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth:1, marginBottom:10, padding:8 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth:1, marginBottom:10, padding:8 }}
      />
      <Button title="Login" onPress={login} />
      <Text style={{ marginTop:20 }}>{message}</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Beginner" component={BeginnerScreen} />
        <Stack.Screen name="Intermediate" component={IntermediateScreen} />
        <Stack.Screen name="Expert" component={ExpertScreen} />
        <Stack.Screen name="Admin" component={AdminScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}