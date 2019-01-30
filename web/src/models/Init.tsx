import { Container } from 'unstated'
import R from 'utils/request'
interface Info {
  name: string
  id: string
  username: string
}
export interface Tag {
  num: number
  value: string
}
export interface OwnState {
  user?: Info
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
      .then((user: Info) => {
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
}