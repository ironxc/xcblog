import React from 'react'
import { Link } from 'react-router-dom'

export default class HomeLink extends React.Component {
  render () {
    const styles = require('./index.scss')
    return(
      <div className={styles.header}>
        <Link to="/home">旋转，跳跃喔</Link>
      </div>
    )
  }
}