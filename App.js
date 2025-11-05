import React, { Component } from "react";

import LogInPage from "./pages/login";
import Register from "./pages/register";
import Homepage from "./pages/homepage";
import ChatScreen from "./pages/chatscreen";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LogInPage} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen
            name="Homepage"
            component={Homepage}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="ChatScreen" component={ChatScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
