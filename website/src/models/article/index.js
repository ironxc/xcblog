
import request from 'src/utils/request'
import pathToRegexp from 'path-to-regexp'
const ns = 'article'
const init = {
  article: undefined,
  articlelist: {
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
      *create (action, { call }) {
        const { payload } = action
        const id = yield call(request.post, `/api/article/${payload.id}`, payload.data)
        console.log(id)
      },
      *get (action, { put, call }) {
        const { payload: { id } } = action
        const article = yield call(request.get, `/api/article/${id}`)
        yield put({
          type: 'updateState',
          payload: {
            article,
          },
        })
      },
      *update (action, { call }) {
        const { payload } = action
        const id = yield call(request.put, `/api/article/${payload.id}`, payload.data)
        console.log(id)
      },
      *delete (action, { call }) {
        const { payload: { id } } = action
        yield call(request.del, `/api/article/${id}`)
      },
      *getArticleList (action, { put, call }) {
        const { payload: { page } } = action
        const result = yield call(request.get, '/api/articlelist', action.payload)
        yield put({
          type: 'updateState',
          payload: {
            articlelist: {
              ...result,
              page,
            },
          },
        })
      },
    },
    subscriptions: {
      subHistory ({ dispatch, history }) {
        history.listen(({ pathname }) => {
          const match = pathToRegexp('/article/:id').exec(pathname)
          if (match) {
            dispatch({
              type: 'get',
              payload: {
                id: match[1],
              },
            })
          }
        })
      },
    },
  }
}
