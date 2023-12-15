import React, { useState, RefObject, useRef } from "react";
import {
  ScrollView,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import {IP_ADDRESS} from '@env';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";

import { SelectCountry } from "react-native-element-dropdown";
import axios from "axios";
import OTPModal from '../components/OTPModal'
import { useNavigation } from "@react-navigation/native";
const url = [
  "../assets/App-Assets/BDO-img.png",
  "../assets/App-Assets/BPI-img.png",
  "../assets/App-Assets/ChinaBank-img.png",
  "../assets/App-Assets/Gcash-img.png",
  "../assets/App-Assets/UnionBank-img.png",
];
const urlTest = url[0];
const local_data = [
  {
    value: "0",
    label: "Banco De Oro",
    image: require("../assets/App-Assets/BDO-img.png"),
  },
  {
    value: "1",
    label: "Bank of the Philippine Islands",
    image: require("../assets/App-Assets/BPI-img.png"),
  },
  {
    value: "2",
    label: "ChinaBank",
    image: require("../assets/App-Assets/ChinaBank-img.png"),
  },
  {
    value: "3",
    label: "GCash",
    image: require("../assets/App-Assets/Gcash-img.png"),
  },
  {
    value: "4",
    label: "UnionBank of the Philippines",
    image: require("../assets/App-Assets/UnionBank-img.png"),
  },
];
const BankScreen = ({ route }) => {
  const navigation = useNavigation();
  const { userData } = route.params;
  const [accountNumber, setAccountNumber] = useState();
  const [count, setCount] = useState("");
  const [otp, setOtp] = useState("")
  const [bank, setBank] = useState({
    owner: "",
    accountNumber: 0,
    bankName: "",
    image: "",
  });
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    if(!isModalVisible){
      setBank({
        owner: userData._id,
        accountNumber: Number(accountNumber),
        bankName: local_data[count].label,
        image: url[count],
      })
      axios.post(`${IP_ADDRESS}:3000/sendOtp`, {email: userData.email}).then(response => {
        setOtp(response.data.otp);
        console.log(otp);
        setModalVisible(!isModalVisible);
      }).catch(error => {
        console.error('Error sending OTP email from React Native:', error);
      })
    }else{
      setModalVisible(!isModalVisible);
    }
  };

  const handleSubmit = (inputOtp) => {
    if(inputOtp != otp) {
      Alert.alert("Wrong OTP", "Please enter the correct OTP")
    }else{
      axios
      .post(`${IP_ADDRESS}:3000/registerBank`, bank)
      .then((response) => {
        setAccountNumber("");
        setCount("");
        Alert.alert("Bank Register Success!")
        navigation.goBack();
      })
      .catch((error)=>{
        Alert.alert("Bank Registration Failed", "An error occured during registration")
        console.log("error", error);
      });
    }
  };
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <Image
              source={require("../assets/App-Assets/SouthMate--Logo.png")}
              style={{ width: 100, height: 100, alignSelf: "center" }}
            />
            <Text style={styles.textStyle}>Choose Bank to Register: </Text>
            <SelectCountry
              style={styles.dropdown1BtnStyle}
              selectedTextStyle={styles.selectedTextStyle}
              placeholderStyle={styles.placeholderStyle}
              imageStyle={styles.imageStyle}
              inputSearchStyle={styles.inputSearchStyle}
              search
              maxHeight={300}
              value={count}
              data={local_data}
              valueField="value"
              labelField="label"
              imageField="image"
              placeholder="Select Bank"
              searchPlaceholder="Search..."
              onChange={(e) => {
                setCount(e.value);
              }}
            />
            <Text style={styles.textStyle}>Enter your Account Number: </Text>
            <TextInput
              keyboardType="numeric"
              value={accountNumber}
              onChangeText={(text) => setAccountNumber(text)}
              style={styles.formInput}
              placeholder="Account Number"
            />
            <TouchableOpacity
              style={styles.registerButton}
              onPress={toggleModal}
            >
              <Text style={styles.buttonText}>Submit</Text>
              <OTPModal
                isVisible={isModalVisible}
                onClose={toggleModal}
                onSubmit={handleSubmit}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};
const styles = StyleSheet.create({
  scrollContainer: {
    marginHorizontal: widthPercentageToDP("10%"),
    marginVertical: heightPercentageToDP("7%"),
  },
  container: {
    backgroundColor: "#968FFF",
    borderRadius: 5,
    paddingVertical: "5%",
    paddingHorizontal: "10%",
  },
  innerContainer: {
    padding: 5,
  },
  textStyle: {
    marginTop: 5,
    fontSize: 15,
    fontWeight: "bold",
  },
  dropdown1BtnStyle: {
    width: "100%",
    height: 50,
    borderColor: "#D0D0D0",
    backgroundColor: "white",
    marginTop: 10,
    borderWidth: 1,
    paddingVertical: 5,
    borderRadius: 5,
    fontSize: 17,
  },
  formInput: {
    color: "grey",
    marginVertical: 10,
    padding: 5,
    fontSize: 16,
    backgroundColor: "white",
    borderRadius: 5,
  },
  imageStyle: {
    width: 40,
    height: 40,
    marginLeft: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    marginLeft: 5,
  },
  selectedTextStyle: {
    fontSize: 16,
    marginLeft: 5,
    padding: 5,
    height: 50,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  registerButton: {
    width: 150,
    backgroundColor: "#F7EE21",
    padding: 15,
    marginTop: 100,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 6,
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default BankScreen;
