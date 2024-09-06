import { Alert, StyleSheet, Text, View, Button } from 'react-native'
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video, ResizeMode } from 'expo-av';
import {
    Image,
    TextInput,
    TouchableOpacity,
} from "react-native";
import axios from 'axios';
import { IPADDRESS } from '../config';

const Loginscreen = () => {

    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // useEffect(() => {
    //     const checkloginstatus = async () => {
    //         try {

    //             const token = await AsyncStorage.getItem("authToken");

    //             if (token) {
    //                 navigation.replace("Main");
    //             } else {
    //                 //
    //             }
    //         } catch (error) {
    //             console.log("error", error);
    //         }
    //     };
    //     checkloginstatus();

    // }, []);

    const handlelogin = async (e) => {
        e.preventDefault();
        const userdetails = {
            email: email,
            password: password,

        }

        try {
            axios.post(`http://${IPADDRESS}:4000/Login`, userdetails).then((response) => {
                const Token = response.data.Token;
                const id = response.data.id;
                AsyncStorage.setItem("authToken", Token);
                AsyncStorage.setItem("userID", id);
                navigation.reset({
                    // index: 0,
                    routes: [{ name: 'Flist' }],
                });
            })

        } catch (error) {
            Alert.alert(
                "Login Failed",
                "An error Occurred"
            );
            console.log("Error here");
            console.log("failed", error);
        }
    }
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});
    // let image = 'C:\\Users\\jafar\\Desktop\\Project 6th sem\\BubbleChat\\BubblechatV2\\assets\\camera.png';
    return (
        <View style={styles.container}>
            {/* <Video
                ref={video}
                style={styles.video}
                // source={require('../assets/random-acoustic-electronic-guitar-136427.mp3')}
                source={{
                    uri: 'https://firebasestorage.googleapis.com/v0/b/bubblechat-19154.appspot.com/o/random-acoustic-electronic-guitar-136427.mp3?alt=media&token=e6f06c9f-d9d7-42a9-b4ba-627a194f8963',
                }}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                isLooping
                onPlaybackStatusUpdate={status => setStatus(() => status)}
            /> */}
            {/* <View style={styles.buttons}>
                <Button
                    title={status.isPlaying ? 'Pause' : 'Play'}
                    onPress={() =>
                        status.isPlaying ? video.current.pauseAsync() : video.current.playAsync()
                    }
                />
            </View> */}
            <Image style={styles.image} source={require("../assets/Logo3.png")} />
            <StatusBar style="auto" />
            <View style={styles.card}>

                <View style={styles.inputViewemail}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder='Email'
                        placeholderTextColor="#FFFFFF"
                        onChangeText={(email) => setEmail(email)}
                    />
                </View>
                <View style={styles.inputViewPass}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder="Password"
                        placeholderTextColor="#FFFFFF"
                        secureTextEntry={true}
                        onChangeText={(password) => setPassword(password)}
                    />
                </View>

                <TouchableOpacity style={{ alignSelf: "flex-start", marginLeft: 60, marginTop: 5, marginBottom: 30, }}>
                    <Text style={styles.forgot_button}>Forgot Password?</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handlelogin} style={styles.loginBtn}>
                    <Text style={styles.loginText}>LogIN</Text>
                </TouchableOpacity>
                <TouchableOpacity onPressIn={() => navigation.navigate("Signup")}>
                    <Text style={styles.Ca_button} >OR Create Account?</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EEF4ED",
        alignItems: "center",
        justifyContent: "center",
    },
    video: {
        alignSelf: 'center',
        width: 320,
        height: 200,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        height: 150,
        width: 200,
        marginTop: 40,
        marginBottom: 40,
    },
    inputViewemail: {
        backgroundColor: "#FF9771",
        borderRadius: 30,
        width: "80%",
        height: 45,
        marginBottom: 20,
        alignItems: "right",
    },
    inputViewPass: {
        backgroundColor: "#FF9771",
        borderRadius: 30,
        width: "80%",
        height: 45,
        marginBottom: 20,
        alignItems: "right",
        marginBottom: 0,

    },
    TextInput: {
        borderWidth: 2,
        borderRadius: 30,
        height: 50,
        flex: 1,
        padding: 10,
        textAlign: "left",
        paddingLeft: 20,
        borderColor: '#EEF4ED',
        fontWeight: 'bold'
    },
    forgot_button: {
        height: 18,
        marginBottom: 0,
        marginTop: 0,
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 15,
        textDecorationLine: 'underline'
    },
    Ca_button: {
        height: 22,
        marginBottom: 0,
        marginTop: 10,
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 18,
        textDecorationLine: 'underline'
    },
    loginBtn: {
        width: "50%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
        backgroundColor: "#FF6B35",
        shadowColor: "black",
        elevation: 15

    },
    loginText: {
        color: '#FFFFFF',
        fontWeight: 'bold'
    },
    card: {
        backgroundColor: '#fed8b1',
        borderRadius: 20,
        paddingVertical: 45,
        paddingHorizontal: 20,
        width: '80%',
        marginVertical: 10,
        height: '50%',
        elevation: 15,
        alignItems: 'center'

    },
});

export default Loginscreen

