
import {
  GETARTICLES,
  GETARTICLES_SUCCESS,
  GETARTICLES_FAIL,
} from '../actionTypes/home'
const initialState = {
  list: [],
  page: 1,
  count: 0,
  loading: false,
}
export default function reducer (state = initialState, action = {}) {
  switch (action.type) {
    case GETARTICLES:
      return {
        ...state,
        loading: true,
      }
    case GETARTICLES_SUCCESS:
      return {
        ...state,
        page: action.page,
        count: action.result.count,
        list: action.result.list,
        loading: false,
      }
    case GETARTICLES_FAIL:
      return {
        ...state,
        loading: false,
      }
    default:
      return state
  }
}


export function getArticles (params) {
  return {
    types: [GETARTICLES, GETARTICLES_SUCCESS, GETARTICLES_FAIL],
    promise: (request) => request.get('/api/articlelist', params),
    page: params.page,
  }
}