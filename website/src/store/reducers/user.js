

import {
  SIGNIN,
  SIGNIN_SUCCESS,
  SIGNIN_FAIL,
  SIGNUP,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  USERINFO,
  USERINFO_SUCCESS,
  USERINFO_FAIL,
} from '../actionTypes/user'
const initialState = {
  info: null,
  signining: false,
}
export default function reducer (state = initialState, action = {}) {
  switch (action.type) {
    case SIGNIN:
      return {
        ...state,
        info: action.result,
        signining: true,
      }
    case SIGNIN_SUCCESS:
      return {
        ...state,
        info: action.result,
        signining: false,
      }
    case SIGNIN_FAIL:
      return {
        ...state,
        info: null,
        signining: false,
      }
    case SIGNUP:
      return {
        signining: true,
      }
    case SIGNUP_SUCCESS:
      return {
        ...state,
        info: action.result,
        signining: false,
      }
    case SIGNUP_FAIL:
      return {
        ...state,
        info: null,
        signining: false,
      }
    case USERINFO:
      return {
        signining: true,
      }
    case USERINFO_SUCCESS:
      return {
        ...state,
        info: action.result,
        signining: false,
      }
    case USERINFO_FAIL:
      return {
        ...state,
        info: null,
        signining: false,
      }
    default:
      return state
  }
}



export function signin (data) {
  return {
    types: [SIGNIN, SIGNIN_SUCCESS, SIGNIN_FAIL],
    promise: (request) => request.post('/api/signin', data),
    successCall: true,
  }
}
export function signup (data) {
  return {
    types: [SIGNUP, SIGNUP_SUCCESS, SIGNUP_FAIL],
    promise: (request) => request.post('/api/signup', data),
    successCall: true,
  }
}
export function userinfo () {
  return {
    types: [USERINFO, USERINFO_SUCCESS, USERINFO_FAIL],
    promise: (request) => request.get('/api/userinfo'),
  }
}