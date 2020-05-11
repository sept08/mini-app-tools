import Taro, { Component, Config } from '@tarojs/taro'
import { AtButton, AtCard, AtInput } from 'taro-ui'
import { View, Picker } from '@tarojs/components'
import Secret from '../../utils/secret'
import './index.scss'

interface IState {
  key: string,
  offset: string,
  codeType: string
  codeTypeIndex: number,
}

const codeTypeList = ['短码', '长码'];

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
      codeType: '短码',
      codeTypeIndex: 0,
    }
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  generationCreateCode = () => {
    const curTimestamp = this.getCurrentTimestamp();
    const offset = this.getoffset();
    const key = this.createEncrptCode(curTimestamp, offset);
    this.setState({ key });
  };

  // 获取当前时间戳
  getCurrentTimestamp = () => {
    const { codeTypeIndex } = this.state;
    if  (codeTypeIndex === 1) {
      return new Date().getTime();
    } else {
      return parseInt(`${new Date().getTime() / 60000}`);
    }
  };

  // 生成加密码
  createEncrptCode = (origin, offset) => {
    const { codeTypeIndex } = this.state;
    if (codeTypeIndex === 0) {
      return Secret.Encrypt_base64(origin, offset);
    } else if (codeTypeIndex === 1) {
      return Secret.Encrypt(origin, offset);
    }
  };

  // 获取偏移量
  getoffset = () => {
    const { offset, codeTypeIndex } = this.state;
    if (offset) {
      if (codeTypeIndex === 0) {
        return Number(offset);
      } else if (codeTypeIndex === 1) {
        return Secret.GenerateOffset(offset)
      }
    } else {
      return codeTypeIndex === 0 ? 0 : '';
    }
  };

  copyCreateCode = () => {
    Taro.setClipboardData({ data: this.state.key })
  };

  changeOffset = (value) => {
    this.setState({ offset: value })
  };

  changeCodeType = (event) => {
    const index = Number(event.detail.value)
    this.setState({ codeType: codeTypeList[index], codeTypeIndex: index })
  };

  render () {
    const { key, offset, codeTypeIndex } = this.state;
    return (
      <View className='index'>
        <Picker
            mode='selector'
            range={codeTypeList}
            value={codeTypeIndex}
            onChange={this.changeCodeType}
        >
          <View className='picker'>
            编码方式：{this.state.codeType}
          </View>
        </Picker>
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
          <View className='at-article__p'>所生成的创建码，仅在三小时内有效。</View>
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
