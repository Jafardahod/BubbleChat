import { StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import React from 'react'


var width = Dimensions.get('window').width;
var Viewwidth = width * 0.95;
const FreindsList = ({ item, id }) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity style={styles.mainView} onPress={() => navigation.navigate('Chat', { CurrentUserID: id, selectedUserID: item._id, name: item.name })}>
            <View style={styles.imageview}>

                <Image style={styles.image} source={require("../assets/man.png")} />
            </View>
            <View style={styles.textview}>

                <Text style={styles.NameText}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    mainView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        marginRight: 10,
        marginTop: 15,


    },
    NameText: {
        fontSize: 25,
        color: 'black',
        marginBottom: 20,
    },
    textview: {
        width: Viewwidth * 0.33,
        flex: 1,
        borderBottomColor: '#FF6B35',
        borderBottomWidth: 0.5,
        marginLeft: 10,
        marginRight: 10,


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
});

export default FreindsList
