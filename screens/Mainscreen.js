import { Image, Pressable, StyleSheet, Text, TouchableOpacity, StatusBar, View, SafeAreaView, ScrollView, Dimensions } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserType, UserContext } from '../Usercontext';
import axios from 'axios';
import User from '../components/User';
import { LinearGradient } from 'expo-linear-gradient';
import { IPADDRESS } from '../config';

var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

const CustomHeader = () => (
    <View style={{ height: height * 0.15, backgroundColor: '#FF6B35', justifyContent: 'flex-start', alignItems: 'flex-end', flexDirection: 'row' }}>
        <StatusBar translucent backgroundColor="#FF6B35" barStyle="light-content" />
        <TouchableOpacity style={{ marginLeft: 25, marginBottom: height * 0.04 }} onPressIn={() => navigation.navigate("Flist")}>
            <Image style={{ height: 20, width: width * 0.06 }} source={require("../assets/back.png")} />
        </TouchableOpacity>
        <Text style={{ color: 'white', fontSize: 26, fontWeight: 'bold', marginLeft: width * 0.190, marginBottom: height * 0.03 }}>Add Friends</Text>
    </View>

);
const Main = () => {

    navigation = useNavigation();
    const { UserId, setUserId } = useContext(UserType);

    const [users, setusers] = useState([]);

    const handleLogout = () => {
        AsyncStorage.removeItem("authToken");
        navigation.navigate("Home");
        setUserId("");
    }
    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <CustomHeader />,
        });
    }, [navigation]);

    useEffect(() => {
        const fetchUsers = async () => {
            var id = await AsyncStorage.getItem("userID");
            try {
                setUserId(id);


            } catch (error) {
                console.error("An error occurred:", error);
            }




            axios.get(`http://${IPADDRESS}:4000/users/${id}`).then((response) => {
                setusers([]);
                setusers(response.data);

            }).catch((error) => {
                console.log(error, "error");
            })

        }
        fetchUsers();
    }, []);
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
                                <User key={index} item={item} users={users} setusers={setusers} />
                            ))
                        ) : (
                            <Text style={styles.NoDataText}>NO Freinds</Text>
                        )
                    }
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    )
}


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

    HeaderView: {
        flexDirection: "row",

    },
    HeaderText: {
        marginTop: 25,
        marginBottom: 20,
        marginRight: 28,
        fontSize: 26,
        color: 'white',
        fontWeight: 'bold',

    },
    HeaderAddfreind: {
        width: 40,
        height: 40,

    },
    HeaderLogout: {
        width: 50,
        height: 50,
        marginLeft: 10,
    },
    NoDataText: {
        color: 'white',
        marginLeft: width * 0.35,
        fontSize: 26,
        marginTop: 45,
    }


})

export default Main
