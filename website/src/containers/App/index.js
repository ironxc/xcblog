import React, { Component } from 'react'
import { Switch, Route, withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Home from '../Home'
import Editor from '../Editor'
import Article from '../Article'
import Tags from '../Tags'
import Profile from '../Profile'
import { connect } from 'react-redux'
import Login from '../Login'
import { userinfo } from 'src/store/reducers/user'
import { getBingImg } from 'src/store/reducers/env'
import HomeLink from 'src/components/HomeLink'
import PropTypes from 'prop-types'


const blackList = [ 'editor', 'login', 'article', 'tags', 'profile' ]
@withRouter
@connect((state) => ({
  info: state.user.info,
}), { userinfo, getBingImg })
class App extends Component {
  static propTypes = {
    info: PropTypes.object,
  }
  componentDidMount () {
    this.props.userinfo()
    this.props.getBingImg()
  }
  render () {
    const styles = require('./index.scss')
    const showNavbar = blackList.every(l => (this.props.location.pathname.indexOf(l) < 0))
    const NavButtons = [
      { name: '标签', path: '/tags' },
      { name: '我', path: '/profile' },
    ]
    return (
      <div className={styles.app}>
        <Switch>
          <Route path="/home" component={Home}></Route>
          <Route path="/editor" component={Editor}></Route>
          <Route path="/login" component={Login}></Route>
          <Route path="/article/:id" component={Article}></Route>
          <Route path="/tags" component={Tags}></Route>
          <Route path="/profile" component={Profile}></Route>
        </Switch>
        {
          showNavbar && <div className={styles.navbar}>
            <HomeLink/>
            <div className={styles.btns}>
              {
                this.props.info && <span key="写笔记"><Link to="/editor">写笔记</Link></span>
              }
              {
                NavButtons.map(btn => (
                  <span key={btn.name}><Link to={btn.path}>{btn.name}</Link></span>
                ))
              }
            </div>
          </div>
        }
        
      </div>
    )
  }
}

export default App
