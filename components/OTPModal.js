import React, { useState } from "react";
import { View, Modal, TextInput, TouchableOpacity, StyleSheet, Text } from "react-native";

const OTPModal = ({ isVisible, onClose, onSubmit }) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (text) => {
    setInputValue(text);
  };
  const handleSubmit = () => {
    onSubmit(inputValue);
    setInputValue("");
    onClose();
  };

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.textStyle}>
            Please enter 6-digit OTP sent to your email.
          </Text>
          <TextInput
            style={styles.input}
            placeholderTextColor="rgba(39, 35, 94, 0.25)" 
            textAlign={'center'}
            placeholder="Enter OTP"
            value={inputValue}
            onChangeText={handleInputChange}
          />
          <TouchableOpacity style={styles.buttonStyle} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.25)", // Semi-transparent background
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5, // Android shadow
  },
  input: {
    height: 50,
    borderColor: "#968FFF",
    borderWidth: 1,
    marginVertical: 30,
    padding: 5,
    borderRadius:5,
  },
  textStyle: {
    fontSize: 16,
    fontWeight: "bold",
    alignSelf:'center',
    color:'black'
  },
  buttonStyle:{
    width: 150,
    backgroundColor: "#F7EE21",
    padding: 15,
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

export default OTPModal;
