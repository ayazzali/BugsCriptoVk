
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
import { Row, Column as Col, Grid } from 'react-native-responsive-grid'
//import 'crypto-js'
//var CryptoJS = require("crypto-js");
var RSAKey = require('react-native-rsa');
var CryptoJS = require("crypto-js");

import { Login } from './login'
import { l, tokenAndFetch, longPoll } from './utils'

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

export class Dialog extends React.Component {
  constructor(p) {
    super(p)
    stop = false;
  }
  // 1 dialog:
  _longPoll(newMsg) {
    // todo: 2000000000 +
    l("_longPoll in dialog" + newMsg)
    if (newMsg.user_id == this.props.navigation.getParam('user_id', ''))
      this.setState(prv => {
        prv.messages.reverse(); prv.messages.push(newMsg); prv.messages.reverse();
        return { messages: prv.messages }
      })

  }
  componentWillUnmount() {
    this.stop = true // doestn help stop _longPoll !!!!! todo !!!!
    this._longPoll = undefined
  }
  componentWillMount() {
    this.setState({
      access_token: ['Загрузка...'],
      messages: ['Загрузка...'],
      msg: '',
      aesKey: 'q]w[ep',
    });

    longPoll(this._longPoll.bind(this), this.props.navigation, this.stop);

    (async () => {
      l("from storage aesKey")
      aesKey = await AsyncStorage.getItem(this.props.navigation.getParam('user_id', '') + "aesKey")
      l("from storage aesKey" + aesKey)
      this.setState({ aesKey: aesKey == null ? 'q]w[ep' : aesKey, })//todo!
    })()
    tokenAndFetch(
      'https://api.vk.com/method/messages.getHistory?v=5.52&user_id=' +
      this.props.navigation.getParam('user_id', '') +
      '&access_token=[access_token]',
      this.props.navigation
    ).then(json => {
      // l(json);
      l('+ getHistory: json arrived:)');
      //debugger;
      let messages = json.response.items
      this.setState({ messages: messages });
    }).catch(e => {
      console.error("getHistory: " + e);
      debugger;
    });
  }
  render() {
    //l(this.state.messages);
    //debugger;

    //decrypt decrypt decrypt decrypt decrypt decrypt decrypt decrypt decrypt decrypt decrypt decrypt decrypt decrypt decrypt decrypt
    l('+ decrypt, render:');
    //debugger;
    let _messages = this.state.messages.map(val => {
      if (val && val.body && val.body.startsWith(AESRFS)) {
        let pureMsg = val.body.substr(AESRFS.length, val.body.length - 1)
        pureMsg = pureMsg.split(' ').join("+")
        //pureMsg=decodeURI(pureMsg);
        l("decrypting: " + pureMsg)

        var bytes = CryptoJS.AES.decrypt(pureMsg, this.state.aesKey);
        l(bytes)
        debugger;
        try {
          var plaintext = bytes.toString(CryptoJS.enc.Utf8);
          if (plaintext == '0')
            val.body = pureMsg
          else
            val.body = plaintext;

        } catch (e) {
          console.warn("toStringing")
          l(bytes)
          val.body = "(что-то пошло не так)"
        }
      }
      return val;
    });///.map(el => el.message);
    l(' count=' + _messages.length);
    const list = _messages.map((val, id) => (
      <View key={id}>
        <TouchableHighlight>
          <Text style={val.from_id == this.props.navigation.getParam("user_id", '') ? styles.Left : styles.Right}>{val && val.body ? val.body : '0'} </Text>
        </TouchableHighlight>
      </View>
    ));
    return (
      <View style={styles.Main}>
        <ScrollView style={styles.FlexStyle}>
          {list}
        </ScrollView>
        <View>
          <View>
            <TextInput
              placeholder={"Ваш \"пароль\". Передайте его собеседнику!"}// т.к. в интернете всё можно перехватить"}
              value={this.state.aesKey}
              onChangeText={value => {
                l("changing aesKey")
                AsyncStorage.setItem(this.props.navigation.getParam('user_id', '') + "aesKey", value)
                this.setState({ aesKey: value })
              }} />
          </View>
          <Row>
            <Col size={80}>
              <View>
                <TextInput onChangeText={value => this.setState({ msg: value })} placeholder={"Ваше сообщение ..."} />
              </View>
            </Col>
            <Col size={20}>
              <View>
                <Button
                  onPress={() => {
                    l('encripting');
                    // Encrypt Encrypt Encrypt Encrypt Encrypt Encrypt Encrypt
                    var ciphertext = CryptoJS.AES.encrypt(this.state.msg, this.state.aesKey);
                    l(ciphertext.ciphertext)
                    let encripted = ciphertext.toString()//do bool enc or no
                    l(encripted)
                    encripted = AESRFS + encripted
                    tokenAndFetch(
                      'https://api.vk.com/method/messages.send?v=5.52&user_id=' +
                      this.props.navigation.getParam('user_id', '') +
                      '&access_token=[access_token]&message=' +
                      encripted// todo encodeURI doesnt work for + CHECK!
                    )
                  }}
                  style={styles.Buttonsend}
                  title={"Send"} />
              </View>
            </Col>
          </Row>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  Right: {
    textAlign: 'right', alignSelf: 'stretch'
  },
  Left: {
    textAlign: 'left', alignSelf: 'stretch'
  },
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