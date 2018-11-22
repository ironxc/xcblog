import React from 'react'
import ReactDOM from 'react-dom'
import App from 'src/containers/App'
import registerServiceWorker from './registerServiceWorker'
import store from 'src/store'
import createHistory from 'history/createBrowserHistory'
import { Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import './index.css'
import 'src/theme/normalize.css'
import 'src/theme/markdown.css'
import 'src/theme/inconfont.css'
import 'highlight.js/styles/github-gist.css'
import 'rc-select/assets/index.css'
const history = createHistory()

ReactDOM.render(<Provider store={store}>
  <Router history={history}>
    <App />
  </Router>
</Provider>, document.getElementById('root'))
registerServiceWorker()
