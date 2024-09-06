import { StyleSheet, Text, View, Dimensions, SafeAreaView, StatusBar, ScrollView, Image, TouchableOpacity, KeyboardAvoidingView, TextInput, Pressable, ActivityIndicator } from 'react-native'
import React, { useState, useLayoutEffect, useEffect, useRef } from 'react'
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo } from '@expo/vector-icons';
import { RefreshControl } from 'react-native';
import EmojiSelector from 'react-native-emoji-selector';
import { IPADDRESS } from '../config';
import * as DocumentPicker from 'expo-document-picker';
import { firebase } from '../configuration';
import { Video, ResizeMode } from 'expo-av';

var height = Dimensions.get('window').height;
var width = Dimensions.get('window').width;


const ChatScreen = ({ route, navigation }) => {
    const [message, setmessage] = useState("");
    const [selectedimage, setselectedimage] = useState("");
    const [allmessages, setallmessages] = useState([]);
    const [showEmojiSelector, setshowEmojiSelector] = useState(false);
    const { CurrentUserID, selectedUserID, name } = route.params;
    const [isLoading, setIsLoading] = useState(false);
    const video = React.useRef(null);
    const [status, setStatus] = React.useState({});

    //Header Element
    const CustomHeader = () => (
        <View style={{
            height: height * 0.15,
            backgroundColor: '#FF6B35',
            alignItems: 'center',  // Vertically center contents
            flexDirection: 'row',
            justifyContent: 'center', // Horizontally center contents
        }}>
            <StatusBar translucent backgroundColor="#FF6B35" barStyle="light-content" />
            <TouchableOpacity style={{ position: 'absolute', left: 25, bottom: height * 0.04 }} onPressIn={() => navigation.navigate("Flist")}>
                <Image style={{ height: 20, width: width * 0.06 }} source={require("../assets/back.png")} />
            </TouchableOpacity>
            <Text style={{
                color: 'white',
                fontSize: 26,
                fontWeight: 'bold',
                marginTop: height * 0.04,
            }}>{name}</Text>
        </View>


    );
    useLayoutEffect(() => {
        navigation.setOptions({
            header: () => <CustomHeader />,
        });
    }, [navigation]);
    //Fetching all the message for the current user and the selected user in some time interval
    const fetchMessages = async () => {
        try {
            const response = await fetch(`http://${IPADDRESS}:4000/messages/${CurrentUserID}/${selectedUserID}`);
            const data = await response.json();

            if (response.ok) {
                setallmessages(data);
            }
            else {
                console.log("Error in showing messages", response.status.message);
            }
        }
        catch (error) {
            console.log("Error Fetching messages", error);

        }
    }
    useEffect(() => {
        fetchMessages();

        const intervalId = setInterval(fetchMessages, 500);

        return () => {
            clearInterval(intervalId);
        };
    }, []);
    // console.log("messages", allmessages);

    //all Handles
    const handleEmojiPress = () => {
        setshowEmojiSelector(!showEmojiSelector);
    }
    //to send messages and store them in the backend
    const handleSend = async (messageType, file) => {
        if (message === '' && !file) {
            console.log("Message field empty Enter something");
        }
        else {
            setIsLoading(true);
            try {
                const formData = new FormData();
                formData.append("senderId", CurrentUserID);
                formData.append("recieverId", selectedUserID);

                if (messageType === 'text') {
                    formData.append("messageType", "text");
                    formData.append("message", message);

                }
                else {
                    formData.append("messageType", messageType);
                    formData.append("FileUrl", file.uri);
                    const File = {
                        name: file.name,
                        uri: file.uri,
                        type: file.mimeType,
                        size: file.size,
                    };
                    formData.append("File", File);
                }

                const response = await fetch(`http://${IPADDRESS}:4000/messages`, {
                    method: 'POST',
                    body: formData
                })

                if (response.ok) {
                    console.log("done");
                    setmessage("");
                    setselectedimage("");
                    fetchMessages();
                }


            } catch (error) {
                console.log("error in sending message", error);

            } finally {
                setIsLoading(false);
            }
        }

    }
    //document selecting
    const handleSelectFile = async () => {
        try {
            const docRes = await DocumentPicker.getDocumentAsync({
                type: '*/*',
            });
            const assets = docRes.assets;
            if (!assets) return;

            const file = assets[0];
            const filetype = file.mimeType.split("/")[0];

            handleSend(filetype, file);

            // console.log(data);
        } catch (error) {
            console.log("Error while selecting file: ", error);
        }
    }

    //Formating the time in a readable way
    const formatTime = (time) => {
        const options = { hour: 'numeric', minute: 'numeric' };
        return new Date(time).toLocaleString("en-US", options)
    }
    const scrollViewRef = useRef();

    useEffect(() => {
        scrollViewRef.current.scrollToEnd({ animated: true });
    }, [allmessages]);
    return (
        <KeyboardAvoidingView style={styles.container}>
            <LinearGradient colors={['#FF6B35', 'white']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={styles.LinearGradient}
            >
                {isLoading && (
                    <View style={{ backgroundColor: 'pink' }}>
                        <Text style={{ alignSelf: 'center', marginBottom: 10, marginTop: 10, fontSize: 25, color: 'black' }}>Sending file...</Text>
                        <ActivityIndicator size="large" color='blue' />
                    </View>
                )}
                <ScrollView ref={scrollViewRef} contentContainerStyle={{ flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'center' }} style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {allmessages.map((item, index) => {

                        if (item.messageType === 'text') {
                            return (
                                <Pressable key={index} style={[
                                    item?.senderId?._id === CurrentUserID ? styles.senderMessage : styles.recieversMessage
                                ]}>
                                    <Text style={{ fontSize: 21, color: 'white', textAlign: 'left', fontWeight: 'bold' }}>{item?.message}</Text>
                                    <Text style={{ textAlign: 'right', fontSize: 13, color: 'white', marginTop: 5 }}>{formatTime(item.timestamp)}</Text>
                                </Pressable>
                            )
                        }



                        if (item.messageType === 'image' && item.FileUrl) {
                            return (
                                <Pressable key={index} style={[
                                    item?.senderId?._id === CurrentUserID ? styles.senderImage : styles.recieversImage
                                ]}>
                                    <Image style={{ width: width * 0.52, height: height * 0.27, borderRadius: 10 }} source={{ uri: item.FileUrl }} />

                                    <Text style={{ textAlign: 'right', fontSize: 13, color: 'white', marginTop: 5 }}>{formatTime(item.timestamp)}</Text>
                                </Pressable>
                            )
                        } else if (item.messageType === 'video' && item.FileUrl) {

                            return (
                                <Pressable key={index} style={[
                                    item?.senderId?._id === CurrentUserID ? styles.senderVideo : styles.recieversVideo
                                ]}>
                                    <Video
                                        ref={video}
                                        style={{
                                            alignSelf: 'center',
                                            width: 320,
                                            height: 200,
                                        }}
                                        source={{
                                            uri: item.FileUrl,
                                        }}
                                        useNativeControls
                                        resizeMode={ResizeMode.CONTAIN}
                                        isLooping
                                        onPlaybackStatusUpdate={status => setStatus(() => status)}
                                    />
                                    <Text style={{ textAlign: 'right', fontSize: 13, color: 'white', marginTop: 5 }}>{formatTime(item.timestamp)}</Text>
                                </Pressable>
                            )
                        } else if (item.messageType === 'audio' && item.FileUrl) {

                            return (
                                <Pressable key={index} style={[
                                    item?.senderId?._id === CurrentUserID ? styles.senderVideo : styles.recieversVideo
                                ]}>
                                    <Image style={{ width: width * 0.095, height: height * 0.04, borderRadius: 10, alignSelf: 'center' }} source={require('../assets/audio.png')} />
                                    <Video
                                        ref={video}
                                        style={{
                                            alignSelf: 'center',
                                            width: 300,
                                            height: 78,
                                        }}
                                        source={{
                                            uri: item.FileUrl,
                                        }}
                                        useNativeControls
                                        resizeMode={ResizeMode.CONTAIN}
                                        isLooping
                                        onPlaybackStatusUpdate={status => setStatus(() => status)}
                                    />
                                    <Text style={{ textAlign: 'right', fontSize: 13, color: 'white', marginTop: 5 }}>{formatTime(item.timestamp)}</Text>
                                </Pressable>
                            )
                        }

                    })}
                </ScrollView>
                <View style={styles.inputView}>
                    <TouchableOpacity style={{ marginRight: width * 0.03, }} onPress={handleEmojiPress} >
                        <Image style={{ height: height * 0.045, width: width * 0.097, marginLeft: width * 0.01 }} source={require("../assets/smile.png")} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleSelectFile} style={{ marginRight: width * 0.035 }} >
                        <Image style={{ height: height * 0.05, width: width * 0.097, marginLeft: width * 0.01 }} source={require("../assets/addfiles.png")} />
                    </TouchableOpacity>
                    <TextInput style={styles.textInput} value={message} onChangeText={(text) => setmessage(text)} placeholder='Enter Your message' placeholderTextColor="white" />
                    <TouchableOpacity onPress={() => handleSend("text")} style={{ marginRight: width * 0.02, marginLeft: width * 0.03 }} >
                        <Image style={{ height: height * 0.055, width: width * 0.097, marginLeft: width * 0.01 }} source={require("../assets/send.png")} />
                    </TouchableOpacity>
                </View>
                {showEmojiSelector && (
                    <EmojiSelector style={{ height: 250, }} onEmojiSelected={(emoji) => {
                        setmessage((prevmessage) => prevmessage + emoji)
                    }} />
                )}
            </LinearGradient>
        </KeyboardAvoidingView >

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
    },
    LinearGradient: {
        flex: 1,
    },
    textInput: {
        flex: 1,
        height: 50,
        borderWidth: 0.8,
        borderColor: 'white',
        borderRadius: 20,
        paddingHorizontal: 10,
        color: 'white',
        fontSize: 20,

    },
    inputView: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: 'white',
        height: 80,
    },
    senderMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#fad6a5',
        padding: 11,
        maxWidth: "60%",
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#FF6B35',
        marginTop: 5,
        marginBottom: 5,
        marginRight: 6,
    },
    senderImage: {
        alignSelf: 'flex-end',
        backgroundColor: '#fad6a5',
        maxWidth: "60%",
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#FF6B35',
        marginTop: 5,
        marginBottom: 5,
        marginRight: 6,
        padding: 7,
    },
    recieversMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#A6B3D3',
        padding: 11,
        maxWidth: "60%",
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#224193',
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 6,
    },
    recieversImage: {
        alignSelf: 'flex-start',
        backgroundColor: '#A6B3D3',
        padding: 7,
        maxWidth: "60%",
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#224193',
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 6,
    },
    senderVideo: {
        alignSelf: 'flex-end',
        backgroundColor: '#fad6a5',
        maxWidth: "100%",
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#FF6B35',
        marginTop: 5,
        marginBottom: 5,
        marginRight: 6,
        padding: 7,
    },
    recieversVideo: {
        alignSelf: 'flex-start',
        backgroundColor: '#A6B3D3',
        padding: 7,
        maxWidth: "100%",
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#224193',
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 6,
    },

});

export default ChatScreen
