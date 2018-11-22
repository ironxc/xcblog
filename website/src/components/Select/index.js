import React from 'react'
import PropTypes from 'prop-types'
import Select, { Option } from 'rc-select'
import 'rc-select/assets/index.css'
export default class SelectCompont extends React.Component {
  static propTypes = {
    value: PropTypes.array.isRequired,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string.isRequired,
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

SelectCompont.defaultProps = {
  placeholder: 'placeholder',
}