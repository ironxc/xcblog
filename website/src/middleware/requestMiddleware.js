
export default function clientMiddleware (request) {
  return ({ dispatch, getState }) => {
    return next => action => {
      if (typeof action === 'function') {
        return action(dispatch, getState)
      }
      const { promise, types, successCall, errCall, ...rest } = action 
      if (!promise) {
        return next(action)
      }

      const [REQUEST, SUCCESS, FAILURE] = types
      next({ ...rest, type: REQUEST })
      return promise(request).then(
        (result) => {
          next({ ...rest, result, type: SUCCESS })
          if (successCall ) {
            return Promise.resolve(result)
          }
        },
        (error) => {
          next({ ...rest, error, type: FAILURE })
          if (errCall) {
            return Promise.reject(error)
          }
        }
      ).catch((error) => {
        next({ ...rest, error, type: FAILURE })
        if (errCall) {
          return Promise.reject(error)
        }
      })
    }
  }
}
