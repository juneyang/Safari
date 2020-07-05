import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Button, Input } from '@tarojs/components'
import './index.scss'

import Login from '../../components/login/index.weapp'

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
    this.generateQuiz( 3 )
  }

  generateQuiz( count ){
    let quiz:any = []
    let _random = Math.floor( Math.random() * count )
    let _randomQuiz = Math.round( Math.random() * (100 - count) + 1 ) + _random
    console.log( _random, _randomQuiz )
    for( let i = 0; i < count; i ++ ){
      quiz.push( _random == i ? _randomQuiz : '')
    }

    this.setState({
      quiz
    })
  }

  onCheckResult() {
    
  }

  render () {
    let { quiz = [] } = this.state
    return (
      <View className='HomeQuiz'>
        <View className='HomeQuiz__Main'>
          {
            quiz.map( (item, idx) => {
              return (
                <View key={`item__item__${idx}`} className={`HomeQuiz__Block `}>
                    { !!item ? item :
                      <View className='HomeQuiz__Block--Input'>
                        <Input type='number' />
                      </View>
                    }
                </View>
              )
            })
          }
        </View>
        <View className='HomeQuiz__Check'>
          <Button onClick={this.onCheckResult.bind(this)}>检查</Button>
        </View>
        <View className='HomeQuiz__Button'>
          <Button onClick={this.generateQuiz.bind(this, 3)}>3个</Button>
          <Button onClick={this.generateQuiz.bind(this, 6)}>6个</Button>
          <Button onClick={this.generateQuiz.bind(this, 9)}>9个</Button>
        </View>
      </View>
    )
  }
}
