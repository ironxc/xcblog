import React from 'react'
import { Link } from 'react-router-dom'

const HomeLink = () => {
  const styles = require('./index.scss')
  return <Link to="/home" className={styles.homeLink}>旋转，跳跃喔</Link>
}
export default HomeLink