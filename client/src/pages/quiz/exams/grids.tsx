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
      generating: true
    })
    await sleep( 100 )
    let quiz:any = []
    let correct: any = []
    let checked: any = []

    let _randomQuiz = Math.round( Math.random() * (70) + 1 )
    correct = [
      _randomQuiz, _randomQuiz + 1, _randomQuiz + 2,
      _randomQuiz + 10, _randomQuiz + 11, _randomQuiz + 12,
      _randomQuiz + 20, _randomQuiz + 21, _randomQuiz + 22
    ]

    let _random = Math.floor( Math.random() * 9 ) // 位置

    quiz = correct.map( (item,index) => {
      if( index == _random ){
        return item 
      } else {
        let _item = Math.random() > 0.4
        if( !_item ){
          correct[index] = undefined
        }
        return _item ? '' : undefined
      }
    })

    console.log( quiz, correct )


    this.setState({
      showResult: false,
      currentValue: '',
      correct,
      quiz,
      result: quiz,
      checked,
      generating: false
    })
  }

  onCheckResult() {
    let { currentCount, correct, result, checked } = this.state
    result.map( (_result,i) => {
      checked[i] = result[i] == correct[i]
    })
    this.setState({
      showResult: true,
      checked,
      allCorrect: shallowEqualArrays( result, correct )
    })
    console.log( result, correct, checked )
  }

  onInput( index, e ){
    let { value } = e.detail
    let { result } = this.state 
    let _result = [...result]
    _result[index] = Number(value)
    this.setState({
      result: _result
    })
  }


  render () {
    let { quiz = [], generating, showResult, currentValue,
      checked, allCorrect } = this.state
    return (
      <View className='HomeQuiz'>
        {
          generating ? null :
          <View className='HomeQuiz__Main'>
          {
            quiz.map( (item, idx) => {
              let _class = !showResult ? '' : checked[idx] ? 'correct' : 'wrong'
              let _blank = typeof item == 'undefined'

              if(!!_blank){
                return (
                  <View className='HomeQuiz__Blank' />
                )
              }
              return (
                <View key={`item__${item}__${idx}`} className={`HomeQuiz__Block ${_class}`}>
                    {
                      !!item ? item :
                      <View className='HomeQuiz__Block--Input'>
                        <Input type='number' value={currentValue} onInput={this.onInput.bind(this, idx)} />
                      </View>
                    }
                </View>
              )
            })
          }
        </View>
        }
        
        {
          <View className='HomeQuiz__Button'>
            <View className='HomeQuiz__Check'>
              <Button onClick={this.onCheckResult.bind(this)}>检查</Button>
            </View>
            {
              !!showResult &&
              <Button className='HomeQuiz__Button--Generate' onClick={this.generateQuiz.bind(this)}>出题</Button>
            }
          </View>
        }
        {
          !!showResult && 
          <View className='HomeQuiz__Image'>
              <Image src={allCorrect ? IMAGE_CORRECT : IMAGE_WRONG} mode='aspectFill' />
          </View>
        }
        
      </View>
    )
  }
}
