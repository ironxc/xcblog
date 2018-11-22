import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
export default class TextArea extends React.Component {
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
    if( error ){
      return error
    } 
    if (focus || value ){
      return label
    }
    return placeholder
  }
  render () {
    const styles = require('./index.scss')
    const { value, error, id } = this.props
    const { focus } = this.state
    return(
      <div className={classnames(styles.textareaComponent, {
        [styles.focus]: focus || value,
      })} >
        <label htmlFor={id} className={classnames({
          [styles.err]: error,
        })}>{this.getLabelTxt()}</label>
        <div className={styles.textareaWrap}>
          <textarea
            id={id}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            value={value}
            onChange={this.handleChange}>
          </textarea>
        </div>
      </div>
    )
  }
}
TextArea.defaultProps = {
  error: '',
  placeholder: 'placeholder',
  label: 'placeholder',
  type: 'text',
  id: 'asdfasdf',
}