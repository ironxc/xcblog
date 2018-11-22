import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { getTags } from 'src/store/reducers/env'
import HomeLink from 'src/components/HomeLink'

@connect(state => ({
  allTags: state.env.allTags,
}), { getTags })
export default class Tags extends React.Component {
  static propTypes = {
    allTags: PropTypes.array.isRequired,
    getTags: PropTypes.func.isRequired,
  }
  componentDidMount () {
    this.props.getTags()
  }
  handleClick = (val) => () => {
    this.props.history.push(`/home?tag=${val}`)
  }
  render () {
    const { allTags } = this.props
    const styles = require('./index.scss')
    return (
      <div className={styles.tags}>
        <div className={styles.homelink}>
          <HomeLink />
        </div>
        <div className={styles.content}>
          {
            allTags.map(t => (<span style={{ 
              fontSize: `${12 + t.num}px`,
            }} onClick={this.handleClick(t.value)}>{t.value}</span>))
          }
        </div>
      </div>
    )
  }
}