import * as React from 'react'
import HomeLink from 'components/HomeLink'
import dayjs from 'dayjs'
import classnames from 'classnames'
import { match } from 'react-router'
import { ArticleData } from '../EditorPage'
import R from 'utils/request'
import * as H from 'history'
import Init, { UserInfo } from 'models/Init'
import { Subscribe } from 'unstated'
import ContentView from 'components/Editor/View'
interface OuterProps {
  match: match<any>
  history: H.History
}
interface OwnProps extends OuterProps{
  user?: UserInfo
}
interface OwnState {
  data?: ArticleData
}
class Article extends React.Component<OwnProps, OwnState> {
  state: OwnState = { data: undefined }
  componentDidMount () {
    this.getArticle(this.props.match.params.id)
  }
  getArticle = (id: string) => {
    R.get(`/api/article/${id}`)
      .then((data: ArticleData) => {
        this.setState({
          data,
        })
      })
  }
  onEdit = () => {
    this.props.history.push(`/editor/${this.props.match.params.id}`)
  }
  onDelete = () => {
    const { data } = this.state
    if(data){
      R.del(`/api/article/${data.id}`)
        .then(() => {
          this.props.history.push('/home')
        })
    }
  }
  render () {
    const styles = require('./index.scss')
    const { data } = this.state
    const { user } = this.props
    if(!data){
      return null
    }
    return (
      <div className={styles.article}>
        <div className={classnames(styles.header, {
          [styles.nologo]: !Boolean(data.logo),
        })} style={{
          backgroundImage: `url(${data.logo})`,
          bottom: 0,
        }}>
          <div className={styles.homelink}>
            <HomeLink />
          </div>
        </div>
        <div className={styles.content} style={{ top: 0 }}>
          <div className={styles.description}>
            <span>{dayjs(data.updatedAt).format('MMM DD YYYY')} / {data.author.name}</span>
            <h2>{data.name}</h2>
            <h3>{data.description}</h3>
          </div>
          <ContentView value={data.content}/>
          {/* <div className={styles.count}>
            <span>{data.browseCount}</span><span><i className="iconfont iconeye" /></span>
          </div> */}
          {
            user && user.id === data.author.id && <div className={styles.btns}>
              <span onClick={this.onEdit}><i className="iconfont iconbianji"/></span>
              <span onClick={this.onDelete}><i className="iconfont iconshanchu" /></span>
            </div>
          }
        </div>
      </div>
    )
  }
}
export default class WrapArticle extends React.Component<OuterProps, {}> {
  render() {
    return (<Subscribe to={[Init]}>{
      (init: any) => (
        <Article {...this.props} user={init.state.user} />
      )
    }</Subscribe>)
  }
}
