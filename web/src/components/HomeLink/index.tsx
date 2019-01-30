import React from 'react'
import { Link } from 'react-router-dom'

export default  () => {
  const styles = require('./index.scss')
  return <Link to="/home" className={styles.homeLink}>旋转，跳跃喔</Link>
}