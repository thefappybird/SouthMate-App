import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import { Image, View, StyleSheet, ActivityIndicator, Text } from "react-native";
import ProfileScreen from "./ProfileScreen";
import SecurityScreen from "./SecurityScreen";
import HomeScreen from "./HomeScreen";
import ScanScreen from "./ScanScreen";
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';

const Drawer = createDrawerNavigator();
function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.header}>
        <Image
          source={require("../assets/App-Assets/SouthMate--Logo.png")}
          style={styles.logo}
        />
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}
const CenteredHeaderImage = () => (
  <View style={styles.headerLogo}>
    <Image
      source={require("../assets/App-Assets/Header--Logo.png")}
      style={{ width: 150, height: 60, resizeMode: "contain" }}
    />
  </View>
);
const styles = StyleSheet.create({
  header: {
    padding: 20,
    alignItems: "center",
  },
  headerLogo:{ 
    flex: 1, 
    justifyContent: "center",
},
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
});
export default function DrawerScreen() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: {
          backgroundColor: "white", // Customize drawer background color
        },
        drawerLabelStyle: {
          color: "black", // Customize drawer label text color
        },
        headerStyle: {
          backgroundColor: "#F7EE21", // Customize header background color
        },
        headerTintColor: "black", // Customize header text color
        headerTitleStyle: {
          display:"none", // Specify the font family for header title
        },
        headerTitle: () => (
          <CenteredHeaderImage/>
        ),
        headerTitleAlign: "center"
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="Security" component={SecurityScreen} />
    </Drawer.Navigator>
  );
}
