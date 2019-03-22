import * as React from 'react'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import { Provider } from 'unstated'
import * as H from 'history'
import Home from '../Home'
import Profile from '../Profile'
import NotFound from '../NotFound'
import TagsPage from '../Tags'
import Login from '../Login'
import Test from '../Test'
import Editor from '../EditorPage'
import Init from 'models/Init'
import Article from 'src/containers/Article'
import LoadingBar from 'components/LoadingBar/index'
import Trigger from '../TestTrigger'
const InitStore = new Init()
interface AppProps {
  history?: H.History
  location?: H.Location
  match?: any
}
@(withRouter as any)
class App extends React.Component<AppProps, {}> {
  constructor(props: AppProps) {
    super(props)
  }
  render() {
    const styles = require('./index.scss')
    return (
      <div className={styles.app}>
        <LoadingBar />
        <Provider inject={[InitStore]}>
          <Switch>
            <Redirect from="/" exact to={'/home'} />
            <Route path="/home" component={Home}/>
            <Route path="/article/:id" component={Article}/>
            <Route path="/login" component={Login}/>
            <Route path="/tags" component={TagsPage}/>
            <Route path="/profile" component={Profile}/>
            <Route path="/test" component={Test} />
            <Route path="/editor/:id" component={Editor} />
            <Route path="/trigger" component={Trigger}/>
            <Route component={NotFound} />
          </Switch>
        </Provider>
      </div>
    )
  }
}
export default App
