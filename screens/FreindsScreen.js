import { Image, Pressable, StyleSheet, Text, View, TouchableOpacity, StatusBar, SafeAreaView, ScrollView, Dimensions } from 'react-native'
import React, { useLayoutEffect, useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Acceptuser from '../components/Acceptuser';
import { IPADDRESS } from '../config';
import { LinearGradient } from 'expo-linear-gradient';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;
const CustomHeader = () => (
    <View style={{ height: height * 0.15, backgroundColor: '#FF6B35', justifyContent: 'flex-start', alignItems: 'flex-end', flexDirection: 'row' }}>
        <StatusBar translucent backgroundColor="#FF6B35" barStyle="light-content" />
        <TouchableOpacity style={{ marginLeft: 25, marginBottom: height * 0.04 }} onPressIn={() => navigation.navigate("Flist")}>
            <Image style={{ height: 20, width: width * 0.06 }} source={require("../assets/back.png")} />
        </TouchableOpacity>
        <Text style={{ color: 'white', fontSize: 26, fontWeight: 'bold', marginLeft: width * 0.140, marginBottom: height * 0.03 }}>Friend Requests</Text>
    </View>

);

const FreindsScreen = () => {
    navigation = useNavigation();

    const [users, setusers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            global.id = await AsyncStorage.getItem("userID");



            axios.get(`http://${IPADDRESS}:4000/freindRequestRecieve/${id}`).then((response) => {
                setusers(response.data);
            }).catch((error) => {
                console.log(error, "error");
            })

        }

        fetchUsers();
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <CustomHeader />,
        });
    }, [navigation]);

    return (
        <LinearGradient colors={['#FF6B35', '#FF6B35']}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={styles.container}>
            <SafeAreaView style={styles.SVcontainer}>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {
                        users.length > 0 ? (
                            users.map((item, index) => (
                                <Acceptuser key={index} item={item} users={users} setusers={setusers} id={id} />
                            ))
                        ) : (
                            <Text style={styles.NoUserText}>No Friend Requests</Text>
                        )
                    }


                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};


const styles = StyleSheet.create({
    SVcontainer: {
        flex: 1,
        width: width * 1,
        backgroundColor: '#EEF4ED',
        marginRight: 5,
        marginLeft: 5,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        elevation: 100,
    },
    scrollView: {
        flex: 1,

    },
    container: {
        flex: 1,

        alignItems: "center",
        justifyContent: "center",
    },
    NoUserText: {
        color: 'black',
        alignItems: 'center',
        marginLeft: width * 0.22,
        fontSize: 26,
        marginTop: 45,

    }
});

export default FreindsScreen;
