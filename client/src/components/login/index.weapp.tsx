import Taro, { Component } from "@tarojs/taro"
import { View, Text, Button, Image } from "@tarojs/components"

import './login.scss'

export default class Login extends Component {
  state:any = {
    user: {}
  }

  componentWillMount() {
    this.getLogin()
  }

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  getLogin = ( userinfo? ) => {
    let localUserinfo = Taro.getStorageSync( 'userinfo' )
    let _userinfo = userinfo ? userinfo : localUserinfo
    
    return Taro.cloud
      .callFunction({
        name: "login",
        data: { _userinfo }
      }).then( (data:any) => {
        if( data.errMsg == 'cloud.callFunction:ok'){
          let { user } = data.result
          this.setState({
            user
          })
        } 
      })
  }

  onGetUserInfo ( res ){
    let userData = res.detail
    let { userInfo } = userData
    !!userInfo.nickName && Taro.setStorageSync( 'userinfo', userInfo )
    
    this.getLogin( userInfo )
  }

  

  render() {
    let { user = {} } = this.state
    return (
      <View className='UserLogin'>
        {
          !!user.nickName ? 
          <View className='UserInfo'>
            <View className='UserInfo__Avatar'>
              <Image src={user.avatarUrl} mode='widthFix' />
            </View>
            <View className='UserInfo__Name'>
              <Text>{user.nickName}</Text>
            </View>
          </View>:
          <Button className='UserLogin__Button' openType='getUserInfo' onGetUserInfo={this.onGetUserInfo.bind(this)}>授权用户信息</Button>
        }
      </View>
    )
  }
}
