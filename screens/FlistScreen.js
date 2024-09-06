import { Image, Pressable, StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Dimensions, StatusBar } from 'react-native'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import FreindsList from '../components/FreindsList';
import { LinearGradient } from 'expo-linear-gradient';
import { IPADDRESS } from '../config';
import { RefreshControl } from 'react-native';





var width = Dimensions.get('window').width;
var height = Dimensions.get('window').height;

const FlistScreen = () => {
    navigation = useNavigation();
    const [users, setusers] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const handleLogout = () => {
        AsyncStorage.removeItem("authToken");
        navigation.navigate("Home");

    }

    const onRefresh = async () => {
        setRefreshing(true);
        console.log("Working from refresh");

        try {
            const response = await axios.get(`http://${IPADDRESS}:4000/freindsList/${id}`);
            setusers(response.data);
        } catch (error) {
            console.log(error, "error");
        } finally {
            setRefreshing(false);
        }
    };



    useEffect(() => {
        const fetchUsers = async () => {
            global.id = await AsyncStorage.getItem("userID");
            axios.get(`http://${IPADDRESS}:4000/freindsList/${id}`).then((response) => {
                setusers(response.data);


            }).catch((error) => {
                console.log(error, "error");
            })

        }
        fetchUsers();
    }, []);


    const CustomHeader = () => (
        <SafeAreaView style={{ height: height * 0.15, backgroundColor: '#FF6B35', justifyContent: 'flex-start', alignItems: 'flex-end', flexDirection: 'row' }}>
            <StatusBar translucent backgroundColor="#FF6B35" barStyle="light-content" />
            <Text style={styles.HeaderText}>Bubble Chat</Text>
            <View style={{ fontSize: 26, flex: 1, flexDirection: 'row', height: height * 1, fontWeight: 'bold', marginBottom: height * 0.03, alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                <Pressable onPress={() => { navigation.navigate("Freinds"); }}>
                    <Image style={styles.HeaderFreindRequests} source={require("../assets/friends.png")} />
                </Pressable>
                <Pressable onPress={() => { navigation.navigate("Main"); }}>
                    <Image style={styles.HeaderAddfreind} source={require("../assets/Frequest.png")} />
                </Pressable>
                <Pressable onPress={handleLogout} >
                    <Image style={styles.HeaderLogout} source={require("../assets/logout.png")} />
                </Pressable>
            </View>
        </SafeAreaView >

    );

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

            <LinearGradient colors={['white', 'white']} style={styles.SVcontainer}>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >

                    {
                        users.length > 0 ? (
                            users.map((item, index) => (
                                <FreindsList key={index} item={item} id={id} />
                            ))
                        ) : (
                            <Text style={styles.NoDataText}>NO Friends</Text>
                        )
                    }

                </ScrollView>
            </LinearGradient>
        </LinearGradient>
    )
}


const styles = StyleSheet.create({

    SVcontainer: {
        flex: 1,
        width: width * 1,
        // marginRight: 0,
        // marginLeft: 0,
        // marginBottom: 10,
        // borderBottomLeftRadius: 30,
        // borderBottomRightRadius: 30,
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
        color: 'white',
        marginLeft: width * 0.05,
        fontSize: 26,
        marginBottom: height * 0.03,
        fontWeight: 'bold',

    },
    HeaderFreindRequests: {
        width: 30,
        height: 30,

    },
    HeaderAddfreind: {
        width: 30,
        height: 30,
        marginLeft: 13,

    },
    HeaderLogout: {
        width: 30,
        height: 30,
        marginLeft: 18,
        marginRight: 15
    },
    NoDataText: {
        color: 'white',
        marginLeft: width * 0.35,
        fontSize: 26,
        marginTop: 45,
    },
})

export default FlistScreen

