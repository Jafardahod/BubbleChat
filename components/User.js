import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native'
import React, { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IPADDRESS } from '../config';
import axios from 'axios';
var width = Dimensions.get('window').width;
var Viewwidth = width * 0.95;


const User = ({ item, users, setusers }) => {
    const [requestSent, setRequestSent] = useState(false);
    const handleAddfriend = async (selectedUser) => {
        var CurrentUser = await AsyncStorage.getItem("userID");
        // console.log(CurrentUser);

        try {
            const response = await fetch(`http://${IPADDRESS}:4000/friendRequest`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",

                },
                body: JSON.stringify({ CurrentUser, selectedUser })
            })

            if (response.ok) {
                setRequestSent(true);
                setusers(users.filter((request) => request._id !== selectedUser));
                console.log("Freind request sent!");
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
            <View>
                <TouchableOpacity onPress={() => handleAddfriend(item._id)} style={styles.Btn}>
                    <Text style={{ color: 'white' }}>Add Freind</Text>
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
        width: Viewwidth * 0.50
    },
    image: {
        height: 60,
        width: Viewwidth * 0.15,
    },
    imageview: {
        marginTop: 5,
        marginRight: Viewwidth * 0.03,
    },
    Btn: {
        width: Viewwidth * 0.25,
        borderRadius: 25,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#5431d0",
        shadowColor: "black",
        elevation: 15,


    },


});

export default User
