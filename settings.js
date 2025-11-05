import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
} from "react-native";
import ButtonElement from "../elements/button";
import InputElement from "../elements/input";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Camera from "./camera";

export default class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user_id: "",
      isLoading: true,
      getUserInfoData: [],
      submitted: false,

      first_name: "",
      last_name: "",
      email: "",
      password: "",
      error: "",

      photo: null,

      searchResults: [],
      searchText: "",
    };
  }

  componentDidMount() {
    this.getUserInfoData();
    this.getProfilePhoto();
  }

  getUserInfoData = async () => {
    const token = await AsyncStorage.getItem("whatsthat_session_token");
    const user_id = await AsyncStorage.getItem("whatsthat_user_id");

    return fetch("http://localhost:3333/api/1.0.0/user/" + user_id, {
      headers: {
        "X-Authorization": token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          getUserInfoData: responseJson,
          orig_first_name: responseJson.first_name,
          orig_last_name: responseJson.last_name,
          orig_email: responseJson.email,
          orig_password: responseJson.password,
        });
        console.log(responseJson);
      })

      .catch((error) => {
        console.log(error);
      });
  };

  updateUserInfo = async () => {
    let to_send = {};

    if (this.state.first_name !== this.state.orig_first_name) {
      to_send["first_name"] = this.state.first_name;
    }

    if (this.state.last_name !== this.state.orig_last_name) {
      to_send["second_name"] = this.state.second_name;
    }

    if (this.state.email !== this.state.orig_email) {
      to_send["email"] = this.state.email;
    }

    if (this.state.password !== this.state.orig_password) {
      to_send["password"] = this.state.password;
    }

    const token = await AsyncStorage.getItem("whatsthat_session_token");
    const user_id = await AsyncStorage.getItem("whatsthat_user_id");
    console.log(
      JSON.stringify({
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        email: this.state.email,
      })
    );

    try {
      await fetch("http://localhost:3333/api/1.0.0/user/" + user_id, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "X-Authorization": token,
        },
        body: JSON.stringify({
          first_name: this.state.first_name,
          last_name: this.state.last_name,
          email: this.state.email,
        }),
      });

      console.log("User information has been updated");

      await this.getUserInfoData();
    } catch (error) {
      console.log(error);
      throw "Something went wrong";
    }
  };

  async logout() {
    console.log("Logout");

    return fetch("http://localhost:3333/api/1.0.0/logout", {
      method: "POST",
      headers: {
        "X-Authorization": await AsyncStorage.getItem(
          "whatsthat_session_token"
        ),
      },
    })
      .then(async (response) => {
        if (response.status === 200) {
          await AsyncStorage.removeItem("whatsthat_session_token");
          await AsyncStorage.removeItem("whatsthat_user_id");
          this.props.navigation.navigate("Login");
        } else if (response.status === 401) {
          console.log("Unauthorised");
          await AsyncStorage.removeItem("whatsthat_session_token");
          await AsyncStorage.removeItem("whatsthat_user_id");
          this.props.navigation.navigate("Login");
        } else {
          throw "Something went wrong";
        }
      })
      .catch((error) => {
        this.setState({ error: error });
        this.setState({ submitted: false });
      });
  }

  getProfilePhoto = async () => {
    const token = await AsyncStorage.getItem("whatsthat_session_token");
    const userId = await AsyncStorage.getItem("whatsthat_user_id");

    fetch("http://localhost:3333/api/1.0.0/user/" + userId + "/photo", {
      method: "GET",
      headers: {
        "X-Authorization": token,
      },
    })
      .then((res) => {
        return res.blob();
      })
      .then((resBlob) => {
        let data = URL.createObjectURL(resBlob);

        this.setState({
          photo: data,
          isLoading: false,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  searchUsers = async (searchText) => {
    const token = await AsyncStorage.getItem("whatsthat_session_token");

    return fetch("http://localhost:3333/api/1.0.0/search?q=" + searchText, {
      headers: {
        "X-Authorization": token,
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          searchResults: responseJson,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    if (this.state.photo) {
      return (
        <View style={styles.container}>
          <View style={styles.profileContainer}>
            <Image
              source={{ uri: this.state.photo }}
              style={styles.profileImage}
            />

            <Text style={styles.profileText}>
              {this.state.getUserInfoData.first_name}{" "}
              {this.state.getUserInfoData.last_name}
            </Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              onChangeText={(text) => this.setState({ first_name: text })}
              placeholder={this.state.getUserInfoData.first_name}
              value={this.state.first_name}
            />

            <TextInput
              style={styles.input}
              onChangeText={(text) => this.setState({ last_name: text })}
              placeholder={this.state.getUserInfoData.last_name}
              value={this.state.last_name}
            />

            <TextInput
              style={styles.input}
              onChangeText={(text) => this.setState({ email: text })}
              placeholder={this.state.getUserInfoData.email}
              value={this.state.email}
            />

            <ButtonElement
              text={"Update user information"}
              method={() => {
                this.updateUserInfo();
                this.getUserInfoData();
              }}
            />

            <ButtonElement
              text={"Upload a profile photo"}
              method={() => this.props.navigation.navigate("Camera")}
            />

            <ButtonElement
              text={"Log Out"}
              method={() => this.logout()}
              style={styles.logoutButton}
              textStyle={styles.logoutButtonText}
            />
          </View>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.input}
              onChangeText={(text) => {
                this.setState({ searchText: text }, () => {
                  this.searchUsers(this.state.searchText);
                });
              }}
              placeholder="Search for users"
              value={this.state.searchText}
            />
            <FlatList
              data={this.state.searchResults}
              keyExtractor={(item) => item.user_id.toString()}
              renderItem={({ item }) => (
                <Text style={styles.searchText}>
                  {item.given_name} {item.family_name}
                </Text>
              )}
            />
          </View>
        </View>
      );
    } else {
      return <Text>Loading</Text>;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  formContainer: {},
  input: {
    backgroundColor: "#081C15",
    color: "white",
    borderBottomColor: "#52B788",
    borderBottomWidth: 5,
    padding: 10,
    margin: 5,
  },
  logoutButton: {
    backgroundColor: "red",
    marginTop: 20,
  },
  logoutButtonText: {
    color: "#fff",
  },
  searchText: {
    color: "black",
  },
});
