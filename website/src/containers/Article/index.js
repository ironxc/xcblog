import React from 'react'
import { ParseMardown } from 'src/utils'
import HomeLink from 'src/components/HomeLink'
import dayjs from 'dayjs'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { selectUerInfo } from 'src/models/init/selector'
import { selectArticle } from 'src/models/article/selector'
import { createStructuredSelector } from 'reselect'
const mapStateToProps = createStructuredSelector({
  article: selectArticle,
  userInfo: selectUerInfo,
})


@connect(mapStateToProps)
export default class Article extends React.Component {
  static propTypes = {
    userinfo: PropTypes.object,
    article: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
  }
  componentWillUnmount () {
    this.props.dispatch({
      type: 'article/updateState',
      payload: {
        article: undefined,
      },
    })
  }
  onEdit = () => {
    this.props.history.push(`/editor/${this.props.match.params.id}`)
  }
  onDelete = () => {
    this.props.dispatch({
      type: 'article/delete',
      payload: {
        id: this.props.match.params.id,
      },
    })
  }
  render () {
    const styles = require('./index.scss')
    const { info, article } = this.props
    if(!article){
      return null
    }
    const htmlContent = ParseMardown(article.content).parsedData
    return (
      <div className={styles.article}>
        <div className={classnames(styles.header, {
          [styles.nologo]: !Boolean(article.logo),
        })} style={{
          backgroundImage: `url(${article.logo})`,
        }}>
          <div className={styles.homelink}>
            <HomeLink />
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.description}>
            <span>{dayjs(article.updatedAt).format('MMM DD YYYY')} / {article.author.name}</span>
            <h2>{article.name}</h2>
            <h3>{article.description}</h3>
          </div>
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} className="markdown-body" />
          {
            info && info.id === article.author.id && <div className={styles.btns}>
              <span onClick={this.onEdit}>编辑</span>
              <span onClick={this.onDelete}>删除</span>
            </div>
          }
        </div>
      </div>
    )
  }
}