import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Pressable,
  TextInput,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {
  Feather,
  AntDesign,
  FontAwesome,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import React, { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import SelectDropdown from "react-native-select-dropdown";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const RegisterScreen = () => {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const genderArray = ["Male", "Female", "Other", "I'd rather not say."];
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [midName, setMidName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fullName, setFullName] = useState("");
  const [mNumber, setMNumber] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [placeOfBirth, setPlaceOfBirth] = useState("");
  const [citizenship, setCitizenship] = useState("");
  const [houseAddress, setHouseAddress] = useState("");
  const [province, setProvince] = useState("");
  const [cityMuni, setCityMuni] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [gender, setGender] = useState("");
  const [checkPassword, setCheckPassword] = useState("");
  const navigation = useNavigation();
  const getFullName = (fName, mName, lName) => {
    setLastName(lName);
    setFullName(fName + " " + mName + " " + lName);
  };
  const handleConfirm = (date) => {
    setSelected(true);
    setBirthDate(date);
    hideDatePicker(false);
  };
  const handleRegister = () => {
    const user = {
      name: fullName,
      gender: gender,
      email: email,
      password: password,
      mNumber: mNumber,
      birthDate: birthDate,
      citizenship: citizenship,
      placeOfBirth: placeOfBirth,
      houseAddress: houseAddress,
      province: province,
      cityMuni: cityMuni,
      zipCode: zipCode,
      idNumber: idNumber,
    };

    axios
      .post("http://10.0.2.2:3000/register", user)
      .then((response) => {
        Alert.alert(
          "Registration successful",
          "you have been registered successfully"
        );
        setFullName("");
        setGender("");
        setMNumber("");
        setEmail("");
        setPassword("");
        setBirthDate("");
        setCitizenship("");
        setPlaceOfBirth("");
        setHouseAddress("");
        setProvince("");
        setCityMuni("");
        setZipCode("");
        setIdNumber("");
        navigation.goBack();
      })
      .catch((error) => {
        Alert.alert(
          "Registration failed",
          "An error occurred during registration"
        );
        console.log("error", error);
      });
  };
  const handleNext = () => {
    setStep(step + 1);
  };
  const handlePrevious = () => {
    setStep(step - 1);
  };
  const showDatePicker = () => {
    setDatePickerVisible(true);
  };
  const hideDatePicker = (cancelled) => {
    if (cancelled) {
      setSelected(false);
    }
    setDatePickerVisible(false);
  };
  const renderStepContent = () => {
    switch (step) {
      case 1: //1st Page
        return (
          <View>
            <View style={{ marginTop: 10 }}>
              <View style={styles.formInputView}>
                <AntDesign
                  style={styles.icons}
                  name="user"
                  size={24}
                  color="gray"
                />
                <TextInput
                  autoCapitalize="words"
                  value={firstName}
                  onChangeText={(text) => setFirstName(text)}
                  style={styles.formInput}
                  placeholder="Enter your first name"
                />
              </View>
            </View>
            <View style={{ marginTop: 10 }}>
              <View style={styles.formInputView}>
                <AntDesign
                  style={styles.icons}
                  name="user"
                  size={24}
                  color="white"
                />
                <TextInput
                  autoCapitalize="words"
                  value={midName}
                  onChangeText={(text) => setMidName(text)}
                  style={styles.formInput}
                  placeholder="Enter your middle name"
                />
              </View>
            </View>
            <View style={{ marginTop: 10 }}>
              <View style={styles.formInputView}>
                <AntDesign
                  style={styles.icons}
                  name="user"
                  size={24}
                  color="white"
                />
                <TextInput
                  autoCapitalize="words"
                  value={lastName}
                  onChangeText={(text) => getFullName(firstName, midName, text)}
                  style={styles.formInput}
                  placeholder="Enter your last name"
                />
              </View>
            </View>
            <SelectDropdown
              buttonStyle={styles.dropdown1BtnStyle}
              data={genderArray}
              defaultButtonText="Select Gender"
              onSelect={(selectedItem, index) => {
                setGender(selectedItem);
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
            />
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={styles.registerButton}
                onPress={handleNext}
              >
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 2: //2nd Page
        return (
          <View>
            <View style={{ marginTop: 10 }}>
              <View style={styles.formInputView}>
                <AntDesign
                  style={styles.icons}
                  name="phone"
                  size={24}
                  color="gray"
                />
                <TextInput
                  keyboardType="numeric"
                  value={mNumber}
                  onChangeText={(text) => setMNumber(text)}
                  style={styles.formInput}
                  placeholder="Enter your mobile number"
                />
              </View>
            </View>
            <View style={{ marginTop: 10 }}>
              <TouchableOpacity onPress={showDatePicker}>
                <View style={styles.formInputView}>
                  <AntDesign
                    style={styles.icons}
                    name="calendar"
                    size={24}
                    color="gray"
                  />
                  <Text style={styles.formInput}>
                    {selected
                      ? birthDate.toLocaleDateString()
                      : "Enter your birth date"}
                  </Text>
                </View>
              </TouchableOpacity>
              <DateTimePickerModal
                date={birthDate}
                isVisible={datePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={() => hideDatePicker(false)}
              />
            </View>
            <View style={{ marginTop: 10 }}>
              <View style={styles.formInputView}>
                <FontAwesome
                  style={styles.icons}
                  name="hospital-o"
                  size={24}
                  color="gray"
                />
                <TextInput
                  autoCapitalize="words"
                  value={placeOfBirth}
                  onChangeText={(text) => setPlaceOfBirth(text)}
                  style={styles.formInput}
                  placeholder="Enter your place of birth"
                />
              </View>
            </View>
            <View style={{ marginTop: 10 }}>
              <View style={styles.formInputView}>
                <FontAwesome5
                  style={styles.icons}
                  name="passport"
                  size={24}
                  color="gray"
                />
                <TextInput
                  autoCapitalize="words"
                  value={citizenship}
                  onChangeText={(text) => setCitizenship(text)}
                  style={styles.formInput}
                  placeholder="Enter your citizenship"
                />
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={styles.registerButton}
                onPress={handlePrevious}
              >
                <Text style={styles.buttonText}>Previous</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.registerButton}
                onPress={handleNext}
              >
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 3: //Third Page
        return (
          <View>
            <View style={{ marginTop: 10 }}>
              <View style={styles.formInputView}>
                <FontAwesome5
                  style={styles.icons}
                  name="house-user"
                  size={24}
                  color="gray"
                />
                <TextInput
                  autoCapitalize="words"
                  value={houseAddress}
                  onChangeText={(text) => setHouseAddress(text)}
                  style={styles.formInput}
                  placeholder="Enter your house address"
                />
              </View>
            </View>
            <View style={{ marginTop: 10 }}>
              <View style={styles.formInputView}>
                <MaterialCommunityIcons
                  style={styles.icons}
                  name="town-hall"
                  size={24}
                  color="gray"
                />
                <TextInput
                  autoCapitalize="words"
                  value={province}
                  onChangeText={(text) => setProvince(text)}
                  style={styles.formInput}
                  placeholder="Enter your province"
                />
              </View>
            </View>
            <View style={{ marginTop: 10 }}>
              <View style={styles.formInputView}>
                <MaterialCommunityIcons
                  style={styles.icons}
                  name="home-city"
                  size={24}
                  color="gray"
                />
                <TextInput
                  autoCapitalize="words"
                  value={cityMuni}
                  onChangeText={(text) => setCityMuni(text)}
                  style={styles.formInput}
                  placeholder="Enter your city/municipality"
                />
              </View>
            </View>
            <View style={{ marginTop: 10 }}>
              <View style={styles.formInputView}>
                <Feather
                  style={styles.icons}
                  name="mail"
                  size={24}
                  color="gray"
                />
                <TextInput
                  keyboardType="numeric"
                  value={zipCode}
                  onChangeText={(text) => setZipCode(text)}
                  style={styles.formInput}
                  placeholder="Enter your zip code"
                />
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={styles.registerButton}
                onPress={handlePrevious}
              >
                <Text style={styles.buttonText}>Previous</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.registerButton}
                onPress={handleNext}
              >
                <Text style={styles.buttonText}>Next</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 4:
        return (
          <View>
            <View>
              <View style={{ marginTop: 10 }}>
                <View style={styles.formInputView}>
                  <MaterialIcons
                    style={{ marginLeft: 10 }}
                    name="email"
                    size={24}
                    color="gray"
                  />
                  <TextInput
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    style={styles.formInput}
                    placeholder="Enter your email"
                  />
                </View>
              </View>
              <View style={{ marginTop: 10 }}>
                <View style={styles.formInputView}>
                  <AntDesign
                    style={styles.icons}
                    name="idcard"
                    size={24}
                    color="gray"
                  />
                  <TextInput
                    keyboardType="numeric"
                    value={idNumber}
                    onChangeText={(text) => setIdNumber(text)}
                    style={styles.formInput}
                    placeholder="Enter your ID number"
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
              <View style={{ marginTop: 10 }}>
                <View style={styles.formInputView}>
                  <MaterialCommunityIcons
                    style={{ marginLeft: 10 }}
                    name="form-textbox-password"
                    size={24}
                    color="white"
                  />
                  <TextInput
                    secureTextEntry={true}
                    value={checkPassword}
                    onChangeText={(text) => setCheckPassword(text)}
                    style={styles.formInput}
                    placeholder="Confirm your password"
                  />
                </View>
              </View>
            </View>
            <View style={{flexDirection: "row" }}>
              <TouchableOpacity
                style={styles.registerButton}
                onPress={handlePrevious}
              >
                <Text style={styles.buttonText}>Previous</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.registerButton}
                onPress={handleRegister}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
    }
  };
  return (
    <KeyboardAwareScrollView
      behavior="padding"
      style={styles.mainContainer}
      keyboardVerticalOffset={-300}
    >
      <ScrollView style={styles.mainView}>
        <View style={{ marginTop: 50, alignItems: "center" }}>
          <Image
            style={(style = styles.imageStyle)}
            source={require("../assets/App-Assets/SouthMate--Logo.png")}
          />
          <Text style={styles.formText}>Register Your Account</Text>
        </View>
        {renderStepContent()}
        <Pressable onPress={() => navigation.goBack()} style={{ marginTop: 5 }}>
          <Text style={styles.signupText}>
            Already have an account?{" "}
            <Text style={styles.link}>Go back to login</Text>
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
  mainView:{
    marginVertical: heightPercentageToDP('2.5%'), 
    marginHorizontal: widthPercentageToDP('10%'),
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
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
  logoView: {
    marginTop: 75,
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
  dateInput: {
    fontSize: 16,
    color: "gray",
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
  registerButton: {
    width: 150,
    backgroundColor: "#27235E",
    padding: 15,
    marginTop: 40,
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 6,
  },
  icons: {
    marginLeft: 10,
  },
});

export default RegisterScreen;
