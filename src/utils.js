import {
  AsyncStorage,
} from 'react-native';
import { StackNavigator } from 'react-navigation'; // 1.5.9

export const l = v => {
  console.log(JSON.stringify(v));
};

export const DisplaysName = { _Login: "_Login", _Dialog: "_Dialog", _DialogsList: "_DialogsList" }
console.log(DisplaysName)

export function tokenAndFetch(url, navigation) {
  //AsyncStorage.removeItem('access_token',undefined)
  // l("deleted"
  // return AsyncStorage.getItem('access_token')
  //   .then(access_token => {
  return (async () => {
    var access_token = await AsyncStorage.getItem('access_token')
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
        if (resp)//if above never returned smth
          return resp.json()
      })
      .catch(e => {
        console.error(e);
        debugger;
      })
      .then(json => {
        //debugger;
        if (json && json.error) {
          //if(json.error.error_code==100)
          l(json.error.error_msg)
          navigation.navigate('_Login'); //todo!!! check right this error code
          l('ERROR: resp.json()');
          //l(JSON.stringify(json));
          return JSON.stringify(json);//todo do proper alert: about 
        }
        return json;
        //let messages = json.response.items.map(el => el.message);
        //this.setState({ dialogs: messages });
      })
      .catch(e => {
        console.warn(e);
        debugger;
      });
  })()
}

/// func that will be called 'by' new msg
export function longPoll(func, navigation, stop = false) {//todo ACCESS_TOKEN (..)
  function upd(server, key, ts) {
    return fetch("https://" + server + "?act=a_check&key=" + key + "&ts=" + ts + "&wait=25&mode=2&version=2")
      .then((rawUpdate) => {
        //console.log(rawUpdate)
        return rawUpdate.json()
      }).then((update) => {
        //console.log(update)
        return update
      }).catch(console.error);
  }

  tokenAndFetch("https://api.vk.com/method/messages.getLongPollServer?access_token=[access_token]&v=5.73", navigation)
    .then(function (lp) {
      var r = lp.response;
      (async () => {
        var ts = r.ts
        while (true) {
          if (stop) return;
          try {
            var result = await upd(r.server, r.key, ts)
            ts = result.ts
            //console.log(result.updates);
            if (result.updates)  // проверка, были ли обновления
              result.updates.forEach(element => {
                let action_code = element[0]  // запись в переменную кода события
                if (action_code == 4)  // проверка кода события
                {
                  //l(element[3])//user_id
                  let text = element[5]//.split(" ").join("+")/// ибо вк видимо энкодит  //atob(element[5])
                  console.log("UpdateMsg: " + text)
                  func({ body: text, user_id: element[3] });
                }
              });
          } catch (e) { console.error(e) }
        }
      })();
    })
    .catch(console.error);
}