import * as React from "react";
import { TextInput, StyleSheet, View } from "react-native";

function InputElement({ text, placeHolder, onChangeText, secure }) {
  return (
    <View>
      <TextInput
        onChangeText={onChangeText}
        value={text}
        placeholder={placeHolder}
        style={styles.input}
        placeholderTextColor={"white"}
        secureTextEntry={secure}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#081C15",
    color: "white",
    borderBottomColor: "#52B788",
    borderBottomWidth: 5,
    padding: 10,
    margin: 5,
  },
});

export default InputElement;
