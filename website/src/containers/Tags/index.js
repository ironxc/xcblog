import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectAllTags } from 'src/models/init/selector'
import HomeLink from 'src/components/HomeLink'
import { createStructuredSelector } from 'reselect'


const mapStateToProps = createStructuredSelector({
  allTags: selectAllTags,
})

@connect(mapStateToProps)
export default class Tags extends React.Component {
  static propTypes = {
    allTags: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired,
  }
  componentDidMount () {
    this.props.dispatch({
      type: 'init/getAllTags',
    })
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