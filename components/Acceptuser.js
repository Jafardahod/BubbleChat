import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IPADDRESS } from '../config';
import { useNavigation } from '@react-navigation/native';

var width = Dimensions.get('window').width;
var Viewwidth = width * 0.95;

const Acceptuser = ({ item, users, setusers, id }) => {
    navigation = useNavigation();

    const handleAcceptFreind = async (selectedUser) => {
        const CurrentUser = await AsyncStorage.getItem("userID");

        try {
            const response = await fetch(`http://${IPADDRESS}:4000/friendAccept`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ CurrentUser: CurrentUser, selectedUser: selectedUser })
            });

            if (response.ok) {
                setusers(users.filter((request) => request._id !== selectedUser));
                console.log("Freind request Accepted Success");
                navigation.navigate('Chat', { CurrentUserID: id, selectedUserID: item._id })

            }
        } catch (error) {
            console.log("Error from here", error);
        }
    }

    const handleRejectFreind = async (selectedUser) => {
        const CurrentUser = await AsyncStorage.getItem("userID");

        try {
            const response = await fetch(`http://${IPADDRESS}:4000/freindReject`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ CurrentUser: CurrentUser, selectedUser: selectedUser })
            });

            if (response.ok) {
                setusers(users.filter((request) => request._id !== selectedUser));
                console.log("Freind request Rejected Successfully");
                // navigation.navigate("Chat");

            }
        } catch (error) {
            console.log("Error", error);
        }

    }
    return (
        <View style={styles.mainView}>
            <View style={styles.imageview}>

                <Image style={styles.image} source={require("../assets/man.png")} />
            </View>
            <View style={styles.textview}>

                <Text style={styles.NameText}>{item.name}</Text>
            </View>
            <View style={styles.buttonView}>
                <TouchableOpacity onPress={() => handleAcceptFreind(item._id)} style={styles.BtnAccept}>
                    <Text style={{ color: 'white' }}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRejectFreind(item._id)} style={styles.BtnReject}>
                    <Text style={{ color: 'white' }}>Reject</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    mainView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 20,
        marginTop: 15,

    },
    NameText: {
        fontSize: 23,
        color: 'black',
    },
    textview: {
        width: Viewwidth * 0.33
    },
    image: {
        height: 60,
        width: Viewwidth * 0.15,
    },
    imageview: {
        marginTop: 5,
        marginRight: Viewwidth * 0.03,
    },
    buttonView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    BtnAccept: {
        width: Viewwidth * 0.20,
        borderRadius: 25,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#5431d0",
        shadowColor: "black",
        elevation: 15,
        marginRight: 10,


    },
    BtnReject: {
        width: Viewwidth * 0.20,
        borderRadius: 25,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FF5003",
        shadowColor: "black",
        elevation: 15,
        marginRight: 10,
    },


});

export default Acceptuser
