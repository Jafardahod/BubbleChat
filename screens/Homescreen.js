import { StyleSheet, Text, TextInput, TouchableOpacity, Image, View } from 'react-native';
import { StatusBar } from "expo-status-bar";
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IPADDRESS } from '../config';

const Homescreen = () => {
    const navigation = useNavigation();
    useEffect(() => {
        const checkloginstatus = async () => {
            try {

                const token = await AsyncStorage.getItem("authToken");
                console.log(token);

                if (token) {
                    navigation.replace("Flist");
                } else {
                    //
                }
            } catch (error) {
                console.log("error", error);
            }
        };
        checkloginstatus();

    }, []);
    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require("../assets/Logo3.png")} />
            <StatusBar style="auto" />
            <View style={styles.card}>
                <TouchableOpacity style={styles.loginBtn} onPressIn={() => navigation.navigate("Login")} >
                    <Text style={styles.loginText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.signup} onPressIn={() => navigation.navigate("Signup")}>
                    <Text style={styles.signupText}>SignUp</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#EEF4ED",
        alignItems: "center",
        justifyContent: "center",
        flex: 1
    },
    image: {
        height: 150,
        width: 200,
        marginTop: 40,
        marginBottom: 50,
    },
    loginBtn: {
        width: "30%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: "#FF6B35",
        shadowColor: "black",
        elevation: 15,
        marginLeft: 30
    },
    loginText: {
        color: "white",
        fontSize: 18
    },
    signup: {
        width: "30%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
        marginBottom: 20,
        marginRight: 30,
        backgroundColor: "#FF6B35",
        shadowColor: "black",
        elevation: 15,
    },
    signupText: {
        color: "white",
        fontSize: 18,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fed8b1',
        borderRadius: 20,
        width: '70%',
        marginVertical: 10,
        height: '20%',
        elevation: 15,
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 100
    },
})

export default Homescreen
