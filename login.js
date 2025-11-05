import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import ButtonElement from "../elements/button";
import InputElement from "../elements/input";
import * as EmailValidator from "email-validator";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class LogInPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      submitted: false,
      error: "",
    };

    this.login_button = this.login_button.bind(this);
  }

  login_button() {
    this.setState({ submitted: true });
    this.setState({ error: "" });

    if (!(this.state.email && this.state.password)) {
      this.setState({ error: "Must enter email and password" });
      return;
    }

    if (!EmailValidator.validate(this.state.email)) {
      this.setState({ error: "Must enter valid email" });
      return;
    }

    const PASSWORD_REGEX = new RegExp(
      "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
    );
    if (!PASSWORD_REGEX.test(this.state.password)) {
      this.setState({
        error:
          "Password isn't strong enough (One upper, one lower, one special, one number, at least 8 characters long)",
      });
      return;
    }

    console.log(
      "Logged in with " + this.state.email + " " + this.state.password
    );
    return fetch("http://localhost:3333/api/1.0.0/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
    }).then(async (response) => {
      const data = await response.json();

      console.log(data);

      try {
        await AsyncStorage.setItem("whatsthat_user_id", data.id);

        await AsyncStorage.setItem("whatsthat_session_token", data.token);

        this.setState({ submitted: false });

        this.props.navigation.navigate("Homepage");
      } catch {
        throw "Something went wrong";
      }
    });
  }

  render() {
    return (
      <View>
        <Text style={styles.text}>WhatsThat?</Text>
        <InputElement
          text={this.state.email}
          placeHolder={"Email address"}
          onChangeText={(email) => this.setState({ email })}
        />

        <InputElement
          text={this.state.password}
          placeHolder={"Password"}
          onChangeText={(password) => this.setState({ password })}
          secure={true}
        />

        <ButtonElement text={"SIGN IN"} method={() => this.login_button()} />

        <ButtonElement
          text={"SIGN UP"}
          method={() => this.props.navigation.navigate("Register")}
        />

        <>{this.state.error && <Text>{this.state.error}</Text>}</>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    color: "black",
    fontWeight: "700",
    fontSize: 50,
  },
});
