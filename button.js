import * as React from "react";
import { Button, StyleSheet, View } from "react-native";

function ButtonElement({ text, method }) {
  return (
    <View style={styles.button}>
      <Button color={"#081C15"} title={text} onPress={method} />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: 5,
  },
});

export default ButtonElement;
