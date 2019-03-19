import React from 'react'
import Select, { Option } from 'rc-select'
import { valueType } from 'rc-select/lib/PropTypes'
import 'rc-select/assets/index.css'

interface OuterProps{
  value: string[]
  options: string[]
  onChange: (val: valueType) => void
  placeholder: string
}
export default class SelectCompont extends React.Component<OuterProps, {}> {
  static defaultProps: Partial<OuterProps> = {
    placeholder: 'placeholder'
  }
  render () {
    const styles = require('./index.scss')
    const { value, options, onChange, placeholder } = this.props
    return (
      <div className={styles.select}>
        <Select
          placeholder={placeholder}
          tags
          value={value}
          onChange={onChange}
        >
          {
            options.map(val => (<Option key={val}>{val}</Option>))
          }
        </Select>
      </div>
    )
  }
}