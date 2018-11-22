import React from 'react'
import request from 'src/utils/request'
import { ParseMardown } from 'src/utils'
import HomeLink from 'src/components/HomeLink'
import dayjs from 'dayjs'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { userinfo } from 'src/store/reducers/user'
@connect((state) => ({
  info: state.user.info,
}), { userinfo })
export default class Article extends React.Component {
  static propTypes = {
    info: PropTypes.object,
  }
  state = {
    data: '',
  }
  componentDidMount () {
    request.get(`/api/article/${this.props.match.params.id}`)
      .then(res => {
        this.setState({
          data: res,
        })
      })
    this.props.userinfo()
  }
  onEdit = () => {
    this.props.history.push(`/editor/${this.props.match.params.id}`)
  }
  onDelete = () => {
    
  }
  render () {
    const styles = require('./index.scss')
    const { data } = this.state
    if(!data){
      return null
    }
    const htmlContent = ParseMardown(data.content).parsedData
    return (
      <div className={styles.article}>
        <div className={classnames(styles.header, {
          [styles.nologo]: !Boolean(data.logo),
        })} style={{
          backgroundImage: `url(${data.logo})`,
        }}>
          <div className={styles.homelink}>
            <HomeLink />
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.description}>
            <span>{dayjs(data.updatedAt).format('MMM DD YYYY')} / {data.author.name}</span>
            <h2>{data.name}</h2>
            <h3>{data.description}</h3>
          </div>
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} className="markdown-body" />
          <div className={styles.btns}>
            <span onClick={this.onEdit}>编辑</span>
            <span onClick={this.onDelete}>删除</span>
          </div>
        </div>
      </div>
    )
  }
}