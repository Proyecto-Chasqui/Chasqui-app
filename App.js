import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import configureStore from './app/store';
//import 'index.css';
//import 'app.css';
import MainApp from './app/MainApp';

const store = configureStore();

export default function App() {
  return (
      <MainApp store={store}/>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
