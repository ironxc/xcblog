import { Container } from 'unstated'
import request from 'src/utils/'
interface Info {
  name: string
  id: string
  username: string
}
interface OwnState {
  userInfo?: Info,
}
export default class InitProvider extends Container<OwnState> {
  componentDidMount() {

  }
}