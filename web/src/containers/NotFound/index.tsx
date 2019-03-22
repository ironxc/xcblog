import React from 'react'
import { Link } from 'react-router-dom'

export default () => {
  const styles = require('./index.scss')
  return(
    <div className={styles.hint}><Link to="/home">404</Link></div>
  )
}
