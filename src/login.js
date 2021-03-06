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
import { StackNavigator } from 'react-navigation';
import { l, tokenAndFetch } from './utils'

function URLToArray(url, adv) {
  var request = {};
  var pairs;
  if (url.indexOf('?') > 0)
    pairs = url.substring(url.indexOf('?') + 1).split('&');
  else pairs = url.substring(url.indexOf(adv) + 1).split('&');

  for (var i = 0; i < pairs.length; i++) {
    if (!pairs[i]) continue;
    var pair = pairs[i].split('=');
    request[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }
  return request;
}

export class Login extends Component {
  constructor(p) {
    super(p);
    this.alreadyLoggedIn = false//cause _onNavigationStateChange called 2 times with same access_token
  }
  _onNavigationStateChange(e) {
    debugger;
    //l(e)
    let arr = URLToArray(e.url, '#');
    if (arr['access_token'] && !this.alreadyLoggedIn) {
      l("token" + arr['access_token'] ? "good" : "dont exists")
      //console.log(arr['access_token']);
      AsyncStorage.setItem('access_token', arr['access_token']);
      this.props.navigation.navigate('_DialogsList');
      this.alreadyLoggedIn = true;
      return;
      // TODO
      //set open rsa key
      l("react-native-rsa")
      var RSAKey = require('react-native-rsa');
      const bits = 1024;
      const exponent = '10001'; // must be a string. This is hex string. decimal = 65537
      var rsa = new RSAKey();
      rsa.generate(bits, exponent);
      var publicKey = rsa.getPublicString(); // return json encoded string
      var privateKey = rsa.getPrivateString();
      tokenAndFetch('https://api.vk.com/method/storage.set?v=5.52&access_token=[access_token]' +
        'global=1&&key=rsaopen&&value=' + encodeURI(publicKey))//+'user_id
        .then(json => console.info)
        .catch(e => { console.error("storage.set: " + e); debugger; });
    }
  }
  render() {
    // debugger;
    return (
      <WebView
        source={{
          uri: 'https://oauth.vk.com/authorize?client_id=5490057&display=page&redirect_uri=https://oauth.vk.com/blank.html&scope=messages&response_type=token&v=5.52',
        }}
        style={{ marginTop: 20 }}
        onNavigationStateChange={this._onNavigationStateChange.bind(this)}
      />
    );
  }
}
