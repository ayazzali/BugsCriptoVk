import React, { Component } from 'react';
import {
  Button,
  AsyncStorage,
  WebView,
  //AppRegistry,
  //View,
  ScrollView,
  //ListView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { StackNavigator } from 'react-navigation'; // 1.5.9
const AESRecognizingFirstSymbols="encryptedAAA";
const AESRFS=AESRecognizingFirstSymbols;
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
class Login extends Component {
  _onNavigationStateChange(e) {
    //debugger;
    //l(e)
    let arr = URLToArray(e.url, '#');
    if (arr['access_token']) {
      l("token"+arr['access_token']?"good":"dont exists")
      //console.log(arr['access_token']);
      AsyncStorage.setItem('access_token', arr['access_token']);
      this.props.navigation.navigate('_CategoriesList');
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
const l = v => {
  console.log(JSON.stringify(v));
};
///login and fetch.json() and replaces: [access_token]
function tokenAndFetch(url, navigation) {
  //AsyncStorage.removeItem('access_token',undefined)
 // l("deleted"
  return AsyncStorage.getItem('access_token')
    .then(access_token => {
      //debugger;
      url = url.replace('[access_token]', access_token);
      l('tokenAndFetch starts:')
      //l(url)
      if (!access_token) navigation.navigate('_Login');
      else return fetch(url);
    })
    .catch(e => {
      console.error(e);
      debugger;
    })
    .then(resp => resp.json())
    .catch(e => {
      console.error(e);
      debugger;
    })
    .then(json => {
      //debugger;
      if (json.error) {
        navigation.navigate('_Login');
        l('ERROR: resp.json()');
        //l(JSON.stringify(json));
        return JSON.stringify(json);
      }
      return json;
      //let messages = json.response.items.map(el => el.message);
      //this.setState({ dialogs: messages });
    })
    .catch(e => {
      console.error(e);
      debugger;
    });
}

class CategoriesList extends React.Component {
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
        onPress={() => this.props.navigation.navigate('_Messages', { ...val })}
      />
    ));
    return (
      <ScrollView style={styles.FlexStyle}>
        {dialogsCopmponents}
      </ScrollView>
    );
  }
}

class CategoryButton extends React.Component {
  // 1 dialog:
  componentWillMount() {
    this.setState({
      access_token: ['Загрузка...'],
      messages: ['Загрузка...'],
      msg: '',
      aesKey: 'q]w[ep',//todo!
    });
    l();
    tokenAndFetch(
      'https://api.vk.com/method/messages.getHistory?v=5.52&user_id=' +
        this.props.navigation.getParam('user_id', '') +
        '&access_token=[access_token]',
      this.props.navigation
    ).then(json => {
      // l(json);
      l('+ getHistory:');
      let messages = json.response.items.map(val=>{
        if(val&&val.body&&val.body.startsWith(AESRFS)){
          l("decrypting: "+val.body)
          
        }
        return val;
      });///.map(el => el.message);
      l(' count=' + messages.length);
      this.setState({ messages: messages });
    }).catch(e => {
      console.error("getHistory: "+e);
      debugger;
    });
  }
  render() {
    //l(this.state.messages);
    const list = this.state.messages.map((val, id) => (
      <Button
        key={id}
        title={val&&val.body ? val.body : '0'} //
        onPress={() => {} //this.props.navigation.navigate('_Messages', {user_id:val.user_id})
        }
      />
    ));
    return (
      <ScrollView style={styles.FlexStyle}>
        {list}
        <TextInput 
          value={this.state.aesKey}
          onChangeText={value => this.setState({aesKey: value })} />
        <TextInput onChangeText={value => this.setState({msg: value })} />
        <TouchableOpacity
          onPress={() =>{
            l('encripting');
            let encripted=this.state.msg//do bool enc or no
            encripted=AESRFS+encripted
            tokenAndFetch(
              'https://api.vk.com/method/messages.send?v=5.52&user_id=' +
                this.props.navigation.getParam('user_id', '') +
                '&access_token=[access_token]&message=' +
                encripted
            )}}>
          <Text>
            Send
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  FlexStyle: {
    flex: 1,
  },
  ColorRed: {
    backgroundColor: 'red',
  },
});

//AppRegistry.registerComponent('CategoriesList',()=>CategoriesList);

export default StackNavigator(
  {
    _CategoriesList: {
      screen: CategoriesList,
    },
    _Messages: {
      screen: CategoryButton,
    },
    _Login: {
      screen: Login,
    },
  },
  {
    initialRouteName: '_CategoriesList',
  }
);
