import axios from 'axios'
import {Message} from 'antd'

const http = axios.create({
  timeout: 30000,
  baseURL: 'http://127.0.0.1:9876/backend/rest/'
})

http.interceptors.response.use(
  response => {
    // if (response.data.code !== 0) {
    //   debugger
    //   Message.error('test')
    //   return Promise.reject(response)
    // }
    return Promise.resolve(response.data)
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.log(401)
          break
        case 403:
          console.log(403)
          break
        case 404:
          console.log(404)
          break
        case 500:
          console.log(500)
          break
        default:
          break
      }
    }
    Message.error('请求失败!')
    return Promise.reject(error.response)
  }
)


export default http
