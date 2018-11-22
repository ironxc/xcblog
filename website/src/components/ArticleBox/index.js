import React, { Component } from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
class ArticleBox extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
  }
  goDetail = () =>  {
    this.props.push(`/article/${this.props.data.id}`)
  }
  render () {
    const styles = require('./index.scss')
    const { data } = this.props
    return (
      <div className={styles.articleBox} style={{
        display: data.logo ? 'flex' : 'block' ,
        padding: data.logo ? '1.2rem .5rem' : '.5rem',
      }} onClick={this.goDetail}>
        {
          data.logo && <div className={styles.img}>
            <img src={data.logo} alt="图片丢失"/>
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
    )
  }
}

export default ArticleBox
