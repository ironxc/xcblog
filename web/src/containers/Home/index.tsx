import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import R from 'utils/request'
import dayjs from 'dayjs'
import HomeLink from 'components/HomeLink'
import { Subscribe } from 'unstated'
import Init, { UserInfo } from 'models/Init'
import qs from 'query-string'
import * as H from 'history'

interface AritcleProfile {
  name: string
  description: string
  updatedAt: number
  logo: string
  id: string
}
interface FetchParam {
  page: number
  perPage?: number
  tag?: string | string[]
}
interface OwnState {
  perPage: number
  page: number
  list: AritcleProfile[]
  count: number
  loading: boolean
}
interface OuterProps {
  location: H.Location
  history: H.History
}
interface OwnProps extends OuterProps {
  user: UserInfo
}
export class Home extends Component<OwnProps, OwnState> {
  state = {
    perPage: 8,
    page: 1,
    list: [],
    count: 0,
    loading: false,
  }
  componentDidMount() {
    const { page, perPage } = this.state
    this.getArticles({page, perPage})
  }
  getArticles = (param: FetchParam) => {
    const { search } = this.props.location
    const query: any = qs.parse(search)
    if(this.state.loading) { return }
    this.setState({
      loading: true,
    }, () => {
      R.get('/api/articlelist', {
        ...param,
        tag: query.tag ? query.tag : '',
      })
        .then((res: any) => {
          this.setState({
            count: res.count,
            list: [...this.state.list, ...res.list],
            page: param.page,
            loading: false,
          })
        })
    })
  }
  loadMore = () => {
    const { page, perPage } = this.state
    this.getArticles({ page: page + 1, perPage})
  }
  handleGoDetail = (item: AritcleProfile) => (event: React.MouseEvent) => {
    event.stopPropagation()
    this.props.history.push(`/article/${item.id}`)
  }
  renderArticleList = () => {
    const styles = require('./index.scss')
    const { list, loading, count, page, perPage } = this.state
    if(list.length <= 0) {
      return null
    }
    return (
      <div className={styles.articleList}>
        {
          list.map((data: AritcleProfile) => (
            <div className={styles.box} style={{
              display: data.logo ? 'flex' : 'block',
              padding: data.logo ? '1.2rem .5rem' : '.5rem',
            }} key={data.id} onClick={this.handleGoDetail(data)}>
              {
                data.logo && <div className={styles.img}>
                  <img src={data.logo} alt="图片丢失" />
                </div>
              }
              <div style={{
                padding: data.logo ? '0 2.5rem' : '0',
              }}>
                <span>{dayjs(data.updatedAt).format('MMM DD YYYY')}</span>
                <h2>{data.name}</h2>
                <h3>{data.description.substring(0, 60)}{data.description.length > 60 && '...'}</h3>
              </div>
            </div>
          ))
        }
        {
          page * perPage < count 
            ? <p onClick={this.loadMore} className={styles.loading}><span>{loading ? 'loading...' : 'more'}</span></p>
            : <p className={styles.loading}><span>end</span></p>
        }
      </div>
    )
  }
  infos() {
    const { search } = this.props.location
    const { list } = this.state
    const query: any = qs.parse(search)
    let result: string[] = []
    list.forEach((l: AritcleProfile) => {
      let d = String(new Date(l.updatedAt).getFullYear())
      if (result.indexOf(d) < 0) {
        result.push(d)
      }
    })
    if (query.tag) {
      result.push(query.tag as string)
    }
    return result
  }
  render() {
    const styles = require('./index.scss')
    const { user } = this.props
    
    return (
      <div className={styles.home} style={{ height: document.documentElement.clientHeight }}>
        <h1>
          {
            this.infos().map((txt, index) => (<div key={index}>{txt}</div>))
          }
        </h1>
        {
          this.renderArticleList()
        }
        <div className={styles.navbar}>
          <HomeLink/>
          <div className={styles.btns}>
            {
              user && <span key="写笔记"><Link to="/editor/new">写笔记</Link></span>
            }
            <span><Link to="/tags">标签</Link></span>
            <span><Link to="/profile">关于</Link></span>
          </div>
        </div>
      </div>
    );
  }
}
export default class WrapHome extends React.Component<OuterProps, {}> {
  render() {
    return (<Subscribe to={[Init]}>{
      (init: any) => (
        <Home {...this.props} user={init.state.user} />
      )
    }</Subscribe>)
  }
}