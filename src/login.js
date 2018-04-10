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
    _onNavigationStateChange(e) {
      //debugger;
      //l(e)
      let arr = URLToArray(e.url, '#');
      if (arr['access_token']) {
        l("token" + arr['access_token'] ? "good" : "dont exists")
        //console.log(arr['access_token']);
        AsyncStorage.setItem('access_token', arr['access_token']);
        this.props.navigation.navigate('_CategoriesList');
  
        //set open rsa key
        
        tokenAndFetch('https://api.vk.com/method/storage.set?v=5.52&access_token=[access_token]'+
      'global=1&&key=rsaopen&&value='+encodeURI(publicKey))//+'user_id
      .then(json=>console.info)
      .catch(e => {console.error("storage.set: " + e);debugger;});
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
  