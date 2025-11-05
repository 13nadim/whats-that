import React, { Component } from "react";

import Chats from "./chats";
import Settings from "./settings";
import Edit from "./edit";
import Camera from "./camera";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

export default class Homepage extends Component {
  render() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Chats" component={Chats} />
        <Tab.Screen name="Contacts" component={Edit} />
        <Tab.Screen name="Settings" component={Settings} />
        <Tab.Screen name="Camera" component={Camera} />
      </Tab.Navigator>
    );
  }
}
