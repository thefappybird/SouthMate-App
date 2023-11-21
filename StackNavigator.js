import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import DrawerScreen from "./screens/DrawerScreen";
import ScanScreen from './screens/ScanScreen';
import BankScreen from "./screens/BankScreen";
import CashInScreen from './screens/CashInScreen';
import CashOutScreen from './screens/CashOutScreen';
import SendScreen from './screens/SendScreen';
import RegisterChoiceScreen from './screens/RegisterChoiceScreen'
const StackNavigator = () => {
    const Stack = createNativeStackNavigator()
    return (
        <NavigationContainer>
            <Stack.Navigator 
                screenOptions={{
                    headerStyle: {
                      backgroundColor: '#F7EE21', // Common background color
                    },
                    headerTintColor: 'black', // Common text color
                    headerTitleStyle: {
                      fontWeight: 'bold', // Common font weight
                    },
                    headerTitleAlign: 'center', // Common title alignment
                  }}
            >
                <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}} />
                <Stack.Screen name="RegisterChoice" component={RegisterChoiceScreen} options={{headerShown: false}}/>
                <Stack.Screen name="Register" component={RegisterScreen} options={{headerShown: false}}/>
                <Stack.Screen name="Drawer" component={DrawerScreen} options={{headerShown: false}}/>
                <Stack.Screen name="BankScreen" component={BankScreen} options={{headerShown: true, headerTitle:"Register Bank"}}/>
                <Stack.Screen name="CashInScreen" component={CashInScreen} options={{headerShown: true, headerTitle:"Cash In"}}/>
                <Stack.Screen name="CashOutScreen" component={CashOutScreen} options={{headerShown: true, headerTitle:"Cash Out"}}/>
                <Stack.Screen name="SendScreen" component={SendScreen} options={{headerShown: true, headerTitle:"Send Money"}}/>
                <Stack.Screen name="Scan" component={ScanScreen} options={{headerShown: true,  headerStyle: {
                    backgroundColor: "#F7EE21", // Customize header background color
                    },
                    headerTintColor: "black", // Customize header text color
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                        headerTitle:"Scan QR Code",
                        headerTitleAlign: "center"
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};
export default StackNavigator;
