import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Alert
} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import style from "react-native-datepicker/style";
const LoginScreen = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const handleLogin = () => {
    const user={
      email: email,
      password: password
    }
    axios.post("http://192.168.254.120:3000/login", user).then(async (response) => {
      const token = response.data.token;
      const userId = response.data.userId;
      await AsyncStorage.setItem("authToken", token);
      await AsyncStorage.setItem("userId", userId);
      navigation.navigate("Drawer");
    }).catch((error)=> {
      Alert.alert("Login error", "There was an unexpected error upon login.")
      console.log("error", error);
    })
  }
  return (
    <KeyboardAwareScrollView
      behavior="padding"
      style={styles.mainContainer}
    >
      <ScrollView style={styles.mainView}>
        <View style={{ alignItems: "center" }}>
          <Image
            style={styles.imageStyle}
            source={require("../assets/App-Assets/SouthMate--Logo.png")}
          />
        </View>
        <View style={styles.formView}>
          <Text style={styles.formText}>Login to Your Account</Text>
        </View>
        <View style={{ marginTop: 30 }}>
          <View style={styles.formInputView}>
            <AntDesign
              style={{ marginLeft: 10 }}
              name="idcard"
              size={24}
              color="gray"
            />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={styles.formInput}
              placeholder="Enter your Email"
            />
          </View>
        </View>
        <View style={{ marginTop: 10 }}>
          <View style={styles.formInputView}>
            <MaterialCommunityIcons
              style={{ marginLeft: 10 }}
              name="form-textbox-password"
              size={24}
              color="gray"
            />
            <TextInput
              value={password}
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
              style={styles.formInput}
              placeholder="Enter your Password"
            />
          </View>
        </View>
        <View style={styles.loginOptions}>
          <Text>Keep me logged in</Text>
          <Text style={styles.link}>Forgot Password</Text>
        </View>
        <View style={{ marginTop: 30 }} />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Pressable
          onPress={() => navigation.navigate("RegisterChoice")}
          style={{ marginTop: 10 }}
        >
          <Text style={styles.signupText}>
            Don't have an account? <Text style={styles.link}>Sign up</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  mainView:{
    marginVertical: heightPercentageToDP('10%'), 
    marginHorizontal: widthPercentageToDP('10%'),
  },
  imageStyle: {
    width: 200,
    height: 175,
    resizeMode: "contain",
  },
  formView: {
    alignItems: "center",
    justifyContent: "center",
  },
  formText: {
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 25,
  },
  formInputView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderColor: "#D0D0D0",
    borderWidth: 1,
    paddingVertical: 5,
    borderRadius: 5,
  },
  formInput: {
    color: "grey",
    marginVertical: 10,
    width: 300,
    fontSize: 16,
  },
  loginOptions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  link: {
    fontWeight: "500",
    color: "#007FFF",
  },
  loginButton: {
    width: 200,
    backgroundColor: "#27235E",
    padding: 15,
    marginTop: 40,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 6,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  signupText: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default LoginScreen;
