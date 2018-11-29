import React from 'react'
import { Link } from 'dva/router'

const NotFound = () => {
  const styles = require('./index.scss')
  return(
    <div className={styles.hint}><Link to="/home">404</Link></div>
  )
}

export default NotFound