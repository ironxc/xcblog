import { Container } from 'unstated'
import R from 'utils/request'

export interface UserInfo {
  name: string
  id: string
  username: string
}
export interface Tag {
  num: number
  value: string
}
export interface OwnState {
  user?: UserInfo
  tags: Tag[]
}
export default class InitProvider extends Container<OwnState> {
  constructor() {
    super()
    this.state = {
      tags: [],
    }
    this.getUserInfo()
    this.getAllTags()
  }
  getUserInfo = () => {
    R.get('/api/userinfo')
      .then((user: UserInfo) => {
        this.setState({
          user,
        })
      }).catch(() => {})
  }
  getAllTags = () => {
    R.get('/api/tags')
      .then((tags: Tag[]) => {
        this.setState({
          tags,
        })
      })
      .catch(() => {})
  }
  setUser = (user: UserInfo, cb?: () => void) => {
    this.setState({
      user,
    }, () => {
      if(cb) { cb()}
    })
  }
}
