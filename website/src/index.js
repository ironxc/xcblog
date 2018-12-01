import React from 'react'
import App from 'src/containers/App'
import registerServiceWorker from './registerServiceWorker'
import createHistory from 'history/createBrowserHistory'
import { Router } from 'dva/router'
import dva from 'dva'
import models from 'src/models'
import createLoading from 'dva-loading'

import './index.css'
import 'src/theme/normalize.css'
import 'src/theme/markdown.css'
import 'src/theme/inconfont.css'
import 'highlight.js/styles/github-gist.css'
import 'rc-select/assets/index.css'

// Init
const app = dva({
  history: createHistory(),
  onError: function (e) {
    console.log(e.message)
  },
})

// Model
models.forEach((model) => {
  app.model(model())
})

// Router
app.router(({ history }) => (
  <Router history={history}>
    <App />
  </Router>
))
// Plugins
app.use(createLoading())
// Start
app.start('#root')




registerServiceWorker()
