/**
 * whatwg-fetch implement standard Fetch specification, but to use in real project,
 * we need some addtional features 
 */
import queryString from 'query-string'


async function request(req) {
  const res = await req
  if (!res.ok) {
    return Promise.reject('网路错误')
  }
  const resdata = await await res.json()
  if (resdata.msg === 'success') {
    return Promise.resolve(resdata.data)
  } else {
    return Promise.reject(resdata.msg)
  }
}

class Client {
  /**
   * send http GET request
   * @param  {String} url       absolute URL with another site`s host is performed in accordance with CORS 
   * @param  {Object} [params]  url search
   * @param  {Boolean}[options] return full response data or parsed data
   * @param  {Object} [options] fetch options, see https://github.github.io/fetch/ for more details
   * @return {Promise}
   */
  get(url, params, options) {
    const formedUrl = params ? `${url}?${queryString.stringify(params)}` : url
    options = options || {}
    options.headers = options.headers || {}

    const req = fetch(formedUrl, {
      ...options,
      method: 'GET',
      credentials: 'same-origin',
    })
    return request(req)
  }
  /**
   * send http POST request
   * @param  {String} url       absolute URL with another site`s host is performed in accordance with CORS
   * @param  {Object} [data]    body to be sent
   * @param  {Boolean}[options] return full response data or parsed data
   * @param  {Object} [options] fetch options, see https://github.github.io/fetch/ for more details
   * @return {Promise}
   */
  post(url, data, options) {
    const isFormData = data instanceof FormData
    const headers = options ? options.headers : {}
    if (!isFormData) {
      headers['Content-Type'] = 'application/json'
    }
    options = options || {}
    const req = fetch(url, {
      ...options,
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
      credentials: 'same-origin',
      headers: headers,
    })
    return request(req)
  }
  /**
   * send http PUT request
   * @param  {String} url       absolute URL with another site`s host is performed in accordance with CORS
   * @param  {Object} [data]    body to be sent
   * @param  {Boolean}[options] return full response data or parsed data
   * @param  {Object} [options] fetch options, see https://github.github.io/fetch/ for more details
   * @return {Promise}
   */
  put(url, data, options) {
    options = options || {}
    options.headers = options.headers || {}
    const req = fetch(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
    return request(req)
  }
  /**
   * send http DELETE request
   * @param  {String} url       absolute URL with another site`s host is performed in accordance with CORS
   * @param  {Object} [data]    body to be sent
   * @param  {Boolean}[options] return full response data or parsed data
   * @param  {Object} [options] fetch options, see https://github.github.io/fetch/ for more details
   * @return {Promise}
   */
  del(url, data, options) {
    options = options || {}
    options.headers = options.headers || {}
    const req = fetch(url, {
      ...options,
      method: 'DELETE',
      body: JSON.stringify(data),
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
    return request(req)
  }
}
const client = new Client()

export default client