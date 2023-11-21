import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Alert,
} from "react-native";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import axios from "axios";
import OTPModal from "../components/OTPModal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
const SendScreen = ({ route }) => {
  const navigation = useNavigation();
  const { userData, data } = route.params;
  const [userEmail, setUserEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [otp, setOtp] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState({
    senderId: "",
    receiverEmail: "",
    transAmount: 0,
  });

  const toggleModal = () => {
    if (!isModalVisible) {
      if (amount != "" && userEmail != "") {
        setTransactionDetails({
          senderId: userData._id,
          receiverEmail: userEmail,
          transAmount: Number(amount),
        });
        axios
          .post("http://192.168.254.120:3000/sendOtp", {
            email: userData.email,
          })
          .then((response) => {
            setOtp(response.data.otp);
            setModalVisible(!isModalVisible);
          })
          .catch((error) => {
            console.error("Error sending OTP email from React Native:", error);
          });
      } else {
        Alert.alert(
          "Transaction error",
          "Please complete the form to continue."
        );
      }
    } else {
      setModalVisible(!isModalVisible);
    }
  };
  const handleSubmit = (inputOtp) => {
    if (inputOtp != otp) {
      Alert.alert("Wrong OTP", "Please enter the correct OTP");
    } else {
      axios
        .post("http://192.168.254.120:3000/sendMoney", transactionDetails)
        .then((response) => {
          navigation.goBack();
        })
        .catch((error) => {
          Alert.alert(
            "Transaction Failed",
            "An error occured during the Transaction"
          );
          console.log("error", error);
        });
    }
  };
  return (
    <KeyboardAwareScrollView
    style={{ flex: 1 }}
    scrollEnabled={false}
  >
      <View style={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <Image
              source={require("../assets/App-Assets/SouthMate--Logo.png")}
              style={{ width: 100, height: 100, alignSelf: "center" }}
            />
            <Text style={styles.textStyle}>Enter User's Email: </Text>
            <TextInput
              value={data ? data : userEmail}
              style={styles.formInput}
              placeholder="Recipient's Email"
              onChangeText={(text) => setUserEmail(text)}
            />
            <Text style={styles.textStyle}>Enter the Amount to Cash Out: </Text>
            <TextInput
              keyboardType="numeric"
              value={amount}
              style={styles.formInput}
              placeholder="Cash Out Amount"
              onChangeText={(text) => setAmount(text)}
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
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    marginHorizontal: widthPercentageToDP("10%"),
    marginVertical: heightPercentageToDP("7%"),
  },
  listContainer: {
    flex: 1,
    flexDirection: "row",
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
  listIcon: {
    width: 25,
    height: 25,
    marginRight: 5,
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
  bankInfo: {
    padding: 10,
    backgroundColor: "white",
    marginTop: 5,
    borderRadius: 5,
  },
  selectedTextStyle: {
    fontSize: 16,
    fontWeight: "400",
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
export default SendScreen;
