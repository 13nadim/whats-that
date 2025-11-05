import * as React from "react";
import { StyleSheet, View, Text } from "react-native";
import ButtonElement from "../elements/button";
import InputElement from "../elements/input";

function SignUpPage({ navigation }) {
  const [firstname, setFirstName] = React.useState("");
  const [secondname, setSecondName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  return (
    <View>
      <InputElement
        text={firstname}
        placeHolder={"First Name"}
        onChangeText={setFirstName}
      />

      <InputElement
        text={secondname}
        placeHolder={"Second Name"}
        onChangeText={setSecondName}
      />

      <InputElement
        text={email}
        placeHolder={"Email address"}
        onChangeText={setEmail}
      />

      <InputElement
        text={password}
        placeHolder={"Password"}
        onChangeText={setPassword}
        secure={true}
      />

      <ButtonElement
        text={"SIGN UP"}
        method={() =>
          console.log("user tried to sign up with " + email + " " + password)
        }
      />
      <ButtonElement
        text={"LOG IN"}
        method={() => navigation.navigate("Login")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "black",
    fontWeight: "700",
    fontSize: 50,
  },
});

export default SignUpPage;
