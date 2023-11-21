import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  FlatList,
  Alert,
} from "react-native";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import axios from "axios";
import OTPModal from "../components/OTPModal";
import { useNavigation } from "@react-navigation/native";
const local_data = [
  {
    label: "Banco De Oro",
    image: require("../assets/App-Assets/BDO-img.png"),
  },
  {
    label: "Bank of the Philippine Islands",
    image: require("../assets/App-Assets/BPI-img.png"),
  },
  {
    label: "ChinaBank",
    image: require("../assets/App-Assets/ChinaBank-img.png"),
  },
  {
    label: "GCash",
    image: require("../assets/App-Assets/Gcash-img.png"),
  },
  {
    label: "UnionBank of the Philippines",
    image: require("../assets/App-Assets/UnionBank-img.png"),
  },
];
const CashOutScreen = ({ route }) => {
  const navigation = useNavigation();
  const { userData } = route.params;
  const [data, setData] = useState([]);
  const [amount, setAmount] = useState("");
  const [selectedAccNo, setSelectedAccNo] = useState(null);
  const [fetchedData, setFetchedData] = useState({});
  const [otp, setOtp] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [show, setShow] = useState();
  const [transactionDetails, setTransactionDetails] = useState({
    owner: "",
    accNumber: 0,
    bank: "",
    transAmount: 0,
  });

  useEffect(() => {
    const fetchDataAndUpdateState = () => {
      axios
        .get("http://192.168.254.120:3000/fetchBanks", { params: userData })
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };
    fetchDataAndUpdateState();
  }, [userData]);
  useEffect(() => {
    // Fetch the account information when a bank is selected
    const fetchAccountInfo = () => {
      if (data.length != 0) {
        setShow(true);
        if (selectedAccNo) {
          const bankData =
            data.find((item) => item.accountNumber === selectedAccNo) || {};
          setFetchedData(bankData);
        }
      } else {
        setShow(false);
      }
    };
    fetchAccountInfo();
  }, [selectedAccNo, data]);
  const handleSelectBank = (accNumber) => {
    setSelectedAccNo((prevSelectedNumber) =>
      prevSelectedNumber === accNumber ? null : accNumber
    );
  };
  const renderItem = ({ item }) => {
    const matchedBank = local_data.find(
      (localItem) => localItem.label === item.bankName
    );
    const imageSource = matchedBank
      ? matchedBank.image
      : require("../assets/App-Assets/SouthMate--Logo.png");
    return (
      <TouchableOpacity
        onPress={() => handleSelectBank(item.accountNumber)}
        style={styles.listContainer}
      >
        <Image
          source={imageSource}
          style={styles.listIcon}
          defaultSource={require("../assets/App-Assets/SouthMate--Logo.png")} // Provide your placeholder image path
        />
        <Text style={[styles.selectedTextStyle, { marginRight: 5 }]}>
          {item.bankName}
        </Text>
      </TouchableOpacity>
    );
  };
  const toggleModal = () => {
    if (!isModalVisible) {
      if (amount != "" && selectedAccNo) {
        setTransactionDetails({
          owner: fetchedData.owner,
          accNumber: fetchedData.accountNumber,
          bank: fetchedData.bankName,
          transAmount: Number(amount),
        });
        let email;
        switch (userData.type) {
          case "Student":
            email = userData.guardianEmail;
            break;
          default:
            email = userData.email;
        }
        axios
          .post("http://192.168.254.120:3000/sendOtp", { email })
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
        .post("http://192.168.254.120:3000/cashOut", transactionDetails)
        .then((response) => {
          setSelectedAccNo(null);
          setAmount("");
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
    <KeyboardAwareScrollView style={{ flex: 1 }} scrollEnabled={false}>
      <View style={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <Image
              source={require("../assets/App-Assets/SouthMate--Logo.png")}
              style={{ width: 100, height: 100, alignSelf: "center" }}
            />
            <Text style={styles.textStyle}>Choose Bank to Cash Out: </Text>
            {!show && (
              <TouchableOpacity
                style={styles.redirectButton}
                onPress={() => navigation.navigate("BankScreen", { userData })}
              >
                <Text style={styles.redirectText}>Register a Bank</Text>
              </TouchableOpacity>
            )}
            {show && (
              <FlatList
                style={styles.listStyle}
                data={data}
                keyExtractor={(item) => item._id.toString()} // Assuming _id is unique
                horizontal={true}
                renderItem={renderItem}
              />
            )}
            {selectedAccNo && (
              <View style={styles.bankInfo}>
                <Text
                  style={[styles.selectedTextStyle, { fontWeight: "bold" }]}
                >
                  {fetchedData.bankName}
                </Text>
                <Text style={styles.selectedTextStyle}>
                  Account Number: {fetchedData.accountNumber}
                </Text>
              </View>
            )}
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
    padding: 10,
    fontSize: 16,
    backgroundColor: "white",
    borderRadius: 5,
  },
  redirectButton: {
    marginTop: 5,
    padding: 5,
    backgroundColor: "white",
    borderRadius: 5,
    alignItems: "center",
  },
  redirectText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  listStyle: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
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
export default CashOutScreen;
