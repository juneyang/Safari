import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Button, Input, Image } from '@tarojs/components'
import '../quiz.scss'

import { shallowEqualArrays } from 'shallow-equal'

import { sleep } from '../../../utils/utils'

interface IProps {
  [keyname: string]: any
}
interface IState {
  [keyname: string]: any
}


import IMAGE_CORRECT from '../../../assets/correct.jpg'
import IMAGE_WRONG from '../../../assets/wrong.jpg'

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
      showResult: '',
      result: []
    }
  }

  componentWillMount () { 
    this.generateQuiz( )
  }

  async generateQuiz(){
    this.setState({
        showResult: false,
        generating: true
    })
    await sleep( 100 )
    const BLANKTYPES = [
        [true, false, true],
        [true, true, false],
        [false, true, true]
    ]
    let _random = Math.floor(Math.random() * 3)
    let _positions = BLANKTYPES[_random]
    let _sign = Math.random() > 0.5 ? '+' : '-'
    let _delta = _sign == '+' ? 1 : -1

    let num1 = Math.round( Math.random() * 100 )
    let num2 = Math.round( Math.random() * (100 - num1 ) )
    let total = num1 + num2

    let correct = 0
    if( !_positions[0] ){
        correct = _sign == '+' ? num1 : total
    } else if( !_positions[1] ){
        correct = _sign == '+' ? num2 : num1
    } else if( !_positions[2] ){
        correct = _sign == '+' ? total : num2
    }

    let _num1 = !_positions[0] ? false : (_sign == '+' ? num1 : total)
    let _num2 = !_positions[1] ? false : (_sign == '+' ? num2 : num1)
    let _num3 = !_positions[2] ? false : (_sign == '+' ? total : num2)

    this.setState({
        generating: false,
        type: _sign,
        numberList: [_num1, _num2, _num3],
        correct
    })
  }

  onCheckResult() {
    let { correct, result } = this.state
    this.setState({
      showResult: true,
      checked: !!result,
      allCorrect: result == correct
    })
  }

  onInput( e ){
    let { value } = e.detail
    this.setState({
      result: value
    })
  }


  render () {
    let { generating, numberList, type, showResult, allCorrect } = this.state
    return (
      <View className='HomeQuiz FillBlank'>
        {
            generating ? 
            <View className='FillBlank__Main'>
                
            </View>:
            <View className='FillBlank__Main'>
            <View className={`FillBlank__Block`}>
                {
                    numberList[0] ? 
                    <View className='FillBlank__Block--Number'>{numberList[0]}</View> : 
                    <View className='FillBlank__Block--Input'>
                        <Input type='number' onInput={this.onInput.bind(this)} />
                    </View>
                }
            </View>
            <View className='FillBlank__Add'>{type}</View>
            <View className={`FillBlank__Block`}>
                {
                    numberList[1] ? 
                    <View className='FillBlank__Block--Number'>{numberList[1]}</View> :
                    <View className='FillBlank__Block--Input'>
                        <Input type='number' onInput={this.onInput.bind(this)} />
                    </View>
                }
            </View>
            <View className='FillBlank__Add'>=</View>
            <View className={`FillBlank__Block`}>
                {
                    numberList[2] ? 
                    <View className='FillBlank__Block--Number'>{numberList[2]}</View> :
                    <View className='FillBlank__Block--Input'>
                        <Input type='number' onInput={this.onInput.bind(this)} />
                    </View>
                }
            </View>
        </View>
        }
        {
          <View className='Quiz__Button'>
            <View className='Quiz__Check'>
              <Button onClick={this.onCheckResult.bind(this)}>检查</Button>
            </View>
            {
              !!showResult &&
              <Button className='Quiz__Button--Generate' onClick={this.generateQuiz.bind(this)}>出题</Button>
            }
          </View>
        }
        {
          !!showResult && 
          <View className='QuizResult__Image'>
              <Image src={allCorrect ? IMAGE_CORRECT : IMAGE_WRONG} mode='aspectFill' />
          </View>
        }
        
      </View>
    )
  }
}
