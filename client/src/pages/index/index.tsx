import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import './index.scss'

import Login from '../../components/login/index.weapp'

export default class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: ''
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onClickSafari(){
    Taro.navigateTo({
      url: '/pages/map/index'
    })
  }

  onClickMath() {
    Taro.navigateTo({
      url: '/pages/quiz/index'
    })
  }

  render () {
    return (
      <View className='Home'>
        <Login/>
        <View className='Home__Slogan'>
          打开地图，开上车，漫游在地图上
        </View>
        <View className='Home__Button'>
          <Button onClick={this.onClickMath.bind(this)}>答题</Button>
          <Button onClick={this.onClickSafari.bind(this)}>进入地图</Button>
        </View>
      </View>
    )
  }
}
