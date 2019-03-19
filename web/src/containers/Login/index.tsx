import * as React from 'react'
import Input from 'components/Input'
import classnames from 'classnames'
import queryString from 'query-string'
import R from 'utils/request'
import HomeLink from 'components/HomeLink'
import * as H from 'history'
import Init, { UserInfo } from 'models/Init'
import { Subscribe } from 'unstated'

const EmailValidReg = new RegExp('^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$')
interface OwnState {
  signin: {
    username: { [key: string]: string }
    password: { [key: string]: string }
  }
  signup: {
    username: { [key: string]: string }
    password: { [key: string]: string }
    reenterPassword: { [key: string]: string }
    email: { [key: string]: string }
  }
  bgimg?: string
}
interface OuterProps {
  location: H.Location
  history: H.History
}
interface OwnProps extends OuterProps {
  setUser: (user: UserInfo, cb?: () => void) => void
}
class Login extends React.Component<OwnProps, OwnState> {
  constructor(props: OwnProps) {
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
    this.getBgImg()
  }
  getBgImg = () => {
    R.get('/api/bingimg')
      .then((res: string) => {
        this.setState({
          bgimg: res,
        })
      })
      .catch(() => { })
  }
  onSingin = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value
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
  onSingup = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const { signup: { password, reenterPassword } } = this.state
    const value: string = event.target.value
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
              error: !EmailValidReg.test(value) ? '邮箱格式不正确' : '',
            },
          },
        })
        break
      default:
        break
    }
  }
  handleActive = (url: string) => () => {
    this.props.history.push(url)
  }
  signin = () => {
    const { signin: { username, password} } = this.state
    const { history, setUser } = this.props
    if(!username.error && !password.error) {
      R.post('/api/signin', {
        password: password.value,
        username: username.value,
      }).then((res: UserInfo) => {
        setUser(res, () => { history.push('/home')})
      }).catch(() => { })
    }
  }
  signup = () => {
    const { signup: { username, password, email } } = this.state
    const { history, setUser } = this.props
    if (!username.error && !password.error && !email.error) {
      R.post('/api/signup', {
        password: password.value,
        username: username.value,
        email: email.value,
      }).then((res: UserInfo) => {
        setUser(res, () => { history.push('/home')})
      }).catch(() => {})
    }
  }
  render () {
    const styles = require('./index.scss')
    const { signin, signup, bgimg } = this.state
    const searchQ = queryString.parse(this.props.location.search)
    const login = !searchQ.type || searchQ.type === 'signin'
    return (
      <div className={styles.login} style={{
        backgroundImage: `url(${bgimg})`,
        height: document.documentElement.clientHeight,
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
                onChange={this.onSingin('username')}/>
            </div>
            <div className={styles.inputWrap}>
              <Input 
                value={signin.password.value}
                error={signin.password.error}
                label="密码" 
                placeholder="请输入密码" 
                type="password" 
                onChange={this.onSingin('password')}/>
            </div>
          </div>
          <div className={styles.signup} style={{
            display: login ? 'none' : 'block',
          }}>
            <div className={styles.inputWrap}>
              <Input 
                value={signup.username.value}
                error={signup.username.error}
                label="账号"
                placeholder="请输入账号"
                onChange={this.onSingup('username')}/>
            </div>
            <div className={styles.inputWrap}>
              <Input 
                value={signup.password.value}
                error={signup.password.error}
                label="密码"
                placeholder="请输入密码"
                onChange={this.onSingup('password')}
                type="password"/>
            </div>
            <div className={styles.inputWrap}>
              <Input 
                value={signup.reenterPassword.value}
                error={signup.reenterPassword.error}
                label="确认密码"
                placeholder="请输入确认密码"
                onChange={this.onSingup('reenterPassword')}
                type="password"/>
            </div>
            <div className={styles.inputWrap}>
              <Input 
                value={signup.email.value}
                error={signup.email.error}
                label="邮箱"
                placeholder="请输入邮箱"
                onChange={this.onSingup('email')}/>
            </div>
          </div>
          <div className={styles.btn} onClick={ login ? this.signin : this.signup }>确认</div>
        </div>
      </div>
    )
  }
}
export default class WrapLogin extends React.Component<OuterProps, {}> {
  render() {
    return (<Subscribe to={[Init]}>{
      (init: any) => (
        <Login {...this.props} setUser={init.setUser} />
      )
    }</Subscribe>)
  }
}