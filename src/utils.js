import {
  AsyncStorage,
} from 'react-native';
import { StackNavigator } from 'react-navigation'; // 1.5.9

export const l = v => {
    console.log(JSON.stringify(v));
  };
  
/// login and fetch.json() and replaces: [access_token]
export  function tokenAndFetch(url, navigation) {
  //AsyncStorage.removeItem('access_token',undefined)
  // l("deleted"
  // return AsyncStorage.getItem('access_token')
  //   .then(access_token => {
    return (async()=>{
    var access_token=await  AsyncStorage.getItem('access_token')
      //debugger;
      url = url.replace('[access_token]', access_token);
      l('tokenAndFetch starts:')
      //l(url)
      if (!access_token) navigation.navigate('_Login');
      else return fetch(url)
    // })
    // .catch(e => {
    //   console.error(e);
    //   debugger;
    // })
    .then(resp => {
      if(resp)//if above never returned smth
        return resp.json()})
    .catch(e => {
      console.error(e);
      debugger;
    })
    .then(json => {
      //debugger;
      if (json&&json.error) {
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
      console.warn(e);
      debugger;
    });
})()}