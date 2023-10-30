import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { getAuthToken } from "../components/AuthUtils";
import StickyFooter from "../components/StickyFooter";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    // Function to fetch user data using the authentication token
    const fetchUserData = async () => {
      try {
        const authToken = await getAuthToken();
        // Make an API call to fetch user data using the authToken
        const response = await axios.get(
          `http://192.168.254.120:3000/user/${authToken.userId}`
        );
        // Update the state with the fetched user data
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data", error);
      } finally {
        // Set loading to false after API call completes
        setLoading(false);
      }
    };
    // Call the function when the component mounts
    fetchUserData();
  }, []);

  if (loading) {
    // Display a loading indicator while fetching data
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  const handleNavigate = (routeName) => () => {
    navigation.navigate(routeName, { userData });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <ImageBackground
              source={require("../assets/App-Assets/backgroundLogo.png")}
              style={styles.backgroundImage}
            >
              <Text style={styles.screenText}>{userData.name}</Text>
              <Text style={styles.screenText}>{userData.idNumber}</Text>
              <View style={{ marginTop: 5 }}>
                <Text style={styles.screenText}>Available Balance:</Text>
                <Text style={styles.balanceText}>₱{userData.balance}</Text>
              </View>
            </ImageBackground>
          </View>
          <View style={styles.buttonLayout}>
            <TouchableOpacity style={styles.buttonStyle}>
              <Image
                source={require("../assets/App-Assets/send-icon.png")}
                style={{ width: 35, height: 35 }}
              />
              <Text style={styles.buttonText}>Send Money</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonStyle}>
              <Image
                source={require("../assets/App-Assets/cashout-icon.png")}
                style={styles.buttonImage}
              />
              <Text style={styles.buttonText}>Cash Out</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={handleNavigate("CashInScreen")}
            >
              <Image
                source={require("../assets/App-Assets/cashin-icon.png")}
                style={styles.buttonImage}
              />
              <Text style={styles.buttonText}>Cash In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={handleNavigate("BankScreen")}
            >
              <Image
                source={require("../assets/App-Assets/bank-icon.png")}
                style={styles.buttonImage}
              />
              <Text style={styles.buttonText}>Register Bank</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <StickyFooter userData={userData} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#27235E",
    marginTop: heightPercentageToDP("3%"),
    marginHorizontal: widthPercentageToDP("5%"),
    borderRadius: 5,
    padding: "5%",
    height: heightPercentageToDP("32%"),
    maxHeight: 230,
  },
  buttonStyle: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "contain",
  },
  innerContainer: {
    backgroundColor: "#F7EE21",
    padding: "3%",
    flexDirection: "row",
  },
  balanceText: {
    fontSize: 25,
    fontWeight: "bold",
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginLeft: 100,
    overflow: "hidden",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  screenText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    opacity: 1,
  },
  buttonLayout: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 15,
    paddingLeft: 10,
  },
  buttonImage: {
    width: 40,
    height: 40,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
export default HomeScreen;
