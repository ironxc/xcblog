import React, { Component } from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import { connect } from 'react-redux'
import { selectArticlelist } from 'src/models/article/selector'
import { selectUerInfo } from 'src/models/init/selector'
import { createStructuredSelector } from 'reselect'
import HomeLink from 'src/components/HomeLink'
import { Link, routerRedux } from 'dva/router'
import { TransitionMotion, spring } from 'react-motion'
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
    userInfo: PropTypes.object,
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
          page: parseInt(queryObj.page, 10),
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
        page: queryObj.page ? parseInt(queryObj.page, 10) : 1,
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
    let query = {}
    if (type === 'newer'){
      query.page = page - 1
    } else {
      query.page = page + 1
    }
    if (queryObj.tag){
      query.tag = queryObj.tag
    }
    this.props.dispatch(routerRedux.push(`/home?${qs.stringify(query)}`))
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
  handleGoDetail = (item) => () => {
    this.props.history.push(`/article/${item.id}`)
  }
  getDefaultStyles = (list) => {
    return list.map((item, index) => ({
      data: item,      
      style: { opacity: 0, top: index * 5 },
      key: item.id,
    }))
  }
  getStyles = (list) => {
    return list.map((item, index) => ({
      data: item,
      style: { 
        opacity: spring(1, { stiffness: 150 - index * 20, damping: 15 }), 
        top: spring(0, { stiffness: 150 - index * 20, damping: 15 })},
      key: item.id,
    }))
  }
  willEnter = () => {
    return {
      opacity: 0,
      top:30,
    }
  }
  rendeList = () => {
    const { articles: { list } } = this.props
    const styleClass = require('./index.scss')
    const transitionProps = {
      defaultStyles: this.getDefaultStyles(list),
      styles: this.getStyles(list),
      willEnter: this.willEnter,
    }
    return (
      <TransitionMotion {...transitionProps}>
        {
          styles =>
            <div>
              {
                styles.map(({ style, data, key }) => (
                  <div className={styleClass.box} style={{
                    ...style,
                    display: data.logo ? 'flex' : 'block',
                    padding: data.logo ? '1.2rem .5rem' : '.5rem',
                  }} key={key} onClick={this.handleGoDetail(data)}>
                    {
                      data.logo && <div className={styleClass.img}>
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
            </div>
        }
      </TransitionMotion>
    )
  }
  render () {
    const styles = require('./index.scss')
    const { articles: { list, page, count } } = this.props
    const { perPage } = this.state
    return (
      <div className={styles.home}>
        <h1>
          {
            this.infos().map((txt, index) => (<div key={index}>{txt}</div>))
          }
        </h1>
        <div className={styles.articleList}>
          {
            list.length > 0 && this.rendeList()
          }
        </div>
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
