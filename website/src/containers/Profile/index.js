import React from 'react'
import HomeLink from 'src/components/HomeLink'


export default class Profile extends React.Component {
  render () {
    const styles = require('./index.scss')
    return (
      <div className={styles.profile}>
        <div className={styles.header}>
          <HomeLink />
        </div>
        <div className={styles.content}>
          <h5>前端菜鸟</h5>
          <h5>专注bug30年</h5>
        </div>
      </div>
    )
  }
}