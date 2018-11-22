import React from 'react'
import HomeLink from 'src/components/HomeLink'


export default class Profile extends React.Component {
  render () {
    const styles = require('./index.scss')
    return (
      <div className={styles.profile}>
        <div className={styles.homelink}>
          <HomeLink />
        </div>
        <div className={styles.content}>
          密密麻麻
        </div>
      </div>
    )
  }
}