import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
const RegisterChoiceScreen = () => {
  const navigation = useNavigation();
  const handleChoice = (choice) => () => {
    navigation.navigate("Register", choice);
  };
  return (
    <View style={styles.mainContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.textStyle}>Welcome to SouthMate!</Text>
        <Text style={styles.textStyle}>Choose to register as a:</Text>
      </View>
      <TouchableOpacity
        style={styles.choiceButton}
        onPress={handleChoice("Student")}
      >
        <Text style={[styles.textStyle, { color: "white" }]}>Student</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.choiceButton}
        onPress={handleChoice("Employee")}
      >
        <Text style={[styles.textStyle, { color: "white" }]}>
          Merchant/Employee
        </Text>
      </TouchableOpacity>
    </View>
  );
};
styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    alignItems: "center",
    margin: 20,
  },
  choiceButton: {
    backgroundColor: "#27235E",
    padding: 13,
    borderRadius: 5,
    width: widthPercentageToDP("40%"),
    alignItems: "center",
    margin: 10,
  },
  textStyle: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 2,
  },
});
export default RegisterChoiceScreen;
