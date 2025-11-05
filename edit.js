import React, { Component } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import ButtonElement from "../elements/button";
import InputElement from "../elements/input";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput } from "react-native-web";

export default class Edit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contactData: [],
      blockedData: [],
      user_id: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      error: "",
    };
  }
  componentDidMount() {
    this.viewContacts();
  }

  viewContacts = async () => {
    const token = await AsyncStorage.getItem("whatsthat_session_token");
    try {
      let response = await fetch("http://localhost:3333/api/1.0.0/contacts", {
        method: "GET",
        headers: {
          "X-Authorization": token,
        },
      });
      let json = await response.json();
      this.setState({
        contactData: json,
      });
    } catch (error) {
      console.log(error);
    }
  };

  addContact = async () => {
    const token = await AsyncStorage.getItem("whatsthat_session_token");
    const user_id = this.state.user_id;
    return fetch(
      "http://localhost:3333/api/1.0.0/user/" + user_id + "/contact",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": token,
        },
      }
    )
      .then((response) => {
        console.log("Add a contact");
        this.viewContacts();
        this.setState({
          user_id: "",
        });
      })
      .catch((error) => {
        throw "Something went wrong";
      });
  };

  removeContact = async () => {
    const token = await AsyncStorage.getItem("whatsthat_session_token");
    const user_id = this.state.user_id;
    return fetch(
      "http://localhost:3333/api/1.0.0/user/" + user_id + "/contact",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": token,
        },
      }
    )
      .then((response) => {
        console.log("Remove a contact");
        this.viewContacts();
        this.setState({ user_id: "" });
      })
      .catch((error) => {
        throw "Something went wrong";
      });
  };

  viewBlockedUsers = async () => {
    const token = await AsyncStorage.getItem("whatsthat_session_token");
    try {
      let response = await fetch("http://localhost:3333/api/1.0.0/blocked", {
        method: "GET",
        headers: {
          "X-Authorization": token,
        },
      });
      let json = await response.json();
      this.setState({
        blockedData: json,
      });
    } catch (error) {
      console.log(error);
    }
  };

  blockUser = async () => {
    const token = await AsyncStorage.getItem("whatsthat_session_token");
    const user_id = this.state.user_id;
    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/block", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

        "X-Authorization": token,
      },
    })
      .then((response) => {
        console.log("Block a user");
        this.viewContacts();
        this.setState({
          user_id: "",
        });
      })
      .catch((error) => {
        throw "Something went wrong";
      });
  };

  unblockUser = async () => {
    const token = await AsyncStorage.getItem("whatsthat_session_token");
    const user_id = this.state.user_id;
    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id + "/block", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-Authorization": token,
      },
    })
      .then((response) => {
        console.log("Unblock a user");
        this.viewContacts();
        this.setState({
          user_id: "",
        });
      })
      .catch((error) => {
        throw "Something went wrong";
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.contactData}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.listItemText}>
                {item.first_name} {item.last_name} {item.email}
              </Text>
            </View>
          )}
          keyExtractor={({ user_id }, index) => user_id}
        />

        <TextInput
          style={styles.input}
          onChangeText={(text) => this.setState({ user_id: text })}
          value={this.state.user_id}
          placeholder="Enter User ID:"
        />
        <ButtonElement
          text={"Add a contact"}
          method={() => this.addContact()}
        />

        <ButtonElement
          text={"Remove a contact"}
          method={() => this.removeContact()}
        />

        <ButtonElement text={"Block a user"} method={() => this.blockUser()} />

        <ButtonElement
          text={"Unblock a user"}
          method={() => this.unblockUser()}
        />

        <ButtonElement
          text={"View all blocked users"}
          method={() => this.viewBlockedUsers()}
        />

        <FlatList
          data={this.state.blockedData}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.listItemText}>
                {item.first_name} {item.last_name} {item.email}
              </Text>
            </View>
          )}
          keyExtractor={({ user_id }, index) => user_id}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 10,
  },
  listItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 10,
  },
  listItemText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
  input: {
    backgroundColor: "#081C15",
    color: "white",
    borderBottomColor: "#52B788",
    borderBottomWidth: 5,
    padding: 10,
    margin: 5,
  },
});
