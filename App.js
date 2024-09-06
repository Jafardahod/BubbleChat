import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Stacknavigator from './Stacknavigator';
import { UserContext } from './Usercontext';


export default function App() {
  return (
    <>
      <UserContext>

        <Stacknavigator />
      </UserContext>
    </>
  );
}

const styles = StyleSheet.create({
  container: {

    flex: 1,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
