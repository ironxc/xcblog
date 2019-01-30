import * as React from 'react'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import { Provider } from 'unstated'
import * as H from 'history'
import Home from '../Home'
import Profile from '../Profile'
import NotFound from '../NotFound'
import TagsPage from '../Tags'
import Login from '../Login'
import Init from 'models/Init'
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
        <Provider inject={[InitStore]}>
          <Switch>
            <Redirect from="/" exact to={'/home'} />
            <Route path="/home" component={Home}></Route>
            {/* <Route path="/editor/:id" component={Editor}></Route>
            <Route path="/article/:id" component={Article}></Route>*/}
            <Route path="/login" component={Login}></Route>
            <Route path="/tags" component={TagsPage}></Route>
            <Route path="/profile" component={Profile}></Route>
            <Route component={NotFound} />
          </Switch>
        </Provider>
      </div>
    )
  }
}
// export default withRouter(App as any)
export default App