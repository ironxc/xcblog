import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ArticleBox from 'src/components/ArticleBox'
import { connect } from 'react-redux'
import { getArticles } from 'src/store/reducers/home'
const qs = require('query-string')
@connect(state => ({
  list: state.home.list,
  page: state.home.page,
  count: state.home.count,
}), { getArticles })
export default class Home extends Component {
  static propTypes = {
    getArticles: PropTypes.func.isRequired,
    list: PropTypes.array.isRequired,
    page: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
  }
  state = {
    perPage:5,
    infos: [],
  }
  componentWillReceiveProps (nextProps) {
    const { location: { search } } = nextProps
    const queryObj = qs.parse(search)
    if( search !== this.props.location.search) {
      this.props.getArticles({
        page: 1,
        perPage: this.state.perPage,
        tag: queryObj.tag ? queryObj.tag : '',
      })
    }
  }
  componentDidMount () {
    const { location: { search } } = this.props
    const queryObj = qs.parse(search)
    this.props.getArticles({
      page: 1,
      perPage: this.state.perPage,
      tag: queryObj.tag ? queryObj.tag : '',
    })
  }
  loadMore = (type) => () => {
    const { location: { search }, page, count } = this.props
    const { perPage } = this.state
    const queryObj = qs.parse(search)
    if (type === 'newer' && page <= 1){
      return
    }
    if (type === 'previous' && Math.ceil(count / perPage) <= page) {
      return
    }
    this.props.getArticles({
      page: type === 'newer' ? page - 1 : page + 1,
      perPage: this.state.perPage,
      tag: queryObj.tag ? queryObj.tag : '',
    })
  }
  infos () {
    const { list, location: { search } } = this.props
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
    const { list, history: { push }, count, page } = this.props
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
        <div className={styles.btns}>
          <span
            onClick={this.loadMore('newer')}
            className={page <= 1 ? styles.disable : styles.able}>上一页</span>
          <span
            onClick={this.loadMore('previous')}
            className={Math.ceil(count / perPage) <= page ? styles.disable : styles.able}>下一页</span>
        </div>
      </div>
    )
  }
}
