
import request from 'src/utils/request'
import { routerRedux } from 'dva/router'
const ns = 'init'
const init = {
  userInfo: undefined,
  clientHeight: document.documentElement.clientHeight,
  clientWidth: document.documentElement.clientWidth,
  allTags: [],
  bingimg: '',
  imagelist: {
    list: [],
    page: 1,
    count: 0,
  },
}

export default function (initState = init, namespace = ns) {
  return {
    namespace,
    state: initState,
    reducers: {
      updateState (state, { payload }) {
        return {
          ...state,
          ...payload,
        }
      },
    },
    effects: {
      *getUserInfo (action, { put, call }) {
        const userInfo = yield call(request.get, '/api/userinfo')
        yield put({
          type: 'updateState',
          payload: {
            userInfo,
          },
        })
      },
      *getImageList (action, { put, call }) {
        const { payload } = action
        const result = yield call(request.get, '/api/imagelist', payload)
        yield put({
          type: 'updateState',
          payload: {
            imagelist: {
              ...result,
              page: payload ? payload.page : 1,
            },
          },
        })
      },
      *postImage (action, { put, call }) {
        const { payload: { data } } = action
        yield call(request.post, '/api/image', data)
        yield put({
          type: 'getImageList',
        })
      },
      *getBingImg (action, { put, call }) {
        const bingimg = yield call(request.get, '/api/bingimg')
        yield put({
          type: 'updateState',
          payload: {
            bingimg,
          },
        })
      },
      *getAllTags (action, { put, call }) {
        const allTags = yield call(request.get, '/api/tags')
        yield put({
          type: 'updateState',
          payload: {
            allTags,
          },
        })
      },
      *singIn (action, { put, call }) {
        const userInfo = yield call(request.post, '/api/signin', action.payload)
        yield put({
          type: 'updateState',
          payload: {
            userInfo,
          },
        })
        yield put(routerRedux.push('/home'))
      },
      *singUp (action, { put, call }) {
        const userInfo = yield call(request.post, '/api/signup', action.payload)
        yield put({
          type: 'updateState',
          payload: {
            userInfo,
          },
        })
        yield put(routerRedux.push('/home'))
      },
    },
  }
}
  
