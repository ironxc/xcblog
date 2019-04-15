import * as React from 'react'
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import { Provider } from 'unstated'
import * as H from 'history'
import Init from 'models/Init'
import LoadingBar from 'components/LoadingBar'

const Article = React.lazy(() => import('src/containers/Article'))
const Editor = React.lazy(() => import('src/containers/EditorPage'))
const Test = React.lazy(() => import('src/containers/Test'))
const TestDecorator = React.lazy(() => import('src/containers/TestDecorator'))
const Login = React.lazy(() => import('src/containers/Login'))
const TagsPage = React.lazy(() => import('src/containers/Tags'))
const NotFound = React.lazy(() => import('src/containers/NotFound'))
const Profile = React.lazy(() => import('src/containers/Profile'))
const Home = React.lazy(() => import('src/containers/Home'))
const Trigger = React.lazy(() => import('src/containers/TestTrigger'))
const ArticleManagement = React.lazy(() => import('src/containers/ArticleManagement'))
const TestContext = React.lazy(() => import('src/containers/TestContext') )

const InitStore = new Init()
interface AppProps {
  history?: H.History
  location?: H.Location
  match?: any
}
@(withRouter as any)
class App extends React.Component<AppProps, {}> {
  render() {
    const styles = require('./index.scss')
    return (<div className={styles.app}>
      <LoadingBar />
      <Provider inject={[InitStore]}>
        <React.Suspense fallback={<LoadingBar show/>}>
          <Switch>
            <Redirect from="/" exact to={'/home'} />
            <Route path="/login" component={Login} />
            <Route path="/tags" component={TagsPage} />
            <Route path="/profile" component={Profile} />
            <Route path="/test" component={Test} />
            <Route path="/editor/:id" component={Editor} />
            <Route path="/article/:id" component={Article} />
            <Route path="/trigger" component={Trigger}/>
            <Route path="/home" component={Home} />
            <Route path="/context" component={TestContext} />
            <Route path="/articlesmanagement" component={ArticleManagement} />
            <Route path="/decorator" component={TestDecorator} />
            <Route component={NotFound} />
          </Switch>
        </React.Suspense>
      </Provider>
    </div>
    )
  }
}
export default App
