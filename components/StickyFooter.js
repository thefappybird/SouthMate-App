import React, { useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import QrCodeModal from "./QRCodeModal";
const StickyFooter = ({ userData }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [email, setemail] = useState('');
  const handleGenerateQRCode = () => {
    // Fetch API data and set email here
    const fetchedEmail = userData.email
    // For example, use fetch or axios to get data from the server
    setemail(fetchedEmail);
    // Show the modal
    setModalVisible(true);
  };
  const handleCloseModal = () => {
    setModalVisible(false);
  };
  const navigation = useNavigation();

  const handleScan = () => {
    navigation.navigate("Scan");
  };
  return (
    <View>
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleGenerateQRCode}
        >
          <Image
            source={require("../assets/App-Assets/qrCode.png")}
            style={styles.ImageIconStyle}
          />
          <Text style={styles.textStyle}>Generate QR</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleScan}
        >
          <Image
            source={require("../assets/App-Assets/qrCode.png")}
            style={styles.ImageIconStyle}
          />
          <Text style={styles.textStyle}>Scan QR</Text>
        </TouchableOpacity>
      </View>
      <QrCodeModal visible={isModalVisible} onClose={handleCloseModal} email={email} />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    alignItems: "center",
  },
  textStyle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#484386",
  },
  ImageIconStyle: {
    width: 62,
    height: 62,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: "#27235E",
  },
  footer: {
    flexDirection: "row",
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});

export default StickyFooter;
