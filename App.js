import React from 'react';
import configureStore from './app/store';
import MainApp from './app/MainApp';

const store = configureStore();

export default function App() {
  return (
      <MainApp store={store}/>
  );
}
