import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const QRCodeModal = ({ visible, onClose, email }) => {
  return (
    <View style={styles.container}>
      <Modal visible={visible} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Generate QR code with the user's ID */}
            <View style={{padding: 25}}>
              <QRCode
                value={email}
                size={250}
                enableLinearGradient={true}
                linearGradient={['rgb(39, 35, 94)', 'rgb(2, 119, 189)']}
                logo={require('../assets/App-Assets/qrCodeLogo.png')}
                logoBackgroundColor='rgba(51, 255, 224, 0.8)'
              />
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  buttonText:{
    fontSize: 15,
    fontWeight:'bold'
  },
  modalContent: {
    width: '75%', // Adjust the width as needed
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5, // For Android shadow
  },
  closeButton: {
    width: '40%',
    alignItems: 'center',
    marginTop: 20,
    padding: 10,
    backgroundColor: '#968FFF',
    borderRadius: 5,
  },
});

export default QRCodeModal;