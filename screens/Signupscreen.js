import { Alert, Dimensions, StyleSheet, Button, Text, View } from 'react-native'
import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    Image,
    TextInput,
    TouchableOpacity,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

import * as DocumentPicker from 'expo-document-picker';
import { IPADDRESS } from '../config';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
const Signupscreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [Password, setPassword] = useState("");
    const [CPassword, setCPassword] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);

    const handleSignup = async (e) => {
        e.preventDefault();

        if (CPassword === Password) {
            const user = new FormData();
            if (selectedFile) {

                user.append("name", name);
                user.append("email", email);
                user.append("password", Password);
                user.append('image', selectedFile.uri)
                const File = {
                    name: selectedFile.name,
                    uri: selectedFile.uri,
                    type: selectedFile.mimeType,
                    size: selectedFile.size,
                }
                // console.log(selectedFile.name)
                user.append("File", File);
                console.log(File.type)
            }
            console.log('fromher', user);

            try {


                const response = await fetch(`http://${IPADDRESS}:4000/Signup`, {
                    method: 'POST',
                    body: user
                })

                // await axios.post(`http://${IPADDRESS}:4000/Signup`, user).then((response) => {
                //     console.log('From herr')
                //     const Token = response.data.Token;
                //     const id = response.data.id;
                //     AsyncStorage.setItem("authToken", Token);
                //     AsyncStorage.setItem("userID", id);
                //     // setUserId(id);

                //     navigation.reset({
                //         index: 0,
                //         routes: [{ name: 'Flist' }],
                //     });
                //     console.log("Registration Successful");
                //     Alert.alert(
                //         "Registration Successful",
                //         "You have been Registered Successfully"
                //     )
                // })

                if (response.ok) {
                    console.log('From herr')
                    console.log(response);
                    
                    const Token = response.data.Token;
                    const id = response.data.id;
                    AsyncStorage.setItem("authToken", Token);
                    AsyncStorage.setItem("userID", id);
                    // setUserId(id);

                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Flist' }],
                    });
                    console.log("Registration Successful");
                    Alert.alert(
                        "Registration Successful",
                        "You have been Registered Successfully"
                    )

                }


            } catch (error) {
                console.log("error in sending message", error);

            }

            // if (!selectedFile) {

            //     const user = {
            //         name: name,
            //         email: email,
            //         password: Password,
            //         image: null,
            //         File: null
            //     };

            // }

            // console.log(selectedFile);
            // const user = {
            //     name: name,
            //     email: email,
            //     password: Password,
            //     image: selectedFile.uri,
            //     File: selectedFile
            // };

            // console.log(user)


            // try {
            //     await axios.post(`http://${IPADDRESS}:4000/Signup`, user).then((response) => {
            //         const Token = response.data.Token;
            //         const id = response.data.id;
            //         AsyncStorage.setItem("authToken", Token);
            //         AsyncStorage.setItem("userID", id);
            //         // setUserId(id);

            //         navigation.reset({
            //             index: 0,
            //             routes: [{ name: 'Flist' }],
            //         });
            //         console.log("Registration Successful");
            //         Alert.alert(
            //             "Registration Successful",
            //             "You have been Registered Successfully"
            //         );
            //     })
            // } catch (error) {
            //     Alert.alert(
            //         "Registration Failed",
            //         "An error Occurred"
            //     );
            //     console.log("failed", error);
            // }
        } else {
            console.log("Password and Confirm should be equal");
        }
    }


    const handleSelectFile = async () => {
        try {
            const docRes = await DocumentPicker.getDocumentAsync({
                type: 'image/*',
            });
            const assets = docRes.assets;
            if (!assets) return;

            const file = assets[0];
            const filetype = file.mimeType.split("/")[0];


            setSelectedFile(file);


            // console.log(data);
        } catch (error) {
            console.log("Error while selecting file: ", error);
        }
    }

    return (

        <View style={styles.container}>
            <Image style={styles.image} source={require("../assets/Logo3.png")} />
            <StatusBar style="auto" />
            <View style={styles.card}>
                {!selectedFile ? (
                    <TouchableOpacity onPress={handleSelectFile} >
                        <Image style={styles.ProfileImage} source={require('../assets/person.png')} />
                    </TouchableOpacity>

                )
                    :
                    (
                        <TouchableOpacity onPress={handleSelectFile} >
                            <Image style={styles.ProfileImage} source={{ uri: selectedFile.uri }} />
                        </TouchableOpacity>
                    )
                }

                <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder='Name'
                        placeholderTextColor="#FFFFFF"
                        onChangeText={(Name) => setName(Name)}
                    />

                </View>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder='Email'
                        placeholderTextColor="#FFFFFF"
                        onChangeText={(email) => setEmail(email)}
                    />

                </View>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder="Password"
                        placeholderTextColor="#FFFFFF"
                        secureTextEntry={true}
                        onChangeText={(password) => setPassword(password)}
                    />
                </View>
                <View style={styles.inputView}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder="Confirm Password"
                        placeholderTextColor="#FFFFFF"
                        secureTextEntry={true}
                        onChangeText={(Cpassword) => setCPassword(Cpassword)}
                    />
                </View>




                <TouchableOpacity onPress={handleSignup} style={styles.signUpBtn}>
                    <Text style={styles.loginText}>SignUP</Text>
                </TouchableOpacity>
                <TouchableOpacity onPressIn={() => navigation.navigate("Login")}>
                    <Text style={styles.A_button}>Already have an Account?</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,

        backgroundColor: "#EEF4ED",
        alignItems: "center",
        justifyContent: "center",
    },
    image: {
        height: 150,
        width: 200,
        marginTop: 30,
        marginBottom: 30,
    },
    inputView: {
        backgroundColor: "#FF9771",
        borderRadius: 30,
        width: "80%",
        height: 45,
        marginBottom: 20,
        alignItems: "right",
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
        fontWeight: 'bold',
    },

    A_button: {
        height: 22,
        marginBottom: 0,
        marginTop: 10,
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 18,
        textDecorationLine: 'underline'
    },
    signUpBtn: {
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
        fontWeight: "bold"
    },
    card: {
        backgroundColor: '#fed8b1',
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 20,
        width: '80%',
        marginVertical: 10,
        height: '70%',
        elevation: 15,
        alignItems: 'center'

    },

    ProfileImage: {
        backgroundColor: '#FF9771',
        borderRadius: 50,
        height: height * 0.08,
        width: width * 0.17,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: 'white',
    },

});

export default Signupscreen

