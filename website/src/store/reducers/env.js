
import {
  GETTAGS,
  GETTAGS_SUCCESS,
  GETTAGS_FAIL,
  GETBINGIMG,
  GETBINGIMG_SUCCESS,
  GETBINGIMG_FAIL,
} from '../actionTypes/env'

const initialState = {
  clientHeight: document.documentElement.clientHeight,
  clientWidth: document.documentElement.clientWidth,
  allTags: [],
  bingimg: '',
}
export default function reducer (state = initialState, action = {}) {
  switch(action.type){
    case GETTAGS_SUCCESS:
      return {
        ...state,
        allTags: action.result,
      }
    case GETBINGIMG_SUCCESS:
      return {
        ...state,
        bingimg: action.result,
      }
    default:
      return state
  }
}

export function getTags () {
  return {
    types: [GETTAGS, GETTAGS_SUCCESS, GETTAGS_FAIL],
    promise: (request) => request.get('/api/tags'),
  }
}
export function getBingImg () {
  return {
    types: [GETBINGIMG, GETBINGIMG_SUCCESS, GETBINGIMG_FAIL],
    promise: (request) => request.get('/api/bingimg'),
  }
}

