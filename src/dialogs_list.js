

import React, { Component } from 'react';
import {
  Button,
  AsyncStorage,
  WebView,
  //AppRegistry,
  View,
  ScrollView,
  //ListView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { StackNavigator } from 'react-navigation'; // 1.5.9
import { Row, Column as Col, Grid} from 'react-native-responsive-grid'
//import 'crypto-js'
//var CryptoJS = require("crypto-js");
var RSAKey = require('react-native-rsa');

import {Login} from './login'
import {l, tokenAndFetch} from './utils'
import {Dialog} from './dialog'

export class DialogsList extends React.Component {
    componentWillMount() {
      this.setState({
        access_token: ['Загрузка...'],
        dialogs: ['Загрузка...'],
      });
      tokenAndFetch(
        'https://api.vk.com/method/messages.getDialogs?v=5.52&access_token=[access_token]',
        this.props.navigation
      ).then(json => {
        let messages = json.response.items.map(el => el.message);
        this.setState({ dialogs: messages });
      });
    }
    render() {
      console.info('render dialogs');
      const dialogsCopmponents = this.state.dialogs.map((val, id) => (
        <Button
          key={id}
          title={val.body ? val.body : ''} //
          onPress={() => this.props.navigation.navigate('_Dialog', { ...val })}
        />
      ));
      return (
        <ScrollView style={styles.FlexStyle}>
          {dialogsCopmponents}
        </ScrollView>
      );
    }
  }
  
  const styles = StyleSheet.create({
    FlexStyle: {
      flex: 1,
      alignSelf: 'stretch'
    },
    Main: {
          flex: 1, 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          flexWrap: 'wrap'
    },
    Inputcontainer: {
          flex: 1, 
          flexDirection: 'row', 
          justifyContent: 'flex-start', 
          flexWrap: 'wrap',
          height: 80
    },
    Buttonsend: {
          
    },
    ColorRed: {
      backgroundColor: 'red',
    },
  });