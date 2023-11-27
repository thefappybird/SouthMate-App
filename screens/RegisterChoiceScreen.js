import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
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
        <Image style={styles.listIcon}source={require("../assets/App-Assets/SouthMate--Logo.png")}/>
        <View style={{gap: 70}}>
          <Text style={styles.titleStyle}>Get started by creating your SouthMate account</Text>
          <Text style={styles.textStyle}>By choosing your user type, you will be redirected to our full registration form.</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.choiceButton}
        onPress={handleChoice("Student")}
      >
        <Text style={[styles.textStyle, { color: "#27235E" }]}>Student</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.choiceButton}
        onPress={handleChoice("Employee")}
      >
        <Text style={[styles.textStyle, { color: "#27235E" }]}>
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
    backgroundColor: "#F7EE21",
    padding: 13,
    borderRadius: 5,
    width: widthPercentageToDP("40%"),
    alignItems: "center",
    margin: 10,
  },
  textStyle: {
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
    textAlign:'center'
  },
  titleStyle:{
    fontSize: 25,
    textAlign:'center',
    fontWeight:'bold',
    color:"#27235E"
  },
  listIcon:{
    width: 175,
    height: 175
  }
});
export default RegisterChoiceScreen;
