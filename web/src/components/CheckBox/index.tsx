import * as React from 'react'
import classnames from 'classnames'
interface OuterProps {
  checked: boolean
  onChange: (val: boolean, event: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
}
export default class CheckBox extends React.Component<OuterProps, {}> {
  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChange(!this.props.checked,event)
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
