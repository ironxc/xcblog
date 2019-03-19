import React from 'react'
export default class LoadingBar extends React.Component{
  render () {
    const styles = require('./index.scss')
    return (  
      <div className={styles.loadingBar} id="root-loading-bar">
        <div className={styles.bar}/>
      </div>
    )
  }
}
