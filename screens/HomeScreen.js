import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ImageBackground,
  TouchableOpacity,
  FlatList,
} from "react-native";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { getAuthToken } from "../components/AuthUtils";
import StickyFooter from "../components/StickyFooter";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
const local_data = [
  {
    label: "Cash In",
    image: require("../assets/App-Assets/cashin-icon.png"),
  },
  {
    label: "Cash Out",
    image: require("../assets/App-Assets/cashout-icon.png"),
  },
  {
    label: "Send Money",
    image: require("../assets/App-Assets/send-icon.png"),
  },
];
const HomeScreen = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [data, setData] = useState();

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
        const transactionResponse = await axios.get(
          "http://192.168.254.120:3000/fetchTransactions",
          { params: response.data }
        );
        const transData = transactionResponse.data;
        const tempData = transData.slice(0, 5);
        setData(tempData);
      } catch (error) {
        console.error("Error fetching user data", error);
      } finally {
        // Set loading to false after API call completes
        setLoading(false);
      }
    };
    // Call the function when the component mounts
    fetchUserData();
  }, [userData]);
  const renderItem = ({ item }) => {
    const matchedTransaction = local_data.find(
      (localItem) => localItem.label === item.description
    );
    const date = new Date(item.date);

    const imageSource = matchedTransaction
      ? matchedTransaction.image
      : require("../assets/App-Assets/SouthMate--Logo.png");
    return (
      <View style={styles.listContainer}>
        <Image
          source={imageSource}
          style={styles.listIcon}
          defaultSource={require("../assets/App-Assets/SouthMate--Logo.png")} // Provide your placeholder image path
        />
        <View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Text
              style={[
                styles.selectedTextStyle,
                {
                  fontWeight: "bold",
                  color:
                    item.description === "Cash Out"
                      ? "red"
                      : item.description === "Cash In"
                      ? "green"
                      : "orange",
                },
              ]}
            >
              ₱{item.amount}
            </Text>
            <Text style={[styles.selectedTextStyle, { fontWeight: "bold" }]}>
              - {item.description} -
            </Text>
            <Text style={[styles.selectedTextStyle, { fontWeight: "bold" }]}>
              {date.toDateString()}
            </Text>
          </View>
          <Text style={[styles.selectedTextStyle, { fontWeight: "bold" }]}>
            {(() => {
              switch (item.description) {
                case "Cash In":
                  return "From: " + item.senderName;
                case "Send Money":
                  return userData._id === item.receiver ? "From: " + item.senderName : "To: " + item.receiverName;
                default:
                  return "To: " + item.receiverName;
              }
            })()}
          </Text>
          <Text style={styles.selectedTextStyle}>{item._id}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    // Display a loading indicator while fetching data
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  const handleNavigate = (routeName) => () => {
    navigation.navigate(routeName, { userData });
  };
  const renderHeader = () => (
    <View style={styles.listHeader}>
      <Text style={styles.headerText}>Transaction History</Text>
    </View>
  );
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.scrollContainer}>
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
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={handleNavigate("SendScreen")}
            >
              <Image
                source={require("../assets/App-Assets/send-icon.png")}
                style={{ width: 35, height: 35 }}
              />
              <Text style={styles.buttonText}>Send Money</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={handleNavigate("CashOutScreen")}
            >
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
        <FlatList
          style={styles.listStyle}
          data={data}
          keyExtractor={(item) => item._id.toString()}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
        />
      </View>
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
    minHeight: 230,
    maxHeight: 250,
  },
  listStyle: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 5,
    maxHeight: 440,
    marginTop: heightPercentageToDP("5%"),
    marginBottom: heightPercentageToDP("15%"),
    marginHorizontal: widthPercentageToDP("5%"),
  },
  listHeader: {
    padding: 10,
    backgroundColor: "#F7EE21",
    alignItems: "center",
  },
  headerText: {
    color: "black",
    fontSize: 17,
    fontWeight: "bold",
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
  listIcon: {
    width: 50,
    height: 50,
    margin: 5,
    justifyContent: "center",
  },
  balanceText: {
    fontSize: 25,
    fontWeight: "bold",
  },
  selectedTextStyle: {
    color: "black",
    fontSize: 15,
    opacity: 1,
    marginRight: 5,
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
  listContainer: {
    flex: 1,
    flexDirection: "row",
    borderBottomWidth: 5,
    borderBottomColor: "black",
    padding: 8,
  },
});
export default HomeScreen;
