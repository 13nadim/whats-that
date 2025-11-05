import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import ButtonElement from "../elements/button";
import InputElement from "../elements/input";
import * as EmailValidator from "email-validator";

export default class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
      submitted: false,
      error: "",
    };

    this.signup_button = this.signup_button.bind(this);
  }

  signup_button() {
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

    if (this.state.password !== this.state.confirm_password) {
      this.setState({ error: "Passwords do not match" });
      return;
    }

    console.log(
      "User signed up with following details: " +
        this.state.first_name +
        " " +
        this.state.last_name +
        " " +
        this.state.email +
        " " +
        this.state.password
    );
    console.log("Sign up validated and ready to send to the API");

    fetch("http://localhost:3333/api/1.0.0/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        email: this.state.email,
        password: this.state.password,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  }

  render() {
    return (
      <View>
        <Text style={styles.text}>WhatsThat?</Text>

        <InputElement
          text={this.state.first_name}
          placeHolder={"First Name"}
          onChangeText={(first_name) => this.setState({ first_name })}
        />

        <InputElement
          text={this.state.last_name}
          placeHolder={"Last Name"}
          onChangeText={(last_name) => this.setState({ last_name })}
        />

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

        <InputElement
          text={this.state.confirm_password}
          placeHolder={"Confirm Your Password"}
          onChangeText={(confirm_password) =>
            this.setState({ confirm_password })
          }
          secure={true}
        />

        <ButtonElement
          text={"SIGN UP"}
          method={() => {
            if (this.signup_button()) {
              this.props.navigation.navigate("Login");
            }
          }}
        />

        <ButtonElement
          text={"Sign in instead"}
          method={() => {
            this.props.navigation.navigate("Login");
          }}
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
