import {
  CREATE,
  CREATE_SUCCESS,
  CREATE_FAIL,
  GETIMAGES,
  GETIMAGES_SUCCESS,
  GETIMAGES_FAIL,
} from '../actionTypes/editor'

const initialState = {
  creating: false,
  data: {
    name: '',
    description: '',
    content: '',
    tags: [],
    logo: '',
  },
  image: {
    list: [],
    page: 1,
    count: 0,
  },
}
export default function reducer (state = initialState, action = {}) {
  switch (action.type) {
    case CREATE:
      return {
        ...state,
        creating: true,
      }
    case CREATE_SUCCESS:
      return {
        ...state,
        data: action.result,
        creating: false,
      }
    case CREATE_FAIL:
      return {
        ...state,
        creating: false,
      }
    case GETIMAGES_SUCCESS:
      return {
        ...state,
        image: {
          ...action.result,
          page: action.page,
        },
      }
    default:
      return state
  }
}


export function create ({id, ...data}) {
  return {
    types: [CREATE, CREATE_SUCCESS, CREATE_FAIL],
    promise: (request) => request.post(`/api/article/${id}`, data),
    successCall: true,
  }
}
export function getImages (param) {
  return {
    types: [GETIMAGES, GETIMAGES_SUCCESS, GETIMAGES_FAIL],
    promise: (request) => request.get('/api/image', param),
    page: param.page,
  }
}