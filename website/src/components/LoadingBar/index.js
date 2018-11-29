import React from 'react'
import PropTypes from 'prop-types'
import { Motion, spring } from 'react-motion'

const springSetting = { stiffness: 150, damping: 15 }

export default class LoadingBar extends React.Component{
  static propsTypes = {
    show: PropTypes.bool.isRequired,
  }
  render () {
    const styles = require('./index.scss')
    const { show } = this.props
    return (  
      <Motion style={{ left: spring(show ? -100 : 0, springSetting) }}>
        {
          ({ left }) => (
            <div className={styles.loadingBar} style={{
              display: show ? 'block' : 'none',
            }}>
              <div className={styles.bar} style={{
                left: `${left}%`,
              }}/>
            </div>
          )
        }
      </Motion>
      
    )
  }
}
