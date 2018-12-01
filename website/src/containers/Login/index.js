import React from 'react'
import PropTypes from 'prop-types'
import Input from 'src/components/Input'
import HomeLink from 'src/components/HomeLink'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { routerRedux } from 'dva/router'
import { selectBingimg } from 'src/models/init/selector'
import { createStructuredSelector } from 'reselect'

const mapStateToProps = createStructuredSelector({
  bingimg: selectBingimg,
})


const queryString = require('query-string')
const emailValidReg = new RegExp('^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$')
@connect(mapStateToProps)
export default class Login extends React.Component {
  static propTypes = {
    bingimg: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
  }
  constructor (props) {
    super(props)
    this.state = {
      signin: {
        username: {
          value: '',
          error: '',
        },
        password: {
          value: '',
          error: '',
        },
      },
      signup: {
        username: {
          value: '',
          error: '',
        },
        password: {
          value: '',
          error: '',
        },
        reenterPassword: {
          value: '',
          error: '',
        },
        email: {
          value: '',
          error: '',
        },
      },
    }
  }
  componentDidMount () {
    this.props.dispatch({
      type: 'init/getBingImg',
    })
  }
  onSingin = (key) => (value) => {
    if(value.length < 4 || value.length > 20) {
      this.setState({
        signin: {
          ...this.state.signin,
          [key]: {
            value,
            error: key === 'username' ? '用户名长度必须是4到20个字符' : '密码长度必须是4到20个字符',
          },
        },
      })
    } else {
      this.setState({
        signin: {
          ...this.state.signin,
          [key]: {
            value,
            error: '',
          },
        },
      })
    }
  }
  onSingup = (key) => (value) => {
    const { signup: { password, reenterPassword } } = this.state
    switch(key){
      case 'username':
        this.setState({
          signup: {
            ...this.state.signup,
            username: {
              value,
              error: (value.length < 4 || value.length > 20) ? '用户名长度必须是4到20个字符' : '',
            },
          },
        })
        break
      case 'password':
        return this.setState({
          signup: {
            ...this.state.signup,
            password: {
              value,
              error: (value.length < 6 || value.length > 20) ? '用户名长度必须是4到20个字符' : '',
            },
            reenterPassword: {
              ...reenterPassword,
              error: password.value !== value ? '两次输入的密码不一致' : '',
            },
          },
        })
      case 'reenterPassword':
        return this.setState({
          signup: {
            ...this.state.signup,
            reenterPassword: {
              ...reenterPassword,
              value,
              error: password.value !== value ? '两次输入的密码不一致' : '',
            },
          },
        })
      case 'email':
        this.setState({
          signup: {
            ...this.state.signup,
            email: {
              value,
              error: !emailValidReg.test(value) ? '邮箱格式不正确' : '',
            },
          },
        })
        break
      default:
        break
    }
  }
  handleActive = (url) => () => {
    this.props.dispatch(routerRedux.push(url))
  }
  signin = () => {
    const { signin: { username, password} } = this.state
    if(!username.error && !password.error) {
      this.props.dispatch({
        type: 'init/signIn',
        payload: {
          password: password.value,
          username: username.value,
        },
      })
    }
  }
  signup = () => {
    const { signup: { username, password, email } } = this.state
    if (!username.error & !password.error & !email.error) {
      this.props.dispatch({
        type: 'init/signUp',
        payload: {
          password: password.value,
          username: username.value,
          email: email.value,
        },
      })
    }
  }
  render () {
    const styles = require('./index.scss')
    const { signin, signup } = this.state
    const { bingimg } = this.props
    const searchQ = queryString.parse(this.props.location.search)
    const login = !searchQ.type || searchQ.type === 'signin'
    return (
      <div className={styles.login} style={{
        backgroundImage: `url(${bingimg})`,
      }}>
        <div className={styles.homelink}>
          <HomeLink />
        </div>
        <div className={styles.content}>
          <div className={styles.nav}>
            <span className={classnames({
              [styles.active]: login,
            })} onClick={this.handleActive('/login')}>登录</span>
            <span className={classnames({
              [styles.active]: !login,
            })} onClick={this.handleActive('login?type=signup')}>注册</span>
          </div>
          <div className={styles.signin} style={{
            display: login ? 'block' : 'none',
          }}>
            <div className={styles.inputWrap}>
              <Input 
                value={signin.username.value}
                error={signin.username.error}
                label="账号"
                placeholder="请输入账号" 
                onChange={this.onSingin('username')}
                id="signinusername"/>
            </div>
            <div className={styles.inputWrap}>
              <Input 
                value={signin.password.value}
                error={signin.password.error}
                label="密码" 
                placeholder="请输入密码" 
                type="password" 
                onChange={this.onSingin('password')}
                id="signinpassword"/>
            </div>
          </div>
          <div className={styles.signup} style={{
            display: login ? 'none' : 'block',
          }}>
            <div className={styles.inputWrap}>
              <Input 
                value={signup.username.value}
                error={signup.username.error}
                label="账号" placeholder="请输入账号"
                onChange={this.onSingup('username')}
                id="signupusername"/>
            </div>
            <div className={styles.inputWrap}>
              <Input 
                value={signup.password.value}
                error={signup.password.error}
                label="密码" placeholder="请输入密码"
                onChange={this.onSingup('password')}
                type="password"
                id="signuppassword"/>
            </div>
            <div className={styles.inputWrap}>
              <Input 
                value={signup.reenterPassword.value}
                error={signup.reenterPassword.error}
                label="确认密码" placeholder="请输入确认密码"
                onChange={this.onSingup('reenterPassword')}
                type="password"
                id="signupreenterPassword"/>
            </div>
            <div className={styles.inputWrap}>
              <Input 
                value={signup.email.value}
                error={signup.email.error}
                label="邮箱" placeholder="请输入邮箱"
                onChange={this.onSingup('email')}
                id="signupemail"/>
            </div>
          </div>
          <div className={styles.btn} onClick={ login ? this.signin : this.signup }>确认</div>
        </div>
      </div>
    )
  }
}