import * as React from 'react'
import R from 'utils/request'
import { FetchParam } from 'containers/Home'
import dayjs from 'dayjs'
import CheckBox from 'components/CheckBox'
import { match } from 'react-router'
import * as H from 'history'
import { ArticleData, ArticlePostData } from 'containers/EditorPage'

interface ManagementState{
  list: ArticleData[],
  count: number,
  page: number
}
interface OuterProps {
  match: match<any>
  history: H.History
}
export default class ArticleManagement extends React.Component<OuterProps, ManagementState> {
  state = {
    list: [],
    count: 0,
    page: 1,
    perPage: 10,
  }
  componentDidMount() {
    this.getArticles({
      page: this.state.page,
      perPage: this.state.perPage,
    })
  }
  getArticles = (param: FetchParam) => {
    R.get('/api/allarticlelist', param)
      .then((res: any) => {
        this.setState({
          count: res.count,
          list: res.list,
          page: param.page,
        })
      })
  }
  calcPages = (): number[] => {
    let pages: number[] = []
    const { count, perPage } = this.state
    for (let i = 1; i <= Math.ceil(count / perPage); i++) {
      pages.push(i)
    }
    return pages
  }
  onEdit = (id: string) => () => {
    this.props.history.push(`/editor/${id}`)
  }
  onDelete = (id: string) => () => {
    R.del(`/api/article/${id}`)
      .then(() => {
        this.getArticles({
          page: 1,
          perPage: this.state.perPage,
        })
      })
  }
  handleStatus = (id: string, status: number) => {
    this.setState({
      list: this.state.list.map((l: ArticleData) => {
        if (l.id === id) {
          return {
            ...l,
            status,
          }
        } else {
          return l
        }
      }),
    })
  }
  updateArticle = (data: ArticleData) =>  (val: boolean) => {
    const postdata: ArticlePostData = {
      name: data.name,
      description: data.description,
      status: val ? 1 : 0,
      content: data.content,
      logo: data.logo,
      tags: data.tags,
    }
    R.put(`/api/article/${data.id}`, postdata)
      .then(res => {
        this.handleStatus(res, postdata.status )
      })
  }
  handlePage = (page: number) => () => {
    this.getArticles({
      page,
      perPage: this.state.perPage,
    })
  }
  render (){
    const styles = require('./index.scss')
    const { list,page } = this.state

    return (
      <div className={styles.articleManagement}>
        <div className={styles.articleList}>
          {
            list.map((l: ArticleData) => (
              <div className={styles.item} key={l.id}>
                <div className={styles.name}>{l.name}</div>
                <div className={styles.time}>{dayjs(l.updatedAt).format('YYYY-MM-DD')}</div>
                <div className={styles.icons}>
                  <span onClick={this.onEdit(l.id)}><i className="iconfont iconbianji" /></span>
                  <span onClick={this.onDelete(l.id)}><i className="iconfont iconshanchu" /></span>
                  <span>
                    <CheckBox checked={l.status === 1} onChange={this.updateArticle(l)} label="公开" />
                  </span>
                </div>
              </div>
            ))
          }
        </div>
        <div className={styles.pages}>
          {
            this.calcPages().map((p: number) => (
              <div key={p} className={`${page === p? styles.active : ''}`} onClick={this.handlePage(p)}> {p}</div>
            ))
          }
        </div>
      </div>
    )
  }
}
