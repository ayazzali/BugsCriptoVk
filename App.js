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

import {Login} from './src/login'
import {l, tokenAndFetch} from './src/utils'
import {Dialog} from './src/dialog'
import{DialogsList} from './src/dialogs_list'

const AESRecognizingFirstSymbols = "encryptedAAA";
const AESRFS = AESRecognizingFirstSymbols;

// // Encrypt
// var ciphertext = CryptoJS.AES.encrypt('my message', 'secret key 123');
// ciphertext.ciphertext
// // Decrypt
// var bytes = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123');
// var plaintext = bytes.toString(CryptoJS.enc.Utf8);
//console.log(plaintext);
l("react-native-rsa")
const bits = 1024;
const exponent = '10001'; // must be a string. This is hex string. decimal = 65537
var rsa = new RSAKey();
rsa.generate(bits, exponent);
var publicKey = rsa.getPublicString(); // return json encoded string
var privateKey = rsa.getPrivateString(); // return json encoded string

var rsa = new RSAKey();
rsa.setPublicString(publicKey);
var originText = 'sample String Value';
var encrypted = rsa.encrypt(originText);

rsa.setPrivateString(privateKey);
var decrypted = rsa.decrypt(encrypted); // decrypted == originText

l(decrypted)
tokenAndFetch('https://api.vk.com/method/storage.set?v=5.52&access_token=[access_token]'+
'global=1&&key=rsaopen&&value='+encodeURI(publicKey), null)//+'user_id
.then(json=>
console.info)
.catch(e => {console.error("storage.set: " + e);debugger;});




//AppRegistry.registerComponent('DialogsList',()=>DialogsList);

export default StackNavigator(
  {
    _DialogsList: {
      screen: DialogsList,
    },
    _Dialog: {
      screen: Dialog,
    },
    _Login: {
      screen: Login,
    },
  },
  {
    initialRouteName: '_DialogsList',
  }
);
