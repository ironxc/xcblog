import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ArticleBox from 'src/components/ArticleBox'
import { connect } from 'react-redux'
import { selectArticlelist } from 'src/models/article/selector'
import { selectUerInfo } from 'src/models/init/selector'
import { createStructuredSelector } from 'reselect'
import HomeLink from 'src/components/HomeLink'
import { Link } from 'dva/router'
const qs = require('query-string')
const mapStateToProps = createStructuredSelector({
  articles: selectArticlelist,
  userInfo: selectUerInfo,
})
@connect(mapStateToProps)
export default class Home extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    articles: PropTypes.object.isRequired,
    userInfo: PropTypes.object.isRequired,
  }
  state = {
    perPage:5,
    infos: [],
  }
  componentWillReceiveProps (nextProps) {
    const { location: { search } } = nextProps
    const queryObj = qs.parse(search)
    if( search !== this.props.location.search) {
      this.props.dispatch({
        type: 'article/getArticleList',
        payload: {
          page: 1,
          perPage: this.state.perPage,
          tag: queryObj.tag ? queryObj.tag : '',
        },
      })
    }
  }
  componentDidMount () {
    const { location: { search } } = this.props
    const queryObj = qs.parse(search)
    this.props.dispatch({
      type: 'article/getArticleList',
      payload: {
        page: 1,
        perPage: this.state.perPage,
        tag: queryObj.tag ? queryObj.tag : '',
      },
    })
  }
  loadMore = (type) => () => {
    const { location: { search }, articles: { page, count } } = this.props
    const { perPage } = this.state
    const queryObj = qs.parse(search)
    if (type === 'newer' && page <= 1){
      return
    }
    if (type === 'previous' && Math.ceil(count / perPage) <= page) {
      return
    }
    this.props.dispatch({
      type: 'article/getArticleList',
      payload: {
        page: type === 'newer' ? page - 1 : page + 1,
        perPage: this.state.perPage,
        tag: queryObj.tag ? queryObj.tag : '',
      },
    })
  }
  infos () {
    const { articles: { list }, location: { search } } = this.props
    const queryObj = qs.parse(search)
    var result = []
    list.forEach(l => {
      var d = new Date(l.updatedAt).getFullYear()
      if( result.indexOf(d) < 0) {
        result.push(d)
      }
    })
    if( queryObj.tag) {
      result.push(queryObj.tag)
    }
    return result
  }
  render () {
    const styles = require('./index.scss')
    const { articles: { list, count, page } , history: { push } } = this.props
    const { perPage } = this.state
    return (
      <div className={styles.home}>
        <h1>
          {
            this.infos().map((txt, index) => (<div key={index}>{txt}</div>))
          }
        </h1>
        {
          list.map(item => {
            return <ArticleBox data={item} key={item.id} push={push}/>
          })
        }
        <div className={styles.pageBtns}>
          <span
            onClick={this.loadMore('newer')}
            className={page <= 1 ? styles.disable : styles.able}>上一页</span>
          <span
            onClick={this.loadMore('previous')}
            className={Math.ceil(count / perPage) <= page ? styles.disable : styles.able}>下一页</span>
        </div>
        <div className={styles.navbar}>
          <HomeLink />
          <div className={styles.btns}>
            {
              this.props.userInfo && <span key="写笔记"><Link to="/editor/new">写笔记</Link></span>
            }
            <span><Link to="/tags">标签</Link></span>
            <span><Link to="/profile">我</Link></span>
          </div>
        </div>
      </div>
    )
  }
}
