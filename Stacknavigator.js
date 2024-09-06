import { StyleSheet, Text, View, Pressable, Image } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Homescreen from './screens/Homescreen';
import Signupscreen from './screens/Signupscreen';
import Loginscreen from './screens/Loginscreen';
import Main from './screens/Mainscreen';
import FreindsScreen from './screens/FreindsScreen';
import ChatScreen from './screens/ChatScreen';
import Flist from './screens/FlistScreen';

const stacknavigator = () => {
    const Stack = createNativeStackNavigator();
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Home" component={Homescreen} options={{ headerShown: false }} />
                <Stack.Screen name="Signup" component={Signupscreen} options={{ headerShown: false }} />
                <Stack.Screen name="Login" component={Loginscreen} options={{ headerShown: false }} />
                <Stack.Screen name="Main" component={Main} />
                <Stack.Screen name="Freinds" component={FreindsScreen} />
                <Stack.Screen name="Chat" component={ChatScreen} />
                <Stack.Screen name="Flist" component={Flist} />



            </Stack.Navigator>
        </NavigationContainer>
    )
}
const styles = StyleSheet.create({


});

export default stacknavigator
