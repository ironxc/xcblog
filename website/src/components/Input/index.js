import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
export default class Input extends React.Component{
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    id: PropTypes.string,
  }
  state = {
    focus: false,
  }
  handleFocus = () => {
    this.setState({
      focus: true,
    })
  }
  handleBlur = () => {
    this.setState({
      focus: false,
    })
  }
  handleChange = (event) => {
    this.props.onChange(event.target.value)
  }
  getLabelTxt = () => {
    const { placeholder, label, error, value } = this.props
    const { focus } = this.state
    if (error) {
      return error
    }
    if (focus || value) {
      return label
    }
    return placeholder
  }
  render () {
    const styles = require('./index.scss')
    const { value, type, id, error } = this.props
    const { focus } = this.state
    return(
      <div className={classnames(styles.input,{
        [styles.focus]: focus  || error,
      })}>
        <label htmlFor={id} className={classnames({
          [styles.err]: error,
          [styles.labelTrasnform]: value || focus || error,
        })}>{this.getLabelTxt()}</label>
        <div>
          <input
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            id={id} 
            type={type} 
            value={value} 
            onChange={this.handleChange}/>
        </div>
      </div>
    )
  }
}
Input.defaultProps = {
  error: '',
  placeholder: 'placeholder',
  label: 'placeholder',
  type: 'text',
  id: 'asdfasdf',
}