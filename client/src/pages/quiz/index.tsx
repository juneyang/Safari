import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Button, Input, Image, Navigator } from '@tarojs/components'
import './quiz.scss'

interface IProps {
  [keyname: string]: any
}
interface IState {
  [keyname: string]: any
}

export default class Index extends Component<IProps, IState>{ 

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

  constructor(args) { 
    super(args)
    this.state = {

    }
  }

  componentWillMount () { 

  }


  render () {
    return (
      <View className='Quiz'>
        <View className='Quiz__Main'>
            <Navigator className='Quiz__Item' url={'/pages/quiz/exams/grids'}>
                横竖格子
            </Navigator>
        </View>
      </View>
    )
  }
}
