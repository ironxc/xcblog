import React from 'react'
interface OuterProps {
  show?: boolean
}
export default class LoadingBar extends React.Component<OuterProps, {}>{
  render () {
    const styles = require('./index.scss')
    const { show } = this.props
    return (
      <div className={styles.loadingBar} id={`${show ? '' : 'root-loading-bar'}`} style={{
        display: show ? 'bloack' : 'none',
      }}>
        <div className={styles.bar}/>
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 38 38" style={{ position: 'absolute', right: 0 }}>
          <defs>
            <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
              <stop stopColor="#ff7657" stopOpacity="0" offset="0%" />
              <stop stopColor="#ff7657" stopOpacity=".631" offset="63.146%" />
              <stop stopColor="#ff7657" offset="100%" />
            </linearGradient>
          </defs>
          <g fill="none" fillRule="evenodd">
            <g transform="translate(1 1)">
              <path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="url(#a)" strokeWidth="2" transform="rotate(285.174 18 18)">
                <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite" />
              </path>
              <circle fill="#fff" cx="36" cy="18" r="1" transform="rotate(285.174 18 18)">
                <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite" />
              </circle>
            </g>
          </g>
        </svg>
      </div>
    )
  }
}
