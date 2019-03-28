import * as React from 'react'
import classnames from 'classnames'
interface OuterProps {
  checked: boolean
  onChange: (val: boolean) => void
  label?: string
}
export default class CheckBox extends React.Component<OuterProps, {}> {
  handleChange = () => {
    this.props.onChange(!this.props.checked)
  }
  render () {
    const styles = require('./index.scss')
    const { checked, label } = this.props
    return (
      <label className={styles.radioButton}>
        <span className={classnames(styles.input, {
          [styles.checked]: checked,
        })}>
          <input type="checkbox" checked={checked} onChange={this.handleChange}/>
          <span/>
        </span>
        {
          label && <span>{label}</span>
        }
      </label>
    )
  }
}
