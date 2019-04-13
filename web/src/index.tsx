import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'
// import createHistory from 'history/createBrowserHistory'

import './index.css'
import 'theme/normalize.css'
import 'theme/markdown.css'
import 'theme/iconfont.css'
import App from 'containers/App'
import * as serviceWorker from './serviceWorker'
const history = require('history').createBrowserHistory()
ReactDOM.render(<Router history={history}>
    <App />
  </Router>, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
