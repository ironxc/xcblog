import request from 'src/utils/request'
import requsetMiddleware from 'src/middleware/requestMiddleware'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import {
  env,
  user,
  editor,
  home,
} from './reducers'
const middlewares = [requsetMiddleware(request)]

const reducer = combineReducers({
  env,
  user,
  editor,
  home,
})

const storeEnhancers = compose(
  applyMiddleware(...middlewares),
  (window && window.devToolsExtension) ? window.devToolsExtension() : (f) => f,
)

export default createStore(reducer, storeEnhancers)