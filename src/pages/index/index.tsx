import Taro, { Component, Config } from '@tarojs/taro'
import { AtButton, AtCard, AtInput } from 'taro-ui'
import { View } from '@tarojs/components'
import Secret from '../../utils/secret'
import './index.scss'

interface IState {
  key: string,
  offset: string,
}

export default class Index extends Component<{}, IState> {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '首页'
  };

  constructor () {
    super(...arguments);
    this.state = {
      key: '',
      offset: '',
    }
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  generationCreateCode = () => {
    const curTimestamp = new Date().getTime();
    const offset = this.state.offset ? Secret.GenerateOffset(this.state.offset) : '';
    const key = Secret.Encrypt(curTimestamp, offset);
    this.setState({ key });
  };

  copyCreateCode = () => {
    Taro.setClipboardData({ data: this.state.key })
  };

  changeOffset = (value) => {
    this.setState({ offset: value })
  };

  render () {
    const { key, offset } = this.state;
    return (
      <View className='index'>
        <AtCard
            note='点击生成'
            title='创建码'
            thumb='https://img.yzcdn.cn/public_files/2020/04/14/eda729077ce79aa112fb9cd43fa30e9a.png'
            onClick={this.generationCreateCode}
        >
          {key}
        </AtCard>
        <View className='at-row at-row__justify--around btn-group'>
          <View className='at-col at-col-5'>
            <AtButton type='primary' disabled={key === ''} onClick={this.copyCreateCode}>复制</AtButton>
          </View>
        </View>
        <View className='at-article'>
          <View className='at-article__h2'>Tips：</View>
          <View className='at-article__p'>本小程序建议仅供内部员工使用，切勿分享给商家，如意外流出担心安全性问题，请联系开发人员获取创建码偏移量。在填写偏移量后重新生成创建码。</View>
        </View>
        <AtInput
            name='offset'
            title='偏移量'
            type='number'
            placeholder='请输入偏移量'
            value={offset}
            onChange={this.changeOffset}
        />
      </View>
    )
  }
}
