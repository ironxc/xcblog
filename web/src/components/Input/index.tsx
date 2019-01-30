import * as React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
interface OuterProps {
  value: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  error?: string,
  label?: string,
  placeholder?: string,
  id: string,
  type?: string
}
interface OwnState {
  focus: boolean
}
export default class Input extends React.Component<OuterProps, OwnState>{
  state = {
    focus: false,
  }
  static defaultProps: Partial<OuterProps> = {
    error: '',
    placeholder: 'placeholder',
    label: 'placeholder',
    type: 'text',
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
            onChange={this.props.onChange}/>
        </div>
      </div>
    )
  }
}