import AsyncStorage from '@react-native-async-storage/async-storage';

const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    const userId = await AsyncStorage.getItem("userId");
    return {token, userId};
  } catch (error) {
    console.error("Error retrieving authentication token", error);
    return null;
  }
};

const clearAuthToken = async () => {
  try {
    await AsyncStorage.removeItem("authToken");
  } catch (error) {
    console.error("Error clearing authentication token", error);
  }
};

export { getAuthToken, clearAuthToken };